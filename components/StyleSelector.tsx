
import React from 'react';
import { LogoStyleCategory, LogoStyle } from '../types';

interface StyleSelectorProps {
  categories: LogoStyleCategory[];
  selectedStyle: LogoStyle;
  onSelectStyle: (style: LogoStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ categories, selectedStyle, onSelectStyle }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-[400px] overflow-y-auto">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.category}>
            <h3 className="text-base font-semibold text-gray-300 mb-2">{`${category.icon} ${category.category}`}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {category.styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => onSelectStyle(style)}
                  title={style.description}
                  className={`w-full p-2 text-left rounded-md text-sm transition-all duration-200 ${
                    selectedStyle.name === style.name
                      ? 'bg-indigo-600 text-white font-semibold ring-2 ring-indigo-400'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
