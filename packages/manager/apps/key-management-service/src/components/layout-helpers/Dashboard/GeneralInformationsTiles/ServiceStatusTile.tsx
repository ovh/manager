import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KMSServiceInfos } from '@/types/okmsService.type';
import { OkmsServiceState } from '../okmsServiceState/OkmsServiceState.component';

type ServiceStatusTileProps = {
  okmsService?: KMSServiceInfos;
};

const ServiceStatusTile = ({ okmsService }: ServiceStatusTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <OsdsTile className="w-full h-fit flex-col" inline rounded>
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('service_status')}
        </OsdsText>
        <OsdsDivider separator />
        <div className="flex flex-col mb-3">
          <OsdsText
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_state')}
          </OsdsText>
          <span>
            <OkmsServiceState state={okmsService?.resource.state} inline />
          </span>
        </div>
      </div>
    </OsdsTile>
  );
};

export default ServiceStatusTile;
