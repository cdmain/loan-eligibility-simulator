import { useMutation } from '@tanstack/vue-query'
import { checkEligibility } from '@/mocks/eligibility.mock'
import type { LoanFormValues, EligibilityResult } from '@/types/loan.types'

/**
 * Wraps the mock eligibility API in a TanStack mutation.
 *
 * Provides loading state, error handling, and result caching
 * that the UI components can consume reactively.
 */
export function useEligibility() {
  const {
    mutateAsync: evaluate,
    data: result,
    isPending: isEvaluating,
    error,
    reset,
  } = useMutation<EligibilityResult, Error, LoanFormValues>({
    mutationFn: checkEligibility,
  })

  return {
    /** Trigger an eligibility evaluation */
    evaluate,
    /** The most recent result (null before first evaluation) */
    result,
    /** Whether an evaluation is in progress */
    isEvaluating,
    /** Error from the last evaluation, if any */
    error,
    /** Clear the current result and error */
    reset,
  }
}
