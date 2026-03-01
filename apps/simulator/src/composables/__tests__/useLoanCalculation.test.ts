import { describe, it, expect } from 'vitest'
import {
  calculateMonthlyPayment,
  calculateMaxLoanAmount,
  generateAmortisationSchedule,
} from '../useLoanCalculation'

describe('calculateMonthlyPayment', () => {
  it('computes a standard amortising payment', () => {
    // R 200 000 at 12% over 60 months ≈ R 4 448.89
    const payment = calculateMonthlyPayment(200_000, 12, 60)
    expect(payment).toBeCloseTo(4_448.89, 0)
  })

  it('handles zero interest rate', () => {
    const payment = calculateMonthlyPayment(120_000, 0, 12)
    expect(payment).toBe(10_000)
  })

  it('handles a single month', () => {
    const payment = calculateMonthlyPayment(10_000, 12, 1)
    // 1 month: principal + 1 month interest = 10 000 + 100
    expect(payment).toBeCloseTo(10_100, 0)
  })

  it('scales linearly with principal at fixed rate and term', () => {
    const p1 = calculateMonthlyPayment(100_000, 10, 60)
    const p2 = calculateMonthlyPayment(200_000, 10, 60)
    expect(p2).toBeCloseTo(p1 * 2, 2)
  })

  it('returns a positive value for valid inputs', () => {
    expect(calculateMonthlyPayment(50_000, 15, 24)).toBeGreaterThan(0)
  })
})

describe('calculateMaxLoanAmount', () => {
  it('is the inverse of calculateMonthlyPayment', () => {
    const principal = 200_000
    const rate = 12
    const term = 60

    const payment = calculateMonthlyPayment(principal, rate, term)
    const maxLoan = calculateMaxLoanAmount(payment, rate, term)

    expect(maxLoan).toBeCloseTo(principal, 0)
  })

  it('handles zero interest rate', () => {
    const max = calculateMaxLoanAmount(5_000, 0, 24)
    expect(max).toBe(120_000)
  })

  it('higher payments allow larger loans', () => {
    const small = calculateMaxLoanAmount(3_000, 12, 60)
    const large = calculateMaxLoanAmount(6_000, 12, 60)
    expect(large).toBeGreaterThan(small)
  })

  it('longer terms allow larger loans at the same payment', () => {
    const short = calculateMaxLoanAmount(4_000, 12, 24)
    const long = calculateMaxLoanAmount(4_000, 12, 60)
    expect(long).toBeGreaterThan(short)
  })
})

describe('generateAmortisationSchedule', () => {
  it('produces the correct number of rows', () => {
    const schedule = generateAmortisationSchedule(100_000, 12, 24)
    expect(schedule).toHaveLength(24)
  })

  it('has consistent period numbering', () => {
    const schedule = generateAmortisationSchedule(100_000, 12, 12)
    schedule.forEach((row, i) => {
      expect(row.period).toBe(i + 1)
    })
  })

  it('ends with a zero (or near-zero) balance', () => {
    const schedule = generateAmortisationSchedule(200_000, 10, 60)
    const lastRow = schedule[schedule.length - 1]
    expect(lastRow.balance).toBeCloseTo(0, 0)
  })

  it('each row payment equals principal + interest', () => {
    const schedule = generateAmortisationSchedule(150_000, 11, 36)
    for (const row of schedule) {
      expect(row.payment).toBeCloseTo(row.principal + row.interest, 1)
    }
  })

  it('total principal repaid equals the original loan', () => {
    const principal = 100_000
    const schedule = generateAmortisationSchedule(principal, 12, 60)
    const totalPrincipal = schedule.reduce((sum, r) => sum + r.principal, 0)
    expect(totalPrincipal).toBeCloseTo(principal, 0)
  })

  it('interest portion decreases over time', () => {
    const schedule = generateAmortisationSchedule(200_000, 12, 60)
    const firstInterest = schedule[0].interest
    const lastInterest = schedule[schedule.length - 1].interest
    expect(firstInterest).toBeGreaterThan(lastInterest)
  })

  it('principal portion increases over time', () => {
    const schedule = generateAmortisationSchedule(200_000, 12, 60)
    const firstPrincipal = schedule[0].principal
    const lastPrincipal = schedule[schedule.length - 1].principal
    expect(lastPrincipal).toBeGreaterThan(firstPrincipal)
  })
})
