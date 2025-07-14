import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import IncomeInput from './components/IncomeInput';
import BudgetCategories from './components/BudgetCategories';
import TaxBreakdown from './components/TaxBreakdown';
import BudgetResults from './components/BudgetResults';
import SummaryStats from './components/SummaryStats';

// Import styles
import './index.css';

// Tax calculation utilities (could be moved to utils/taxCalculations.js)
const FEDERAL_BRACKETS = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 }
  ],
  marriedJoint: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 }
  ]
};

const STANDARD_DEDUCTIONS = {
  single: 15000,
  marriedJoint: 30000,
  marriedSeparate: 15000,
  headOfHousehold: 22500
};

const STATE_TAX_RATES = {
  'Alabama': 5.0, 'Alaska': 0, 'Arizona': 4.5, 'Arkansas': 4.4, 'California': 13.3,
  'Colorado': 4.4, 'Connecticut': 6.99, 'Delaware': 6.6, 'Florida': 0, 'Georgia': 5.75,
  'Hawaii': 11.0, 'Idaho': 5.8, 'Illinois': 4.95, 'Indiana': 3.0, 'Iowa': 3.8,
  'Kansas': 5.7, 'Kentucky': 4.5, 'Louisiana': 3.0, 'Maine': 7.15, 'Maryland': 5.75,
  'Massachusetts': 5.0, 'Michigan': 4.25, 'Minnesota': 9.85, 'Mississippi': 4.4,
  'Missouri': 4.8, 'Montana': 6.75, 'Nebraska': 5.84, 'Nevada': 0, 'New Hampshire': 0,
  'New Jersey': 10.75, 'New Mexico': 5.9, 'New York': 10.9, 'North Carolina': 4.5,
  'North Dakota': 2.5, 'Ohio': 3.99, 'Oklahoma': 5.0, 'Oregon': 9.9, 'Pennsylvania': 3.07,
  'Rhode Island': 5.99, 'South Carolina': 6.3, 'South Dakota': 0, 'Tennessee': 0,
  'Texas': 0, 'Utah': 4.85, 'Vermont': 8.75, 'Virginia': 5.75, 'Washington': 0,
  'West Virginia': 6.5, 'Wisconsin': 7.65, 'Wyoming': 0
};

const STATE_ABBREVIATIONS = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
  'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
  'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
  'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee',
  'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

