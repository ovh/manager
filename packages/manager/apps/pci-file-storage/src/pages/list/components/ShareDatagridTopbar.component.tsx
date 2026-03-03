import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon, Spinner } from '@ovhcloud/ods-react';

import { subRoutes } from '@/routes/Routes.constants';

export type ShareDatagridTopbarProps = {
  refetch: () => void;
  isFetching: boolean;
};

export const ShareDatagridTopbar: React.FC<ShareDatagridTopbarProps> = ({
  refetch,
  isFetching,
}) => {
  const { t } = useTranslation(['list']);
  const navigate = useNavigate();

  return (
    <div className="align-items-center flex justify-between">
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
        id="reload-button"
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
