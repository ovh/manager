import { useLocation } from '@/data/hooks/locations/useLocations.hook';
import { useIamResourceTags } from '@/data/hooks/iam/useIamResourceTags.hook';

export const useIamRegionsAndCapabilitiesMetrics = (resourceURN: string) => {
  const {
    data: iamTags,
    isLoading: isIamTagsLoading,
    isSuccess: isIamTagsSuccess,
  } = useIamResourceTags(resourceURN, [
    'ovh:region',
    'ovh:capabilities:metrics',
  ]);

  const regionName = iamTags?.['ovh:region'];

  const {
    data: location,
    isLoading: isLocationLoading,
    isSuccess: isLocationSuccess,
  } = useLocation(regionName ?? '');

  const regions = [
    {
      code: location?.code ?? '',
      name: location?.name ?? '',
      label: location?.location ?? '',
    },
  ];

  const capabilitiesMetrics =
    iamTags?.['ovh:capabilities:metrics'] === 'true';

  return {
    isPending: isIamTagsLoading || isLocationLoading,
    isSuccess: isIamTagsSuccess && isLocationSuccess,
    regions,
    capabilitiesMetrics,
    tags: iamTags,
  };
};

