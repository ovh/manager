import { useEffect, useState } from 'react';
import React from 'react';

import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ResourceInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

const ResourceInput = React.forwardRef<HTMLInputElement, ResourceInputProps>(
  ({ value, onChange, min, max }, ref) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      onChange(inputValue)
    }, [inputValue]);
    
    const decrement = () => {
      setInputValue(inputValue - 1 );
    };
    const increment = () => {
      setInputValue(inputValue + 1);
    };

    return (
      <div className="flex flew-row font-semibold">
        <Button
          type="button"
          disabled={((min || min === 0) && inputValue <= min) || false}
          onClick={() => decrement()}
          variant="default"
          className="w-8 h-8"
        >
          <Minus className="text-white h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          onChange={(event) => setInputValue(+event.target.value)}
          value={inputValue}
          className="text-primary font-semibold [&::-webkit-inner-spin-button]:appearance-none w-14 h-8 mx-2"
        />
        <Button
          type="button"
          disabled={(max && inputValue >= max) || false} 
          onClick={() => increment()}
          variant="default"
          className="w-8 h-8"
        >
          <Plus className="text-white h-4 w-4" />
        </Button>
      </div>
    );
  },
);

export default ResourceInput;
