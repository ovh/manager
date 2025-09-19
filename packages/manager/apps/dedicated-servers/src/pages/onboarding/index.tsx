import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import useGuideUtils, { UrlLinks } from '@/hooks/useLinkUtils';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { onboardingLinks } from '@/data/constants/onboardingLinks';
import { orderLinks } from '@/data/constants/orderLinks';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const links = useGuideUtils(onboardingLinks) as UrlLinks;
  const { dedicatedOrder } = useGuideUtils<UrlLinks>(orderLinks);

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('dedicated_servers_onboarding_guide_getting_started_title'),
        description: t(
          'dedicated_servers_onboarding_guide_getting_started_description',
        ),
        category: t('dedicated_servers_onboarding_category'),
      },
      href: links.startedDedicatedServer,
    },
    {
      id: 2,
      texts: {
        title: t('dedicated_servers_onboarding_guide_backup_storage_title'),
        description: t(
          'dedicated_servers_onboarding_guide_backup_storage_description',
        ),
        category: t('dedicated_servers_onboarding_category'),
      },
      href: links.backupStorage,
    },
    {
      id: 3,
      texts: {
        title: t('dedicated_servers_onboarding_guide_firewall_network_title'),
        description: t(
          'dedicated_servers_onboarding_guide_firewall_network_description',
        ),
        category: t('dedicated_servers_onboarding_category'),
      },
      href: links.firewallNetwork,
    },
  ];

  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <OnboardingLayout
      title={t('dedicated_servers_onboarding_title')}
      img={imgSrc}
      description={t('dedicated_servers_onboarding_description')}
      orderButtonLabel={tCommon('order')}
      orderHref={dedicatedOrder as string}
    >
      {tileList.map((tile) => (
        <Card key={tile.id} href={tile.href as string} texts={tile.texts} />
      ))}
    </OnboardingLayout>
  );
}
