import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { serviceInfos } from '../../../api/nasha-react';

function Subscriptions(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos', { serviceName }],
    serviceInfos,
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return (
      <span>Une erreur est surevenue lors du chargement des données...</span>
    );
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }
  return (
    <>
      <ul>
        {JSON.stringify(data)}
        <li>
          <div>
            <osds-text
              color="text"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Date de création:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.creation))}
          </osds-text>
        </li>
        <osds-divider
          color="default"
          size="6"
          class="hydrated"
          separator=""
        ></osds-divider>
        <li>
          <div>
            <osds-text
              color="text"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Date d'échéance:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.expiration))}
          </osds-text>
        </li>
        <osds-divider
          color="default"
          size="6"
          class="hydrated"
          separator=""
        ></osds-divider>
        <li>
          <div>
            <osds-text
              color="text"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Date d'échéance:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.expiration))}
          </osds-text>
        </li>
        <li>
          <osds-chip
            tabindex="-1"
            color="success"
            size="md"
            variant="flat"
            class="hydrated"
          >
            Automatic renewal
          </osds-chip>
        </li>
      </ul>
      <ul>
        <button>Configurer le renouvellement</button>
        <button>Anticiper le paiement</button>
        <button>Configurer le renouvellement</button>
      </ul>
    </>
  );
}

export default Subscriptions;
