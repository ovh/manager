import React, { useState } from 'react';
import {
  ButtonType,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { TagsModal } from '../tags-modal';
import { TagsList } from '../tags-list';

export type DatagridTagsCellProps = {
  editTagsPageUrl?: string;
  tags: Record<string, string>;
  resourceName: string;
  displayInternalTags?: boolean;
};

export const DatagridTagsCell = ({
  tags,
  resourceName,
  editTagsPageUrl,
  displayInternalTags,
}: DatagridTagsCellProps) => {
  const [toggleModal, setToggleModal] = useState(false);
  const { trackClick, trackPage } = useOvhTracking();

  if (!tags) return <></>;

  return (
    <>
      {Object.keys(tags).length > 0 && (
        <>
          {toggleModal && (
            <TagsModal
              displayName={resourceName}
              tags={tags}
              displayInternalTags={displayInternalTags}
              {...(editTagsPageUrl && {
                onEditTags: () => {
                  trackClick({
                    actionType: 'action',
                    actions: ['pop-up', 'edit-tags'],
                  });
                  setToggleModal(false);
                  window.location.href = editTagsPageUrl;
                },
              })}
              onCancel={() => {
                trackClick({
                  actionType: 'action',
                  actions: ['pop-up', 'cancel'],
                });
                setToggleModal(false);
              }}
              isOpen={toggleModal}
            />
          )}
          <TagsList
            tags={tags}
            lineNumber={1}
            displayInternalTags={displayInternalTags}
            onClick={() => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                actions: ['datagrid', ButtonType.button, 'edit-tags'],
              });
              setToggleModal(true);
              trackPage({
                pageType: PageType.popup,
                pageName: 'edit-tags',
              });
            }}
          />
        </>
      )}
    </>
  );
};

export default DatagridTagsCell;
