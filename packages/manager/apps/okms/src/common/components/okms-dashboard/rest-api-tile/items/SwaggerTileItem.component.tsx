import { OKMS } from '@key-management-service/types/okms.type';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { SWAGGER_UI_LABEL } from '@/constants';

type SwaggerTileItemProps = {
  okms: OKMS;
};

export const SwaggerTileItem = ({ okms }: SwaggerTileItemProps) => {
  const { trackClick } = useOkmsTracking();

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{SWAGGER_UI_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <Links
          className="block [&::part(link)]:flex"
          type={LinkType.external}
          href={okms.swaggerEndpoint}
          onClickReturn={() =>
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: ['swagger-ui'],
            })
          }
          label={okms.swaggerEndpoint}
          target="_blank"
        />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
