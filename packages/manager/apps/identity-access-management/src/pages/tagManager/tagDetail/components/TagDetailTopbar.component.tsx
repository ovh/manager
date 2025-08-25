import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useResourcesDatagridContext } from '@/components/resourcesDatagrid/ResourcesDatagridContext';
import { urls } from '@/routes/routes.constant';

export type TagDetailTopbarProps = {
  tag?: string;
};

/** Should be use inside ResourceDatagridContext */
export default function TagDetailTopbar({ tag }: TagDetailTopbarProps) {
  const { t } = useTranslation('tag-manager');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { selectedResourcesList } = useResourcesDatagridContext();

  const onClickAssign = () => {
    trackClick({
      actionType: 'action',
      actions: ['page', ButtonType.button, 'assign-ressource'],
    });
    navigate(urls.tagDetailAssign.replace(':tag', tag));
  };

  const onClickUnassign = () => {
    trackClick({
      actionType: 'action',
      actions: ['page', ButtonType.button, 'unassign_tag'],
    });
    navigate(urls.tagdetailUnassign.replace(':tag', tag), {
      state: {
        resources: selectedResourcesList,
      },
    });
  };

  return (
    <div className="flex gap-4">
      <ManagerButton
        id="assign-tag"
        label={t('assignTag')}
        onClick={onClickAssign}
        variant={ODS_BUTTON_VARIANT.default}
        icon={ODS_ICON_NAME.plus}
        isDisabled={selectedResourcesList?.length > 0}
      />
      <ManagerButton
        id="unassign-tag"
        label={t('unassignTag')}
        onClick={onClickUnassign}
        variant={ODS_BUTTON_VARIANT.outline}
        icon={ODS_ICON_NAME.xmark}
        isDisabled={selectedResourcesList?.length === 0}
      />
    </div>
  );
}
