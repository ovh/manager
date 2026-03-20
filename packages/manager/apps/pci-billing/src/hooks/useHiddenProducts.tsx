import { PCI_FEATURES_HIDDEN_PRODUCTS } from '@/constants';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const useHiddenProducts = () => {
  const { data } = useFeatureAvailability([PCI_FEATURES_HIDDEN_PRODUCTS]);

  const hasHiddenProducts = data?.[PCI_FEATURES_HIDDEN_PRODUCTS];

  return {
    hasHiddenProducts,
  };
};
