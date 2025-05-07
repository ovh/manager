import React, { Suspense } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { PricingByDurationType } from '@/hooks/planCreation/useDefaultOffer';
import { InstanceInfo, TechnicalInfo } from '@/types/CreatePlan.type';
import Commitment from './Commitment';
import { DescriptionWrapper } from '../CreatePlanForm/CreatePlanForm';
import { Block } from '../SimpleTile/SimpleTile';

type CommitmentWrapperProps = {
  pricingByDuration: PricingByDurationType[];
  isPricingLoading: boolean;
  isTechnicalInfoLoading: boolean;
  setOfferIdSelected: (id: string) => void;
  offerIdSelected: string;
  quantity: number;
  activeInstance: TechnicalInfo;
};

const CommitmentWrapper = ({
  pricingByDuration,
  isPricingLoading,
  isTechnicalInfoLoading,
  setOfferIdSelected,
  offerIdSelected,
  quantity,
  activeInstance,
}: CommitmentWrapperProps) => {
  const { t } = useTranslation('create');

  return (
    <Block>
      <Subtitle>{t('select_commitment')}</Subtitle>
      <DescriptionWrapper>
        {t('select_commitment_description')}
      </DescriptionWrapper>
      <Suspense>
        {!isPricingLoading && !isTechnicalInfoLoading ? (
          pricingByDuration?.map(({ id, duration, price }) => (
            <Commitment
              key={id}
              onClick={() => setOfferIdSelected(id)}
              isActive={offerIdSelected === id}
              duration={duration}
              price={price?.toString()}
              quantity={quantity}
              hourlyPriceWithoutCommitment={activeInstance?.hourlyPrice || 0}
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
