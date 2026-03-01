<script setup lang="ts">
import { Landmark, Moon, Sun, Home, Calculator } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import Button from '@/components/ui/Button.vue'

defineProps<{
  currentView: 'landing' | 'simulator'
}>()

const emit = defineEmits<{
  navigate: [view: 'landing' | 'simulator']
}>()

const { store: colorMode } = useColorMode({ emitAuto: true })

function toggleTheme() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-outline-variant bg-surface/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <!-- Logo -->
      <button
        class="flex items-center gap-3 transition-opacity hover:opacity-80"
        @click="emit('navigate', 'landing')"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Landmark :size="20" />
        </div>
        <div class="text-left">
          <h1 class="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Loan Eligibility Simulator
          </h1>
          <p class="hidden text-xs text-low-emphasis sm:block">
            Estimate your loan eligibility in real time
          </p>
        </div>
      </button>

      <!-- Nav + actions -->
      <div class="flex items-center gap-1">
        <nav class="flex items-center gap-1">
          <button
            class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="currentView === 'landing'
              ? 'bg-primary/10 text-primary'
              : 'text-medium-emphasis hover:bg-dim hover:text-foreground'"
            @click="emit('navigate', 'landing')"
          >
            <Home :size="16" />
            <span class="hidden sm:inline">Home</span>
          </button>
          <button
            class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="currentView === 'simulator'
              ? 'bg-primary/10 text-primary'
              : 'text-medium-emphasis hover:bg-dim hover:text-foreground'"
            @click="emit('navigate', 'simulator')"
          >
            <Calculator :size="16" />
            <span class="hidden sm:inline">Simulator</span>
          </button>
        </nav>

        <div class="ml-1 h-6 w-px bg-outline-variant" />

        <Button
          variant="ghost"
          size="icon"
          @click="toggleTheme"
        >
          <Sun
            v-if="colorMode === 'dark'"
            :size="18"
          />
          <Moon
            v-else
            :size="18"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  </header>
</template>
