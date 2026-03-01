const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const ZAR_PRECISE = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format a number as South African Rand (e.g. R 25 000) */
export function formatCurrency(value: number): string {
  return ZAR.format(value)
}

/** Format with cents (e.g. R 2 345.67) */
export function formatCurrencyPrecise(value: number): string {
  return ZAR_PRECISE.format(value)
}

/** Format a percentage with one decimal (e.g. 32.5%) */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/** Format months into a human-readable duration */
export function formatTerm(months: number): string {
  const years = Math.floor(months / 12)
  const remaining = months % 12

  if (years === 0) return `${months} months`
  if (remaining === 0) return years === 1 ? '1 year' : `${years} years`
  return `${years}y ${remaining}m`
}
