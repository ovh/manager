import React from 'react';
import AssignTagButton from '@/components/assignTagsButton/assignTagsButton';
import TagsListFilter from '../tagsListFilter/tagsListFilter.component';

export default function TagsListTopbar() {
  const assignTag = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Assign tag');
  };

  return (
    <div className="flex justify-between w-full items-center mr-4">
      <AssignTagButton onClick={assignTag} />
      <TagsListFilter />
    </div>
  );
}
