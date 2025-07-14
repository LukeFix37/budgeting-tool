const BudgetResults = ({ categories, netMonthlyIncome }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalPercentage = categories.reduce((sum, cat) => sum + (parseFloat(cat.percentage) || 0), 0);
  const remainingPercentage = 100 - totalPercentage;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold">Monthly Budget Breakdown</h2>
        <p className="text-gray-300 text-sm">Based on {formatCurrency(netMonthlyIncome)} net monthly income</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Percentage</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Monthly Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.filter(cat => cat.name.trim()).map((category, index) => {
              const monthlyAmount = (netMonthlyIncome * category.percentage) / 100;
              return (
                <tr key={category.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{category.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(monthlyAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {totalPercentage.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {formatCurrency((netMonthlyIncome * totalPercentage) / 100)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {totalPercentage > 100 && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ Warning: Your budget exceeds 100% of your income by {(totalPercentage - 100).toFixed(1)}%
          </p>
        </div>
      )}

      {remainingPercentage > 0 && (
        <div className="bg-green-50 border-t border-green-200 p-4">
          <p className="text-green-800 text-sm font-medium">
            ✓ You have {remainingPercentage.toFixed(1)}% ({formatCurrency((netMonthlyIncome * remainingPercentage) / 100)}) unallocated
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetResults;