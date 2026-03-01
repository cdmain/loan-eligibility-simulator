<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
    class?: string
  }>(),
  {
    variant: 'default',
    class: '',
  },
)

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary-container text-on-primary-container',
        success: 'bg-success-container text-on-success-container',
        warning: 'bg-warning-container text-on-warning-container',
        error: 'bg-error-container text-on-error-container',
        info: 'bg-info-container text-on-info-container',
        outline: 'border border-outline text-medium-emphasis',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), props.class),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
