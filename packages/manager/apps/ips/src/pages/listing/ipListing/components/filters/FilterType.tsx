import React, { useContext } from 'react';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { IpTypeEnum } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';

const ALL_IP_TYPE_OPTION_VALUE = 'all';

const excludedTypes = [
  IpTypeEnum.CDN,
  IpTypeEnum.HOSTED_SSL,
  IpTypeEnum.HOUSING,
  IpTypeEnum.MAIL,
  IpTypeEnum.PRIVATE,
  IpTypeEnum.VPN,
  IpTypeEnum.PCI,
];

/**
 * Component to filter ip by IP Type
 */
export const TypeFilter = ({ className }: { className?: string }) => {
  const { t } = useTranslation('listing');
  const { apiFilter, setApiFilter } = useContext(ListingContext);

  return (
    <OdsSelect
      className={className}
      name="search-type"
      data-testid="search-type"
      value={apiFilter?.type || ALL_IP_TYPE_OPTION_VALUE}
      onOdsChange={(e) => {
        const { value } = e.detail;
        setApiFilter((prev) => ({
          ...prev,
          type:
            value === ALL_IP_TYPE_OPTION_VALUE
              ? undefined
              : (value as IpTypeEnum),
        }));
      }}
    >
      <option value={ALL_IP_TYPE_OPTION_VALUE}>
        {t('listingFilterTypeAllTypes')}
      </option>
      {Object.values(IpTypeEnum)
        .filter((type) => !excludedTypes.includes(type))
        .map((value) => (
          <option key={value} value={value}>
            {t(`listingColumnsType_${value}`)}
          </option>
        ))}
    </OdsSelect>
  );
};
