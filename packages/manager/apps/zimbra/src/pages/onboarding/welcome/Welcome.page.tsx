import React, { useContext, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { usePlatform } from '@/data/hooks';
import {
  ZIMBRA_ADMINISTRATOR_GUIDE,
  ZIMBRA_HOW_TO_CONFIGURE_GUIDE,
  ZIMBRA_WEBMAIL_GUIDE,
} from '@/guides.constants';
import { useGenerateUrl } from '@/hooks';
import {
  GO_TO,
  GUIDE_ADMINISTRATOR,
  GUIDE_HOW_TO_CONFIGURE,
  GUIDE_WEBMAIL,
  ONBOARDING_WELCOME_CONFIGURE_NOW_CTA,
} from '@/tracking.constants';

import onboardingImgSrc from '../onboarding-img.png';

export const OnboardingWelcome = () => {
  const { t } = useTranslation(['onboarding', 'common']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { platformId } = usePlatform();
  const navigate = useNavigate();
  const configureUrl = useGenerateUrl(`../configure/${platformId}/organization`, 'path');

  const { trackClick } = useOvhTracking();

  const onPrimaryClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ONBOARDING_WELCOME_CONFIGURE_NOW_CTA],
    });
    navigate(configureUrl);
  };

  const onboardingGuides = [
    {
      key: 1,
      href: useMemo(() => {
        return ZIMBRA_ADMINISTRATOR_GUIDE[ovhSubsidiary] || ZIMBRA_ADMINISTRATOR_GUIDE.DEFAULT;
      }, [ovhSubsidiary]),
      tracking: GUIDE_ADMINISTRATOR,
    },
    {
      key: 2,
      href: useMemo(() => {
        return (
          ZIMBRA_HOW_TO_CONFIGURE_GUIDE[ovhSubsidiary] || ZIMBRA_HOW_TO_CONFIGURE_GUIDE.DEFAULT
        );
      }, [ovhSubsidiary]),
      tracking: GUIDE_HOW_TO_CONFIGURE,
    },
    {
      key: 3,
      href: useMemo(() => {
        return ZIMBRA_WEBMAIL_GUIDE[ovhSubsidiary] || ZIMBRA_WEBMAIL_GUIDE.DEFAULT;
      }, [ovhSubsidiary]),
      tracking: GUIDE_WEBMAIL,
    },
  ];

  return (
    <OnboardingLayout
      title={t('welcome_title')}
      img={{ src: onboardingImgSrc }}
      description={
        <>
          <OdsText className="text-center" id="welcome-description">
            {t('welcome_description')}
          </OdsText>
          <div className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <OdsButton
              className="sm:w-auto [&::part(button)]:w-full"
              size={ODS_BUTTON_SIZE.md}
              label={t('common:configure_now')}
              onClick={onPrimaryClick}
            />
          </div>
        </>
      }
    >
      {onboardingGuides.map(({ href, key, tracking }) => (
        <Card
          key={key}
          href={href}
          texts={{
            category: t('card_guide_category'),
            description: t(`card_guide_description_${key}`),
            title: t(`card_guide_title_${key}`),
          }}
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: [GO_TO(tracking)],
            });
          }}
        />
      ))}
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
