import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const objectStorage = 'pci-object-storage';

const standardInfrequentAcess = `${objectStorage}:standard-infrequent-access`;

const UseStandardInfrequentAccessAvailability = () => {
  const { data } = useFeatureAvailability([standardInfrequentAcess]);
  return Boolean(data?.[standardInfrequentAcess]);
};

export default UseStandardInfrequentAccessAvailability;
