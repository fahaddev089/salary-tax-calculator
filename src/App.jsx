import { useMemo, useState } from 'react'
import './App.css'

// FBR salary tax slabs for salaried individuals.
// Each slab: tax = fixed + rate * (income - lower bound of slab)
const TAX_DATA = {
  '2025-26': {
    label: 'FY 2025–26',
    shortLabel: 'TY 2026',
    slabs: [
      { upTo: 600000, rate: 0, fixed: 0, label: 'Up to PKR 600,000 (0%)' },
      { upTo: 1200000, rate: 0.01, fixed: 0, label: 'PKR 600,000 – 1,200,000 (1%)' },
      { upTo: 2200000, rate: 0.11, fixed: 6000, label: 'PKR 1,200,000 – 2,200,000 (11%)' },
      { upTo: 3200000, rate: 0.23, fixed: 116000, label: 'PKR 2,200,000 – 3,200,000 (23%)' },
      { upTo: 4100000, rate: 0.30, fixed: 346000, label: 'PKR 3,200,000 – 4,100,000 (30%)' },
      { upTo: Infinity, rate: 0.35, fixed: 616000, label: 'Above PKR 4,100,000 (35%)' },
    ],
    footnote:
      'Excludes the 9% surcharge that applies when annual taxable income exceeds PKR 10,000,000, and any rebates, allowances, or other deductions.',
  },
  '2026-27': {
    label: 'FY 2026–27',
    shortLabel: 'TY 2027',
    slabs: [
      { upTo: 600000, rate: 0, fixed: 0, label: 'Up to PKR 600,000 (0%)' },
      { upTo: 1200000, rate: 0.01, fixed: 0, label: 'PKR 600,000 – 1,200,000 (1%)' },
      { upTo: 2200000, rate: 0.11, fixed: 6000, label: 'PKR 1,200,000 – 2,200,000 (11%)' },
      { upTo: 3200000, rate: 0.20, fixed: 116000, label: 'PKR 2,200,000 – 3,200,000 (20%)' },
      { upTo: 4100000, rate: 0.25, fixed: 316000, label: 'PKR 3,200,000 – 4,100,000 (25%)' },
      { upTo: 5600000, rate: 0.29, fixed: 541000, label: 'PKR 4,100,000 – 5,600,000 (29%)' },
      { upTo: 7000000, rate: 0.32, fixed: 976000, label: 'PKR 5,600,000 – 7,000,000 (32%)' },
      { upTo: Infinity, rate: 0.35, fixed: 1424000, label: 'Above PKR 7,000,000 (35%)' },
    ],
    footnote:
      'Based on Budget 2026–27 proposals effective 1 July 2026, pending formal passage of the Finance Bill 2026. The 9% surcharge above PKR 10,000,000 has been proposed for removal. Excludes rebates, allowances, or other deductions.',
  },
}

function formatPKR(value) {
  const safe = Number.isFinite(value) ? value : 0
  return 'PKR ' + Math.round(safe).toLocaleString('en-PK')
}

function calculateTax(annualIncome, slabs) {
  let lowerBound = 0
  for (const slab of slabs) {
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
  const last = slabs[slabs.length - 1]
  return {
    slabLabel: last.label,
    ratePercent: last.rate * 100,
    fixedTax: last.fixed,
    additionalAmount: 0,
    additionalTax: 0,
    totalTax: last.fixed,
  }
}

function App() {
  const [taxYear, setTaxYear] = useState('2025-26')
  const [salaryInput, setSalaryInput] = useState('100000')

  const yearData = TAX_DATA[taxYear]
  const monthlyGross = Math.max(Number(salaryInput) || 0, 0)
  const annualGross = monthlyGross * 12

  const result = useMemo(
    () => calculateTax(annualGross, yearData.slabs),
    [annualGross, yearData],
  )

  const monthlyTax = result.totalTax / 12
  const netMonthly = monthlyGross - monthlyTax
  const netAnnual = annualGross - result.totalTax

  return (
    <div className="page">
      <main className="receipt">
        <section className="panel left-panel">
          <div className="stamp" aria-hidden="true">
            {yearData.shortLabel}
            <br />
            FBR
          </div>

          <p className="eyebrow">Pakistan · Salaried Individuals</p>
          <h1 className="title">Salary Tax Calculator</h1>
          <p className="subtitle">
            Enter your monthly gross salary to see the fixed tax for your
            slab and the tax on the additional amount above it.
          </p>

          <div className="year-toggle" role="tablist" aria-label="Tax year">
            {Object.entries(TAX_DATA).map(([key, data]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={taxYear === key}
                className={taxYear === key ? 'active' : ''}
                onClick={() => setTaxYear(key)}
              >
                {data.label}
              </button>
            ))}
          </div>

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

          <div className="row highlight">
            <span>Net monthly salary</span>
            <span className="value">{formatPKR(netMonthly)}</span>
          </div>
        </section>

        <section className="panel right-panel">
          <p className="panel-title">Tax breakdown · {yearData.label}</p>

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
            <div className="row">
              <span>Net annual salary</span>
              <span className="value">{formatPKR(netAnnual)}</span>
            </div>
          </div>

          <p className="footnote">{yearData.footnote}</p>
        </section>
      </main>
    </div>
  )
}

export default App
