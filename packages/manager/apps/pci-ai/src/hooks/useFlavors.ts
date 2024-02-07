import { useEffect, useMemo, useState } from 'react';
import { useGetFlavors } from './api/ai/useGetFlavors';
import { ai } from '@/models/types';

/**
 * Fetch networks and only return the ones that
 * are private and in the provided region
 * @param projectId the cloud project id
 * @param region the short name for the region (ex: GRA, BHS)
 * @returns flavor (ressources) available for a given region, flavors lists, queries statuses
 */
export function useFlavors (
  projectId: string, 
  region: string, 
  ) {
  const [selectedFlavor, setSelectedFlavor] = useState<ai.capabilities.Flavor>();
  const [selectedType, setSelectedType] = useState<
  ai.capabilities.FlavorTypeEnum
>(ai.capabilities.FlavorTypeEnum.cpu);
const [selectedResourceNumber, setSelectedResourceNumber] = useState(1);
  // define queries
  const flavorQuery = useGetFlavors(projectId, region);
  // create lists based on queries responses
  const flavorList = useMemo(
    () =>
      flavorQuery.data?.filter(
        (flavor: ai.capabilities.Flavor) => flavor.type === selectedType) || [],
    [flavorQuery.data, region, selectedType],
  );

  useEffect(() => {
    if (flavorList) {
      setSelectedFlavor(flavorList[0] || undefined);
    }
  }, [flavorList]);

  useEffect(() => {
    setSelectedResourceNumber(1);
  }, [selectedFlavor]);

  return {
    flavorQuery,
    flavorList,
    selectedFlavor,
    setSelectedFlavor,
    setSelectedType,
    selectedType,
    selectedResourceNumber,
    setSelectedResourceNumber,
  };
}
