import { OKMS } from '@key-management-service/types/okms.type';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { SWAGGER_UI_LABEL } from '@/constants';

type SwaggerTileItemProps = {
  okms: OKMS;
};

export const SwaggerTileItem = ({ okms }: SwaggerTileItemProps) => {
  const { trackClick } = useOvhTracking();

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
