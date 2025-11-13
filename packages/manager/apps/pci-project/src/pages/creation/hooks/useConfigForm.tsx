import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  useGetCartConfiguration,
  useGetProjectItem,
  useIsHdsChecked,
} from '@/data/hooks/useCart';

export type ConfigFormState = {
  description: string;
  isContractsChecked: boolean;
  hasItalyAgreements: boolean;
  isHdsChecked: boolean;
};

export const useConfigForm = (
  ovhSubsidiary: OvhSubsidiary,
  cartId: string | undefined,
) => {
  const [form, setForm] = useState<ConfigFormState>({
    description: `Project ${format(new Date(), 'yyyy-MM-dd')}`,
    isContractsChecked: !!cartId,
    hasItalyAgreements: !!cartId,
    isHdsChecked: false,
  });

  /**
   * Get existing project item
   * when cartId exist on the url
   */
  const { data: existingProjectItem } = useGetProjectItem(cartId);

  /**
   * Get existing project description
   * when the cartId exists on the url or when the project item exists
   */
  const { data: cartConfigurationDescription } = useGetCartConfiguration(
    'description',
    cartId,
    existingProjectItem?.itemId,
  );

  const { data: hdsItem } = useIsHdsChecked(cartId);

  useEffect(() => {
    if (cartConfigurationDescription) {
      setForm((prev) => ({
        ...prev,
        description: cartConfigurationDescription.value || '',
      }));
    }
  }, [cartConfigurationDescription, setForm]);

  useEffect(() => {
    if (hdsItem) {
      setForm((prev) => ({
        ...prev,
        isHdsChecked: !!hdsItem,
      }));
    }
  }, [hdsItem, setForm]);

  const isConfigFormValid = (): boolean => {
    // If cartId is set, that means we reloaded the page, so the contract checkboxes should be checked
    const hasRequiredFields =
      form.description?.trim() &&
      form.isContractsChecked &&
      (ovhSubsidiary !== OvhSubsidiary.IT || form.hasItalyAgreements);

    return Boolean(hasRequiredFields);
  };

  return {
    form,
    setForm,
    isConfigFormValid,
    existingProjectItem,
    cartConfigurationDescription,
  };
};
