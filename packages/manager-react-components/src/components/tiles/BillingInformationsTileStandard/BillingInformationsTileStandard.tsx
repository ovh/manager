import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '../../content/ManagerTile/manager-tile.component';
import BillingDetails from '../BillingInformationsTile/BillingDetails.class';
import {
  BillingInformationContext,
  useBillingInformationContextServiceDetails,
} from '../BillingInformationsTile/BillingInformationsContext';
import { BillingInformationsTile } from '../BillingInformationsTile/BillingInformationsTile';

export type BillingInformationsTileProps = {
  resourceName?: string;
};

export const BillingInformationsTileStandardContent = () => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } =
    useBillingInformationContextServiceDetails();

  const billingDetails = useMemo(
    () => (isLoading ? undefined : new BillingDetails(serviceDetails)),
    [serviceDetails],
  );

  return (
    <>
      <BillingInformationsTile.Title>
        {t('billing_informations_title')}
      </BillingInformationsTile.Title>
      <BillingInformationsTile.Divider />
      <BillingInformationsTile.CreationDate />
      <BillingInformationsTile.Divider />
      <BillingInformationsTile.State />
      <BillingInformationsTile.Divider />
      <BillingInformationsTile.NextBillingDate />
      {!billingDetails?.isResiliated() &&
        !billingDetails?.shouldDeleteAtExpiration() && (
          <>
            <BillingInformationsTile.Divider />
            <BillingInformationsTile.ResiliateLink />
          </>
        )}
    </>
  );
};

export const BillingInformationsTileStandard = ({
  resourceName,
}: BillingInformationsTileProps) => {
  return (
    <BillingInformationContext.Provider value={{ resourceName }}>
      <BillingInformationsTileStandardContent />
    </BillingInformationContext.Provider>
  );
};
