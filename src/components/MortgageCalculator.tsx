import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, AlertCircle } from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
  listingType: 'sale' | 'rent';
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ propertyPrice, listingType }) => {
  if (listingType === 'rent') {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-rose-600" /> Rental Affordability Calculator
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Estimated tenant budget breakdown based on standard 30% gross monthly income guidelines.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Monthly Rent</span>
            <span className="text-lg font-bold text-slate-900">S${propertyPrice.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Rec. Min Household Income</span>
            <span className="text-lg font-bold text-rose-600">S${Math.round(propertyPrice / 0.3).toLocaleString()} / mo</span>
          </div>
        </div>
      </div>
    );
  }

  const [price, setPrice] = useState<number>(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [tenureYears, setTenureYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(3.5);

  const downPaymentAmount = price * (downPaymentPercent / 100);
  const loanAmount = price - downPaymentAmount;

  // Monthly mortgage calculation formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = tenureYears * 12;

  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Mortgage Estimator</h3>
            <p className="text-xs text-slate-500">Calculate estimated monthly bank loan payments</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Estimated Monthly</span>
          <span className="text-2xl font-extrabold text-rose-600">
            S${Math.round(monthlyPayment).toLocaleString()}<span className="text-xs text-slate-500 font-normal"> / mo</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sliders & Inputs */}
        <div className="space-y-4">
          {/* Property Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Purchase Price</span>
              <span className="text-rose-600">S${price.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={30000000}
              step={50000}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Down Payment % */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Down Payment ({downPaymentPercent}%)</span>
              <span className="text-slate-900">S${Math.round(downPaymentAmount).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Loan Tenure</span>
              <span className="text-slate-900">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={5}
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Interest Rate</span>
              <span className="text-slate-900">{interestRate.toFixed(2)}% p.a.</span>
            </div>
            <input
              type="range"
              min={1.5}
              max={6.0}
              step={0.1}
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Loan Principal</span>
              <span className="font-semibold text-slate-900">S${Math.round(loanAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Total Interest</span>
              <span className="font-semibold text-slate-900">S${Math.round(totalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Down Payment (Cash/CPF)</span>
              <span className="font-semibold text-slate-900">S${Math.round(downPaymentAmount).toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-900 font-bold">
              <span>Estimated Total Cost</span>
              <span>S${Math.round(totalPayment + downPaymentAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* MAS / TDSR Guidance Note */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 leading-tight flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Subject to 55% TDSR regulations and bank credit approval. Buyer Stamp Duty (BSD) & ABSD apply based on citizenship status.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
