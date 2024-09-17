import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import vmwareBroadcomOVHCloud from '@/assets/VmwareBroadcomxOVHcloud.svg';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('managed_vcd_onboarding_guide1_title'),
        description: t('managed_vcd_onboarding_guide1_description'),
        category: t('managed_vcd_onboarding_guide1_category').toUpperCase(),
      },
      href: link?.guideLink1,
      hrefLabel: t('managed_vcd_onboarding_guide1_link'),
    },
    {
      id: 2,
      texts: {
        title: t('managed_vcd_onboarding_guide2_title'),
        description: t('managed_vcd_onboarding_guide2_description'),
        category: t('managed_vcd_onboarding_guide2_category').toUpperCase(),
      },
      href: link?.guideLink2,
      hrefLabel: t('managed_vcd_onboarding_guide2_link'),
    },
    {
      id: 3,
      texts: {
        title: t('managed_vcd_onboarding_guide3_title'),
        description: t('managed_vcd_onboarding_guide3_description'),
        category: t('managed_vcd_onboarding_guide3_category').toUpperCase(),
      },
      href: link?.guideLink3,
      hrefLabel: t('managed_vcd_onboarding_guide3_link'),
    },
  ];

  const description: React.ReactNode = (
    <>
      <p>{t('managed_vcd_onboarding_description_part1')}</p>
      {t('managed_vcd_onboarding_description_part2')}
    </>
  );
  const imgSrc = {
    src: vmwareBroadcomOVHCloud,
  };

  return (
    <div className="pt-8">
      <OnboardingLayout
        title="Managed VMware Cloud Director"
        img={imgSrc}
        description={description}
      >
        {tileList.map((tile) => (
          <Card
            key={tile.id}
            href={tile.href}
            texts={tile.texts}
            hrefLabel={tile.hrefLabel}
          />
        ))}
      </OnboardingLayout>
    </div>
  );
}
