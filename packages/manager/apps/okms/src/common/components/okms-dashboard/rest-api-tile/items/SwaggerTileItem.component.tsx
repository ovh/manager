import { OKMS } from '@key-management-service/types/okms.type';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';

import { ExternalLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { SWAGGER_UI_LABEL } from '@/constants';

type SwaggerTileItemProps = {
  okms: OKMS;
};

export const SwaggerTileItem = ({ okms }: SwaggerTileItemProps) => {
  const { trackClick } = useOkmsTracking();

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={SWAGGER_UI_LABEL} />
      <Tile.Item.Description divider={false}>
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
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
