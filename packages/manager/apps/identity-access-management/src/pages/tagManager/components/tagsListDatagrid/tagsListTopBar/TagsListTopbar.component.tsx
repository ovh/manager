import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import AssignTagButton from '@/components/assignTagsButton/AssignTagsButton.component';
import TagsListFilter from '../tagsListFilter/TagsListFilter.component';
import { useTagManagerContext } from '@/pages/tagManager/TagManagerContext';
import { urls } from '@/routes/routes.constant';

export default function TagsListTopbar() {
  const { selectedTagsList } = useTagManagerContext();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const assignTag = () => {
    trackClick({
      actionType: 'action',
      actions: ['page', ButtonType.button, 'assign-multiple_tag'],
    });
    navigate(urls.assignTag, {
      state: {
        tags: selectedTagsList.map((tag) => tag.name),
      },
    });
  };

  return (
    <div className="flex justify-between w-full items-center mr-4">
      <AssignTagButton
        onClick={assignTag}
        isDisabled={selectedTagsList.length === 0}
      />
      <TagsListFilter />
    </div>
  );
}
