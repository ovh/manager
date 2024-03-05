import { Span } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

export const FlavorSlider = ({
  max,
  //value,
  onChange,
}: {
  max: number;
  //value: number;
  onChange: (newValue: number) => void;
}) => {
  const [nbResource, setNbResource] = useState(1);
  const handleChange = (resourceNumber: number) => {
    setNbResource(resourceNumber);
    onChange(resourceNumber);
  };
  /*
  useMemo(() => {
    setNbResource(1);
  }, [value]);*/

  useEffect(() => {
    setNbResource(1);
  }, [max]);

  return (
    <div>
      <Label htmlFor="storage-select">Select the number of ressource(s)</Label>
      <div className="w-[70%]">
      <div className="flex flex-col">
        <div className="flex justify-between mb-2">
          <Span>1</Span>
          <Span>{max}</Span>
        </div>
        <Slider
          onValueChange={([newValue]) => handleChange(newValue)}
          id="resource-select"
          name="resource-select"
          defaultValue={[1]}
          value={[nbResource]}
          min={1}
          max={max}
          step={1}
        />
        <div className="flex w-full justify-center mt-2">
          <Span className="font-bold">{nbResource}</Span>
        </div>
      </div>
      </div>
    </div>
  );
};
