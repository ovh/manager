import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon, Spinner } from '@ovhcloud/ods-react';

import { useAcls } from '@/data/hooks/acl/useAcls';
import { useShareParams } from '@/hooks/useShareParams';

type TAclDatagridTopbarProps = {
  onAddClick: () => void;
  isButtonDisabled: boolean;
};

export const AclDatagridTopbar: FC<TAclDatagridTopbarProps> = ({
  onAddClick,
  isButtonDisabled,
}) => {
  const { t } = useTranslation('acl');
  const { region, shareId } = useShareParams();
  const { refetch, isFetching } = useAcls(region, shareId);

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="default" color="primary" onClick={onAddClick} disabled={isButtonDisabled}>
        <Icon name={ICON_NAME.plus} />
        {t('acl:add.label')}
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
