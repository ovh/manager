import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardProps,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useGuideUtils } from './useGuideUtils';
import onboardingImgSrc from '@/assets/veeamxOVHcloud.svg';
import { urls } from '@/routes/routes.constant';
import { useBillingUrl } from '@/components/Links/BillingLink.component';
import { productFullName } from '@/veeam-backup.config';
import { useOrganizationList } from '@/data';
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
      badges: [
        { text: t('new_badge_label'), color: ODS_THEME_COLOR_INTENT.info },
      ],
      href: guides?.guideLink1,
      isExternalHref: true,
    },
  ];

  return (
    <React.Suspense fallback={<Loading />}>
      {isError && (
        <OsdsMessage className="mb-9" type={ODS_MESSAGE_TYPE.error}>
          {error.message}
        </OsdsMessage>
      )}
      {!isLoading && !isError && (
        <NoOrganizationMessage organizationList={organizationList} />
      )}
      <OnboardingLayout
        title={productFullName}
        img={{ src: onboardingImgSrc }}
        description={t('description')}
        orderButtonLabel={t('order_button_label')}
        onOrderButtonClick={
          organizationList?.length > 0
            ? () => navigate(urls.orderVeeam)
            : undefined
        }
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
