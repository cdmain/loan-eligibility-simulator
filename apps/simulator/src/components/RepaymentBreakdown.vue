<script setup lang="ts">
import { computed } from 'vue'
import type { EligibilityResult } from '@/types/loan.types'
import { formatCurrency, formatPercentage } from '@/lib/currency'
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Wallet,
  Banknote,
  PiggyBank,
} from 'lucide-vue-next'

const props = defineProps<{
  result: EligibilityResult
}>()

const rows = computed(() => [
  {
    label: 'Monthly Repayment',
    value: formatCurrency(props.result.monthlyPayment),
    icon: Wallet,
    highlight: true,
  },
  {
    label: 'Interest Rate',
    value: formatPercentage(props.result.interestRate),
    icon: Percent,
    highlight: false,
  },
  {
    label: 'Total Repayment',
    value: formatCurrency(props.result.totalRepayment),
    icon: Banknote,
    highlight: false,
  },
  {
    label: 'Total Interest',
    value: formatCurrency(props.result.totalInterest),
    icon: TrendingUp,
    highlight: false,
  },
  {
    label: 'Max Eligible Amount',
    value: formatCurrency(props.result.maxEligibleAmount),
    icon: PiggyBank,
    highlight: false,
  },
  {
    label: 'Remaining Disposable',
    value: formatCurrency(props.result.disposableIncomeAfterLoan),
    icon: props.result.disposableIncomeAfterLoan >= 0 ? TrendingUp : TrendingDown,
    highlight: false,
  },
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
      :class="row.highlight ? 'bg-primary-container' : 'hover:bg-dim'"
    >
      <span class="flex items-center gap-2 text-sm text-medium-emphasis">
        <component
          :is="row.icon"
          :size="16"
          :class="row.highlight ? 'text-on-primary-container' : 'text-low-emphasis'"
        />
        {{ row.label }}
      </span>
      <span
        class="text-sm font-semibold tabular-nums"
        :class="row.highlight ? 'text-on-primary-container' : 'text-foreground'"
      >
        {{ row.value }}
      </span>
    </div>
  </div>
</template>
