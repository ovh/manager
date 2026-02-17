import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon, Spinner } from '@ovhcloud/ods-react';

import { useShares } from '@/data/hooks/shares/useShares';
import { subRoutes } from '@/routes/Routes.constants';

export const ShareDatagridTopbar: React.FC = () => {
  const { t } = useTranslation(['list']);
  const navigate = useNavigate();

  const { refetch, isFetching } = useShares();

  return (
    <div className="-mr-6 flex justify-between">
      <Button color="primary" type="button" onClick={() => navigate(`./${subRoutes.create}`)}>
        <Icon name={ICON_NAME.plus} />
        {t('list:actionButton')}
      </Button>
      <Button
        color="primary"
        variant="outline"
        type="button"
        onClick={() => void refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <Spinner size="sm" />
        ) : (
          <Icon name={ICON_NAME.refresh} className="text-[24px]" />
        )}
      </Button>
    </div>
  );
};
