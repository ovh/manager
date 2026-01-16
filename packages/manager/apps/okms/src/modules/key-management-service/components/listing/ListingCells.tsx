import { useNavigate } from 'react-router-dom';

import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/service-key/useServiceKeyTypeTranslations';
import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, BUTTON_VARIANT, ICON_NAME } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { ServiceKeyStatus } from '../service-key/service-key-status-badge/ServiceKeyStatusBadge.component';

export const DatagridServiceKeyCellName = (props: OkmsServiceKey) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  return (
    <MukLink
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['service-key'],
        });
        navigate(`${props?.id}`);
      }}
      data-testid={`service-key-link-${props.id}`}
    >
      {props?.name}
    </MukLink>
  );
};

export const DatagridServiceKeyCellId = (props: OkmsServiceKey) => {
  return <Clipboard className="w-full" value={props.id} />;
};

export const DatagridCellType = (props: OkmsServiceKey) => {
  const translatedValue = useServiceKeyTypeTranslations(props.type);
  return <DataGridTextCell>{translatedValue}</DataGridTextCell>;
};

export const DatagridCreationDate = (props: OkmsServiceKey) => {
  const date = new Date(Date.parse(props.createdAt));

  const formattedDate = useFormattedDate({
    date,
    options: {
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridStatus = (props: OkmsServiceKey) => {
  return <ServiceKeyStatus state={props.state} />;
};

export const DatagridServiceKeyActionMenu = (serviceKey: OkmsServiceKey, okms: OKMS) => {
  const actions = useServiceKeyActionsList(okms, serviceKey, 'list');

  // Add id and remove icon
  const actionsWithId = actions.map((action, index) => ({
    ...action,
    id: index,
    icon: undefined,
  }));

  return (
    <ActionMenu
      id={`service-key-actions-${serviceKey.id}`}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      icon={ICON_NAME.ellipsisVertical}
      items={actionsWithId}
    />
  );
};
