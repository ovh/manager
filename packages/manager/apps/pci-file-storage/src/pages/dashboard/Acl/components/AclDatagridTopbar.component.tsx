import React from 'react';
import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const AclDatagridTopbar: FC = () => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="default" color="primary">
        <Icon name={ICON_NAME.plus} />
        {t('acl:add.label')}
      </Button>
    </div>
  );
};
