import { OKMS } from '@key-management-service/types/okms.type';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { ExternalLink } from '@/common/components/link/Link.component';
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
        <ExternalLink
          className="block [&::part(link)]:flex"
          href={okms.swaggerEndpoint}
          onClick={() =>
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: ['swagger-ui'],
            })
          }
        >
          {okms.swaggerEndpoint}
        </ExternalLink>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
