import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

type TAclDatagridTopbarProps = {
  onAddClick: () => void;
  isButtonDisabled: boolean;
};

export const AclDatagridTopbar: FC<TAclDatagridTopbarProps> = ({
  onAddClick,
  isButtonDisabled,
}) => {
  const { t } = useTranslation('acl');

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="default" color="primary" onClick={onAddClick} disabled={isButtonDisabled}>
        <Icon name={ICON_NAME.plus} />
        {t('acl:add.label')}
      </Button>
    </div>
  );
};
