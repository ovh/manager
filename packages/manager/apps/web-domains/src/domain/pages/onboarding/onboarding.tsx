import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  Breadcrumb,
} from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import useGuideUtils from '@/alldoms/hooks/guide/useGuideUtils';
import onboardingImgSrc from './onboarding-img.png';

import appConfig from '@/web-domains.config';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('guide1Title'),
        description: t('guide1Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink1,
    },
    {
      id: 2,
      texts: {
        title: t('guide2Title'),
        description: t('guide2Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink2,
    },
    {
      id: 3,
      texts: {
        title: t('guide3Title'),
        description: t('guide3Description'),
        category: t('guideCategory'),
      },
      href: link?.guideLink3,
    },
  ];

  const title: string = t('title');
  const description: string = t('description');
  const renderDescriptionFormated = () => {
    return (
      <>
        <Text>{description.split('*')[0]}</Text>
        <ul>
          {description.split('*').map((i) => {
            return (
              <Text key={i}>
                <li>{i}</li>
              </Text>
            );
          })}
        </ul>
      </>
    );
  };
  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <>
      <Breadcrumb
        rootLabel={t('title')}
        appName={appConfig.rootLabel}
        hideRootLabel
      />
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={renderDescriptionFormated()}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref={t('orderButtonLink')}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={t('moreInfoButtonLink')}
      >
        {tileList.map((tile) => (
          <Card key={tile.id} href={tile.href} texts={tile.texts} />
        ))}
      </OnboardingLayout>
    </>
  );
}
