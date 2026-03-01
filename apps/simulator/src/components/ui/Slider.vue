<script setup lang="ts">
import { computed } from 'vue'
import {
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: number[]
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    class?: string
  }>(),
  {
    modelValue: () => [0],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    class: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const rootClasses = computed(() =>
  cn(
    'relative flex w-full touch-none select-none items-center',
    props.disabled && 'pointer-events-none opacity-40',
    props.class,
  ),
)
</script>

<template>
  <SliderRoot
    :model-value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :class="rootClasses"
    @update:model-value="(v: number[] | undefined) => emit('update:modelValue', v ?? [0])"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-dim">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      class="block h-5 w-5 rounded-full border-2 border-primary bg-surface shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    />
  </SliderRoot>
</template>
