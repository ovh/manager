import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovhcloud/manager-components';
import { isEditable, VrackServicesWithIAM } from '@/api';
import { urls } from '@/router/constants';
import { useVrackMenuItems } from '@/components/vrack-id.component';
import iamActions from '@/utils/iam.action';

export const ActionCell: React.FC<VrackServicesWithIAM> = (vs) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/listing');
  const { trackClick } = useOvhTracking();
  const vrackActionsMenuItems = useVrackMenuItems(vs, true);

  const disabled = !isEditable(vs);

  return (
    <ActionMenu
      isCompact
      items={[
        {
          id: 0,
          label: t('manage'),
          disabled,
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
          label: t('edit'),
          disabled,
          urn: vs.iam.urn,
          iamActions: [
            iamActions.account_services_edit,
            iamActions.account_services_get,
          ],
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
          label: t('delete'),
          disabled,
          urn: vs.iam.urn,
          iamActions: [
            iamActions.account_services_terminate,
            iamActions.account_services_get,
          ],
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
