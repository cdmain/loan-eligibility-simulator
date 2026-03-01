<script setup lang="ts">
import { computed } from 'vue'
import { Label as RekaLabel } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    for?: string
    class?: string
  }>(),
  { for: undefined, class: '' },
)

const classes = computed(() =>
  cn('text-sm font-medium text-foreground', props.class),
)
</script>

<template>
  <RekaLabel
    :for="props.for"
    :class="classes"
  >
    <slot />
  </RekaLabel>
</template>
