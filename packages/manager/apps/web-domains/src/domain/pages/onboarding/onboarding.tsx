import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getOrderURL } from '@ovh-ux/manager-module-order';
import onboardingImgSrc from './onboarding.svg?url';
import {
  ORDER_LINK,
  WEBSITE_LINK,
  TRANSFER_LINK,
  ORDER_API_LINK,
  FAQ_LINK,
} from './onboarding.constants';

export default function Onboarding() {
  const { t } = useTranslation('domain/onboarding');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();
  const orderBaseURL = getOrderURL('orderDomain', region, ovhSubsidiary);

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('guideTransferTitle'),
        description: t('guideTransferDescription'),
        category: t('guideCategory'),
      },
      href: useMemo(() => {
        return TRANSFER_LINK[ovhSubsidiary] || TRANSFER_LINK.DEFAULT;
      }, [ovhSubsidiary]),
    },
    {
      id: 2,
      texts: {
        title: t('guideOrderAPITitle'),
        description: t('guideOrderAPIDescription'),
        category: t('guideCategory'),
      },
      href: useMemo(() => {
        return ORDER_API_LINK[ovhSubsidiary] || ORDER_API_LINK.DEFAULT;
      }, [ovhSubsidiary]),
    },
    {
      id: 3,
      texts: {
        title: t('guideFAQTitle'),
        description: t('guideFAQDescription'),
        category: t('guideCategory'),
      },
      href: useMemo(() => {
        return FAQ_LINK[ovhSubsidiary] || FAQ_LINK.DEFAULT;
      }, [ovhSubsidiary]),
    },
  ];

  const title: string = t('title');
  const description: string = t('description');
  const descriptionWithLeaderPart: string = t('descriptionWithLeaderPart');
  // We are not the leader all over the world
  const renderDescriptionFormated = () => {
    return (
      <Text>
        {description}
        {ovhSubsidiary === OvhSubsidiary.FR && `, ${descriptionWithLeaderPart}`}
      </Text>
    );
  };

  const imgSrc: React.ComponentProps<'img'> = {
    src: onboardingImgSrc,
    className: 'h-36',
  };

  return (
    <OnboardingLayout
      title={title}
      img={imgSrc}
      description={renderDescriptionFormated()}
      orderButtonLabel={t('orderButtonLabel')}
      orderHref={`${orderBaseURL}${ORDER_LINK}`}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={WEBSITE_LINK[ovhSubsidiary] || WEBSITE_LINK.DEFAULT}
    >
      {tileList.map((tile) => (
        <Card key={tile.id} href={tile.href} texts={tile.texts} />
      ))}
    </OnboardingLayout>
  );
}
