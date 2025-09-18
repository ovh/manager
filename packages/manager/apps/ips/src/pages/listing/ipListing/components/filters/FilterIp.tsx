import React, { useContext, useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ListingContext } from '@/pages/listing/listingContext';

export const IpFilter = ({ className }: { className?: string }) => {
  const { setApiFilter, apiFilter } = useContext(ListingContext);
  const { t } = useTranslation('listing');
  const [inputValue, setInputValue] = useState<string>(apiFilter?.ip || '');

  React.useEffect(() => {
    setInputValue(apiFilter?.ip || '');
  }, [apiFilter?.ip]);

  const onSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setApiFilter((prev) => ({
      ...prev,
      ip: inputValue,
    }));
  };

  return (
    <form className={className} onSubmit={onSubmit}>
      <OdsInput
        className="w-full"
        data-testid="search-ip"
        name="search-ip"
        type={ODS_INPUT_TYPE.search}
        onOdsChange={(e) => setInputValue(e.target.value as string)}
        value={inputValue}
        isClearable
        placeholder={t('listingFilterIp')}
        onOdsClear={() => {
          setApiFilter((prev) => ({
            ...prev,
            ip: undefined,
          }));
        }}
      />
    </form>
  );
};
