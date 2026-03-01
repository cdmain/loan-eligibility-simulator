<script setup lang="ts">
import { computed } from 'vue'
import { Separator as RekaSeparator } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    class?: string
  }>(),
  {
    orientation: 'horizontal',
    class: '',
  },
)

const classes = computed(() =>
  cn(
    'shrink-0 bg-outline-variant',
    props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    props.class,
  ),
)
</script>

<template>
  <RekaSeparator
    :orientation="orientation"
    :class="classes"
  />
</template>
