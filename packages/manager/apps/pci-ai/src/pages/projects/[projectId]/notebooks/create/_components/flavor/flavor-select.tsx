import { Flavor, Flavors } from '@/models/order-funnel';
import React, { useEffect, useState } from 'react';
import FlavorTile from './flavor-tile';
import { ai } from '@/models/types';
import RadioTile from '@/components/radio-tile';
import { FlavorSlider } from './flavor-slider';

interface FlavorSelectProps {
  flavors: Flavor[];
  value: Flavors;
  onChange: (newFlavors: Flavors) => void;
}

const FlavorSelect = React.forwardRef<HTMLInputElement, FlavorSelectProps>(
  ({ flavors, value, onChange }, ref) => {
    //console.log(value);
    const [flavorsListByType, setFlavorsListByType] = useState<Flavor[]>([]);
    const [isGPUFlavor, setIsGPUFlavor] = useState(
      flavors.find((flav) => flav.id === value.flavor)?.type ===
        ai.capabilities.FlavorTypeEnum.gpu,
    );
    const [maxFlavors, setMaxFlavors] = useState(1);

    useEffect(() => {
      if (!value) return;
      if (flavors.find((flav) => flav.id === value.flavor)?.type ===
      ai.capabilities.FlavorTypeEnum.cpu){
        setIsGPUFlavor(false);
      }
      setMaxFlavors(flavors.find((flav) => flav.id === value.flavor)?.max || 1);
    }, [value])

    useEffect(() => {
      if (!flavors) return;
      if (isGPUFlavor) {
        setFlavorsListByType(
          flavors.filter(
            (flav) => flav.type === ai.capabilities.FlavorTypeEnum.gpu,
          ),
        );
        const newFlavor = flavors.find(
          (flav) =>
            flav.default && flav.type === ai.capabilities.FlavorTypeEnum.gpu,
        );
        onChange({ flavor: newFlavor?.id || '', number: 1 });
      } else {
        setFlavorsListByType(
          flavors.filter(
            (flav) => flav.type === ai.capabilities.FlavorTypeEnum.cpu,
          ),
        );
        const newFlavor = flavors.find(
          (flav) =>
            flav.default && flav.type === ai.capabilities.FlavorTypeEnum.cpu,
        );
        onChange({ flavor: newFlavor?.id || '', number: 1 });
      }
    }, [isGPUFlavor, flavors]);

    return (
      <div ref={ref}>
        <div className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <RadioTile
            name="type-select"
            onChange={() => setIsGPUFlavor(false)}
            value={ai.capabilities.FlavorTypeEnum.cpu}
            checked={
              flavors.find((flav) => flav.id === value.flavor)?.type ===
              ai.capabilities.FlavorTypeEnum.cpu
            }
          >
            <div className="flex justify-between items-center">
              <h3 className={`capitalize ${!isGPUFlavor ? 'font-bold' : 'font-normal'}`}>AI Notebooks Standard (CPU resources)</h3>
            </div>
            <RadioTile.Separator />
            <p className="text-xs">
              A lower price, offering standard performance. Suitable for
              learning, testing or workloads that only require CPU.
            </p>
          </RadioTile>
          <RadioTile
            name="type-select"
            onChange={() => setIsGPUFlavor(true)}
            value={ai.capabilities.FlavorTypeEnum.gpu}
            checked={
              flavors.find((flav) => flav.id === value.flavor)?.type ===
              ai.capabilities.FlavorTypeEnum.gpu
            }
          >
            <div className="flex justify-between items-center">
              <h3 className={`capitalize ${isGPUFlavor ? 'font-bold' : 'font-normal'}`}>AI Notebooks Advanced (GPU resources)</h3>
            </div>
            <RadioTile.Separator />
            <p className="text-xs">
              Powered by up to four GPUs and dozens of CPUs. Delivers higher
              performance for deep learning and intensive workloads.
            </p>
          </RadioTile>
        </div>
        <div className="mb-2 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2">
          {flavorsListByType.map((flavor) => (
            <FlavorTile
              key={flavor.id}
              quantity={value.number}
              flavor={flavor}
              selected={flavor.id === value.flavor}
              onChange={(newFlavor: string, newNumber: number) => {
                onChange({
                  flavor: newFlavor,
                  number: newNumber,
                });
              }}
            />
          ))}
        </div>
        <div>
          <FlavorSlider
            max={maxFlavors}
            //value={value.number}
            onChange={(newValue : number) => {
              onChange({
                flavor: value.flavor,
                number: newValue
              });
            }}
          />
        </div>
      </div>
    );
  },
);

export default FlavorSelect;
