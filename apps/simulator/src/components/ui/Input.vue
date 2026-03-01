<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    id?: string
    class?: string
    min?: number
    max?: number
    step?: number
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    id: undefined,
    class: '',
    min: undefined,
    max: undefined,
    step: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const classes = computed(() =>
  cn(
    'flex h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-foreground transition-colors',
    'placeholder:text-low-emphasis',
    'focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary/25',
    'disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-foreground-disabled',
    props.class,
  ),
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    :class="classes"
    @input="handleInput"
  >
</template>
