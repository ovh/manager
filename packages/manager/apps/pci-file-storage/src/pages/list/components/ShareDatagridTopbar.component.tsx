import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { subRoutes } from '@/routes/Routes.constants';

export const ShareDatagridTopbar: React.FC = () => {
  const { t } = useTranslation(['list']);
  const navigate = useNavigate();

  return (
    <Button color="primary" variant="default" onClick={() => navigate(`./${subRoutes.create}`)}>
      <Icon name={ICON_NAME.plus} />
      {t('list:actionButton')}
    </Button>
  );
};
