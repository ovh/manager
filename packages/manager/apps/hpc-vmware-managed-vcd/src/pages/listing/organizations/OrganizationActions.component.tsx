import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { VCDOrganization } from '@ovh-ux/manager-module-vcd-api';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';
import { MessageOptions } from '@/context/Message.context';

export default function OrganizationActions({ id }: VCDOrganization) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const messageOptions: MessageOptions = {
    isDismissible: true,
  };

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('terminate'),
      onClick: () => {
        navigate(`${subRoutes.terminate}/${id}`, { state: { messageOptions } });
      },
      'data-testid': `terminate-cta-${id}`,
    },
  ];

  return (
    <ActionMenu
      id={`vcdActionMenu-${id}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
