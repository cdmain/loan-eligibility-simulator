import { z } from 'zod'

export const expenseItemSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(50, 'Label is too long'),
  amount: z
    .number({ required_error: 'Amount is required' })
    .min(0, 'Amount cannot be negative')
    .max(500_000, 'Amount seems too high'),
})

export const loanFormSchema = z
  .object({
    grossIncome: z
      .number({ required_error: 'Monthly income is required' })
      .min(1_000, 'Minimum income is R 1 000')
      .max(10_000_000, 'Income seems too high'),
    expenses: z
      .array(expenseItemSchema)
      .min(1, 'Add at least one expense'),
    loanAmount: z
      .number({ required_error: 'Loan amount is required' })
      .min(5_000, 'Minimum loan is R 5 000')
      .max(10_000_000, 'Maximum loan is R 10 000 000'),
    loanTermMonths: z
      .number({ required_error: 'Loan term is required' })
      .min(6, 'Minimum term is 6 months')
      .max(360, 'Maximum term is 30 years'),
  })
  .refine(
    (data) => {
      const totalExpenses = data.expenses.reduce(
        (sum, item) => sum + item.amount,
        0,
      )
      return totalExpenses < data.grossIncome
    },
    {
      message: 'Total expenses must be less than monthly income',
      path: ['expenses'],
    },
  )
