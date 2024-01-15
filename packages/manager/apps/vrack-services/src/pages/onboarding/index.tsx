import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import { useGuideUtils } from '@/components/GuideLink';
import { OnboardingLayout } from '@/components/layout-helpers';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';

const MscTile = (props: any) => {
  // TODO: Replace with React Tile
  console.log(props);
  return <div>{props.tileTitle}</div>;
};

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

export default function Onboarding() {
  const { t } = useTranslation('vrack-services/onboarding');
  const environment = useEnvironment();
  const locale = environment.getUserLocale();
  const link = useGuideUtils();
  const navigate = useNavigate();

  const tileList = [
    {
      tileTitle: t('guide1Title'),
      tileDescription: t('guide1Description'),
      href: link?.guideLink1,
      'data-tracking': `vrack-services::onboarding::docs::${t('guide1Title')}`,
    },
    {
      tileTitle: t('guide2Title'),
      tileDescription: t('guide2Description'),
      href: link?.guideLink2,
      'data-tracking': `vrack-services::onboarding::docs::${t('guide2Title')}`,
    },
  ];

  return (
    <OnboardingLayout
      introTitle={t('introTitle')}
      intro={t('intro')}
      title={t('title')}
      description={t('description')}
      imageSrc={onboardingImgSrc}
      primaryButtonLabel={t('orderButtonLabel')}
      primaryOnClick={() => navigate('/create')}
      primaryButtonDataTracking="vrack-services::onboarding::add"
      secondaryButtonLabel={t('moreInfoButtonLabel')}
      secondaryHref={t('moreInfoButtonLink')}
      secondaryButtonDataTracking="vrack-services::onboarding::discover"
    >
      <aside className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
        {tileList.map((tile) => (
          <MscTile
            key={tile.tileTitle}
            category={t('guideCategory')}
            locale={locale}
            isExternalHref
            {...tile}
          >
            <span slot="badges">
              <OsdsChip color={ODS_THEME_COLOR_INTENT.primary}>
                {t('newBadgeText')}
              </OsdsChip>
            </span>
          </MscTile>
        ))}
      </aside>
    </OnboardingLayout>
  );
}
