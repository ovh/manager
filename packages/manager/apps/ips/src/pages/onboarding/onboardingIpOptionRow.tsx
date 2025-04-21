import React from 'react';
import { useTranslation } from 'react-i18next';
import { Links } from '@ovh-ux/manager-react-components';
import { PriceDescription } from '@/components/PriceDescription/PriceDescription';
import { useCatalogLowestPrice } from '@/data/hooks/catalog';
import useGuideUtils from '@/pages/onboarding/useGuideUtils';

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

export function IpOptionRow() {
  const { t } = useTranslation('onboarding');
  const { t: tOrder } = useTranslation('order');
  const { ipv4LowestPrice, ipv6LowestPrice } = useCatalogLowestPrice();
  const link = useGuideUtils();
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
  return (
    <>
      {optionList.map((option: IpOptionRowProps) => (
        <tr
          key={`${option.feature}`}
          className="border-solid border-[1px] border-[--ods-color-blue-200]"
        >
          <td className="text-left pl-4">{option.feature}</td>
          <td className="text-left pl-4 whitespace-pre-line">{option.ipv4}</td>
          <td className="text-left pl-4 whitespace-pre-line">{option.ipv6}</td>
        </tr>
      ))}
    </>
  );
}

export default IpOptionRow;
