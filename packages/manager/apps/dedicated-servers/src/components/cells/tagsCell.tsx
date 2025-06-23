import React, { useState } from 'react';
import { TagsList, TagsModal } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DedicatedServer } from '@/data/types/server.type';
import { useServerUrl } from '@/hooks/useServerUrl';

export const TagsCell = (server: DedicatedServer) => {
  const [toggleModal, setTogglModal] = useState(false);
  const { trackClick, trackPage } = useOvhTracking();
  const serverUrl = useServerUrl(server);
  return (
    <>
      {server.iam?.tags && Object.keys(server.iam?.tags).length > 0 && (
        <>
          {toggleModal && (
            <TagsModal
              displayName={server?.iam?.displayName}
              tags={server.iam?.tags}
              onEditTags={() => {
                trackClick({
                  actionType: 'action',
                  actions: ['pop-up', 'edit-tags'],
                });
                setTogglModal(false);
                window.location.href = `${serverUrl}/tag-manager`;
              }}
              onCancel={() => {
                trackClick({
                  actionType: 'action',
                  actions: ['pop-up', 'cancel'],
                });
                setTogglModal(false);
              }}
              isOpen={toggleModal}
            />
          )}
          <TagsList
            tags={server.iam?.tags}
            lineNumber={1}
            onClick={() => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                actions: ['datagrid', ButtonType.button, 'edit-tags'],
              });
              setTogglModal(true);
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

export default TagsCell;
