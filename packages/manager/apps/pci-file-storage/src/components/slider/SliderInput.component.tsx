import React, { useEffect, useRef } from 'react';

import { Input, Range, RangeValueChangeDetail } from '@ovhcloud/ods-react';

export type TSliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  inputName?: string;
};

/** Focus handling
 * There was unwanted behavior with the focus between the input and the range
 * When typing on the <Input>, the focus was transferred to the range, and the focus was therefore lost on the number input
 * Cursor solved the problem.
 * **/
export const SliderInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  inputName = '',
}: TSliderInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isInputFocusedRef = useRef(false);
  const isRangeDraggingRef = useRef(false);

  const handleRangeChange = ({ value }: RangeValueChangeDetail) => {
    const newValue = value?.[0] ?? min;
    // Mark that range is being dragged
    isRangeDraggingRef.current = true;
    onChange(newValue);
    isRangeDraggingRef.current = false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.valueAsNumber);
  };

  const handleInputFocus = () => {
    isInputFocusedRef.current = true;
  };

  const handleInputBlur = () => {
    // Don't immediately clear the flag - wait a bit in case focus is being restored
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        isInputFocusedRef.current = false;
      }
    }, 0);
  };

  useEffect(() => {
    // Only restore input focus if input was focused, value changed, and range is NOT being dragged
    // This prevents the range from stealing focus when typing
    if (isInputFocusedRef.current && !isRangeDraggingRef.current) {
      inputRef.current?.focus();
    }
  }, [value]);

  return (
    <div className="flex w-full items-baseline gap-7">
      <Range
        className="max-w-80 grow"
        value={[value]}
        onDragging={handleRangeChange}
        min={min}
        max={max}
        step={step}
      />
      <Input
        className="w-16"
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        name={inputName}
        min={0}
        max={max}
      />
    </div>
  );
};
