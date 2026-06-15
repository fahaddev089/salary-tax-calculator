import { useMemo, useState } from 'react'
import './App.css'

// FBR salary tax slabs — Tax Year 2025–26 (annual taxable income, PKR)
// Each slab: tax = fixed + rate * (income - lower bound of slab)
const SLABS = [
  { upTo: 600000, rate: 0, fixed: 0, label: 'Up to PKR 600,000 (0%)' },
  { upTo: 1200000, rate: 0.01, fixed: 0, label: 'PKR 600,000 – 1,200,000 (1%)' },
  { upTo: 2200000, rate: 0.11, fixed: 6000, label: 'PKR 1,200,000 – 2,200,000 (11%)' },
  { upTo: 3200000, rate: 0.23, fixed: 116000, label: 'PKR 2,200,000 – 3,200,000 (23%)' },
  { upTo: 4100000, rate: 0.30, fixed: 346000, label: 'PKR 3,200,000 – 4,100,000 (30%)' },
  { upTo: Infinity, rate: 0.35, fixed: 616000, label: 'Above PKR 4,100,000 (35%)' },
]

function formatPKR(value) {
  const safe = Number.isFinite(value) ? value : 0
  return 'PKR ' + Math.round(safe).toLocaleString('en-PK')
}

function calculateTax(annualIncome) {
  let lowerBound = 0
  for (const slab of SLABS) {
    if (annualIncome <= slab.upTo) {
      const additionalAmount = Math.max(annualIncome - lowerBound, 0)
      const additionalTax = additionalAmount * slab.rate
      return {
        slabLabel: slab.label,
        ratePercent: slab.rate * 100,
        fixedTax: slab.fixed,
        additionalAmount,
        additionalTax,
        totalTax: slab.fixed + additionalTax,
      }
    }
    lowerBound = slab.upTo
  }
  // Fallback (unreachable, last slab upTo is Infinity)
  return {
    slabLabel: SLABS[SLABS.length - 1].label,
    ratePercent: SLABS[SLABS.length - 1].rate * 100,
    fixedTax: SLABS[SLABS.length - 1].fixed,
    additionalAmount: 0,
    additionalTax: 0,
    totalTax: SLABS[SLABS.length - 1].fixed,
  }
}

function App() {
  const [salaryInput, setSalaryInput] = useState('100000')

  const monthlyGross = Math.max(Number(salaryInput) || 0, 0)
  const annualGross = monthlyGross * 12

  const result = useMemo(() => calculateTax(annualGross), [annualGross])

  const monthlyTax = result.totalTax / 12
  const netMonthly = monthlyGross - monthlyTax
  const netAnnual = annualGross - result.totalTax

  return (
    <div className="page">
      <main className="receipt">
        <div className="stamp" aria-hidden="true">
          FY 2025–26
          <br />
          FBR SLABS
        </div>

        <p className="eyebrow">Pakistan · Salaried Individuals</p>
        <h1 className="title">Salary Tax Calculator</h1>
        <p className="subtitle">
          Enter your monthly gross salary. The breakdown below shows the fixed
          tax for your slab plus the tax on the additional amount above it.
        </p>

        <label className="field">
          <span>Monthly gross salary (PKR)</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            placeholder="e.g. 150000"
          />
        </label>

        <div className="perforation" aria-hidden="true"></div>

        <div className="rows">
          <div className="row">
            <span>Annual gross income</span>
            <span className="value">{formatPKR(annualGross)}</span>
          </div>
          <div className="row">
            <span>Applicable slab</span>
            <span className="value small">{result.slabLabel}</span>
          </div>
          <div className="row">
            <span>Fixed tax</span>
            <span className="value">{formatPKR(result.fixedTax)}</span>
          </div>
          <div className="row">
            <span>
              Tax on additional amount ({result.ratePercent}% of{' '}
              {formatPKR(result.additionalAmount)})
            </span>
            <span className="value">{formatPKR(result.additionalTax)}</span>
          </div>
          <div className="row total">
            <span>Total annual tax</span>
            <span className="value">{formatPKR(result.totalTax)}</span>
          </div>
          <div className="row total">
            <span>Monthly tax deduction</span>
            <span className="value">{formatPKR(monthlyTax)}</span>
          </div>
        </div>

        <div className="perforation" aria-hidden="true"></div>

        <div className="rows">
          <div className="row highlight">
            <span>Net monthly salary</span>
            <span className="value">{formatPKR(netMonthly)}</span>
          </div>
          <div className="row">
            <span>Net annual salary</span>
            <span className="value">{formatPKR(netAnnual)}</span>
          </div>
        </div>

        <p className="footnote">
          Based on FBR salary tax slabs for Tax Year 2025–26. Excludes the 9%
          surcharge that applies when annual taxable income exceeds PKR
          10,000,000, and any rebates, allowances, or other deductions.
        </p>
      </main>
    </div>
  )
}

export default App
