import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { service, renameNasha } from '../../../api/nasha-react';

function Informations(props: { serviceName: string }) {
  const { serviceName } = props;
  const [serviceRename, setServiceRename] = useState(serviceName);
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    service,
  );
  const { t } = useTranslation('nasha-react/details/dashboard');

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
      <div>
        <osds-text
          color="text"
          size="100"
          level="heading"
          hue="500"
          class="hydrated"
        >
          {t('nasha_dashboard_information_name')}
        </osds-text>
      </div>
      <div className="row">
        <div className="col">
          <osds-text
            color="text"
            size="100"
            level="heading"
            hue="500"
            class="hydrated"
          >
            {JSON.parse(JSON.stringify(data.serviceName))}
          </osds-text>
        </div>
        <div className="col-3">
          <osds-chip
            tabindex="-1"
            color="default"
            size="md"
            variant="stroked"
            class="hydrated"
          >
            <osds-link>
              <osds-icon
                name="ellipsis"
                size="xxs"
                color="primary"
                onClick={handleClickRename}
              ></osds-icon>
            </osds-link>
          </osds-chip>
        </div>
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
            {t('nasha_dashboard_information_id')}
          </osds-text>
        </div>
        <osds-text
          color="text"
          size="100"
          level="heading"
          hue="500"
          class="hydrated"
        >
          {JSON.parse(JSON.stringify(data.customName))}
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
            {t('nasha_dashboard_information_datacenter')}
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
            {t('nasha_dashboard_information_disk_type')}
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
            {t('nasha_dashboard_information_disk_size')}
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
      </div>
    </>
  );
}

export default Informations;
