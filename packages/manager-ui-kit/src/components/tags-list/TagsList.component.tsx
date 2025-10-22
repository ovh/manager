import { FC, Suspense, lazy, useMemo, useState } from 'react';

import { TagsListProps } from './TagsList.props';
import { filterTags } from './TagsList.utils';
import { TagsStack } from './tags-stack/TagsStack.component';

const TagsModal = lazy(() => import('./tags-modal/TagsModal.component'));

export const TagsList: FC<TagsListProps> = ({
  tags,
  displayInternalTags = false,
  maxLines,
  modalHeading,
  onEditTags,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const filteredTags: string[] = useMemo(
    () => filterTags({ tags, displayInternalTags }),
    [tags, displayInternalTags],
  );

  return (
    <>
      <TagsStack
        tags={filteredTags}
        maxLines={maxLines}
        onClick={() => {
          setOpen(true);
        }}
      />
      {open && modalHeading && (
        <Suspense>
          <TagsModal
            tags={filteredTags}
            heading={modalHeading}
            open={open}
            {...(onEditTags && {
              onEditTags: () => {
                onEditTags();
                setOpen(false);
              },
            })}
            onCancel={() => setOpen(false)}
            onOpenChange={(detail) => {
              setOpen(detail?.open ?? false);
            }}
          />
        </Suspense>
      )}
    </>
  );
};
