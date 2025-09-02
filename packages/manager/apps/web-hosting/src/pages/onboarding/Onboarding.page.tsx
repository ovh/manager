import React, { useContext, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import useGuides from '@/hooks/useGuides';
import { GO_TO, ORDER_CTA } from '@/utils/tracking.constants';

import { ORDER_LINK } from './onboarding.constants';
import onboardingImgSrc from './onboarding.svg?url';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const { trackClick } = useOvhTracking();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guides = useGuides();

  const tiles = useMemo(
    () => [
      {
        id: 1,
        texts: {
          title: t(guides?.guideLink1?.title),
          description: t(guides?.guideLink1?.description),
          category: t(guides?.guideLink1?.category),
        },
        href: guides?.guideLink1?.href,
        tracking: guides?.guideLink1?.tracking,
      },
      {
        id: 2,
        texts: {
          title: t(guides?.guideLink2?.title),
          description: t(guides?.guideLink2?.description),
          category: t(guides?.guideLink2?.category),
        },
        href: guides?.guideLink2?.href,
        tracking: guides?.guideLink2?.tracking,
      },
      {
        id: 3,
        texts: {
          title: t(guides?.guideLink3?.title),
          description: t(guides?.guideLink3?.description),
          category: t(guides?.guideLink3.category),
        },
        href: guides?.guideLink3?.href,
        tracking: guides?.guideLink3?.tracking,
      },
    ],
    [guides, t],
  );

  const orderLink = useMemo(() => ORDER_LINK[ovhSubsidiary] || ORDER_LINK.DEFAULT, [ovhSubsidiary]);

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc, alt: '' }}
      description={<OdsText className="text-center">{t('description')}</OdsText>}
      orderButtonLabel={t('order_btn')}
      onOrderButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: [ORDER_CTA],
        });

        window.open(orderLink, '_blank', 'noopener');
      }}
    >
      {tiles.map((tile) => (
        <Card
          key={tile.id}
          href={tile.href}
          texts={tile.texts}
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: [GO_TO(tile.tracking)],
            });
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
