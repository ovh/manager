import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import { urls } from '@/routes/routes.constant';
import { useTagManagerContext } from '@/pages/tagManager/TagManagerContext';

export default function TagsListActions(item: IamTagListItem) {
  const { t } = useTranslation('tag-manager');
  const navigate = useNavigate();
  const { selectedTagsList } = useTagManagerContext();

  const assignTag = () => {
    navigate(urls.tagDetailAssign.replace(':tag', item.name));
  };

  const manageResources = () => {
    navigate(urls.tagDetail.replace(':tag', item.name));
  };

  const isMenuDisabled = useMemo(() => {
    if (selectedTagsList?.length === 0) return false;
    if (
      selectedTagsList?.length === 1 &&
      selectedTagsList.find((tag) => tag.name === item.name)
    )
      return false;

    return true;
  }, [selectedTagsList]);

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('manageResources'),
      onClick: manageResources,
      isDisabled: isMenuDisabled,
    },
    {
      id: 2,
      label: t('assignToResources'),
      onClick: assignTag,
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
