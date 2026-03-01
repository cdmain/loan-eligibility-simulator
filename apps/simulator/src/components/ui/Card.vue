<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
  }>(),
  { class: '' },
)

const classes = computed(() =>
  cn('rounded-xl border border-outline-variant bg-surface p-6 shadow-sm', props.class),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
