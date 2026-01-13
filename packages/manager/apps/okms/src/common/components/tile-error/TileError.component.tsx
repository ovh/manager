import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

import { ErrorResponse } from '@/common/types/api.type';

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
      <Button onClick={onRetry}>{t('retry')}</Button>
    </div>
  );
};
