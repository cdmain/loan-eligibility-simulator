import { describe, it, expect } from 'vitest'
import { loanFormSchema, expenseItemSchema } from '../loan.schema'

describe('expenseItemSchema', () => {
  it('accepts a valid expense item', () => {
    const result = expenseItemSchema.safeParse({ label: 'Rent', amount: 7_000 })
    expect(result.success).toBe(true)
  })

  it('rejects an empty label', () => {
    const result = expenseItemSchema.safeParse({ label: '', amount: 1_000 })
    expect(result.success).toBe(false)
  })

  it('rejects a negative amount', () => {
    const result = expenseItemSchema.safeParse({ label: 'Rent', amount: -100 })
    expect(result.success).toBe(false)
  })

  it('rejects an excessively large amount', () => {
    const result = expenseItemSchema.safeParse({ label: 'Rent', amount: 600_000 })
    expect(result.success).toBe(false)
  })

  it('accepts zero amount', () => {
    const result = expenseItemSchema.safeParse({ label: 'Other', amount: 0 })
    expect(result.success).toBe(true)
  })
})

describe('loanFormSchema', () => {
  const validInput = {
    grossIncome: 50_000,
    expenses: [{ label: 'Rent', amount: 8_000 }],
    loanAmount: 200_000,
    loanTermMonths: 60,
  }

  it('accepts valid form data', () => {
    const result = loanFormSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('rejects income below minimum', () => {
    const result = loanFormSchema.safeParse({ ...validInput, grossIncome: 500 })
    expect(result.success).toBe(false)
  })

  it('rejects empty expenses array', () => {
    const result = loanFormSchema.safeParse({ ...validInput, expenses: [] })
    expect(result.success).toBe(false)
  })

  it('rejects loan amount below minimum', () => {
    const result = loanFormSchema.safeParse({ ...validInput, loanAmount: 1_000 })
    expect(result.success).toBe(false)
  })

  it('rejects loan term below minimum', () => {
    const result = loanFormSchema.safeParse({ ...validInput, loanTermMonths: 3 })
    expect(result.success).toBe(false)
  })

  it('rejects loan term above maximum', () => {
    const result = loanFormSchema.safeParse({ ...validInput, loanTermMonths: 400 })
    expect(result.success).toBe(false)
  })

  it('rejects when total expenses exceed income', () => {
    const result = loanFormSchema.safeParse({
      ...validInput,
      grossIncome: 10_000,
      expenses: [
        { label: 'Rent', amount: 6_000 },
        { label: 'Groceries', amount: 5_000 },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('accepts multiple expenses that total below income', () => {
    const result = loanFormSchema.safeParse({
      ...validInput,
      expenses: [
        { label: 'Rent', amount: 8_000 },
        { label: 'Groceries', amount: 4_000 },
        { label: 'Transport', amount: 3_000 },
      ],
    })
    expect(result.success).toBe(true)
  })
})
