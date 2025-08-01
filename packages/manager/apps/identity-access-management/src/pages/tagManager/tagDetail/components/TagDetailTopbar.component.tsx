import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useResourcesDatagridContext } from '@/components/resourcesDatagrid/ResourcesDatagridContext';

export type TagDetailTopbarProps = {
  tag?: string;
};

/** Should be use inside ResourceDatagridContext */
export default function TagDetailTopbar({ tag }: TagDetailTopbarProps) {
  const { t } = useTranslation('tag-manager');
  const { selectedResourcesList } = useResourcesDatagridContext();

  const onClickAssign = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Assign', tag);
  };

  const onClickUnassign = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Unassign', tag);
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
