<script setup lang="ts">
import { computed } from 'vue'
import type { EligibilityResult, EligibilityStatus } from '@/types/loan.types'
import { formatPercentage } from '@/lib/currency'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Separator from '@/components/ui/Separator.vue'
import AffordabilityGauge from '@/components/AffordabilityGauge.vue'
import RepaymentBreakdown from '@/components/RepaymentBreakdown.vue'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChartNoAxesCombined,
  Info,
} from 'lucide-vue-next'

const props = defineProps<{
  result: EligibilityResult | null
  isLoading: boolean
  affordabilityPercentage: number
}>()

const statusConfig = computed<
  Record<EligibilityStatus, { icon: typeof CheckCircle; badge: 'success' | 'warning' | 'error'; label: string }>
>(() => ({
  approved: { icon: CheckCircle, badge: 'success', label: 'Eligible' },
  conditional: { icon: AlertTriangle, badge: 'warning', label: 'Conditional' },
  declined: { icon: XCircle, badge: 'error', label: 'Not Eligible' },
}))

const currentStatus = computed(() => {
  if (!props.result) return null
  return statusConfig.value[props.result.status]
})
</script>

<template>
  <Card class="flex flex-col gap-6">
    <div class="flex items-center gap-2 text-foreground">
      <ChartNoAxesCombined
        :size="18"
        class="text-primary"
      />
      <h2 class="text-base font-semibold">
        Eligibility Results
      </h2>
    </div>

    <!-- Empty state -->
    <div
      v-if="!result && !isLoading"
      class="flex flex-col items-center gap-4 py-12 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-dim">
        <ChartNoAxesCombined
          :size="28"
          class="text-low-emphasis"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-medium-emphasis">
          No assessment yet
        </p>
        <p class="text-xs text-low-emphasis">
          Fill in your details and click &ldquo;Check Eligibility&rdquo;
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-else-if="isLoading"
      class="flex flex-col items-center gap-4 py-12"
    >
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-dim border-t-primary" />
      <p class="text-sm text-medium-emphasis">
        Evaluating eligibility&hellip;
      </p>
    </div>

    <!-- Results -->
    <template v-else-if="result && currentStatus">
      <!-- Status Badge -->
      <div class="flex flex-col items-center gap-3 py-2">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl"
          :class="{
            'bg-success-container': result.status === 'approved',
            'bg-warning-container': result.status === 'conditional',
            'bg-error-container': result.status === 'declined',
          }"
        >
          <component
            :is="currentStatus.icon"
            :size="28"
            :class="{
              'text-on-success-container': result.status === 'approved',
              'text-on-warning-container': result.status === 'conditional',
              'text-on-error-container': result.status === 'declined',
            }"
          />
        </div>
        <Badge
          :variant="currentStatus.badge"
          class="px-4 py-1.5 text-sm"
        >
          {{ currentStatus.label }}
        </Badge>
        <p class="text-xs text-low-emphasis">
          Score: {{ result.score }} / 850 &middot;
          Debt-to-Income: {{ formatPercentage(result.debtToIncomeRatio) }}
        </p>
      </div>

      <Separator />

      <!-- Affordability Gauge -->
      <AffordabilityGauge :value="affordabilityPercentage" />

      <Separator />

      <!-- Repayment Details -->
      <RepaymentBreakdown :result="result" />

      <Separator />

      <!-- Reasons -->
      <div class="flex flex-col gap-2">
        <p class="flex items-center gap-1.5 text-sm font-medium text-medium-emphasis">
          <Info :size="14" />
          Assessment Notes
        </p>
        <ul class="flex flex-col gap-1.5">
          <li
            v-for="(reason, index) in result.reasons"
            :key="index"
            class="flex items-start gap-2 rounded-md bg-dim px-3 py-2 text-xs text-medium-emphasis"
          >
            <span class="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-low-emphasis" />
            {{ reason }}
          </li>
        </ul>
      </div>
    </template>
  </Card>
</template>
