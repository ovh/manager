import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/pages/onboarding/useGuideUtils';
import onboardingImgSrc from './onboarding-img.png';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';

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
  const imgSrc = {
    src: onboardingImgSrc,
  };
  const [selectedRegion, setSelectedRegion] = React.useState('');

  return (
    <>
      <RegionSelector
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        regionList={[
          'eu-west-par',
          'eu-west-gra',
          'eu-west-rbx',
          'eu-west-sbg',
          'eu-west-lim',
          'eu-central-waw',
          'eu-west-eri',
          'us-east-vin',
          'us-west-hil',
          'ca-east-bhs',
          'ap-southeast-sgp',
          'ap-southeast-syd',
          'eu-west-rbx-snc',
          'eu-west-sbg-snc',
          'ca-east-tor',
          'ap-south-mum',
          'labeu-west-1-preprod',
          'labeu-west-1-dev-2',
          'labeu-west-1-dev-1',
          'eu-west-lz-bru',
          'eu-west-lz-mad',
          'eu-west-gra-snc',
          'us-east-lz-dal',
          'us-west-lz-lax',
          'us-east-lz-chi',
          'us-east-lz-nyc',
          'us-east-lz-mia',
          'us-west-lz-pao',
          'us-west-lz-den',
          'us-east-lz-atl',
          'eu-west-lz-mrs',
        ]}
      />
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={description}
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
