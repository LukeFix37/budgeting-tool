import { Info } from 'lucide-react';

const TaxBreakdown = ({ taxBreakdown }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!taxBreakdown.grossAnnual) return null;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg">
      <div className="bg-red-700 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Info size={20} />
          Annual Tax Breakdown
        </h2>
        <p className="text-red-100 text-sm">Based on {formatCurrency(taxBreakdown.grossAnnual)} gross annual income</p>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Gross Annual Income:</span>
            <span className="font-semibold">{formatCurrency(taxBreakdown.grossAnnual)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Federal Income Tax:</span>
            <span className="text-red-600">{formatCurrency(taxBreakdown.federalTax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Social Security (6.2%):</span>
            <span className="text-red-600">{formatCurrency(taxBreakdown.socialSecurity)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Medicare (1.45%+):</span>
            <span className="text-red-600">{formatCurrency(taxBreakdown.medicare)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">
              State Tax ({taxBreakdown.state || 'Unknown'}):
            </span>
            <span className="text-red-600">{formatCurrency(taxBreakdown.stateTax)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span className="text-gray-900">Total Taxes:</span>
            <span className="text-red-700">{formatCurrency(taxBreakdown.totalTaxes)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span className="text-gray-900">Net Annual Income:</span>
            <span className="text-green-700">{formatCurrency(taxBreakdown.netAnnual)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;