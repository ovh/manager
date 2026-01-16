import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const ffPrefix = 'pci-kubernetes';

const region3AZ = `${ffPrefix}:deployment-region-3-az`;

export const use3azAvailability = () => {
  const { data, ...query } = useFeatureAvailability([region3AZ]);

  return {
    data: Boolean(data?.[region3AZ]),
    ...query,
  };
};
