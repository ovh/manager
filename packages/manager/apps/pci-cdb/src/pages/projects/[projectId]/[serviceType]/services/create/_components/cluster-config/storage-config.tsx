import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { H4 } from '@/components/typography';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

interface StorageConfigProps {
  model: AvailabilitiesHookOutput;
}
const StorageConfig = ({ model }: StorageConfigProps) => {
  const [nbStorage, setNbStorage] = useState(
    model.availability?.specifications.storage?.minimum.value || 0,
  );
  useEffect(() => {
    setNbStorage(
      model.availability?.specifications.storage?.minimum.value || 0,
    );
  }, [model.availability]);
  if (!model.availability?.specifications.storage) return <></>;
  const { storage, flavor } = model.availability.specifications;
  const { minimum, maximum, step } = storage;
  if (maximum.value === 0 || minimum.value === maximum.value || !step) {
    return <></>;
  }
  return (
    <div>
      <H4>Stockage additionnel</H4>
      <p>
        Votre modèle de nœud {flavor} inclut {minimum.value} {minimum.unit} de
        stockage auxquels vous pouvez ajouter jusqu'à{' '}
        {maximum.value - minimum.value} {minimum.unit} de stockage
        supplémentaire par pas de {step.value} {step.unit}.
      </p>
      <Label htmlFor="storage-select">
        Sélectionnez le stockage additionnel du cluster
      </Label>
      <div className="flex flex-col">
        <div className="flex justify-between mb-2">
          <span>Aucun</span>
          <span>
            {maximum.value - minimum.value} {maximum.unit}
          </span>
        </div>
        <Slider
          onValueChange={([newValue]) => setNbStorage(newValue)}
          id="storage-select"
          name="storage-select"
          defaultValue={[minimum.value]}
          value={[nbStorage]}
          min={minimum.value}
          max={maximum.value}
          step={step?.value || 1}
        />
        <div className="flex w-full justify-center mt-2">
          <span className="font-bold">
            {nbStorage - minimum.value} {minimum.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StorageConfig;
