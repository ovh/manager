import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { serviceInfos } from '../../../api/nasha-react';
// import { createPath } from 'react-router-dom';

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

  const dataCreation = new Date(data.creation);
  const dataExpiration = new Date(data.expiration);
  const dataEngagedUpTo = new Date(data.engagedUpTo);

  const optionsDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateCreation = dataCreation
    ? dataCreation.toLocaleDateString(undefined, optionsDate)
    : '';
  const dateExpiration = dataExpiration
    ? dataExpiration.toLocaleDateString(undefined, optionsDate)
    : '';
  const dateEngagementUpTo = dataEngagedUpTo
    ? dataEngagedUpTo.toLocaleDateString(undefined, optionsDate)
    : '';

  return (
    <>
      <div>
        <div>
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
            Le {dateCreation}
          </osds-text>
        </div>
        <osds-divider
          color="default"
          size="1"
          class="hydrated"
          separator=""
        ></osds-divider>
        <div>
          <div>
            <osds-text
              color="text"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Prochaine échéance:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            Le {dateExpiration}
          </osds-text>
          <osds-divider
            color="default"
            size="1"
            class="hydrated"
            separator=""
          ></osds-divider>
        </div>
        <div>
          {data.renew.manualPayment && (
            <div>
              <osds-chip
                tabindex="-1"
                color="warning"
                size="md"
                variant="flat"
                class="hydrated"
              >
                Renouvellement manuel
              </osds-chip>
              <div>
                <osds-link
                  color="primary"
                  href=""
                  rel=""
                  target="_self"
                  class="hydrated"
                >
                  <span slot="start"></span>
                  S'engager
                  <span slot="end">
                    <osds-icon
                      name="arrow-right"
                      size="xs"
                      color="primary"
                      aria-hidden=""
                      alt=""
                      aria-name=""
                      class="hydrated"
                    ></osds-icon>
                  </span>
                </osds-link>
                <osds-divider
                  color="default"
                  size="1"
                  class="hydrated"
                  separator=""
                ></osds-divider>
              </div>
            </div>
          )}
          {!data.renew.manualPayment && data.renew.automatic && (
            <div>
              <osds-chip
                tabindex="-1"
                color="success"
                size="md"
                variant="flat"
                class="hydrated"
              >
                Renouvellement automatique
              </osds-chip>
              <osds-divider
                color="default"
                size="1"
                class="hydrated"
                separator=""
              ></osds-divider>
            </div>
          )}
        </div>
      </div>
      <div>
        <div>
          <osds-text
            color="text"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            Engagement:
          </osds-text>
        </div>
        {!dateEngagementUpTo ? (
          <div>
            <osds-chip
              tabindex="-1"
              color="accent"
              size="md"
              variant="flat"
              class="hydrated"
            >
              Aucun
            </osds-chip>
            <osds-divider
              color="default"
              size="1"
              class="hydrated"
              separator=""
            ></osds-divider>
          </div>
        ) : (
          <div>
            <osds-text
              color="default"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Terminé le {dateEngagementUpTo}
            </osds-text>
            <osds-divider
              color="default"
              size="1"
              class="hydrated"
              separator=""
            ></osds-divider>
          </div>
        )}
      </div>
      <div>
        <div>
          <osds-text
            color="text"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            Contacts:
          </osds-text>
        </div>
        <osds-text
          color="default"
          size="100"
          level="heading"
          hue="500"
          class="hydrated"
        >
          <div>
            {JSON.parse(JSON.stringify(data.contactAdmin))} Administrateur
          </div>
          <div>{JSON.parse(JSON.stringify(data.contactTech))} Technique</div>
          <div>
            {JSON.parse(JSON.stringify(data.contactBilling))} Facturation
          </div>
        </osds-text>
        <osds-link
          color="primary"
          href=""
          rel=""
          target="_self"
          class="hydrated"
        >
          <span slot="start"></span>
          Gérer les contacts
          <span slot="end">
            <osds-icon
              name="arrow-right"
              size="xs"
              color="primary"
              aria-hidden=""
              alt=""
              aria-name=""
              class="hydrated"
            ></osds-icon>
          </span>
        </osds-link>
      </div>
    </>
  );
}

export default Subscriptions;
