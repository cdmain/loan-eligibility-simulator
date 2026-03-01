import { computed, type Ref } from 'vue'
import type { AmortisationRow, ExpenseItem } from '@/types/loan.types'

/**
 * Calculate the fixed monthly payment for an amortising loan.
 *
 * Formula: P × [r(1+r)^n] / [(1+r)^n − 1]
 * where P = principal, r = monthly rate, n = number of months.
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) return principal / termMonths

  const compounded = Math.pow(1 + monthlyRate, termMonths)
  return principal * ((monthlyRate * compounded) / (compounded - 1))
}

/**
 * Given an affordable monthly payment, compute the maximum loan principal.
 *
 * Inverse of the amortisation formula.
 */
export function calculateMaxLoanAmount(
  affordableMonthlyPayment: number,
  annualRate: number,
  termMonths: number,
): number {
  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) return affordableMonthlyPayment * termMonths

  const compounded = Math.pow(1 + monthlyRate, termMonths)
  return (
    affordableMonthlyPayment * ((compounded - 1) / (monthlyRate * compounded))
  )
}

/**
 * Generate a full amortisation schedule (one row per month).
 */
export function generateAmortisationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
): AmortisationRow[] {
  const monthlyRate = annualRate / 100 / 12
  const payment = calculateMonthlyPayment(principal, annualRate, termMonths)
  const schedule: AmortisationRow[] = []

  let balance = principal

  for (let period = 1; period <= termMonths; period++) {
    const interest = balance * monthlyRate
    const principalPortion = payment - interest
    balance = Math.max(0, balance - principalPortion)

    schedule.push({
      period,
      payment: Math.round(payment * 100) / 100,
      principal: Math.round(principalPortion * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  return schedule
}

/**
 * Reactive composable that derives loan metrics from the form state.
 *
 * Provides real-time preview values while the user adjusts inputs.
 * The heavier mock-API check (via TanStack Query) runs on submit.
 */
export function useLoanCalculation(params: {
  grossIncome: Ref<number>
  expenses: Ref<ExpenseItem[]>
  loanAmount: Ref<number>
  loanTermMonths: Ref<number>
}) {
  const totalExpenses = computed(() =>
    params.expenses.value.reduce((sum, item) => sum + item.amount, 0),
  )

  const disposableIncome = computed(
    () => params.grossIncome.value - totalExpenses.value,
  )

  /** Simple preview rate based on expense ratio */
  const estimatedRate = computed(() => {
    const ratio = totalExpenses.value / params.grossIncome.value
    if (ratio < 0.3) return 10.5
    if (ratio < 0.45) return 12.75
    if (ratio < 0.6) return 15.25
    if (ratio < 0.75) return 18.0
    return 22.5
  })

  const estimatedMonthlyPayment = computed(() =>
    calculateMonthlyPayment(
      params.loanAmount.value,
      estimatedRate.value,
      params.loanTermMonths.value,
    ),
  )

  const debtToIncomeRatio = computed(
    () =>
      (estimatedMonthlyPayment.value / params.grossIncome.value) * 100,
  )

  const disposableAfterLoan = computed(
    () => disposableIncome.value - estimatedMonthlyPayment.value,
  )

  const affordabilityPercentage = computed(() => {
    if (disposableIncome.value <= 0) return 0
    const usedRatio =
      estimatedMonthlyPayment.value / disposableIncome.value
    return Math.max(0, Math.min(100, (1 - usedRatio) * 100))
  })

  return {
    totalExpenses,
    disposableIncome,
    estimatedRate,
    estimatedMonthlyPayment,
    debtToIncomeRatio,
    disposableAfterLoan,
    affordabilityPercentage,
  }
}
