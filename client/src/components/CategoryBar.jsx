import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { LayoutGrid, Headphones, Watch, Laptop, Smartphone } from 'lucide-react';

const categoryIcons = {
  all: LayoutGrid,
  electronics: Headphones,
  wearables: Watch,
  computing: Laptop,
  accessories: Smartphone
};

export const CategoryBar = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useEcommerce();

  return (
    <div className="category-bar-section">
      <div className="container">
        <div className="category-pills-row">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || LayoutGrid;
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="pill-icon-wrapper">
                  <Icon size={18} />
                </div>
                <span className="pill-name">{cat.name}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
