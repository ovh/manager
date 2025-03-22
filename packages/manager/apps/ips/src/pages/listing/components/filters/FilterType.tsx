import React, { useContext } from 'react';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IpTypeEnum } from '@/data/api';
import { ListingContext } from '@/pages/listing/listingContext';

/**
 * Component to filter ip by name
 * @param ipList the ip list
 * @returns React component
 */
export const TypeFilter = () => {
  const { t } = useTranslation('listing');
  const { apiFilter, setApiFilter } = useContext(ListingContext);

  return (
    <OdsSelect
      className="m-2"
      name="search-type"
      data-testid="search-type"
      onOdsChange={(e: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => {
        setApiFilter({ ...apiFilter, type: e.target.value as IpTypeEnum });
      }}
      placeholder={t('listingFilterType')}
    >
      {Object.values(IpTypeEnum).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </OdsSelect>
  );
};
