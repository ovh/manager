import React, { useState } from 'react';
import { TagsList, TagsModal } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DedicatedServer } from '@/data/types/server.type';
import { useServerUrl } from '@/hooks/useServerUrl';

export const TagsCell = (server: DedicatedServer) => {
  const [toggleModal, setTogglModal] = useState(false);
  const { trackClick } = useOvhTracking();
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
                actions: ['button', 'listing', 'all-tags'],
              });
              setTogglModal(true);
            }}
          />
        </>
      )}
    </>
  );
};

export default TagsCell;
