import React, { useState } from 'react';
import { TagsList, TagsModal } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { useServerUrl } from '@/hooks/useServerUrl';

export const TagsCell = (server: DedicatedServer) => {
  const [toggleModal, setTogglModal] = useState(false);
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
                setTogglModal(false);
                window.location.href = `${serverUrl}/tag-manager`;
              }}
              onCancel={() => {
                setTogglModal(false);
              }}
              isOpen={toggleModal}
            />
          )}
          <TagsList
            tags={server.iam?.tags}
            lineNumber={1}
            onClick={() => {
              setTogglModal(true);
            }}
          />
        </>
      )}
    </>
  );
};

export default TagsCell;
