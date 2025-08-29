import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsCard } from '@ovhcloud/ods-components/react';

import { ServiceDetails } from '@ovh-ux/manager-module-common-api';

import BillingDetails from './BillingDetails.class';
import BillingInformationsTile from './BillingInformationsTile';
import {
  BillingInformationsTileContext,
  useBillingInformationsContextServiceDetails,
} from './BillingInformationsTile.context';

export type BillingInformationsTileProps = {
  resourceName?: string;
  onResiliateLinkClick?: () => void;
};

export const BillingInformationsTileStandardContent = ({
  onResiliateLinkClick,
}: Pick<BillingInformationsTileProps, 'onResiliateLinkClick'>) => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } = useBillingInformationsContextServiceDetails();

  const billingDetails = useMemo(
    () => (isLoading ? undefined : new BillingDetails(serviceDetails || ({} as ServiceDetails))),
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
      {!billingDetails?.isResiliated() && !billingDetails?.shouldDeleteAtExpiration() && (
        <>
          <BillingInformationsTile.Divider />
          <BillingInformationsTile.ResiliateLink onClickReturn={onResiliateLinkClick} />
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
    <BillingInformationsTileContext.Provider value={BillingInformationsTileContextValues}>
      <BillingInformationsTileStandardContent onResiliateLinkClick={onResiliateLinkClick} />
    </BillingInformationsTileContext.Provider>
  );
};
