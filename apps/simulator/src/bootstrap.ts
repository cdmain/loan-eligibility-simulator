import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import './styles/globals.css'

const app = createApp(App)

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  },
})

// Global error handler — logs uncaught errors during development
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', { err, component: instance?.$options.name, info })
}

app.mount('#app')
