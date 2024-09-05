import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardProps,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useGuideUtils } from './useGuideUtils';
import onboardingImgSrc from '@/assets/veeamxOVHcloud.svg';
import { urls } from '@/routes/routes.constant';
import { useBillingUrl } from '@/components/Links/BillingLink.component';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils();
  const navigate = useNavigate();
  const moreInfoHref = useBillingUrl();

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
    <OnboardingLayout
      title="Managed Veeam for VMware Cloud Director"
      img={{ src: onboardingImgSrc }}
      description={t('description')}
      orderButtonLabel={t('order_button_label')}
      onOrderButtonClick={() => navigate(urls.orderVeeam)}
      moreInfoButtonLabel={t('more_info_button_label')}
      moreInfoHref={moreInfoHref}
    >
      {tileList.map((tile) => (
        <Card key={tile.texts.title} {...tile} />
      ))}
    </OnboardingLayout>
  );
}
