import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorResponse } from '@/types/api.type';

type TileErrorProps = {
  error: ErrorResponse;
  onRetry: () => void;
};

export const TileError = ({ error, onRetry }: TileErrorProps) => {
  const { t } = useTranslation(NAMESPACES.ERROR);

  return (
    <div className="flex flex-col gap-4">
      <OdsMessage color="danger" isDismissible={false}>
        {t('error_message', { message: error?.response?.data?.message })}
      </OdsMessage>
      <OdsButton label={t('retry')} onClick={onRetry} />
    </div>
  );
};
