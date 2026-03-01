<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { Landmark } from 'lucide-vue-next'

/**
 * Dynamically import the loan simulator module via Module Federation.
 * The remote must be running on :3001 for this to resolve.
 */
const LoanSimulator = defineAsyncComponent({
  loader: () => import('loan_simulator/app'),
  loadingComponent: {
    template: `
      <div class="flex flex-col items-center justify-center gap-4 py-24">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-dim border-t-primary" />
        <p class="text-sm text-low-emphasis">Loading Loan Simulator module&hellip;</p>
      </div>
    `,
  },
  errorComponent: {
    template: `
      <div class="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-container">
          <svg class="h-8 w-8 text-on-error-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground">Failed to load module</p>
        <p class="max-w-xs text-xs text-low-emphasis">
          Make sure the Loan Simulator remote is running on port 3001.
          Run <code class="rounded bg-dim px-1 py-0.5 font-mono text-xs">pnpm dev</code> from the project root.
        </p>
      </div>
    `,
  },
  delay: 200,
  timeout: 10000,
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Shell header -->
    <header class="border-b border-outline-variant bg-surface">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Landmark :size="16" />
        </div>
        <div>
          <h1 class="text-sm font-bold text-foreground">
            Nova Platform
          </h1>
          <p class="text-xs text-low-emphasis">
            Micro-Frontend Shell
          </p>
        </div>
      </div>
    </header>

    <!-- Remote module content -->
    <LoanSimulator />
  </div>
</template>
