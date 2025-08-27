import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  useGetCartConfiguration,
  useGetOrderProjectId,
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

  const {
    data: projectItem,
    isLoading: isLoadingProject,
  } = useGetOrderProjectId(cartId);
  const {
    data: cartConfiguration,
    isLoading: isLoadingCartConfig,
  } = useGetCartConfiguration('description', cartId, projectItem?.itemId);
  const { data: hdsItem, isLoading: isLoadingHds } = useIsHdsChecked(cartId);

  useEffect(() => {
    if (cartConfiguration) {
      setForm((prev) => ({
        ...prev,
        description: cartConfiguration.value || '',
      }));
    }
  }, [cartConfiguration, setForm]);

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
    isLoading: isLoadingProject || isLoadingCartConfig || isLoadingHds,
  };
};
