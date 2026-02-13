import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CheckboxCheckedChangeDetail } from '@ovhcloud/ods-react';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import { selectFlexBlockData } from '../view-models/cartViewModel';

export const useFlexInstance = () => {
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const flavorId = useWatch({ control, name: 'flavorId' });

  const { data } = useInstancesCatalogWithSelect({
    select: selectFlexBlockData(flavorId),
  });

  const showFlexBlock = data?.showFlexBlock ?? false;
  const isFlex = data?.isFlex ?? false;
  const baseRegionalizedFlavorId = data?.baseRegionalizedFlavorId ?? null;
  const flexRegionalizedFlavorId = data?.flexRegionalizedFlavorId ?? null;

  useEffect(() => {
    if (!baseRegionalizedFlavorId || showFlexBlock || !flavorId) return;
    setValue('flavorId', baseRegionalizedFlavorId);
  }, [
    baseRegionalizedFlavorId,
    showFlexBlock,
    flavorId,
    setValue,
  ]);

  const onFlexChange = ({ checked }: CheckboxCheckedChangeDetail) => {
    if (!data || !flavorId) return;
    const nextFlavorId = checked
      ? flexRegionalizedFlavorId ?? flavorId
      : baseRegionalizedFlavorId ?? flavorId;
    setValue('flavorId', nextFlavorId);
  };

  return { showFlexBlock, isFlex, onFlexChange };
};
