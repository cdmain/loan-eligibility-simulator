import type { z } from 'zod'
import type { loanFormSchema, expenseItemSchema } from '@/schemas/loan.schema'

/** A single expense entry */
export type ExpenseItem = z.infer<typeof expenseItemSchema>

/** Shape of the full loan form */
export type LoanFormValues = z.infer<typeof loanFormSchema>

/** Eligibility decision */
export type EligibilityStatus = 'approved' | 'conditional' | 'declined'

/** Full eligibility assessment returned by the mock API */
export type EligibilityResult = {
  status: EligibilityStatus
  score: number
  monthlyPayment: number
  totalRepayment: number
  totalInterest: number
  debtToIncomeRatio: number
  maxEligibleAmount: number
  disposableIncomeAfterLoan: number
  interestRate: number
  reasons: string[]
}

/** A single row in the amortisation schedule */
export type AmortisationRow = {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}
