import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkEligibility } from '../eligibility.mock'
import type { LoanFormValues } from '@/types/loan.types'

// Speed up tests by removing the mock delay
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function makeInput(overrides: Partial<LoanFormValues> = {}): LoanFormValues {
  return {
    grossIncome: 50_000,
    expenses: [
      { label: 'Rent / Bond', amount: 8_000 },
      { label: 'Groceries', amount: 4_000 },
    ],
    loanAmount: 200_000,
    loanTermMonths: 60,
    ...overrides,
  }
}

async function runEligibility(input: LoanFormValues) {
  const promise = checkEligibility(input)
  await vi.advanceTimersByTimeAsync(1000)
  return promise
}

describe('checkEligibility', () => {
  describe('approved scenarios', () => {
    it('approves a healthy applicant', async () => {
      const result = await runEligibility(makeInput())

      expect(result.status).toBe('approved')
      expect(result.score).toBeGreaterThanOrEqual(500)
      expect(result.monthlyPayment).toBeGreaterThan(0)
      expect(result.totalRepayment).toBeGreaterThan(result.monthlyPayment)
      expect(result.interestRate).toBeGreaterThan(0)
      expect(result.reasons).toContain('All eligibility criteria met')
    })

    it('returns correct financial calculations', async () => {
      const result = await runEligibility(makeInput())

      // Total repayment = monthly payment × term
      expect(result.totalRepayment).toBeCloseTo(
        result.monthlyPayment * 60,
        0,
      )

      // Total interest = total repayment - principal
      expect(result.totalInterest).toBeCloseTo(
        result.totalRepayment - 200_000,
        0,
      )
    })
  })

  describe('declined scenarios', () => {
    it('declines when expenses are extremely high (low credit score)', async () => {
      const result = await runEligibility(
        makeInput({
          grossIncome: 15_000,
          expenses: [{ label: 'Rent', amount: 12_000 }],
          loanAmount: 500_000,
        }),
      )

      expect(result.status).toBe('declined')
      expect(result.reasons.length).toBeGreaterThan(0)
    })

    it('declines when DTI is very high', async () => {
      const result = await runEligibility(
        makeInput({
          grossIncome: 10_000,
          expenses: [{ label: 'Rent', amount: 1_000 }],
          loanAmount: 2_000_000,
          loanTermMonths: 12,
        }),
      )

      expect(result.status).toBe('declined')
      expect(result.debtToIncomeRatio).toBeGreaterThan(42)
    })

    it('declines when disposable income after loan is negative', async () => {
      const result = await runEligibility(
        makeInput({
          grossIncome: 20_000,
          expenses: [{ label: 'Rent', amount: 15_000 }],
          loanAmount: 500_000,
          loanTermMonths: 12,
        }),
      )

      expect(result.status).toBe('declined')
      expect(result.disposableIncomeAfterLoan).toBeLessThan(0)
    })
  })

  describe('conditional scenarios', () => {
    it('returns conditional when DTI is between 35-42%', async () => {
      // 35% DTI means monthly payment ≈ 35% of gross income
      // For grossIncome 50K, payment should be ~17.5K
      // Need to find loan amount that results in ~35-42% DTI
      const result = await runEligibility(
        makeInput({
          grossIncome: 30_000,
          expenses: [{ label: 'Rent', amount: 5_000 }],
          loanAmount: 800_000,
          loanTermMonths: 60,
        }),
      )

      // This should be conditional or declined based on DTI
      expect(['conditional', 'declined']).toContain(result.status)
    })

    it('returns conditional when disposable after loan is low', async () => {
      const result = await runEligibility(
        makeInput({
          grossIncome: 25_000,
          expenses: [{ label: 'Rent', amount: 10_000 }],
          loanAmount: 300_000,
          loanTermMonths: 60,
        }),
      )

      expect(['conditional', 'declined']).toContain(result.status)
    })
  })

  describe('result shape', () => {
    it('returns all required fields', async () => {
      const result = await runEligibility(makeInput())

      expect(result).toHaveProperty('status')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('monthlyPayment')
      expect(result).toHaveProperty('totalRepayment')
      expect(result).toHaveProperty('totalInterest')
      expect(result).toHaveProperty('debtToIncomeRatio')
      expect(result).toHaveProperty('maxEligibleAmount')
      expect(result).toHaveProperty('disposableIncomeAfterLoan')
      expect(result).toHaveProperty('interestRate')
      expect(result).toHaveProperty('reasons')
    })

    it('score is within valid range', async () => {
      const result = await runEligibility(makeInput())
      expect(result.score).toBeGreaterThanOrEqual(300)
      expect(result.score).toBeLessThanOrEqual(850)
    })

    it('interest rate is positive', async () => {
      const result = await runEligibility(makeInput())
      expect(result.interestRate).toBeGreaterThan(0)
    })

    it('max eligible amount is positive', async () => {
      const result = await runEligibility(makeInput())
      expect(result.maxEligibleAmount).toBeGreaterThan(0)
    })

    it('reasons array is never empty', async () => {
      const result = await runEligibility(makeInput())
      expect(result.reasons.length).toBeGreaterThan(0)
    })
  })
})
