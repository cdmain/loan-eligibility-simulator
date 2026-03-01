import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatPercentage,
  formatTerm,
} from '../currency'

describe('formatCurrency', () => {
  it('formats a round number with no decimals', () => {
    const result = formatCurrency(25_000)
    expect(result).toContain('25')
    expect(result).toContain('000')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('includes the ZAR currency symbol', () => {
    const result = formatCurrency(1_000)
    expect(result).toMatch(/R/)
  })

  it('truncates decimals', () => {
    const result = formatCurrency(1_234.56)
    // Should not contain cents since maximumFractionDigits: 0
    expect(result).not.toContain('.56')
  })
})

describe('formatCurrencyPrecise', () => {
  it('includes exactly two decimal places', () => {
    const result = formatCurrencyPrecise(2_345.67)
    expect(result).toContain('2')
    expect(result).toContain('345')
    expect(result).toContain('67')
  })

  it('pads with zeros for whole numbers', () => {
    const result = formatCurrencyPrecise(1_000)
    expect(result).toContain('00')
  })
})

describe('formatPercentage', () => {
  it('formats with default 1 decimal', () => {
    expect(formatPercentage(32.567)).toBe('32.6%')
  })

  it('respects custom decimal places', () => {
    expect(formatPercentage(12.3456, 2)).toBe('12.35%')
  })

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.0%')
  })

  it('formats 100%', () => {
    expect(formatPercentage(100)).toBe('100.0%')
  })
})

describe('formatTerm', () => {
  it('formats months-only below 12', () => {
    expect(formatTerm(6)).toBe('6 months')
  })

  it('formats exact years', () => {
    expect(formatTerm(12)).toBe('1 year')
    expect(formatTerm(24)).toBe('2 years')
    expect(formatTerm(60)).toBe('5 years')
  })

  it('formats years and remaining months', () => {
    expect(formatTerm(18)).toBe('1y 6m')
    expect(formatTerm(30)).toBe('2y 6m')
  })

  it('formats 360 months as 30 years', () => {
    expect(formatTerm(360)).toBe('30 years')
  })
})
