import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  OnboardingLayout,
  Links,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsTable } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import useGuideUtils from '@/pages/onboarding/useGuideUtils';
import onboardingImgSrc from './onboarding-img.png';
import { urls } from '@/routes/routes.constant';
import { OnboardingIpOptions } from './onboardingIpOptionsAdvantages';
import { IpOptionRow } from './onboardingIpOptionRow';

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
            <OdsText preset={ODS_TEXT_PRESET.heading2}>{t('titleBis')}</OdsText>
            <OdsText className="block">{t('description')}</OdsText>

            <div className="mt-8">
              <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
                {t('advantagesTitle')}
              </OdsText>
              <div className="text-left mb-8">
                <ul className="list-disc pl-6 space-y-4">
                  <OnboardingIpOptions />
                  <li>
                    <OdsText
                      preset={ODS_TEXT_PRESET.heading5}
                      className="inline"
                    >
                      {t('advantage5Title')}:
                    </OdsText>
                    <OdsText className="inline">
                      {t('advantage5Description')}{' '}
                      <Links
                        href={link?.byoipLink}
                        label={t('learnMoreByoip')}
                      />
                    </OdsText>
                  </li>
                </ul>
              </div>

              <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
                {t('optionsTitle')}
              </OdsText>
              <OdsTable className="w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pl-4">
                        {t('optionsColumnFeature')}
                      </th>
                      <th className="text-left pl-4">
                        {t('optionsColumnIpv4')}
                      </th>
                      <th className="text-left pl-4">
                        {t('optionsColumnIpv6')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <IpOptionRow />
                  </tbody>
                </table>
              </OdsTable>
              <div className="mt-4 text-left">
                <OdsText preset={ODS_TEXT_PRESET.span}>
                  * {t('optionsFootnote')}
                </OdsText>
                <OdsText preset={ODS_TEXT_PRESET.span}>
                  ** {t('geolocationNote')}
                </OdsText>
              </div>

              <OdsText className="mt-4 text-left">
                {t('moreInfoText')}{' '}
                <Links
                  href={link?.presentationLink}
                  label={t('moreInfoProductPage')}
                />{' '}
                {t('moreInfoOr')}{' '}
                <Links
                  href={link?.documentationLink}
                  label={t('moreInfoDocPages')}
                />
                .
              </OdsText>
            </div>
          </div>
        }
        onOrderButtonClick={() => navigate(urls.order)}
        orderButtonLabel={t('orderButtonLabel')}
        moreInfoButtonLabel={t('byoipButtonLabel')}
        onmoreInfoButtonClick={() => navigate(urls.byoip)}
      >
        {tileList.map((tile) => (
          <Card key={tile.id} {...tile} />
        ))}
      </OnboardingLayout>
    </>
  );
}
