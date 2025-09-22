import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  disabled = false, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => !disabled && setIsOpen(!isOpen),
              disabled,
              isOpen
            });
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child, {
              onItemSelect: (itemValue: string) => {
                onValueChange?.(itemValue);
                setIsOpen(false);
              },
              selectedValue: value
            });
          }
        }
        return null;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps & { 
  onClick?: () => void; 
  disabled?: boolean; 
  isOpen?: boolean; 
}> = ({ className = '', children, onClick, disabled, isOpen }) => (
  <button
    type="button"
    className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-between ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

export const SelectContent: React.FC<SelectContentProps & { 
  onItemSelect?: (value: string) => void; 
  selectedValue?: string; 
}> = ({ children, onItemSelect, selectedValue }) => (
  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === SelectItem) {
        return React.cloneElement(child, {
          onSelect: onItemSelect,
          isSelected: child.props.value === selectedValue
        });
      }
      return child;
    })}
  </div>
);

export const SelectItem: React.FC<SelectItemProps & { 
  onSelect?: (value: string) => void; 
  isSelected?: boolean; 
}> = ({ value, children, onSelect, isSelected }) => (
  <div
    className={`px-3 py-2 cursor-pointer hover:bg-emerald-50 ${
      isSelected ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900'
    }`}
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
);

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
);