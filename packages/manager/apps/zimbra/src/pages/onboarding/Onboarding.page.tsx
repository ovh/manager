import React, { useContext, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { getOrderURL } from '@ovh-ux/manager-module-order';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  ZIMBRA_ADMINISTRATOR_GUIDE,
  ZIMBRA_HOW_TO_CONFIGURE_GUIDE,
  ZIMBRA_WEBMAIL_GUIDE,
} from '@/guides.constants';
import {
  GO_TO,
  GUIDE_ADMINISTRATOR,
  GUIDE_HOW_TO_CONFIGURE,
  GUIDE_WEBMAIL,
  ONBOARDING_ORDER_CTA,
} from '@/tracking.constants';

import onboardingImgSrc from './onboarding-img.png';
import { ORDER_LINK, WEBSITE_LINK } from './onboarding.constants';

export const Onboarding = () => {
  const { t } = useTranslation('onboarding');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();
  const orderBaseURL = getOrderURL('orderDomain', region, ovhSubsidiary);

  const { trackClick } = useOvhTracking();

  const onOrderButtonClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ONBOARDING_ORDER_CTA],
    });

    window.open(`${orderBaseURL}${ORDER_LINK}`, '_blank', 'noopener');
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
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={<OdsText className="text-center">{t('description')}</OdsText>}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={onOrderButtonClick}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={WEBSITE_LINK[ovhSubsidiary] || WEBSITE_LINK.DEFAULT}
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

export default Onboarding;
