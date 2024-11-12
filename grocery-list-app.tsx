import React, { useState } from 'react';
import { ChevronDown, Plus, MoreHorizontal, Copy, Tag, Search, FolderPlus, ArrowLeft } from 'lucide-react';

const GroceryApp = () => {
  const [lists, setLists] = useState([
    { 
      id: 1, 
      name: 'Weekly Groceries',
      items: [
        { id: 1, name: 'Milk', completed: false, category: 'Dairy' },
        { id: 2, name: 'Eggs', completed: false, category: 'Dairy' },
        { id: 3, name: 'Onions', completed: false, category: 'Vegetables' },
        { id: 4, name: 'Apples', completed: true, category: 'Fruits' }
      ]
    },
    {
      id: 2,
      name: 'Party Shopping',
      items: []
    }
  ]);
  
  const [currentList, setCurrentList] = useState(1);
  const [view, setView] = useState('lists');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Miscellaneous');
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  
  const categories = [
    'Dairy', 
    'Vegetables', 
    'Fruits', 
    'Beverages', 
    'Bakery', 
    'Meat', 
    'Cleaning Supplies',
    'Personal Care',
    'Miscellaneous'
  ];

  // Common items with their categories
  const commonItemCategories = {
    // Dairy
    'Milk': 'Dairy',
    'Eggs': 'Dairy',
    'Cheese': 'Dairy',
    'Butter': 'Dairy',
    'Yogurt': 'Dairy',
    'Cream': 'Dairy',

    // Vegetables
    'Tomatoes': 'Vegetables',
    'Onions': 'Vegetables',
    'Potatoes': 'Vegetables',
    'Carrots': 'Vegetables',
    'Lettuce': 'Vegetables',
    'Cucumber': 'Vegetables',
    'Bell Peppers': 'Vegetables',

    // Fruits
    'Apples': 'Fruits',
    'Bananas': 'Fruits',
    'Oranges': 'Fruits',
    'Berries': 'Fruits',
    'Grapes': 'Fruits',

    // Beverages
    'Orange Juice': 'Beverages',
    'Coffee': 'Beverages',
    'Tea': 'Beverages',
    'Soda': 'Beverages',

    // Bakery
    'Bread': 'Bakery',
    'Bagels': 'Bakery',
    'Muffins': 'Bakery',
    'Cookies': 'Bakery',

    // Meat
    'Chicken': 'Meat',
    'Beef': 'Meat',
    'Pork': 'Meat',
    'Fish': 'Meat',

    // Cleaning Supplies
    'Paper Towels': 'Cleaning Supplies',
    'Soap': 'Cleaning Supplies',
    'Detergent': 'Cleaning Supplies',

    // Personal Care
    'Toothpaste': 'Personal Care',
    'Shampoo': 'Personal Care',
    'Deodorant': 'Personal Care'
  };
  
  const commonItems = Object.keys(commonItemCategories);

  const addNewList = () => {
    const newList = {
      id: lists.length + 1,
      name: `New List ${lists.length + 1}`,
      items: []
    };
    setLists([...lists, newList]);
  };

  const duplicateList = (listId) => {
    const listToDuplicate = lists.find(list => list.id === listId);
    const newList = {
      id: lists.length + 1,
      name: `${listToDuplicate.name} (Copy)`,
      items: [...listToDuplicate.items]
    };
    setLists([...lists, newList]);
  };

  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const addItemToList = (listId, itemName, category = null) => {
    // Check if the item exists in commonItemCategories
    const autoCategory = commonItemCategories[itemName];
    const finalCategory = autoCategory || category || 'Miscellaneous';

    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: [...list.items, {
            id: list.items.length + 1,
            name: itemName,
            completed: false,
            category: finalCategory
          }]
        };
      }
      return list;
    }));
  };

  const toggleItem = (listId, itemId) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return list;
    }));
  };

  const handleAddCustomItem = () => {
    if (searchTerm.trim()) {
      const autoCategory = commonItemCategories[searchTerm.trim()];
      if (autoCategory) {
        // If it's a common item, add it directly with its predefined category
        addItemToList(currentList, searchTerm.trim(), autoCategory);
        setSearchTerm('');
        setShowCategorySelect(false);
      } else {
        // If it's an unusual item, show the category selection dialog
        setShowCategorySelect(true);
      }
    }
  };

  // Group items by category
  const getGroupedItems = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const currentListData = lists.find(list => list.id === currentList);
  const groupedItems = currentListData ? getGroupedItems(currentListData.items) : {};

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {view === 'items' ? (
          <button 
            onClick={() => setView('lists')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lists
          </button>
        ) : (
          <div className="text-lg font-medium">My Shopping Lists</div>
        )}
      </div>

      {/* Lists View */}
      {view === 'lists' && (
        <>
          <button
            onClick={addNewList}
            className="w-full p-2 mb-4 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FolderPlus className="w-5 h-5" />
            Create New List
          </button>
          
          <div className="space-y-3">
            {lists.map(list => (
              <div key={list.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setCurrentList(list.id);
                      setView('items');
                    }}
                    className="font-medium"
                  >
                    {list.name}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateList(list.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteList(list.id)}
                      className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {list.items.length} items
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Items View */}
      {view === 'items' && currentListData && (
        <>
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search or add new item..."
                className="w-full pl-10 pr-12 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    handleAddCustomItem();
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={handleAddCustomItem}
                  className="absolute right-3 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Selection Dialog */}
            {showCategorySelect && (
              <div className="mt-2 p-3 border rounded-lg bg-white">
                <div className="font-medium mb-2">Select category for "{searchTerm}"</div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        addItemToList(currentList, searchTerm.trim(), category);
                        setSearchTerm('');
                        setShowCategorySelect(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Item Section */}
          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="w-full p-2 mb-4 flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Plus className="w-5 h-5" />
            Add Common Items
          </button>

          {isAddingItem && (
            <div className="mb-4 p-3 border rounded-lg">
              <div className="font-medium mb-2">Quick Add</div>
              <div className="flex flex-wrap gap-2">
                {commonItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addItemToList(currentList, item);
                      setIsAddingItem(false);
                    }}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Items */}
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-4">
              <div className="font-medium mb-2 text-gray-600">{category}</div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(currentList, item.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                      {item.name}
                    </span>
                    <Tag className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GroceryApp;
