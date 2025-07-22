import React, { Suspense } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import Commitment from './Commitment';
import { DescriptionWrapper } from '../CreatePlanForm/CreatePlanForm';
import { Block } from '../SimpleTile/SimpleTile';
import { TPlanPricing } from '@/hooks/planCreation/usePlanPricing';

type CommitmentWrapperProps = {
  enrichedPricingByDuration: TPlanPricing[];
  isLoading: boolean;
  setOfferIdSelected: (id: string) => void;
  offerIdSelected?: string;
};

const CommitmentWrapper = ({
  enrichedPricingByDuration,
  isLoading,
  setOfferIdSelected,
  offerIdSelected,
}: CommitmentWrapperProps) => {
  const { t } = useTranslation('create');

  return (
    <Block>
      <Subtitle>{t('select_commitment')}</Subtitle>
      <DescriptionWrapper>
        {t('select_commitment_description')}
      </DescriptionWrapper>
      <Suspense>
        {!isLoading ? (
          enrichedPricingByDuration.map((planPricing) => (
            <Commitment
              key={planPricing.id}
              onClick={() => setOfferIdSelected(planPricing.id)}
              isActive={offerIdSelected === planPricing.id}
              planPricing={planPricing}
            />
          ))
        ) : (
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        )}
      </Suspense>
    </Block>
  );
};

export default CommitmentWrapper;
