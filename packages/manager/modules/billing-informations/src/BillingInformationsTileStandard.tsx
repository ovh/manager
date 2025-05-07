import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsCard } from '@ovhcloud/ods-components/react';
import {
  BillingInformationsTileContext,
  useBillingInformationsContextServiceDetails,
} from './BillingInformationsTile.context';
import BillingDetails from './BillingDetails.class';
import BillingInformationsTile from './BillingInformationsTile';

export type BillingInformationsTileProps = {
  resourceName?: string;
  onResiliateLinkClick?: () => void;
};

export const BillingInformationsTileStandardContent = ({
  onResiliateLinkClick,
}: Pick<BillingInformationsTileProps, 'onResiliateLinkClick'>) => {
  const { t } = useTranslation('billing-informations-tile');
  const {
    data: serviceDetails,
    isLoading,
  } = useBillingInformationsContextServiceDetails();

  const billingDetails = useMemo(
    () => (isLoading ? undefined : new BillingDetails(serviceDetails)),
    [serviceDetails],
  );

  return (
    <OdsCard className="w-full flex-col p-[1rem]" color="neutral">
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
    </OdsCard>
  );
};

export const BillingInformationsTileStandard = ({
  resourceName,
  onResiliateLinkClick,
}: BillingInformationsTileProps) => {
  const BillingInformationsTileContextValues = useMemo(
    () => ({
      resourceName,
    }),
    [resourceName],
  );
  return (
    <BillingInformationsTileContext.Provider
      value={BillingInformationsTileContextValues}
    >
      <BillingInformationsTileStandardContent
        onResiliateLinkClick={onResiliateLinkClick}
      />
    </BillingInformationsTileContext.Provider>
  );
};
