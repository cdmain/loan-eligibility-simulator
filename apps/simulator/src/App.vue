<script setup lang="ts">
import { ref, computed, nextTick, defineAsyncComponent } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import LandingHero from '@/components/LandingHero.vue'
import LoanForm from '@/components/LoanForm.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { useEligibility } from '@/composables/useEligibility'
import { useLoanCalculation } from '@/composables/useLoanCalculation'
import type { LoanFormValues, ExpenseItem } from '@/types/loan.types'

// Lazy-load the results panel — it's not needed until after submission
const EligibilityResults = defineAsyncComponent(
  () => import('@/components/EligibilityResults.vue'),
)

// --- View state ---
const currentView = ref<'landing' | 'simulator'>('landing')

function navigateTo(view: 'landing' | 'simulator') {
  currentView.value = view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// --- Form state refs for real-time preview ---
const grossIncome = ref(35_000)
const expenses = ref<ExpenseItem[]>([
  { label: 'Rent / Bond', amount: 7_000 },
])
const loanAmount = ref(200_000)
const loanTermMonths = ref(60)

// --- Real-time calculations ---
const { affordabilityPercentage } = useLoanCalculation({
  grossIncome,
  expenses,
  loanAmount,
  loanTermMonths,
})

// --- Eligibility mutation (triggered on form submit) ---
const { evaluate, result, isEvaluating } = useEligibility()

/** Ref for scrolling to results after submit */
const resultsRef = ref<HTMLElement | null>(null)

async function handleSubmit(values: LoanFormValues) {
  grossIncome.value = values.grossIncome
  expenses.value = values.expenses
  loanAmount.value = values.loanAmount
  loanTermMonths.value = values.loanTermMonths

  await evaluate(values)

  await nextTick()
  resultsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const eligibilityResult = computed(() => result.value ?? null)
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppHeader
      :current-view="currentView"
      @navigate="navigateTo"
    />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ErrorBoundary>
        <!-- Landing Page -->
        <LandingHero
          v-if="currentView === 'landing'"
          @start="navigateTo('simulator')"
        />

        <!-- Simulator Page -->
        <template v-else>
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Your Loan Assessment
            </h2>
            <p class="mt-1 text-sm text-low-emphasis">
              Fill in your financial details to check eligibility.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Left: Form -->
            <LoanForm
              :is-submitting="isEvaluating"
              @submit="handleSubmit"
            />

            <!-- Right: Results -->
            <div
              ref="resultsRef"
              class="scroll-mt-24 lg:sticky lg:top-24 lg:self-start"
            >
              <EligibilityResults
                :result="eligibilityResult"
                :is-loading="isEvaluating"
                :affordability-percentage="affordabilityPercentage"
              />
            </div>
          </div>
        </template>
      </ErrorBoundary>

      <!-- Footer -->
      <footer class="mt-12 border-t border-outline-variant pt-6 text-center">
        <p class="text-xs text-low-emphasis">
          This is a simulation tool for demonstration purposes only. It does not constitute a formal loan offer or financial advice.
          All data is mocked and processed locally in the browser.
        </p>
      </footer>
    </main>
  </div>
</template>
