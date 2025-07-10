import {
  ManagerButton,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTagsForApi } from '@/utils/formatTagsForApi';
import { useUpdateIamResources } from '@/data/hooks/useIamResources';
import { useResourcesDatagridContext } from '@/components/resourcesDatagrid/ResourcesDatagridContext';

export type AssignTagTopbarProps = {
  tags: string[];
};

/** Should be use inside ResourceDatagridContext */
export default function AssignTagTopbar({ tags }: AssignTagTopbarProps) {
  const { t } = useTranslation('tag-manager');
  const { selectedResourcesList } = useResourcesDatagridContext();
  const { mutate: updateResource } = useUpdateIamResources();

  const onClick = () => {
    updateResource({
      resources: selectedResourcesList,
      tags: formatTagsForApi(tags),
    });
  };

  return (
    <ManagerButton
      id="assign-to-resource"
      label={t('assignToResources')}
      onClick={onClick}
      variant={ODS_BUTTON_VARIANT.default}
      icon={ODS_ICON_NAME.check}
      isDisabled={selectedResourcesList?.length === 0}
    />
  );
}
