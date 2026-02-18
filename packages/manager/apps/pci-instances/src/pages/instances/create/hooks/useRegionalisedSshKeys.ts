import { useFormContext, useWatch } from 'react-hook-form';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { useSshKeys } from '@/data/hooks/ssh/useSshKeys';
import {
  TInstancesCatalog,
  TMicroRegion,
  TMicroRegionID,
} from '@/domain/entities/instancesCatalog';
import { selectSshKeys } from '../view-models/sshKeysViewModel';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import { useMemo } from 'react';

const selectMicroRegion = (microRegionId: TMicroRegionID | null) => (
  catalog?: TInstancesCatalog,
): TMicroRegion | undefined => {
  if (microRegionId)
    return catalog?.entities.microRegions.byId.get(microRegionId);
};

export const useRegionalisedSshKeys = () => {
  const { control } = useFormContext<TInstanceCreationForm>();
  const selectedMicroRegion = useWatch({ control, name: 'microRegion' });

  const memoizedSelectMicroRegion = useMemo(
    () => selectMicroRegion(selectedMicroRegion),
    [selectedMicroRegion],
  );

  const { data: microRegion } = useInstancesCatalogWithSelect({
    select: memoizedSelectMicroRegion,
  });

  const memoizedSelectSshKeys = useMemo(() => selectSshKeys(microRegion), [
    microRegion,
  ]);

  return useSshKeys({
    select: memoizedSelectSshKeys,
  });
};
