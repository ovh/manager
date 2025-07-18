import React, { useContext, useEffect } from 'react';
import AssignTagButton from '@/components/assignTagsButton/assignTagsButton';
import TagsListFilter from '../tagsListFilter/tagsListFilter.component';
import { TagManagerContext } from '@/pages/tagManager/tagsManagerContext';

export default function TagsListTopbar() {
  const { selectedTagsList } = useContext(TagManagerContext);

  const assignTag = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Assign tag');
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
