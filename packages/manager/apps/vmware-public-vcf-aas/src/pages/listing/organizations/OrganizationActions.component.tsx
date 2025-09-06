import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  isStatusTerminated,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';

export default function OrganizationActions({
  id,
  resourceStatus,
}: VCDOrganization) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();

  const isDisabled = isStatusTerminated(resourceStatus);

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('terminate'),
      isDisabled,
      onClick: () => {
        navigate(`${subRoutes.terminate}/${id}`);
      },
      'data-testid': `terminate-cta-${id}`,
    },
  ];

  return (
    <ActionMenu
      id={`vcdActionMenu-${id}`}
      isDisabled={isDisabled}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
