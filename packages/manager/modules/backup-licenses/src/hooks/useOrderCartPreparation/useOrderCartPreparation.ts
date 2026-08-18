import { useCallback, useEffect, useState } from 'react';

import { Contract } from '@ovh-ux/manager-module-order';

import { usePrepareBackupLicensesCart } from '@/data/hooks/usePrepareBackupLicensesCart/usePrepareBackupLicensesCart';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';

export type OrderCartPreparation = {
  cartId: string | null;
  contractList: Contract[];
  isPreparing: boolean;
  hasPreparationFailed: boolean;
  areTermsAccepted: boolean;
  isReadyToCheckout: boolean;
  acceptTerms: (accepted: boolean) => void;
  retryPreparation: () => void;
};

type SettledPreparation = {
  key: string;
  cartId: string | null;
  contractList: Contract[];
  hasFailed: boolean;
};

const NO_CONTRACT: Contract[] = [];

export const useOrderCartPreparation = ({
  form,
  licenseType,
  isEnabled = true,
}: {
  form: ServerVaultFormState;
  licenseType: LicenseApiValue | null;
  isEnabled?: boolean;
}): OrderCartPreparation => {
  const { mutateAsync: prepareCart } = usePrepareBackupLicensesCart();

  const [settled, setSettled] = useState<SettledPreparation | null>(null);
  const [acceptedKey, setAcceptedKey] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const compositionKey =
    isEnabled && form.regionApiValue !== null && licenseType !== null
      ? JSON.stringify({ form, licenseType, retryToken })
      : null;

  useEffect(() => {
    if (compositionKey === null || licenseType === null) return undefined;

    let cancelled = false;

    prepareCart({ form, licenseType })
      .then(({ cartId, contractList }) => {
        if (cancelled) return;
        setSettled({ key: compositionKey, cartId, contractList, hasFailed: false });
      })
      .catch(() => {
        if (cancelled) return;
        setSettled({
          key: compositionKey,
          cartId: null,
          contractList: NO_CONTRACT,
          hasFailed: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [compositionKey, form, licenseType, prepareCart]);

  const isSettled = settled !== null && settled.key === compositionKey;
  const cartId = isSettled ? settled.cartId : null;
  const areTermsAccepted = compositionKey !== null && acceptedKey === compositionKey;

  const acceptTerms = useCallback(
    (accepted: boolean) => setAcceptedKey(accepted ? compositionKey : null),
    [compositionKey],
  );

  const retryPreparation = useCallback(() => setRetryToken((token) => token + 1), []);

  return {
    cartId,
    contractList: isSettled ? settled.contractList : NO_CONTRACT,
    isPreparing: compositionKey !== null && !isSettled,
    hasPreparationFailed: isSettled && settled.hasFailed,
    areTermsAccepted,
    isReadyToCheckout: cartId !== null && areTermsAccepted,
    acceptTerms,
    retryPreparation,
  };
};
