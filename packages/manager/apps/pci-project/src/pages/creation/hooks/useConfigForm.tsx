import { useState } from 'react';
import { format } from 'date-fns';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export type ConfigFormState = {
  description: string;
  isContractsChecked: boolean;
  hasItalyAgreements: boolean;
  isHdsChecked: boolean;
};

export const useConfigForm = (ovhSubsidiary: OvhSubsidiary) => {
  const [form, setForm] = useState<ConfigFormState>({
    description: `Project ${format(new Date(), 'yyyy-MM-dd')}`,
    isContractsChecked: false,
    hasItalyAgreements: false,
    isHdsChecked: false,
  });

  const isConfigFormValid = (): boolean => {
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
  };
};
