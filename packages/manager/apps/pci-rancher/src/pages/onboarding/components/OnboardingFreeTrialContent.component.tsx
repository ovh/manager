import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { VideoEmbed } from '@/components/VideoEmbed/VideoEmbed.component';
import { getCreateRancherUrl } from '@/utils/route';
import { useTrackingAction } from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useRancherFreeTrial } from '@/hooks/useRancherFreeTrial';
import { RANCHER_GUIDES_URL, ONBOARDING_VIDEO_URL } from '@/utils/guides';
import { OvhSubsidiary } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const OnboardingFreeTrialContent = () => {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const { projectId } = useParams();
  const freeTrialCreditText = useRancherFreeTrial();
  const title: string = t('title');
  const trackAction = useTrackingAction();
  const onOrderButtonClick = () => {
    trackAction(TrackingPageView.Onboarding, TrackingEvent.add);
    navigate(getCreateRancherUrl(projectId ?? ''));
  };

  const { environment } = useContext(ShellContext);
  const guideLink =
    RANCHER_GUIDES_URL[environment.getUser().ovhSubsidiary as OvhSubsidiary] ??
    RANCHER_GUIDES_URL.DEFAULT;

  const description = (
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
  );

  return (
    <>
      <OnboardingLayout
        title={title}
        img={{ src: onboardingImgSrc }}
        description={description}
        orderButtonLabel={t('orderButtonLabelFreeTrial')}
        onOrderButtonClick={onOrderButtonClick}
        moreInfoButtonLabel={t('rancherGuidesLink')}
        moreInfoHref={guideLink}
      />
      <VideoEmbed
        src={ONBOARDING_VIDEO_URL}
        title={t('videoTitle')}
        className="mx-auto max-w-[800px] pt-10"
      />
    </>
  );
};
