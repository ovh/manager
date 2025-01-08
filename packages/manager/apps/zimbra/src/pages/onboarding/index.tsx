import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import {
  ONBOARDING_ORDER_CTA,
  GO_TO,
  GUIDE_HOW_TO_CONFIGURE,
  GUIDE_ADMINISTRATOR,
  GUIDE_WEBMAIL,
} from '@/tracking.constant';
import onboardingImgSrc from './onboarding-img.png';
import {
  ZIMBRA_ADMINISTRATOR_GUIDE,
  ZIMBRA_HOW_TO_CONFIGURE_GUIDE,
  ZIMBRA_WEBMAIL_GUIDE,
} from '@/guides.constants';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const { trackClick } = useOvhTracking();

  const onOrderButtonClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ONBOARDING_ORDER_CTA],
    });
    window.open(
      'https://www.ovh.com/fr/order/webcloud/?zimbra#/webCloud/zimbra/select?selection=%7E(zimbra%7E(offer%7E%27zimbra-account-pp-starter%7Epricing%7E%27default%7Equantity%7E1))', // @todo: should be changed when we have all the URLs
      '_blank',
      'noopener',
    );
  };

  const onboardingGuides = [
    {
      key: 1,
      href: useMemo(() => {
        return (
          ZIMBRA_ADMINISTRATOR_GUIDE[ovhSubsidiary] ||
          ZIMBRA_ADMINISTRATOR_GUIDE.DEFAULT
        );
      }, [ZIMBRA_ADMINISTRATOR_GUIDE, ovhSubsidiary]),
      tracking: GUIDE_ADMINISTRATOR,
    },
    {
      key: 2,
      href: useMemo(() => {
        return (
          ZIMBRA_HOW_TO_CONFIGURE_GUIDE[ovhSubsidiary] ||
          ZIMBRA_HOW_TO_CONFIGURE_GUIDE.DEFAULT
        );
      }, [ZIMBRA_HOW_TO_CONFIGURE_GUIDE, ovhSubsidiary]),
      tracking: GUIDE_HOW_TO_CONFIGURE,
    },
    {
      key: 3,
      href: useMemo(() => {
        return (
          ZIMBRA_WEBMAIL_GUIDE[ovhSubsidiary] || ZIMBRA_WEBMAIL_GUIDE.DEFAULT
        );
      }, [ZIMBRA_WEBMAIL_GUIDE, ovhSubsidiary]),
      tracking: GUIDE_WEBMAIL,
    },
  ];

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={t('description')}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={onOrderButtonClick}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref="https://www.ovhcloud.com/fr/emails/zimbra-emails/" // @todo: should be changed when we have all the URLs
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
}
