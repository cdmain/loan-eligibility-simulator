/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
  export default component
}

declare module 'loan_simulator/app' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}
