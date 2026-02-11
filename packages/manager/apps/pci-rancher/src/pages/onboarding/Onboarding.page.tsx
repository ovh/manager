import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { VideoEmbed } from '@/components/VideoEmbed/VideoEmbed.component';
import { getCreateRancherUrl } from '@/utils/route';
import {
  useTrackingAction,
  useTrackingPage,
} from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useGuideUtils } from '@/hooks/useGuideLink/useGuideLink';
import useRancherEligibility from '@/data/hooks/useRancherEligibility/useRancherEligibility';
import { useRancherFreeTrial } from '@/hooks/useRancherFreeTrial';
import { RANCHER_GUIDES_URL } from '@/utils/guides';
import { OvhSubsidiary } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const ONBOARDING_VIDEO_URL = 'https://www.youtube.com/embed/ZX8Pg4_ZH0Y';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data: eligibility } = useRancherEligibility();
  const freeTrialCreditText = useRancherFreeTrial();
  const title: string = t('title');
  const descriptionText: string = t('description');
  useTrackingPage(TrackingPageView.Onboarding);
  const trackAction = useTrackingAction();
  const onOrderButtonClick = () => {
    trackAction(TrackingPageView.Onboarding, TrackingEvent.add);
    navigate(getCreateRancherUrl(projectId ?? ''));
  };

  const { environment } = useContext(ShellContext);
  const guideLink =
    RANCHER_GUIDES_URL[environment.getUser().ovhSubsidiary as OvhSubsidiary] ??
    RANCHER_GUIDES_URL.DEFAULT;

  const tileData = [
    {
      id: 1,
      titleKey: 'managedRancherServiceGettingStartedTitle',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription',
      hrefKey: 'MANAGED_RANCHER_SERVICE_GETTING_STARTED',
    },
    {
      id: 2,
      titleKey: 'managedRancherServiceGettingStartedTitle2',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription2',
      hrefKey: 'MANAGED_RANCHER_SERVICE_CREATION',
    },
    {
      id: 3,
      titleKey: 'managedRancherServiceGettingStartedTitle3',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription3',
      hrefKey: 'MANAGED_RANCHER_SERVICE_LIFECYCLE_POLICY',
    },
  ];

  const tileList = tileData.map((item) => ({
    ...item,
    texts: {
      title: t(item.titleKey),
      description: t(item.descriptionKey),
      category: t('guideCategory'),
    },
    href: link?.[item.hrefKey] as string,
    isExternalHref: true,
    hoverable: true,
  }));

  const isFreeTrialAvailable = eligibility?.data?.freeTrial;

  const description = isFreeTrialAvailable ? (
    <div className="mt-4 flex flex-col">
      <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="mb-2">
        {t('freeTrialEligibilityTitle')}
      </OsdsText>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="mb-2">
        {t('freeTrialCreditStandard', {
          amount: freeTrialCreditText.standard,
        })}
      </OsdsText>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="mb-2">
        {t('freeTrialCreditOvhEdition', {
          amount: freeTrialCreditText.ovhEdition,
        })}
      </OsdsText>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="mt-4">
        {t('freeTrialCreditApplied')}
      </OsdsText>
    </div>
  ) : (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{descriptionText}</OsdsText>
  );

  return (
    <PageLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={title}
        img={{ src: onboardingImgSrc }}
        description={description}
        orderButtonLabel={
          isFreeTrialAvailable
            ? t('orderButtonLabelFreeTrial')
            : t('orderButtonLabel')
        }
        onOrderButtonClick={onOrderButtonClick}
        moreInfoButtonLabel={
          isFreeTrialAvailable ? t('rancherGuidesLink') : undefined
        }
        moreInfoHref={isFreeTrialAvailable ? guideLink : undefined}
      >
        {!isFreeTrialAvailable &&
          tileList.map((tile) => (
            <Card
              data-testid="tileCard"
              key={tile.id}
              href={tile.href}
              texts={tile.texts}
            />
          ))}
      </OnboardingLayout>
      {isFreeTrialAvailable && (
        <VideoEmbed
          src={ONBOARDING_VIDEO_URL}
          title={t('videoTitle')}
          className="mx-auto max-w-[800px] pt-10"
        />
      )}
    </PageLayout>
  );
}
