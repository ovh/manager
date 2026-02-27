import React, { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { useVrackMenuItems } from '@/components/vrack-id/useVrackMenuItems.hook';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { isEditable } from '@/utils/vrack-services';

export const ActionCell = (vs: VrackServicesWithIAM) => {
  const navigate = useNavigate();
  const { t } = useTranslation([TRANSLATION_NAMESPACES.common, NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const vrackActionsMenuItems = useVrackMenuItems({ vs, isListing: true });

  const isDisabled = !isEditable(vs);
  const isVrackserviceAlreadyAssociated = useMemo<boolean>(
    () =>
      Boolean(
        vs?.currentState?.subnets &&
          vs.currentState.subnets.length > 0 &&
          vs.currentState.subnets[0]?.serviceEndpoints &&
          vs.currentState.subnets[0].serviceEndpoints.length > 0,
      ),
    [vs],
  );

  return (
    <ActionMenu
      id={`action-menu-${vs.id}`}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      items={[
        {
          id: 0,
          label: t('see_details', { ns: NAMESPACES.ACTIONS }),
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
          isDisabled,
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
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          isDisabled: isDisabled || isVrackserviceAlreadyAssociated,
          color: BUTTON_COLOR.critical,
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
