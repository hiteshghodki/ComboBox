// src/components/ComboBox.tsx
import React, { useState, useRef, useEffect } from 'react';

const optionsList = ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Watermelon'];

export const ComboBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(optionsList);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const filtered = optionsList.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          setInputValue(filteredOptions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls="combo-options"
        aria-activedescendant={
          highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
        }
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      {isOpen && (
        <ul
          id="combo-options"
          role="listbox"
          ref={listRef}
          className="absolute mt-1 w-full border border-gray-300 rounded bg-white max-h-40 overflow-auto z-10"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500">No results</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                id={`option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`px-3 py-2 cursor-pointer ${
                  highlightedIndex === index ? 'bg-blue-500 text-white' : ''
                }`}
                onMouseDown={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
