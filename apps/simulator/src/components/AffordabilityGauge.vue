<script setup lang="ts">
import { computed } from 'vue'
import Progress from '@/components/ui/Progress.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** Affordability percentage 0-100. Higher = more affordable. */
  value: number
}>()

const clampedValue = computed(() =>
  Math.max(0, Math.min(100, Math.round(props.value))),
)

const label = computed(() => {
  if (clampedValue.value >= 70) return 'Comfortable'
  if (clampedValue.value >= 40) return 'Moderate'
  if (clampedValue.value >= 20) return 'Tight'
  return 'Unaffordable'
})

const barColorClass = computed(() => {
  if (clampedValue.value >= 70) return 'bg-success'
  if (clampedValue.value >= 40) return 'bg-warning'
  return 'bg-error'
})

const textColorClass = computed(() => {
  if (clampedValue.value >= 70) return 'text-success'
  if (clampedValue.value >= 40) return 'text-warning'
  return 'text-error'
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-sm text-medium-emphasis">Affordability</span>
      <span :class="cn('text-sm font-semibold', textColorClass)">
        {{ clampedValue }}% — {{ label }}
      </span>
    </div>
    <Progress
      :model-value="clampedValue"
      :max="100"
      :indicator-class="barColorClass"
      class="h-3"
    />
  </div>
</template>
