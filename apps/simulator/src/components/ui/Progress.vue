<script setup lang="ts">
import { computed } from 'vue'
import { ProgressRoot, ProgressIndicator } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    max?: number
    class?: string
    indicatorClass?: string
  }>(),
  {
    modelValue: 0,
    max: 100,
    class: '',
    indicatorClass: '',
  },
)

const rootClasses = computed(() =>
  cn('relative h-3 w-full overflow-hidden rounded-full bg-dim', props.class),
)

const barClasses = computed(() =>
  cn('h-full rounded-full transition-all duration-500 ease-out', props.indicatorClass || 'bg-primary'),
)

const percentage = computed(() =>
  Math.min(100, Math.max(0, (props.modelValue / props.max) * 100)),
)
</script>

<template>
  <ProgressRoot
    :model-value="modelValue"
    :max="max"
    :class="rootClasses"
  >
    <ProgressIndicator
      :class="barClasses"
      :style="{ width: `${percentage}%` }"
    />
  </ProgressRoot>
</template>
