<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { z } from 'zod'
import Card from '@/components/ui/Card.vue'
import Label from '@/components/ui/Label.vue'
import Slider from '@/components/ui/Slider.vue'
import Button from '@/components/ui/Button.vue'
import Separator from '@/components/ui/Separator.vue'
import type { LoanFormValues, ExpenseItem } from '@/types/loan.types'
import {
  Banknote,
  Home,
  Zap,
  ShoppingCart,
  Car,
  Shield,
  Tv,
  Plus,
  X,
  Calculator,
  Loader2,
  ReceiptText,
} from 'lucide-vue-next'

const props = defineProps<{
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  submit: [values: LoanFormValues]
}>()

// ---------------------------------------------------------------------------
// Expense suggestions
// ---------------------------------------------------------------------------

type Suggestion = { label: string; defaultAmount: number }

const SUGGESTIONS: Suggestion[] = [
  { label: 'Rent / Bond', defaultAmount: 7_000 },
  { label: 'Utilities', defaultAmount: 2_000 },
  { label: 'Groceries', defaultAmount: 4_000 },
  { label: 'Transport', defaultAmount: 3_000 },
  { label: 'Insurance', defaultAmount: 1_500 },
  { label: 'Entertainment', defaultAmount: 1_000 },
]

const LABEL_ICONS = new Map<string, Component>([
  ['Rent / Bond', Home],
  ['Utilities', Zap],
  ['Groceries', ShoppingCart],
  ['Transport', Car],
  ['Insurance', Shield],
  ['Entertainment', Tv],
])

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { label: 'Rent / Bond', amount: 7_000 },
]

// ---------------------------------------------------------------------------
// Slider state
// ---------------------------------------------------------------------------

const loanAmountSlider = ref([200_000])
const loanTermSlider = ref([60])

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

const form = useForm({
  defaultValues: {
    grossIncome: 35_000,
    expenses: DEFAULT_EXPENSES as ExpenseItem[],
    loanAmount: 200_000,
    loanTermMonths: 60,
  },
  onSubmit: async ({ value }) => {
    emit('submit', value as LoanFormValues)
  },
})

// ---------------------------------------------------------------------------
// Expense helpers
// ---------------------------------------------------------------------------

const addedLabels = computed(() => {
  const expenses = form.getFieldValue('expenses')
  return new Set(expenses.map((e: ExpenseItem) => e.label))
})

const availableSuggestions = computed(() =>
  SUGGESTIONS.filter((s) => !addedLabels.value.has(s.label)),
)

function addSuggestion(suggestion: Suggestion) {
  form.pushFieldValue('expenses', {
    label: suggestion.label,
    amount: suggestion.defaultAmount,
  })
}

function addCustomExpense() {
  form.pushFieldValue('expenses', { label: 'Other', amount: 0 })
}

function removeExpense(index: number) {
  form.removeFieldValue('expenses', index)
}

function updateAmount(index: number, raw: number) {
  const current = form.getFieldValue('expenses')
  const updated = current.map((item: ExpenseItem, i: number) =>
    i === index ? { ...item, amount: raw } : item,
  )
  form.setFieldValue('expenses', updated)
}

// ---------------------------------------------------------------------------
// Slider / input sync
// ---------------------------------------------------------------------------

function handleLoanAmountSlider(value: number[]) {
  loanAmountSlider.value = value
  form.setFieldValue('loanAmount', value[0])
}

function handleLoanAmountInput(event: Event) {
  const raw = Number((event.target as HTMLInputElement).value)
  const clamped = Math.max(5_000, Math.min(5_000_000, raw || 5_000))
  loanAmountSlider.value = [clamped]
  form.setFieldValue('loanAmount', clamped)
}

function handleLoanTermSlider(value: number[]) {
  loanTermSlider.value = value
  form.setFieldValue('loanTermMonths', value[0])
}

function handleLoanTermInput(event: Event) {
  const raw = Number((event.target as HTMLInputElement).value)
  const clamped = Math.max(6, Math.min(360, raw || 6))
  loanTermSlider.value = [clamped]
  form.setFieldValue('loanTermMonths', clamped)
}
</script>