const App = () => {
  // State management
  const [incomeType, setIncomeType] = useState('salary');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');

  const [location, setLocation] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Housing', percentage: 30 },
    { id: 2, name: 'Food', percentage: 15 },
    { id: 3, name: 'Transportation', percentage: 15 },
    { id: 4, name: 'Savings', percentage: 20 },
    { id: 5, name: 'Entertainment', percentage: 10 },
    { id: 6, name: 'Utilities', percentage: 10 }
  ]);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(0);
  const [netMonthlyIncome, setNetMonthlyIncome] = useState(0);
  const [taxBreakdown, setTaxBreakdown] = useState({});

  // Utility functions
  const getStateFromLocation = (location) => {
    if (!location) return null;
    const locationParts = location.split(',').map(part => part.trim());
    if (locationParts.length >= 2) {
      const stateAbbr = locationParts[locationParts.length - 1].toUpperCase();
      return STATE_ABBREVIATIONS[stateAbbr] || null;
    }
    return null;
  };

  const calculateFederalTax = (annualIncome, filingStatus) => {
    const deduction = STANDARD_DEDUCTIONS[filingStatus] || STANDARD_DEDUCTIONS.single;
    const taxableIncome = Math.max(0, annualIncome - deduction);
    
    const brackets = FEDERAL_BRACKETS[filingStatus] || FEDERAL_BRACKETS.single;
    let tax = 0;
    
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += taxableInBracket * bracket.rate;
      }
    }
    
    return tax;
  };

  const calculatePayrollTaxes = (annualIncome, filingStatus) => {
    // Social Security: 6.2% on income up to $176,100
    const socialSecurityTax = Math.min(annualIncome, 176100) * 0.062;
    
    // Medicare: 1.45% on all income
    const medicareTax = annualIncome * 0.0145;
    
    // Additional Medicare: 0.9% on income over threshold
    const additionalMedicareThreshold = filingStatus === 'marriedJoint' ? 250000 : 200000;
    const additionalMedicare = Math.max(0, annualIncome - additionalMedicareThreshold) * 0.009;
    
    return {
      socialSecurity: socialSecurityTax,
      medicare: medicareTax,
      additionalMedicare: additionalMedicare,
      total: socialSecurityTax + medicareTax + additionalMedicare
    };
  };

  const calculateStateTax = (annualIncome, state, filingStatus) => {
    if (!state || !STATE_TAX_RATES[state]) return 0;
    
    const stateRate = STATE_TAX_RATES[state] / 100;
    // Simplified calculation - using standard deduction
    const deduction = STANDARD_DEDUCTIONS[filingStatus] || STANDARD_DEDUCTIONS.single;
    const taxableIncome = Math.max(0, annualIncome - deduction);
    
    return taxableIncome * stateRate;
  };

  // Calculate income and taxes whenever inputs change
  useEffect(() => {
    if (!incomeAmount) {
      setGrossMonthlyIncome(0);
      setNetMonthlyIncome(0);
      setTaxBreakdown({});
      return;
    }

    const amount = parseFloat(incomeAmount);
    let annual = 0;

    if (incomeType === 'salary') {
      annual = amount;
    } else { // hourly
      const weeklyHours = parseFloat(hoursPerWeek) || 40;
      const weeklyPay = amount * weeklyHours;
      annual = weeklyPay * 52; // 52 weeks per year
    }

    const monthly = annual / 12;
    
    // Calculate taxes
    const federalTax = calculateFederalTax(annual, filingStatus);
    const payrollTaxes = calculatePayrollTaxes(annual, filingStatus);
    const state = getStateFromLocation(location);
    const stateTax = calculateStateTax(annual, state, filingStatus);
    
    const totalTaxes = federalTax + payrollTaxes.total + stateTax;
    const netAnnual = annual - totalTaxes;
    const netMonthly = netAnnual / 12;

    setGrossMonthlyIncome(monthly);
    setNetMonthlyIncome(netMonthly);
    setTaxBreakdown({
      grossAnnual: annual,
      netAnnual: netAnnual,
      federalTax: federalTax,
      stateTax: stateTax,
      socialSecurity: payrollTaxes.socialSecurity,
      medicare: payrollTaxes.medicare + payrollTaxes.additionalMedicare,
      totalTaxes: totalTaxes,
      effectiveRate: (totalTaxes / annual) * 100,
      state: state
    });
  }, [incomeAmount, incomeType, hoursPerWeek, location, filingStatus]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Calculator className="text-blue-600" />
          Personal Budgeting Tool
        </h1>
        <p className="text-gray-600">Create a personalized budget with accurate take-home pay calculations</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <IncomeInput 
            incomeType={incomeType}
            setIncomeType={setIncomeType}
            incomeAmount={incomeAmount}
            setIncomeAmount={setIncomeAmount}
            hoursPerWeek={hoursPerWeek}
            setHoursPerWeek={setHoursPerWeek}
            filingStatus={filingStatus}
            setFilingStatus={setFilingStatus}
            location={location}
            setLocation={setLocation}
            grossMonthlyIncome={grossMonthlyIncome}
            netMonthlyIncome={netMonthlyIncome}
            taxBreakdown={taxBreakdown}
          />

          <BudgetCategories 
            categories={categories}
            setCategories={setCategories}
          />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          <TaxBreakdown taxBreakdown={taxBreakdown} />

          <BudgetResults 
            categories={categories}
            netMonthlyIncome={netMonthlyIncome}
          />

          <SummaryStats 
            grossMonthlyIncome={grossMonthlyIncome}
            netMonthlyIncome={netMonthlyIncome}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};

export default App;