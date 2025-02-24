import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const useGetEncriptionAvailability = () => {
  const feature = 'public-cloud:object-storage:encryption';

  const result = useFeatureAvailability([feature]);

  return {
    ...result,
    available: result?.data?.[feature] === true,
  };
};
