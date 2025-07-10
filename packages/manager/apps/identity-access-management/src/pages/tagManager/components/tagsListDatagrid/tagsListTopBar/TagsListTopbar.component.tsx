import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssignTagButton from '@/components/assignTagsButton/AssignTagsButton.component';
import TagsListFilter from '../tagsListFilter/TagsListFilter.component';
import { useTagManagerContext } from '@/pages/tagManager/TagManagerContext';
import { urls } from '@/routes/routes.constant';

export default function TagsListTopbar() {
  const { selectedTagsList } = useTagManagerContext();
  const navigate = useNavigate();
  const assignTag = () => {
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
