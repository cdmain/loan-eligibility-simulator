# Loan Eligibility Simulator

A responsive micro-frontend application where users input their income, expenses, and desired loan amount to see estimated eligibility results (mocked data).

Built with **Vue 3.5**, **TypeScript** (strict mode), **Tailwind CSS 4**, **Rsbuild**, **Module Federation**, **TanStack Form/Query**, **Reka UI**, and **Zod** validation.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the simulator (standalone) — http://localhost:3001
pnpm dev:simulator

# Or start both shell + simulator (MFE mode)
pnpm dev
# → Shell:     http://localhost:3000
# → Simulator: http://localhost:3001
```

## Docker (one command)

```bash
# Build and run with Docker / Rancher Desktop
docker compose up --build

# → http://localhost:3000
```

Or without Compose:

```bash
docker build -t loan-simulator .
docker run -p 3000:80 loan-simulator
```

---

## Architecture

```
├── apps/
│   ├── simulator/      # Remote module — the Loan Eligibility Simulator
│   │   ├── src/
│   │   │   ├── components/     # UI + feature components
│   │   │   ├── composables/    # useLoanCalculation, useEligibility
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   ├── types/          # TypeScript types
│   │   │   ├── mocks/          # Mock eligibility API
│   │   │   ├── lib/            # Utilities (cn, currency formatting)
│   │   │   ├── styles/         # Tailwind CSS theme tokens
│   │   │   ├── App.vue         # Page orchestrator
│   │   │   ├── entry.ts        # Module Federation export
│   │   │   └── main.ts         # Standalone bootstrap
│   │   └── rsbuild.config.ts
│   └── shell/          # Host — consumes the simulator via MF
│       └── rsbuild.config.ts
├── Dockerfile          # Multi-stage build → nginx
├── docker-compose.yml
└── eslint.config.mjs   # ESLint Stylistic (no Prettier)
```

### Module Federation

The project demonstrates a **micro-frontend architecture**:

| App | Role | Port | What it does |
|---|---|---|---|
| `simulator` | Remote | 3001 | Exposes `./app` — the loan simulator component |
| `shell` | Host | 3000 | Consumes the remote and renders it inside a shell layout |

The simulator also works **standalone** — it mounts its own Vue app when accessed directly.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Vue 3.5 (Composition API, `<script setup>`) |
| Language | TypeScript 5 (strict mode) |
| Bundler | Rsbuild (Rspack) |
| Micro-frontends | Module Federation via `@module-federation/rsbuild-plugin` |
| Styling | Tailwind CSS 4 + PostCSS |
| Primitives | Reka UI |
| Component patterns | shadcn-vue (CVA + Tailwind Merge) |
| Forms | TanStack Vue Form |
| Data fetching | TanStack Vue Query (mutation for mock API) |
| Validation | Zod |
| Utilities | VueUse |
| Linting | ESLint + @stylistic (no Prettier) |
| Icons | Lucide Vue Next |
| Container | Docker (multi-stage nginx) |

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start both shell and simulator in development mode |
| `pnpm dev:simulator` | Start only the simulator |
| `pnpm dev:shell` | Start only the shell |
| `pnpm build` | Production build for all apps |
| `pnpm lint` | Run ESLint across all apps |
| `pnpm type-check` | Run TypeScript type checking |

---

## How It Works

1. **Input**: The user enters monthly gross income, itemised expenses, desired loan amount, and repayment term.
2. **Real-time preview**: As inputs change, computed values (estimated rate, DTI ratio, affordability gauge) update live.
3. **Eligibility check**: On form submission, a mock async API evaluates eligibility using:
   - **Debt-to-income ratio** (DTI) — fails at >42%, conditional at 35–42%
   - **Credit score** (simulated 300–850 range)
   - **Disposable income** after repayments
   - **Maximum affordable amount** (capped at 30% of disposable income)
4. **Results**: A detailed breakdown including status badge, affordability gauge, repayment schedule, interest rate, and assessment notes.

### Validation

All form inputs are validated at the field level using **Zod** schemas through the **TanStack Zod Form Adapter**:

- Income: min R 1 000
- Expenses: non-negative, upper bounds
- Loan amount: R 5 000 – R 10 000 000
- Term: 6 – 360 months
- Cross-field: total expenses must be less than income

---

## Design Decisions

- **Presentational components** — components receive props and emit events; the page (`App.vue`) orchestrates state and side effects.
- **Semantic colour tokens** — all colours reference CSS custom properties that switch between light and dark mode automatically. No hardcoded hex values in components.
- **Tailwind CSS 4** — uses `@theme inline` and `@custom-variant dark` for runtime theme switching without a rebuild.
- **CVA (class-variance-authority)** — component variants (Button, Badge) are type-safe and composable.
- **No Prettier** — formatting is handled by ESLint Stylistic rules.
- **Module Federation bootstrap pattern** — `main.ts` dynamically imports `bootstrap.ts` so shared dependencies (Vue) are resolved before mounting.

---

## Building & Testing

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Production build
pnpm build

# Docker
docker compose up --build
# Open http://localhost:3000
```

---

## License

This project was built as a technical assessment and is provided as-is.
