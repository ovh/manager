import React, { useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { OdsInput } from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ListingContext } from '@/pages/listing/listingContext';
import { handleEnterAndEscapeKeyDown } from '@/utils';

export const IpFilter = ({ className }: { className?: string }) => {
  const { setApiFilter, apiFilter } = useContext(ListingContext);
  const { t } = useTranslation('listing');
  const { trackClick } = useOvhTracking();
  const [inputValue, setInputValue] = useState<string>(apiFilter?.ip || '');

  React.useEffect(() => {
    setInputValue(apiFilter?.ip || '');
  }, [apiFilter?.ip]);

  const onSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['filter_ip'],
    });
    setApiFilter((prev) => ({
      ...prev,
      ip: inputValue,
    }));
  };

  const onClear = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['filter_ip'],
    });
    setApiFilter((prev) => ({
      ...prev,
      ip: undefined,
    }));
  };

  React.useEffect(() => {
    if (inputValue) {
      setInputValue((prev) => prev.replace(/[^0-9,./:a-fA-F]/g, '') || '');
    }
  }, [inputValue]);

  return (
    <form className={className} onSubmit={onSubmit}>
      <OdsInput
        className="w-full"
        data-testid="search-ip"
        name="search-ip"
        type={ODS_INPUT_TYPE.search}
        onOdsChange={(e) => setInputValue(e.detail.value as string)}
        value={inputValue}
        isClearable
        placeholder={t('listingFilterIp')}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: onSubmit,
          onEscape: onClear,
        })}
        onOdsClear={onClear}
      />
    </form>
  );
};
