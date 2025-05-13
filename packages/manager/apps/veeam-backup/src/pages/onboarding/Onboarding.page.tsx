import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardProps,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useOrganizationList } from '@ovh-ux/manager-module-vcd-api';
import { useGuideUtils } from './useGuideUtils';
import onboardingImgSrc from '@/assets/veeamxOVHcloud.svg';
import { urls } from '@/routes/routes.constant';
import { useBillingUrl } from '@/components/Links/BillingLink.component';
import { productFullName } from '@/veeam-backup.config';
import { NoOrganizationMessage } from '@/components/NoOrganizationMessage/NoOrganizationMessage.component';
import { Loading } from '@/components/Loading/Loading';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils();
  const navigate = useNavigate();
  const moreInfoHref = useBillingUrl();
  const { data, isLoading, isError, error } = useOrganizationList({
    pageSize: 10,
  });
  const organizationList = data?.pages[0].data;

  const tileList: CardProps[] = [
    {
      texts: {
        title: t('guide1_title'),
        description: t('guide1_description'),
        category: t('guide_category'),
      },
      badges: [{ text: t('new_badge_label') }],
      href: guides?.guideLink1,
      isExternalHref: true,
    },
    {
      texts: {
        title: t('guide2_title'),
        description: t('guide2_description'),
        category: t('guide_category'),
      },
      href: guides?.guideLink2,
      hrefLabel: t('guide2_link_label'),
      isExternalHref: true,
    },
    {
      texts: {
        title: t('guide3_title'),
        description: t('guide3_description'),
        category: t('guide_category'),
      },
      href: guides?.guideLink3,
      hrefLabel: t('guide3_link_label'),
      isExternalHref: true,
    },
  ];

  return (
    <React.Suspense fallback={<Loading />}>
      {isError && (
        <OdsMessage className="mb-9" color="danger">
          {error.message}
        </OdsMessage>
      )}
      {!isLoading && !isError && (
        <NoOrganizationMessage organizationList={organizationList} />
      )}
      <OnboardingLayout
        title={productFullName}
        img={{ src: onboardingImgSrc }}
        description={
          <OdsText className="text-center">{t('description')}</OdsText>
        }
        orderButtonLabel={t('order_button_label')}
        isActionDisabled={!organizationList?.length}
        onOrderButtonClick={() => navigate(urls.orderVeeam)}
        moreInfoButtonLabel={t('more_info_button_label')}
        moreInfoHref={moreInfoHref}
      >
        {tileList.map((tile) => (
          <Card key={tile.texts.title} {...tile} />
        ))}
      </OnboardingLayout>
    </React.Suspense>
  );
}
