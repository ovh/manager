import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { isEditable, VrackServicesWithIAM } from '@/data';
import { urls } from '@/routes/routes.constants';
import { EndpointItem } from './useEndpointList.hook';

export const ActionCell: React.FC<{
  vs: VrackServicesWithIAM;
  endpoint: EndpointItem;
}> = ({ vs, endpoint }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/endpoints');
  const { trackClick } = useOvhTracking();
  const disabled = !isEditable(vs);
  return (
    <ActionMenu
      isCompact
      disabled={disabled}
      items={[
        {
          id: 0,
          label: t('action-editServiceDisplayName'),
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['edit-endpoints'],
            });
            navigate(
              urls.endpointsEdit
                .replace(':id', vs.id)
                .replace(':urn', endpoint.managedServiceURN),
            );
          },
        },
        {
          id: 1,
          label: t('action-deleteServiceEndpoint'),
          color: ODS_THEME_COLOR_INTENT.error,
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['delete-endpoints'],
            });
            navigate(
              urls.endpointsDelete
                .replace(':id', vs.id)
                .replace(':urn', endpoint.managedServiceURN),
            );
          },
        },
      ]}
    />
  );
};

export default ActionCell;
