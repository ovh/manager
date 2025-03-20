import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { urls } from '@/routes/routes.constants';
import { EndpointItem } from './useEndpointList.hook';
import { isEditable } from '@/utils/vrack-services';

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
      id={`endpoint-menu-${vs.id}`}
      isCompact
      isDisabled={disabled}
      variant={ODS_BUTTON_VARIANT.ghost}
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
          color: ODS_BUTTON_COLOR.critical,
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
