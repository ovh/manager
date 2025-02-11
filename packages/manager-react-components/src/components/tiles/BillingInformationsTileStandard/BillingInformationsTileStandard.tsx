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
  onResiliateLinkClick?: () => void;
};

export const BillingInformationsTileStandardContent = ({
  onResiliateLinkClick,
}: Pick<BillingInformationsTileProps, 'onResiliateLinkClick'>) => {
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
            <BillingInformationsTile.ResiliateLink
              onClickReturn={onResiliateLinkClick}
            />
          </>
        )}
    </>
  );
};

export const BillingInformationsTileStandard = ({
  resourceName,
  onResiliateLinkClick,
}: BillingInformationsTileProps) => {
  return (
    <BillingInformationContext.Provider value={{ resourceName }}>
      <BillingInformationsTileStandardContent
        onResiliateLinkClick={onResiliateLinkClick}
      />
    </BillingInformationContext.Provider>
  );
};
