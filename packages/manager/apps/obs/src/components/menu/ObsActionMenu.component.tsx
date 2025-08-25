import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ObsDashoboard } from '@ovh-ux/observability/src/types';

const ObsActionMenu = (props: ObsDashoboard) => {
  const { productType } = props;
  const { t } = useTranslation('dashboards');
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('obs_listing_visualize'),
      onClick: () => {
        const path = `${productType}`;
        navigate(path);
      },
    },
  ];

  return (
    <ActionMenu
      id={`ObsActionMenu-${productType}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};

export default ObsActionMenu;
