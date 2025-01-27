import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  Links,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';

import useGuideUtils from '@/pages/onboarding/useGuideUtils';
import onboardingImgSrc from './onboarding-img.png';
import { urls } from '@/routes/routes.constant';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();

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

  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <>
      <OnboardingLayout
        title={t('title')}
        img={imgSrc}
        description={
          <div className="text-center">
            <OdsText preset={ODS_TEXT_PRESET.heading2}>{t('titlebis')}</OdsText>
            <OdsText className="block">{t('description')}</OdsText>
            <div>
              <ul className="mt-2 text-sm text-center w-[10%] mx-auto">
                <li>{t('ip_onboarding_content_list_item_1')}</li>
                <li>{t('ip_onboarding_content_list_item_2')}</li>
              </ul>
            </div>
            <OdsText className="w-[78%] mt-4">
              <span>{t('descriptionBis')}</span>
              <Links
                href={link.presentationLink}
                label={link.presentationLink}
              ></Links>
            </OdsText>
          </div>
        }
        onOrderButtonClick={() => navigate(urls.order)}
        orderButtonLabel={t('orderButtonLabel')}
        moreInfoButtonLabel={t('boyipButtonLabel')}
        onmoreInfoButtonClick={() => navigate(urls.byoip)}
      >
        {tileList.map((tile) => (
          <Card key={tile.id} {...tile} />
        ))}
      </OnboardingLayout>
    </>
  );
}
