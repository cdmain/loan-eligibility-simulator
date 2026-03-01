<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const error = ref<Error | null>(null)
const hasError = ref(false)

onErrorCaptured((err: Error) => {
  error.value = err
  hasError.value = true
  console.error('[ErrorBoundary]', err)
  return false // Prevent further propagation
})

function retry() {
  hasError.value = false
  error.value = null
}
</script>

<template>
  <Card
    v-if="hasError"
    class="flex flex-col items-center gap-4 py-12 text-center"
  >
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-container">
      <AlertTriangle
        :size="28"
        class="text-on-error-container"
      />
    </div>
    <div class="flex flex-col gap-1">
      <p class="text-sm font-medium text-foreground">
        Something went wrong
      </p>
      <p class="max-w-md text-xs text-low-emphasis">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
    </div>
    <Button
      variant="outline"
      size="sm"
      @click="retry"
    >
      Try Again
    </Button>
  </Card>

  <slot v-else />
</template>
