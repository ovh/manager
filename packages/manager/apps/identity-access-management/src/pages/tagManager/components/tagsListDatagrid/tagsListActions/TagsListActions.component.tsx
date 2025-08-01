import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import { urls } from '@/routes/routes.constant';

export default function TagsListActions(item: IamTagListItem) {
  const { t } = useTranslation('tag-manager');
  const navigate = useNavigate();

  const assignTag = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Assign tag');
  };

  const manageResources = () => {
    navigate(urls.tagDetail.replace(':tag', item.name));
  };

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('manageResources'),
      onClick: manageResources,
    },
    {
      id: 2,
      label: t('assignToResources'),
      onClick: assignTag,
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
