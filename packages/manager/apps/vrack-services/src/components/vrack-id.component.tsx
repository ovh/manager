import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovhcloud/manager-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { VrackServicesWithIAM, isEditable } from '@/api';
import { urls } from '@/router/constants';

export const useVrackMenuItems = (
  vs: VrackServicesWithIAM,
  isListing?: boolean,
): ActionMenuItem[] => {
  const { t } = useTranslation('vrack-services');
  const { trackClick } = useOvhTracking();
  const editable = isEditable(vs);
  const navigate = useNavigate();
  const disabled = !editable;
  const vrackId = vs?.currentState?.vrackId;

  return [
    !vrackId && {
      id: 4,
      label: t('associateVrackButtonLabel'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['associate_vrack-services'],
        });
        navigate(
          (isListing ? urls.listingAssociate : urls.overviewAssociate).replace(
            ':id',
            vs.id,
          ),
        );
      },
    },
    vrackId && {
      id: 5,
      label: t('vrackActionAssociateToAnother'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['associate-another_vrack-services'],
        });
        navigate(
          (isListing
            ? urls.listingAssociateAnother
            : urls.overviewAssociateAnother
          )
            .replace(':id', vs.id)
            .replace(':vrackId', vs.currentState.vrackId),
        );
      },
    },
    vrackId && {
      id: 6,
      label: t('vrackActionDissociate'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['dissociate_vrack-services'],
        });
        navigate(
          (isListing ? urls.listingDissociate : urls.overviewDissociate)
            .replace(':id', vs.id)
            .replace(':vrackId', vs.currentState.vrackId),
        );
      },
    },
  ].filter(Boolean);
};

export const VrackId: React.FC<VrackServicesWithIAM & {
  isListing?: boolean;
}> = ({ isListing, ...vs }) => {
  const { shell } = React.useContext(ShellContext);
  const [vrackUrl, setVrackUrl] = React.useState('#');
  const vrackId = vs?.currentState?.vrackId;
  const menuItems = useVrackMenuItems(vs, isListing);

  React.useEffect(() => {
    if (vrackId) {
      shell.navigation
        .getURL('dedicated', `#/vrack/${vrackId}`, {})
        .then(setVrackUrl);
    }
  }, [vrackId]);

  return isListing ? (
    <DataGridTextCell>{vs.currentState.vrackId}</DataGridTextCell>
  ) : (
    <div className="flex items-center">
      <div className="grow">
        {vrackId ? (
          <OsdsLink href={vrackUrl} color={ODS_THEME_COLOR_INTENT.primary}>
            {vrackId}
          </OsdsLink>
        ) : (
          <DataGridTextCell>{vrackId}</DataGridTextCell>
        )}
      </div>
      <div className="flex-none">
        <ActionMenu isCompact items={menuItems} disabled={!isEditable(vs)} />
      </div>
    </div>
  );
};
