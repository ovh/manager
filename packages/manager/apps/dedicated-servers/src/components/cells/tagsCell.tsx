import React from 'react';
import { TagsList } from '@ovh-ux/muk';
import {
  ButtonType,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useServerUrl } from '@/hooks/useServerUrl';
import { DedicatedServer } from '@/data/types/server.type';

export const TagsCell = (server: DedicatedServer) => {
  const { trackClick, trackPage } = useOvhTracking();
  const serverUrl = useServerUrl(server);
  return (
    <>
      {server.iam?.tags && Object.keys(server.iam?.tags).length > 0 && (
        <>
          <TagsList
            tags={server.iam?.tags}
            modalHeading={server?.iam?.displayName}
            maxLines={1}
            lineNumber={1}
            onEditTags={() => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                actions: ['datagrid', ButtonType.button, 'edit-tags'],
              });
              window.location.href = `${serverUrl}/tag-manager`;
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
