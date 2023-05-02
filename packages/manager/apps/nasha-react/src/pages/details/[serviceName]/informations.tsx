import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { service, renameNasha } from '../../../api/nasha-react';

function Informations(props: { serviceName: string }) {
  const { serviceName } = props;
  const [serviceRename, setServiceRename] = useState(serviceName);
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    service,
  );

  const [redirectToError, setRedirectToError] = useState(false);
  const [redirectToSuccess, setRedirectToSuccess] = useState(false);

  if (redirectToError) {
    return <Navigate to="/404" />;
  }
  if (redirectToSuccess) {
    return (
      <>
        <osds-message
          tabindex="-1"
          color="success"
          icon=""
          class="hydrated"
          removable=""
          type="success"
        >
          Votre modification a été faite avec succes
        </osds-message>
      </>
    );
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    setRedirectToError(true);
  }

  const count = data?.length;
  if (count === 0) {
    setRedirectToError(true);
  }

  const handleClickRename = async () => {
    try {
      const response = await renameNasha({
        queryKey: [
          'renameService',
          {
            serviceName,
            data: { customName: serviceRename },
          },
        ],
      });

      console.info('Service renamed:', response);
      setRedirectToSuccess(true);
    } catch (error) {
      console.error('Error renaming service:', error);
      setRedirectToError(true);
    }
  };

  return (
    <>
      <ul>
        <li>
          <div>
            <osds-text
              color="text"
              size="100"
              level="heading"
              hue="500"
              class="hydrated"
            >
              Name:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.serviceName))}
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
              Service ID:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.customName))}
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
              Datacenter:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.datacenter))}
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
              Disk Type:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.diskType))}
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
              zpoolSize:
            </osds-text>
          </div>
          <osds-text
            color="default"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.zpoolSize))}
          </osds-text>
        </li>
      </ul>

      <ul>
        <div>
          <osds-input
            type="text"
            value={serviceRename}
            onChange={(e) => setServiceRename(e.target.value)}
          />
        </div>
        <div>
          <osds-button size="sm" color="primary" onClick={handleClickRename}>
            Modifier
          </osds-button>
        </div>
      </ul>
    </>
  );
}

export default Informations;
