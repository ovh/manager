import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { IamResource } from '@/data/api/iam-resources';
import { useResourcesDatagridContext } from '@/components/resourcesDatagrid/ResourcesDatagridContext';

export type TagDetailActionsProps = {
  item: IamResource;
  tag: string;
};

export default function TagDetailActions({ item, tag }: TagDetailActionsProps) {
  const { t } = useTranslation('tag-manager');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { selectedResourcesList } = useResourcesDatagridContext();

  const unassignTag = () => {
    trackClick({
      actionType: 'action',
      actions: ['datagrid', ButtonType.button, 'unassign_tag'],
    });
    navigate(urls.tagdetailUnassign.replace(':tag', tag), {
      state: {
        resources: [item],
      },
    });
  };

  const isMenuDisabled = useMemo(() => {
    if (selectedResourcesList?.length === 0) return false;
    return !(
      selectedResourcesList?.length === 1 &&
      selectedResourcesList.find(({ urn }) => urn === item.urn)
    );
  }, [selectedResourcesList]);

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('unassignAction'),
      onClick: unassignTag,
      isDisabled: isMenuDisabled,
    },
  ];

  return (
    <div className="flex justify-end">
      <ActionMenu
        items={items}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
        id={`actions-${item.name}`}
      />
    </div>
  );
}
