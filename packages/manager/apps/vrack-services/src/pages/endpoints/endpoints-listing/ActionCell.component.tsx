import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { isEditable } from '@/utils/vrack-services';

import { EndpointItem } from './useEndpointList.hook';

export const ActionCell: React.FC<{
  vs: VrackServicesWithIAM;
  endpoint: EndpointItem;
}> = ({ vs, endpoint }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.endpoints);
  const { trackClick } = useOvhTracking();
  const disabled = !isEditable(vs);
  return (
    <ActionMenu
      id={`endpoint-menu-${vs.id}`}
      isCompact
      isDisabled={disabled}
      variant={BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('action-deleteServiceEndpoint'),
          color: BUTTON_COLOR.critical,
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
                .replace(':urn', endpoint.managedServiceURN || ''),
            );
          },
        },
      ]}
    />
  );
};

export default ActionCell;
