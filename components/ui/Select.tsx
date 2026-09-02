'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'default' | 'card' | 'ghost';
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  id?: string;
  name?: string;
  'aria-label'?: string;
}

export function Select<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  size = 'sm',
  variant = 'default',
  disabled = false,
  className = '',
  menuClassName = '',
  align = 'left',
  id,
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Adjust scroll when highlighted index changes
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.querySelectorAll('[role="option"]');
      const targetItem = items[highlightedIndex] as HTMLElement;
      if (targetItem) {
        targetItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return next;
    });
  }, [disabled, options, value]);

  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled) return;
      onChange(option.value);
      setIsOpen(false);
      buttonRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next]?.disabled) {
            next++;
          }
          return next < options.length ? next : prev;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next]?.disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const opt = options[highlightedIndex];
          if (opt && !opt.disabled) {
            handleSelect(opt);
          }
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
      default:
        break;
    }
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-[11px] rounded-md gap-1.5',
    sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-2',
    md: 'px-3 py-2 text-xs sm:text-sm rounded-lg gap-2.5',
  };

  const variantStyles = {
    default:
      'bg-[#0a0d20]/90 dark:bg-[#0a0d20]/90 border border-zinc-700/70 dark:border-indigo-950/70 text-zinc-200 hover:border-indigo-500/50 hover:bg-[#0d1028] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
    card:
      'bg-[#0a0d20] border border-zinc-700/80 dark:border-zinc-700/70 text-zinc-200 hover:border-indigo-500/50 hover:bg-[#0d1028]',
    ghost:
      'bg-transparent border border-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white',
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn(
          'w-full flex items-center justify-between font-medium transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
          sizeStyles[size],
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed hover:border-zinc-700 hover:bg-[#0a0d20]',
          isOpen && 'border-indigo-500 ring-2 ring-indigo-500/20'
        )}
      >
        <span className="flex items-center gap-1.5 truncate text-left">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-zinc-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-indigo-400'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[160px] w-full max-w-[320px] rounded-lg bg-gradient-to-b from-[#0e1227] to-[#080a1a] border border-indigo-950/80 p-1 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6),0_0_15px_rgba(99,102,241,0.08)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 select-none',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          <ul
            ref={listboxRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="max-h-60 overflow-y-auto divide-y divide-zinc-800/30 scrollbar-none focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors font-medium',
                    option.disabled
                      ? 'opacity-40 cursor-not-allowed text-zinc-500'
                      : isSelected
                      ? 'bg-indigo-600/25 text-indigo-200 font-semibold'
                      : isHighlighted
                      ? 'bg-indigo-600/15 text-indigo-200'
                      : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50'
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-2" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
