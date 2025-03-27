import { ApiError } from "@ovh-ux/manager-core-api";
import { fetchFeatureAvailabilityData, getFeatureAvailabilityQueryKey, useFeatureAvailability } from "@ovh-ux/manager-react-components";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "react-use";


// function computeHash(featureList: string[]) {
//   const str = JSON.stringify(featureList);
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//       const char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash + char) | 0; // Convert to 32bit integer
//   }
//   // Incorporate the length of the string into the hash
//   hash ^= str.length;
//   // Run a final mix of the hash bits
//   hash ^= hash >>> 16;
//   hash *= 0x85ebca6b;
//   hash ^= hash >>> 13;
//   hash *= 0xc2b2ae35;
//   hash ^= hash >>> 16;
//   return `lfa_${hash >>> 0}`;
// }

const computeHash = (featureList: string[]) => {
  return `lfa_${featureList.map((feature) => `${feature.at(0)}${feature.length}`).join('')}`;
}

export const useLocalFeatureAvailability = (featureList: string[], key?: string) => {

  const localKey = key || computeHash(featureList);
  const [localData, setLocalData] = useLocalStorage<Record<string, boolean> | undefined>(localKey, undefined);

  const fetchLocalFeatureAvailability = async (featureList: string[]) => {
    const data = await fetchFeatureAvailabilityData(featureList);
    setLocalData(data);
    return data;
  };

  return useQuery<Record<(typeof featureList)[number], boolean>, ApiError>({
    staleTime: 0,
    refetchOnMount: true,
    queryKey: getFeatureAvailabilityQueryKey(featureList),
    queryFn: () => fetchLocalFeatureAvailability(featureList),
    initialData: localData,
  });
}