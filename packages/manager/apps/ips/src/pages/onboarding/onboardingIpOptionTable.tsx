import React from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Table, Link, Text } from '@ovhcloud/ods-react';

import { PriceDescription } from '@/components/PriceDescription/PriceDescription';
import { useCatalogLowestPrice } from '@/data/hooks/catalog';
import { useGuideUtils } from '@/utils';

interface IpOptionRowProps {
  feature: string;
  ipv4: React.ReactNode;
  ipv6: React.ReactNode;
}
interface BulletPointListProps {
  content: string;
  feature: string;
}

const BulletPointList = ({ content, feature }: BulletPointListProps) => {
  return content
    ?.split('\n')
    .map((line: string) => <div key={`${feature}-${line}`}>{`• ${line}`}</div>);
};

export function IpOptionTable() {
  const { t } = useTranslation('onboarding');
  const { t: tOrder } = useTranslation('order');
  const { ipv4LowestPrice, ipv6LowestPrice } = useCatalogLowestPrice();
  const { links } = useGuideUtils();
  const optionList = [
    {
      feature: t('optionsAddressTypes'),
      ipv4: (
        <BulletPointList
          content={t('optionsAddressTypesIpv4')}
          feature={t('optionsAddressTypes')}
        />
      ),
      ipv6: (
        <BulletPointList
          content={t('optionsAddressTypesIpv6')}
          feature={t('optionsAddressTypes')}
        />
      ),
    },
    {
      feature: t('optionsModes'),
      ipv4: (
        <BulletPointList
          content={t('optionsModesIpv4')}
          feature={t('optionsModes')}
        />
      ),
      ipv6: (
        <BulletPointList
          content={t('optionsModesIpv6')}
          feature={t('optionsModes')}
        />
      ),
    },
    {
      feature: t('optionsGeolocation'),
      ipv4: t('optionsGeolocationIpv4'),
      ipv6: t('optionsGeolocationIpv6'),
    },
    {
      feature: t('optionsCost'),
      ipv4: (
        <PriceDescription
          shouldOverrideStyle={true}
          isStartingPrice
          price={ipv4LowestPrice}
          suffix={tOrder('per_ip')}
        />
      ),
      ipv6: <PriceDescription price={ipv6LowestPrice} shouldOverrideStyle />,
    },
    {
      feature: t('optionsCompatibleServices'),
      ipv4: (
        <BulletPointList
          content={t('optionsCompatibleServicesIpv4')}
          feature={t('optionsCompatibleServices')}
        />
      ),
      ipv6: (
        <BulletPointList
          content={t('optionsCompatibleServicesIpv6')}
          feature={t('optionsCompatibleServices')}
        />
      ),
    },
    {
      feature: t('optionsAvailability'),
      ipv4: t('optionsAvailabilityIpv4'),
      ipv6: (
        <>
          {t('optionsAvailabilityCheck')}{' '}
          <Link
            href={links?.presentationLink?.link}
            target="_blank"
            rel="noopener"
          >
            {t('optionsAvailabilityHere')}
          </Link>
        </>
      ),
    },
    {
      feature: t('optionsByoip'),
      ipv4: t('optionsByoipIpv4'),
      ipv6: t('optionsByoipIpv6'),
    },
  ];
  return (
    <>
      <Text preset={TEXT_PRESET.heading3} className="mb-4">
        {t('optionsTitle')}
      </Text>
      <Table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="pl-4 text-left">{t('optionsColumnFeature')}</th>
            <th className="pl-4 text-left">{t('optionsColumnIpv4')}</th>
            <th className="pl-4 text-left">{t('optionsColumnIpv6')}</th>
          </tr>
        </thead>
        <tbody>
          {optionList.map((option: IpOptionRowProps) => (
            <tr
              key={`${option.feature}`}
              className="border border-solid border-[--ods-color-blue-200]"
            >
              <td className="pl-4 text-left">{option.feature}</td>
              <td className="whitespace-pre-line pl-4 text-left">
                {option.ipv4}
              </td>
              <td className="whitespace-pre-line pl-4 text-left">
                {option.ipv6}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default IpOptionTable;
