import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OsdsLink, OsdsButton } from '@ovhcloud/ods-components/react';
import {
  ActionMenu,
  ActionMenuItem,
  ManagerButton,
  DataGridTextCell,
} from '@ovhcloud/manager-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { VrackServicesWithIAM } from '@/api';
import { handleClick } from '@/utils/ods-utils';
import { isEditable, useUpdateVrackServices } from '@/utils/vs-utils';
import { urls } from '@/router/constants';

export const VrackId: React.FC<VrackServicesWithIAM & {
  hasMenu?: boolean;
}> = ({ hasMenu, ...vs }) => {
  const { t } = useTranslation('vrack-services/listing');
  const { t: tDashboard } = useTranslation('vrack-services/dashboard');
  const { shell } = React.useContext(ShellContext);
  const [vrackUrl, setVrackUrl] = React.useState('#');
  const { trackClick } = useOvhTracking();
  const { isPending } = useUpdateVrackServices({ key: vs.id });
  const editable = isEditable(vs);
  const navigate = useNavigate();

  React.useEffect(() => {
    shell.navigation
      .getURL('dedicated', `#/vrack/${vs?.currentState?.vrackId}`, {})
      .then(setVrackUrl);
  }, [vs?.currentState?.vrackId]);

  const menuItems: ActionMenuItem[] = [
    {
      id: 1,
      label: tDashboard('vrackActionDissociate'),
      onClick: () => {
        trackClick({
          location: PageLocation.tile,
          actionType: 'navigation',
          buttonType: ButtonType.button,
          actions: ['dissociate_vrack-services'],
        });
        navigate(
          urls.overviewDissociate
            .replace(':id', vs.id)
            .replace(':vrackId', vs.currentState.vrackId),
        );
      },
      action: 'vrackServices:apiovh:storageNetApp/detach',
      urn: vs.iam.urn,
    },
  ];

  if (vs.currentState.vrackId) {
    return (
      <>
        <div className="flex items-center">
          <div className="grow">
            {hasMenu ? (
              <OsdsLink href={vrackUrl} color={ODS_THEME_COLOR_INTENT.primary}>
                {vs.currentState.vrackId}
              </OsdsLink>
            ) : (
              <DataGridTextCell>{vs.currentState.vrackId}</DataGridTextCell>
            )}
          </div>
          {hasMenu && (
            <div className="flex-none">
              <ActionMenu isCompact items={menuItems} />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <ManagerButton
      urn={vs.iam.urn}
      action={'vrackServices:apiovh:vrack/attach'}
      inline
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.stroked}
      type={ODS_BUTTON_TYPE.button}
      size={ODS_BUTTON_SIZE.sm}
      disabled={isPending || !editable || undefined}
      {...handleClick(() => {
        trackClick({
          location: hasMenu ? PageLocation.tile : PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['associate_vrack-services'],
        });
        navigate(urls.listingAssociate.replace(':id', vs.id));
      })}
    >
      {t('associateVrackButtonLabel')}
    </ManagerButton>
  );
};
