<script setup lang="ts">
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  Clock,
  BarChart3,
} from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-10 px-4 py-16 text-center sm:py-24">
    <!-- Icon -->
    <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
      <Landmark
        :size="40"
        class="text-primary"
      />
    </div>

    <!-- Heading -->
    <div class="flex max-w-2xl flex-col gap-4">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        See If You Qualify
      </h2>
      <p class="text-base text-medium-emphasis sm:text-lg">
        Enter your financial details and instantly check your estimated loan
        eligibility. All calculations are simulated for demonstration purposes.
      </p>
    </div>

    <!-- Feature pills -->
    <div class="flex flex-wrap justify-center gap-3">
      <div class="flex items-center gap-2 rounded-full bg-dim px-4 py-2 text-sm text-medium-emphasis">
        <ShieldCheck
          :size="16"
          class="text-success"
        />
        No credit check
      </div>
      <div class="flex items-center gap-2 rounded-full bg-dim px-4 py-2 text-sm text-medium-emphasis">
        <Clock
          :size="16"
          class="text-primary"
        />
        Instant results
      </div>
      <div class="flex items-center gap-2 rounded-full bg-dim px-4 py-2 text-sm text-medium-emphasis">
        <BarChart3
          :size="16"
          class="text-tertiary"
        />
        Detailed breakdown
      </div>
    </div>

    <!-- CTA -->
    <Button
      size="lg"
      @click="$emit('start')"
    >
      Get Started
      <ArrowRight :size="18" />
    </Button>
  </div>
</template>
