import { useEffect, useState } from 'react';

import { useCatalog } from '@ovh-ux/manager-pci-common';

import { TBillingStepProps } from '@/components/create/BillingStep.component';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import { TScalingState } from '@/types';

type TBillingState = TBillingStepProps & {
  antiAffinity: {
    isEnabled: boolean;
    isChecked: boolean;
    onChange: (val: boolean) => void;
  };
};

type TUseBillingStateParams = {
  flavor?: TComputedKubeFlavor;
  isMonthlyBilling: boolean;
  scaling?: TScalingState;
  onAntiAffinityChange: (val: boolean) => void;
};

export function useBillingState({
  flavor,
  isMonthlyBilling,
  scaling,
  onAntiAffinityChange,
}: TUseBillingStateParams) {
  const { data: catalog, isPending: isCatalogPending } = useCatalog();

  const [billingState, setBillingState] = useState<TBillingState>({
    antiAffinity: {
      isEnabled: false,
      isChecked: false,
      onChange: (val: boolean) => {
        setBillingState((prev) => ({
          ...prev,
          antiAffinity: { ...prev.antiAffinity, isChecked: val },
        }));
        onAntiAffinityChange(val);
      },
    },
    price: 0,
    monthlyPrice: undefined,
    monthlyBilling: {
      isComingSoon: false,
      isChecked: false,
      check: (val: boolean) => {
        setBillingState((prev) => ({
          ...prev,
          monthlyBilling: { ...prev.monthlyBilling, isChecked: val },
        }));
      },
    },
    warn: false,
  });

  useEffect(() => {
    if (flavor && !isCatalogPending) {
      const monthlyBillingState = (() => {
        if (flavor) {
          const addon = catalog?.addons.find((add) => add.planCode === flavor?.planCodes?.hourly);
          return addon?.blobs?.tags?.includes('coming_soon') ? 'coming_soon' : 'not_available';
        }
        return 'available';
      })();

      const warnForAutoscaleBilling = Boolean(isMonthlyBilling && scaling?.isAutoscale);

      setBillingState((prev) => ({
        ...prev,
        warn: warnForAutoscaleBilling,
        price: flavor?.pricingsHourly?.price ?? 0,
        monthlyPrice: flavor?.pricingsMonthly?.price ?? 0,
        monthlyBilling: {
          ...prev.monthlyBilling,
          isComingSoon: monthlyBillingState === 'coming_soon',
        },
      }));
    }
  }, [flavor, isMonthlyBilling, scaling, isCatalogPending, catalog?.addons]);

  return billingState;
}
