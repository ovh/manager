import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignTagButton from '@/components/assignTagsButton/assignTagsButton';
import TagsListFilter from '../tagsListFilter/tagsListFilter.component';
import { TagManagerContext } from '@/pages/tagManager/tagsManagerContext';
import { urls } from '@/routes/routes.constant';

export default function TagsListTopbar() {
  const { selectedTagsList } = useContext(TagManagerContext);
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
