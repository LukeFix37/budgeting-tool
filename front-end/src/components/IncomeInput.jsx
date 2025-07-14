import { DollarSign } from 'lucide-react';

const IncomeInput = ({ 
  incomeType, setIncomeType, 
  incomeAmount, setIncomeAmount, 
  hoursPerWeek, setHoursPerWeek, 
  filingStatus, setFilingStatus, 
  location, setLocation,
  grossMonthlyIncome, 
  netMonthlyIncome, 
  taxBreakdown 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <DollarSign className="text-green-600" />
        Income Information
      </h2>
      
      {/* Income Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="salary"
              checked={incomeType === 'salary'}
              onChange={(e) => setIncomeType(e.target.value)}
              className="mr-2"
            />
            Annual Salary
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="hourly"
              checked={incomeType === 'hourly'}
              onChange={(e) => setIncomeType(e.target.value)}
              className="mr-2"
            />
            Hourly Rate
          </label>
        </div>
      </div>

      {/* Income Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {incomeType === 'salary' ? 'Annual Salary' : 'Hourly Rate'}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={incomeType === 'salary' ? '75000' : '25.00'}
          />
        </div>
      </div>

      {/* Hours per week (only for hourly) */}
      {incomeType === 'hourly' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Hours per Week</label>
          <input
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="40"
          />
        </div>
      )}

      {/* Filing Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Filing Status</label>
        <select
          value={filingStatus}
          onChange={(e) => setFilingStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="single">Single</option>
          <option value="marriedJoint">Married Filing Jointly</option>
          <option value="marriedSeparate">Married Filing Separately</option>
          <option value="headOfHousehold">Head of Household</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, State (e.g., Columbus, OH)"
        />
        <p className="text-xs text-gray-500 mt-1">Include state abbreviation for accurate tax calculations</p>
      </div>

      {/* Income Display */}
      <div className="space-y-3">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700 font-medium">Gross Monthly Income</p>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(grossMonthlyIncome)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-sm text-green-700 font-medium">Net Monthly Income (After Taxes)</p>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(netMonthlyIncome)}</p>
          {taxBreakdown.effectiveRate && (
            <p className="text-xs text-green-600 mt-1">
              Effective tax rate: {taxBreakdown.effectiveRate.toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeInput;