import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { urls } from '@/routes/routes.constants';
import { useVrackMenuItems } from '@/components/vrack-id/useVrackMenuItems.hook';
import { isEditable } from '@/utils/vrack-services';

export const ActionCell: React.FC<VrackServicesWithIAM> = (vs) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services');
  const { trackClick } = useOvhTracking();
  const vrackActionsMenuItems = useVrackMenuItems({ vs, isListing: true });

  const disabled = !isEditable(vs);
  const isVrackserviceAlreadyAssociated = useMemo<boolean>(
    () =>
      Boolean(
        vs?.currentState?.subnets &&
          vs?.currentState?.subnets[0]?.serviceEndpoints.length > 0,
      ),
    [vs],
  );

  return (
    <ActionMenu
      isCompact
      items={[
        {
          id: 0,
          label: t('action-goDetails'),
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['details_vrack-services'],
            });
            navigate(urls.overview.replace(':id', vs.id));
          },
        },
        {
          id: 1,
          label: t('action-editDisplayName'),
          disabled,
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['edit_vrack-services'],
            });
            navigate(urls.listingEdit.replace(':id', vs.id));
          },
        },
        ...vrackActionsMenuItems,
        {
          id: 2,
          label: t('action-deleteVrackServices'),
          disabled: disabled || isVrackserviceAlreadyAssociated,
          color: ODS_THEME_COLOR_INTENT.error,
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['delete_vrack-services'],
            });
            navigate(urls.listingDelete.replace(':id', vs.id));
          },
        },
      ]}
    />
  );
};

export default ActionCell;
