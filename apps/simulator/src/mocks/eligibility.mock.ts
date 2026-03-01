import type {
  EligibilityResult,
  EligibilityStatus,
  LoanFormValues,
} from '@/types/loan.types'
import { calculateMonthlyPayment, calculateMaxLoanAmount } from '@/composables/useLoanCalculation'

/** Simulated network latency (ms) */
const MOCK_DELAY = 800

/**
 * Determine a mock interest rate based on income-to-expense ratio.
 * Higher disposable income → lower risk → better rate.
 */
function getMockInterestRate(
  grossIncome: number,
  totalExpenses: number,
): number {
  const ratio = totalExpenses / grossIncome

  if (ratio < 0.3) return 10.5
  if (ratio < 0.45) return 12.75
  if (ratio < 0.6) return 15.25
  if (ratio < 0.75) return 18.0
  return 22.5
}

/**
 * Determine a mock credit score (300-850) based on financial profile.
 * This is a simplified simulation — real scoring is far more complex.
 */
function getMockCreditScore(
  grossIncome: number,
  totalExpenses: number,
  requestedAmount: number,
): number {
  const disposable = grossIncome - totalExpenses
  const expenseRatio = totalExpenses / grossIncome
  const loanToIncome = requestedAmount / (grossIncome * 12)

  let score = 600

  // Reward healthy disposable income
  if (disposable > 20_000) score += 80
  else if (disposable > 10_000) score += 50
  else if (disposable > 5_000) score += 20

  // Penalise high expense ratio
  if (expenseRatio > 0.7) score -= 100
  else if (expenseRatio > 0.5) score -= 40

  // Penalise high loan-to-annual-income ratio
  if (loanToIncome > 5) score -= 80
  else if (loanToIncome > 3) score -= 40
  else if (loanToIncome < 1) score += 40

  return Math.max(300, Math.min(850, score))
}

/**
 * Mock eligibility check — simulates an async API call.
 * Returns a full eligibility assessment after a short delay.
 */
export async function checkEligibility(
  input: LoanFormValues,
): Promise<EligibilityResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))

  const totalExpenses = input.expenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  )
  const disposableIncome = input.grossIncome - totalExpenses
  const interestRate = getMockInterestRate(input.grossIncome, totalExpenses)
  const score = getMockCreditScore(
    input.grossIncome,
    totalExpenses,
    input.loanAmount,
  )

  const monthlyPayment = calculateMonthlyPayment(
    input.loanAmount,
    interestRate,
    input.loanTermMonths,
  )
  const totalRepayment = monthlyPayment * input.loanTermMonths
  const totalInterest = totalRepayment - input.loanAmount
  const debtToIncomeRatio = (monthlyPayment / input.grossIncome) * 100
  const disposableAfterLoan = disposableIncome - monthlyPayment

  // Affordability cap: 30% of disposable income
  const affordablePayment = disposableIncome * 0.3
  const maxEligibleAmount = calculateMaxLoanAmount(
    affordablePayment,
    interestRate,
    input.loanTermMonths,
  )

  // Determine status
  const reasons: string[] = []
  let status: EligibilityStatus = 'approved'

  if (score < 500) {
    status = 'declined'
    reasons.push('Credit score is below the minimum threshold')
  }

  if (debtToIncomeRatio > 42) {
    status = 'declined'
    reasons.push(
      'Debt-to-income ratio exceeds 42% — repayments are unaffordable',
    )
  } else if (debtToIncomeRatio > 35) {
    if (status !== 'declined') status = 'conditional'
    reasons.push(
      'Debt-to-income ratio is between 35–42% — approval subject to review',
    )
  }

  if (disposableAfterLoan < 0) {
    status = 'declined'
    reasons.push(
      'Insufficient disposable income to cover monthly repayments',
    )
  } else if (disposableAfterLoan < 2_000) {
    if (status !== 'declined') status = 'conditional'
    reasons.push(
      'Low remaining disposable income after repayments',
    )
  }

  if (input.loanAmount > maxEligibleAmount * 1.2) {
    if (status !== 'declined') status = 'conditional'
    reasons.push(
      `Requested amount exceeds recommended maximum of R ${Math.round(maxEligibleAmount).toLocaleString('en-ZA')}`,
    )
  }

  if (status === 'approved') {
    reasons.push('All eligibility criteria met')
  }

  return {
    status,
    score,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    debtToIncomeRatio,
    maxEligibleAmount,
    disposableIncomeAfterLoan: disposableAfterLoan,
    interestRate,
    reasons,
  }
}
