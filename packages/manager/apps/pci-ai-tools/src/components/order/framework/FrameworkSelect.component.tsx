import React from 'react';
import { Hammer } from 'lucide-react';
import { RadioGroup, RadioTile, Separator } from '@datatr-ux/uxlib';
import ai from '@/types/AI';

interface FrameworkSelectProps {
  frameworks: ai.capabilities.notebook.Framework[];
  value: string;
  onChange: (newFramework: string) => void;
}
const FrameworksSelect = React.forwardRef<
  HTMLInputElement,
  FrameworkSelectProps
>(({ frameworks, value, onChange }, ref) => {
  return (
    <>
      <div data-testid="fmk-select-container" ref={ref}>
        <div className="p-4 border rounded-b-md rounded-md">
          <RadioGroup
            ref={ref}
            className="px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 rounded-b-md"
            value={value}
            onValueChange={onChange}
          >
            {frameworks.map((fmk) => (
              <RadioTile
                key={fmk.id}
                data-testid={`fmk-radio-tile-${fmk.id}`}
                value={fmk.id}
                checked={fmk.id === value}
                onChange={() => onChange(fmk.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <h5 className="capitalize">{fmk.name}</h5>
                  </div>
                  {fmk.logoUrl ? (
                    <img
                      className="block w-[25px] h-[25px]"
                      src={fmk.logoUrl}
                      alt={fmk.name}
                    />
                  ) : (
                    <Hammer className="size-6" />
                  )}
                </div>
                <Separator className="my-2" />
                <p className="text-sm leading-relaxed">{fmk.description}</p>
              </RadioTile>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
});

FrameworksSelect.displayName = 'FrameworksSelect';
export default FrameworksSelect;
