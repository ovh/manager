import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

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
      <Message color="critical" dismissible={false}>
        {t('error_message', { message: error?.response?.data?.message })}
      </Message>
      <Button onClick={onRetry}>{t('retry')}</Button>
    </div>
  );
};
