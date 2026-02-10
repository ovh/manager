import { useNavigate } from 'react-router-dom';

import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/service-key/useServiceKeyTypeTranslations';
import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, BUTTON_VARIANT } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { ServiceKeyStatus } from '../service-key/service-key-status-badge/ServiceKeyStatusBadge.component';
import { SERVICE_KEY_LIST_CELL_TEST_IDS } from './ListingCells.constants';

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
      data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.name(props.id)}
    >
      {props?.name}
    </MukLink>
  );
};

export const DatagridServiceKeyCellId = (props: OkmsServiceKey) => {
  return (
    <Clipboard
      className="w-full"
      value={props.id}
      data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.keyId(props.id)}
    />
  );
};

export const DatagridCellType = (props: OkmsServiceKey) => {
  const translatedValue = useServiceKeyTypeTranslations(props.type);
  return (
    <Text preset="span" data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.type(props.id)}>
      {translatedValue}
    </Text>
  );
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

  return (
    <Text preset="span" data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.creationDate(props.id)}>
      {formattedDate}
    </Text>
  );
};

export const DatagridStatus = (props: OkmsServiceKey) => {
  return (
    <ServiceKeyStatus
      state={props.state}
      data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.status(props.id)}
    />
  );
};

export const DatagridServiceKeyActionMenu = (serviceKey: OkmsServiceKey, okms: OKMS) => {
  const actions = useServiceKeyActionsList(okms, serviceKey, 'list');

  // Add id and remove icon
  const actionsWithId = actions.map((action, index) => ({
    ...action,
    id: index,
    icon: undefined,
    'data-testid': action.buttonId,
  }));

  return (
    <div data-testid={SERVICE_KEY_LIST_CELL_TEST_IDS.actions(serviceKey.id)}>
      <ActionMenu
        id={`service-key-actions-${serviceKey.id}`}
        isCompact
        variant={BUTTON_VARIANT.ghost}
        items={actionsWithId}
      />
    </div>
  );
};
