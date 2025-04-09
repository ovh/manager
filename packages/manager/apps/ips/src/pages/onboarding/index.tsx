import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Card,
  OnboardingLayout,
  Links,
  Price,
  IntervalUnitType,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsTable } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';

import useGuideUtils from '@/pages/onboarding/useGuideUtils';
import onboardingImgSrc from './onboarding-img.png';
import { urls } from '@/routes/routes.constant';
import { useCatalogLowestPrice } from '@/data/hooks/catalog';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const { t: tCommon, i18n } = useTranslation();
  const { environment } = React.useContext(ShellContext);
  const link = useGuideUtils();
  const { ipv4LowestPrice, ipv6LowestPrice } = useCatalogLowestPrice();
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

  const IP_OPTIONS_ROWS = [
    {
      feature: t('optionsAddressTypes'),
      ipv4: t('optionsAddressTypesIpv4'),
      ipv6: t('optionsAddressTypesIpv6'),
    },
    {
      feature: t('optionsModes'),
      ipv4: t('optionsModesIpv4'),
      ipv6: t('optionsModesIpv6'),
    },
    {
      feature: t('optionsGeolocation'),
      ipv4: t('optionsGeolocationIpv4'),
      ipv6: t('optionsGeolocationIpv6'),
    },
    {
      feature: t('optionsCost'),
      ipv4: (
        <Price
          isStartingPrice
          suffix={tCommon('per_ip')}
          value={ipv4LowestPrice}
          tax={0}
          intervalUnit={IntervalUnitType.month}
          ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
          locale={i18n.language}
          freePriceLabel={tCommon('free_price')}
        />
      ),
      ipv6: (
        <Price
          isStartingPrice
          suffix={tCommon('per_ip')}
          value={ipv6LowestPrice}
          tax={0}
          intervalUnit={IntervalUnitType.month}
          ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
          locale={i18n.language}
          freePriceLabel={tCommon('free_price')}
        />
      ),
    },
    {
      feature: t('optionsCompatibleServices'),
      ipv4: t('optionsCompatibleServicesIpv4'),
      ipv6: t('optionsCompatibleServicesIpv6'),
    },
    {
      feature: t('optionsAvailability'),
      ipv4: t('optionsAvailabilityIpv4'),
      ipv6: (
        <>
          {t('optionsAvailabilityCheck')}{' '}
          <Links
            href={link?.presentationLink}
            label={t('optionsAvailabilityHere')}
          />
        </>
      ),
    },
    {
      feature: t('optionsByoip'),
      ipv4: t('optionsByoipIpv4'),
      ipv6: t('optionsByoipIpv6'),
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
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>{t('advantage1Title')}:</strong>{' '}
                    {t('advantage1Description')}
                  </li>
                  <li>
                    <strong>{t('advantage2Title')}:</strong>{' '}
                    {t('advantage2Description')}
                  </li>
                  <li>
                    <strong>{t('advantage3Title')}:</strong>{' '}
                    {t('advantage3Description')}
                  </li>
                  <li>
                    <strong>{t('advantage4Title')}:</strong>{' '}
                    {t('advantage4Description')}
                  </li>
                  <li>
                    <strong>{t('advantage5Title')}:</strong>{' '}
                    {t('advantage5Description')}{' '}
                    <Links
                      href="https://www.ovhcloud.com/en-ie/network/byoip/"
                      label={t('learnMoreByoip')}
                    />
                  </li>
                </ol>
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
                    {IP_OPTIONS_ROWS.map((row, index) => (
                      <tr
                        key={index}
                        className="border-solid border-[1px] border-[--ods-color-blue-200]"
                      >
                        <td className="text-left pl-4">{row.feature}</td>
                        <td
                          className="text-left pl-4"
                          style={{ whiteSpace: 'pre-line' }}
                        >
                          {row.ipv4}
                        </td>
                        <td
                          className="text-left pl-4"
                          style={{ whiteSpace: 'pre-line' }}
                        >
                          {row.ipv6}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </OdsTable>
              <div className="mt-4 text-left text-xs">
                <div className="mb-2">* {t('optionsFootnote')}</div>
                <div>** {t('geolocationNote')}</div>
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
