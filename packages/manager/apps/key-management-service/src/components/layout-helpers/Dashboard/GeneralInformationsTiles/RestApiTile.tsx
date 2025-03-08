import {
  DashboardTile,
  DashboardTileBlockItem,
  Clipboard,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OKMS } from '@/types/okms.type';
import { REST_ENDPOINT_LABEL, SWAGGER_UI_LABEL } from './RestApiTile.constants';

type RestApiTileProps = {
  okmsData?: OKMS;
};

const RestApiTile = ({ okmsData }: RestApiTileProps) => {
  const { trackClick } = useOvhTracking();

  const items: DashboardTileBlockItem[] = [
    {
      id: 'restApi',
      label: REST_ENDPOINT_LABEL,
      value: (
        <Clipboard className="block w-full" value={okmsData?.restEndpoint} />
      ),
    },
    {
      id: 'swagger',
      label: SWAGGER_UI_LABEL,
      value: (
        <Links
          type={LinkType.external}
          href={okmsData?.swaggerEndpoint}
          onClickReturn={() =>
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.externalLink,
              actionType: 'navigation',
              actions: ['swagger-ui'],
            })
          }
          label={okmsData?.swaggerEndpoint}
        />
      ),
    },
  ];

  return <DashboardTile title="Rest API" items={items} />;
};

export default RestApiTile;
