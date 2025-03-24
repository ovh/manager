import React from 'react';
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
import { isEditable } from '@/utils/vrack-services';

export type SubnetsActionCellProps = {
  vs: VrackServicesWithIAM;
  cidr: string;
};

export const SubnetsActionCell: React.FC<SubnetsActionCellProps> = ({
  vs,
  cidr,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/subnets');
  const { trackClick } = useOvhTracking();
  const disabled = !isEditable(vs);

  return (
    <ActionMenu
      isCompact
      disabled={disabled}
      items={[
        {
          id: 1,
          label: t('action-editSubnet'),
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['edit_subnets'],
            });
            navigate(
              urls.subnetsEdit
                .replace(':id', vs.id)
                .replace(':cidr', cidr.replace('/', '_')),
            );
          },
        },
        {
          id: 2,
          label: t('action-deleteSubnet'),
          color: ODS_THEME_COLOR_INTENT.error,
          onClick: () => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: ['delete-subnet'],
            });
            navigate(
              urls.subnetsDelete
                .replace(':id', vs.id)
                .replace(':cidr', cidr.replace('/', '_')),
            );
          },
        },
      ]}
    />
  );
};
