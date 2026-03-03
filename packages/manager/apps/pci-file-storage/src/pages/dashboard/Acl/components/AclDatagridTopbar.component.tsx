import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, ICON_NAME, Icon, Spinner } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

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
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);
  const { region, shareId } = useShareParams();
  const { refetch, isFetching } = useAcls(region, shareId);

  return (
    <div className="flex w-auto shrink-0 items-center gap-4">
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