<template>
  <Card class="flex flex-col gap-5">
    <div class="flex items-center gap-2 text-foreground">
      <Calculator
        :size="18"
        class="text-primary"
      />
      <h2 class="text-base font-semibold">
        Your Details
      </h2>
    </div>

    <form @submit.prevent.stop="form.handleSubmit">
      <div class="flex flex-col gap-5">
        <!-- Monthly Income -->
        <form.Field
          name="grossIncome"
          :validators="{
            onChange: z.number().min(1000, 'Minimum income is R 1 000').max(10_000_000, 'Income seems too high'),
          }"
        >
          <template #default="{ field }">
            <div class="flex flex-col gap-1.5">
              <Label :for="field.name">
                <span class="flex items-center gap-1.5">
                  <Banknote
                    :size="14"
                    class="text-primary"
                  />
                  Monthly Gross Income
                </span>
              </Label>
              <div class="relative">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-low-emphasis">R</span>
                <input
                  :id="field.name"
                  :name="field.name"
                  :value="field.state.value"
                  type="number"
                  min="1000"
                  step="500"
                  class="flex h-10 w-full rounded-lg border border-outline-variant bg-surface py-2 pl-8 pr-3 text-sm text-foreground tabular-nums transition-colors placeholder:text-low-emphasis focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25"
                  placeholder="25 000"
                  @input="(e: Event) => field.handleChange(Number((e.target as HTMLInputElement).value))"
                  @blur="field.handleBlur"
                >
              </div>
              <p
                v-if="field.state.meta.isTouched && field.state.meta.errors.length > 0"
                class="text-xs text-error"
              >
                {{ field.state.meta.errors[0] }}
              </p>
            </div>
          </template>
        </form.Field>

        <Separator />

        <!-- Dynamic Expenses -->
        <div class="flex flex-col gap-3">
          <p class="flex items-center gap-1.5 text-sm font-medium text-medium-emphasis">
            <ReceiptText
              :size="14"
            />
            Monthly Expenses
          </p>

          <form.Field name="expenses">
            <template #default="{ field: expensesField }">
              <!-- Expense rows -->
              <div class="flex flex-col gap-2">
                <div
                  v-for="(expense, index) in (expensesField.state.value as ExpenseItem[])"
                  :key="`expense-${index}`"
                  class="flex items-center gap-2"
                >
                  <component
                    :is="LABEL_ICONS.get(expense.label)"
                    v-if="LABEL_ICONS.has(expense.label)"
                    :size="14"
                    class="shrink-0 text-low-emphasis"
                  />
                  <span
                    v-else
                    class="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-xs text-low-emphasis"
                  >&#x2022;</span>

                  <span class="w-28 shrink-0 truncate text-sm text-medium-emphasis">
                    {{ expense.label }}
                  </span>

                  <div class="relative flex-1">
                    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-low-emphasis">R</span>
                    <input
                      :value="expense.amount"
                      type="number"
                      min="0"
                      step="100"
                      class="flex h-9 w-full rounded-lg border border-outline-variant bg-surface py-2 pl-8 pr-3 text-sm text-foreground tabular-nums transition-colors placeholder:text-low-emphasis focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25"
                      @input="(e: Event) => updateAmount(index, Number((e.target as HTMLInputElement).value))"
                    >
                  </div>

                  <button
                    type="button"
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-low-emphasis transition-colors hover:bg-dim hover:text-error"
                    title="Remove expense"
                    @click="removeExpense(index)"
                  >
                    <X :size="16" />
                  </button>
                </div>
              </div>

              <!-- Array-level error -->
              <p
                v-if="expensesField.state.meta.isTouched && expensesField.state.meta.errors.length > 0"
                class="mt-1 text-xs text-error"
              >
                {{ expensesField.state.meta.errors[0] }}
              </p>
            </template>
          </form.Field>

          <!-- Suggestion chips -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <button
              v-for="suggestion in availableSuggestions"
              :key="suggestion.label"
              type="button"
              class="flex items-center gap-1 rounded-full border border-dashed border-outline-variant px-3 py-1 text-xs text-medium-emphasis transition-colors hover:border-primary hover:text-primary"
              @click="addSuggestion(suggestion)"
            >
              <Plus :size="12" />
              {{ suggestion.label }}
            </button>
            <button
              type="button"
              class="flex items-center gap-1 rounded-full border border-dashed border-outline-variant px-3 py-1 text-xs text-medium-emphasis transition-colors hover:border-primary hover:text-primary"
              @click="addCustomExpense"
            >
              <Plus :size="12" />
              Custom
            </button>
          </div>
        </div>

        <Separator />

        <!-- Loan Amount -->
        <div class="flex flex-col gap-2">
          <Label>Loan Amount</Label>
          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-low-emphasis">R</span>
            <input
              :value="loanAmountSlider[0]"
              type="number"
              min="5000"
              max="5000000"
              step="5000"
              class="flex h-10 w-full rounded-lg border border-outline-variant bg-surface py-2 pl-8 pr-3 text-sm text-foreground tabular-nums transition-colors placeholder:text-low-emphasis focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25"
              @change="handleLoanAmountInput"
            >
          </div>
          <Slider
            :model-value="loanAmountSlider"
            :min="5000"
            :max="5_000_000"
            :step="5000"
            @update:model-value="handleLoanAmountSlider"
          />
          <div class="flex justify-between text-xs text-low-emphasis">
            <span>R 5 000</span>
            <span>R 5 000 000</span>
          </div>
        </div>

        <!-- Loan Term -->
        <div class="flex flex-col gap-2">
          <Label>Loan Term (months)</Label>
          <input
            :value="loanTermSlider[0]"
            type="number"
            min="6"
            max="360"
            step="6"
            class="flex h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-foreground tabular-nums transition-colors placeholder:text-low-emphasis focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25"
            @change="handleLoanTermInput"
          >
          <Slider
            :model-value="loanTermSlider"
            :min="6"
            :max="360"
            :step="6"
            @update:model-value="handleLoanTermSlider"
          />
          <div class="flex justify-between text-xs text-low-emphasis">
            <span>6 months</span>
            <span>30 years</span>
          </div>
        </div>

        <!-- Submit -->
        <Button
          type="submit"
          size="lg"
          class="mt-2 w-full"
          :disabled="props.isSubmitting"
        >
          <Loader2
            v-if="props.isSubmitting"
            :size="18"
            class="animate-spin"
          />
          <Calculator
            v-else
            :size="18"
          />
          {{ props.isSubmitting ? 'Evaluating...' : 'Check Eligibility' }}
        </Button>
      </div>
    </form>
  </Card>
</template>
