import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import vmwareBroadcomOVHCloud from '@/assets/VmwareBroadcomxOVHcloud.svg?url';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { TRACKING } from '@/tracking.constants';
import { DISCOVER_VCD_REDIRECTION_URL } from '@/utils/discoverVcdRedirection.constants';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '@/utils/label.constants';
import { ORDER_VCD_REDIRECTION_URL } from '@/utils/orderVcdRedirection.constants';

export default function Onboarding() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS]);
  const { t: tOnBoarding } = useTranslation(NAMESPACES.ONBOARDING);

  const link = useGuideUtils();
  const { trackClick } = useOvhTracking();
  const { ovhSubsidiary } = useContext(ShellContext)?.environment?.getUser() || {};

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('managed_vcd_onboarding_guide1_title', {
          productName: VMWARE_CLOUD_DIRECTOR_LABEL,
        }),
        description: t('managed_vcd_onboarding_guide1_description', {
          productName: VMWARE_CLOUD_DIRECTOR_LABEL,
        }),
        category: t('managed_vcd_onboarding_guide1_category').toUpperCase(),
      },
      href: link?.discover,
      hrefLabel: tOnBoarding('find_out_more'),
      tracking: 'guide_discover',
    },
    {
      id: 2,
      texts: {
        title: t('managed_vcd_onboarding_guide2_title', {
          productName: VMWARE_CLOUD_DIRECTOR_LABEL,
        }),
        description: t('managed_vcd_onboarding_guide2_description'),
        category: t('managed_vcd_onboarding_guide2_category').toUpperCase(),
      },
      href: link?.tutorial,
      hrefLabel: t('managed_vcd_onboarding_guide2_link'),
      tracking: 'guide_tutorial',
    },
    {
      id: 3,
      texts: {
        title: tOnBoarding('faq'),
        description: tOnBoarding('find_out_more_faq'),
        category: t('managed_vcd_onboarding_guide3_category').toUpperCase(),
      },
      href: link?.faq,
      hrefLabel: tOnBoarding('browse_faq'),
      tracking: 'guide_FAQ',
    },
  ];

  const description: React.ReactNode = (
    <OdsText className="text-center">
      <p>
        {t('managed_vcd_onboarding_description_part1', {
          productName: VMWARE_CLOUD_DIRECTOR_LABEL,
        })}
      </p>
      {t('managed_vcd_onboarding_description_part2')}
    </OdsText>
  );
  const imgSrc = {
    src: vmwareBroadcomOVHCloud,
  };

  return (
    <div className="pt-8">
      <OnboardingLayout
        title={VMWARE_CLOUD_DIRECTOR_LABEL}
        img={imgSrc}
        description={description}
        orderButtonLabel={t(`${NAMESPACES.ACTIONS}:order`)}
        onOrderButtonClick={() => {
          trackClick(TRACKING.common.order);
          window.open(
            ORDER_VCD_REDIRECTION_URL[ovhSubsidiary] || ORDER_VCD_REDIRECTION_URL.DEFAULT,
            '_blank',
          );
        }}
        moreInfoButtonLabel={t(`${NAMESPACES.ACTIONS}:discover`)}
        onMoreInfoButtonClick={() => {
          window.open(
            DISCOVER_VCD_REDIRECTION_URL[ovhSubsidiary] || DISCOVER_VCD_REDIRECTION_URL.DEFAULT,
            '_blank',
          );
        }}
      >
        {tileList.map((tile) =>
          tile.href ? (
            <Card
              key={tile.id}
              href={tile.href}
              texts={tile.texts}
              hrefLabel={tile.hrefLabel}
              onClick={() => trackClick(TRACKING.onboarding.guideClick(tile.tracking))}
            />
          ) : null,
        )}
      </OnboardingLayout>
    </div>
  );
}
