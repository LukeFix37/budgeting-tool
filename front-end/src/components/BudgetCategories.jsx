import { Plus, Trash2 } from 'lucide-react';

const BudgetCategories = ({ categories, setCategories }) => {
  const addCategory = () => {
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    setCategories([...categories, { id: newId, name: '', percentage: 0 }]);
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        if (field === 'percentage') {
          const numValue = value === '' ? 0 : parseFloat(value);
          return { ...c, [field]: isNaN(numValue) ? 0 : numValue };
        } else {
          return { ...c, [field]: value };
        }
      }
      return c;
    }));
  };

  const totalPercentage = categories.reduce((sum, cat) => sum + (parseFloat(cat.percentage) || 0), 0);
  const remainingPercentage = 100 - totalPercentage;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Budget Categories</h2>
        <button
          onClick={addCategory}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex gap-3 items-center">
            <input
              type="text"
              value={category.name}
              onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
            />
            <div className="relative w-24">
              <input
                type="number"
                value={category.percentage}
                onChange={(e) => updateCategory(category.id, 'percentage', e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <button
              onClick={() => removeCategory(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded-md">
        <div className="flex justify-between text-sm">
          <span>Total Allocated:</span>
          <span className={totalPercentage > 100 ? 'text-red-600 font-bold' : 'text-gray-700'}>
            {totalPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Remaining:</span>
          <span className={remainingPercentage < 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
            {remainingPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCategories;