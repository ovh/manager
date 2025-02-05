import React, { useContext, useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  OdsInputCustomEvent,
  OdsInputChangeEventDetail,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ListingContext } from '@/pages/listing/listingContext';

/**
 * Component to filter ip by name
 * @param setIpToSearch set parent ip to search
 * @returns React component
 */
export const IpFilter = () => {
  const { setIpToSearch } = useContext(ListingContext);
  const { t } = useTranslation('listing');
  const [inputValue, setInputValue] = useState<string>();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIpToSearch(inputValue);
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <OdsInput
        name="search-ip"
        type={ODS_INPUT_TYPE.search}
        onOdsChange={(e: OdsInputCustomEvent<OdsInputChangeEventDetail>) => {
          setInputValue(e.target.value as string);
        }}
        placeholder={t('listingFilterIp')}
      ></OdsInput>
    </form>
  );
};
