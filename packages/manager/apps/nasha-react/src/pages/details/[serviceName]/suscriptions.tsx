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
  const count = data?.length;
  if (count === 0) {
    return <></>;
  }

  if (isLoading) return <span>Loading...</span>;
  if (isError)
    return (
      <span>Une erreur est survenue lors du chargement des données...</span>
    );

  const {
    creation,
    expiration,
    engagedUpTo,
    renew,
    contactAdmin,
    contactTech,
    contactBilling,
  } = data || {};

  const optionsDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const dateCreation = creation
    ? new Date(creation).toLocaleDateString(undefined, optionsDate)
    : '';
  const dateExpiration = expiration
    ? new Date(expiration).toLocaleDateString(undefined, optionsDate)
    : '';
  const dateEngagementUpTo = engagedUpTo
    ? new Date(engagedUpTo).toLocaleDateString(undefined, optionsDate)
    : '';

  let engagedUpToContent;
  if (!dateEngagementUpTo || dateEngagementUpTo === 'Invalid Date') {
    engagedUpToContent = (
      <div>
        <osds-chip color="accent" size="sm" variant="flat">
          Aucun engagement
        </osds-chip>
        <osds-divider color="default" size="1" />
      </div>
    );
  } else if (dateEngagementUpTo) {
    engagedUpToContent = (
      <div>
        <osds-text color="default" size="100" level="heading" hue="500">
          Terminé le {dateEngagementUpTo}
        </osds-text>
        <osds-divider color="default" size="1" />
      </div>
    );
  }

  return (
    <>
      <div className="element">
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
            level="body"
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
            level="body"
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
          {renew.manualPayment && (
            <div>
              <osds-chip
                tabindex="-1"
                color="warning"
                size="sm"
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
          {!renew.manualPayment && renew.automatic && (
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
      <div className="element">
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
        {engagedUpToContent}
      </div>
      <div className="element">
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
          <div>{contactAdmin} Administrateur</div>
          <div>{contactTech} Technique</div>
          <div>{contactBilling} Facturation</div>
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
