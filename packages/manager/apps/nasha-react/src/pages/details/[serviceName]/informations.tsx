import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsMessage,
  OsdsText,
  OsdsDivider,
  OsdsLink,
  OsdsSpinner,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';

import { service, renameNasha } from '@/api/nasha-react';
import ButtonTooltip from './buttonTooltip';

function Informations(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    service,
  );
  const { t } = useTranslation('nasha-react/details/dashboard');

  const [redirectToError, setRedirectToError] = useState(false);
  const [redirectToSuccess, setRedirectToSuccess] = useState(false);
  useEffect(() => {
    if (isError || data?.length === 0) {
      setRedirectToError(true);
    }
  }, [isError, data]);

  const handleClickRename = async () => {
    try {
      const response = await renameNasha({
        queryKey: [
          'renameService',
          {
            serviceName,
            data: { customName: renameNasha },
          },
        ],
      });

      setRedirectToSuccess(true);
    } catch (error) {
      setRedirectToError(true);
    }
  };

  if (isError || redirectToError) {
    return <Navigate to="/404" />;
  }

  if (redirectToSuccess) {
    return (
      <OsdsMessage color={OdsThemeColorIntent.success}>
        {t('nasha_dashboard_informations_success_message')}{' '}
      </OsdsMessage>
    );
  }

  if (isLoading) {
    return (
      <span>
        <OsdsSpinner />
      </span>
    );
  }

  const count = data?.length;
  if (count === 0) {
    setRedirectToError(true);
  }

  return (
    <>
      <OsdsText
        level={OdsThemeTypographyLevel.subheading}
        color={OdsThemeColorIntent.text}
      >
        {t('nasha_dashboard_information_name')}
      </OsdsText>
      <div className="buttonTooltipDashboard">
        <div className="elementTileLeft">
          <OsdsText color={OdsThemeColorIntent.text}>
            {JSON.parse(JSON.stringify(data.serviceName))}
          </OsdsText>
        </div>
        <div className="elementTileRight">
          <ButtonTooltip
            tooltipContent={[
              {
                label: (
                  <OsdsLink color={OdsThemeColorIntent.primary}>
                    {t('nasha_dashboard_informations_modification')}
                  </OsdsLink>
                ),
              },
            ]}
          />
        </div>
      </div>

      <OsdsDivider separator />

      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            {t('nasha_dashboard_information_id')}
          </OsdsText>
        </div>
        <OsdsText color={OdsThemeColorIntent.text}>
          {JSON.parse(JSON.stringify(data.customName))}
        </OsdsText>
        <OsdsDivider separator />
      </div>

      <div>
        <OsdsText
          level={OdsThemeTypographyLevel.subheading}
          color={OdsThemeColorIntent.text}
        >
          {t('nasha_dashboard_information_datacenter')}
        </OsdsText>
      </div>
      <div>
        <OsdsText color={OdsThemeColorIntent.text}>
          {JSON.parse(JSON.stringify(data.datacenter))}
        </OsdsText>
      </div>
      <OsdsDivider separator />

      <div>
        <OsdsText
          level={OdsThemeTypographyLevel.subheading}
          color={OdsThemeColorIntent.text}
        >
          {t('nasha_dashboard_information_disk_type')}
        </OsdsText>
      </div>
      <OsdsText color={OdsThemeColorIntent.text}>
        {JSON.parse(JSON.stringify(data.diskType))}
      </OsdsText>
      <OsdsDivider separator />

      <div>
        <OsdsText
          level={OdsThemeTypographyLevel.subheading}
          color={OdsThemeColorIntent.text}
        >
          {t('nasha_dashboard_information_disk_size')}
        </OsdsText>
      </div>
      <OsdsText color={OdsThemeColorIntent.text}>
        {JSON.parse(JSON.stringify(data.zpoolSize))}
      </OsdsText>
    </>
  );
}

export default Informations;
