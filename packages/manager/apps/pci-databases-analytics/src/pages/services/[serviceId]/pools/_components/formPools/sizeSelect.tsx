import React, { useEffect, useState } from 'react';

import { MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SizeInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}

const SizeInput = React.forwardRef<HTMLInputElement, SizeInputProps>(
  ({ value, onChange, min, max }, ref) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      onChange(inputValue);
    }, [inputValue]);

    const decrement = () => {
      setInputValue(inputValue - 1);
    };
    const increment = () => {
      setInputValue(inputValue + 1);
    };

    return (
      <>
        <div className="flex flew-row font-semibold">
          <Button
            type="button"
            disabled={inputValue <= min}
            onClick={() => decrement()}
            variant="ghost"
            className="w-8 h-8"
          >
            <MinusCircle className="text-primary font-semibold h-6 w-6" />
          </Button>
          <Input
            ref={ref}
            type="number"
            onChange={(event) => setInputValue(+event.target.value)}
            value={inputValue}
            className="font-semibold [&::-webkit-inner-spin-button]:appearance-none w-12 h-8 mx-2"
          />
          <Button
            type="button"
            disabled={inputValue >= max}
            onClick={() => increment()}
            variant="ghost"
            className="w-8 h-8"
          >
            <PlusCircle className="text-primary font-semibold h-6 w-6" />
          </Button>
        </div>
      </>
    );
  },
);

export default SizeInput;
