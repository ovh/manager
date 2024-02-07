import { ai } from '@/models/types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const FlavorSlider = ({
  flavor,
  onChange,
}: {
  flavor: ai.capabilities.Flavor;
  onChange: (resourceNumber: number) => void;
}) => {
  const [nbResource, setNbResource] = useState(1);
  const handleChange = (resourceNumber: number) => {
    setNbResource(resourceNumber);
    onChange(resourceNumber);
  };
  return (
    <div>
      <Label className='text-[#00185e]' htmlFor="resource-select">
        Sélectionnez le nombre de ressource
      </Label>
      <div className="w-[70%]">
        <div className="p-2 flex flex-col">
          <div className="flex justify-between mb-2">
            <span>1</span>
            <span>{flavor.max}</span>
          </div>
          <Slider
            onValueChange={([newValue]) => handleChange(newValue)}
            id="resource-select"
            name="resource-select"
            defaultValue={[1]}
            value={[nbResource]}
            min={1}
            max={flavor.max}
            step={1}
          />
          <div className="flex w-full justify-center mt-2">
            <span className="font-bold">{nbResource}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlavorSlider;
