const SummaryStats = ({ grossMonthlyIncome, netMonthlyIncome, categories }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalPercentage = categories.reduce((sum, cat) => sum + (parseFloat(cat.percentage) || 0), 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700 text-sm font-medium">Gross Monthly</p>
        <p className="text-xl font-bold text-blue-800">{formatCurrency(grossMonthlyIncome)}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-700 text-sm font-medium">Net Monthly</p>
        <p className="text-xl font-bold text-green-800">{formatCurrency(netMonthlyIncome)}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-700 text-sm font-medium">Total Allocated</p>
        <p className="text-xl font-bold text-purple-800">
          {formatCurrency((netMonthlyIncome * totalPercentage) / 100)}
        </p>
      </div>
    </div>
  );
};

export default SummaryStats;