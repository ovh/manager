import { useTranslation, UseTranslationOptions } from 'react-i18next';
import dashboardTranslation from '@/public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import listingTranslation from '@/public/translations/pci-rancher/listing/Messages_fr_FR.json';
import updateSoftwareTranslation from '@/public/translations/pci-rancher/updateSoftware/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/pci-rancher/onboarding/Messages_fr_FR.json';

export type AllPossibleKeys =
  | keyof typeof dashboardTranslation
  | keyof typeof listingTranslation
  | keyof typeof updateSoftwareTranslation
  | keyof typeof onboardingTranslation;

type Namespace =
  | 'pci-rancher/onboarding'
  | 'pci-rancher/listing'
  | 'pci-rancher/dashboard'
  | 'pci-rancher/updateSoftware';

export const useTranslate = (
  ns?: Namespace | Namespace[],
  options?: UseTranslationOptions<undefined>,
) => {
  const { t, ...props } = useTranslation(ns, options);
  const customT = (
    key: AllPossibleKeys,
    opt?: {
      [key: string]: string;
    },
  ) => t(key, opt);
  return {
    ...props,
    t: customT,
  };
};
