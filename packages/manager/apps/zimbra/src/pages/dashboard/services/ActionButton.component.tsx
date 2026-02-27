import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { ResourceStatus, ServiceBillingState } from '@/data/api';
import { SlotWithService, usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import {
  CANCEL_SLOT,
  CONFIGURE_SLOT,
  DELETE_EMAIL_ACCOUNT,
  EDIT_EMAIL_ACCOUNT,
  GO_EMAIL_ACCOUNT_ALIASES,
  UNDO_CANCEL_SLOT,
  UPDATE_OFFER_SLOT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

interface ActionButtonServiceProps {
  item: SlotWithService;
}

interface ActionItem {
  id: number;
  onClick: () => void;
  urn: string;
  iamActions: string[];
  label: string;
  color?: BUTTON_COLOR;
}

export const ActionButtonService: React.FC<ActionButtonServiceProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefEditService = useGenerateUrl(
    item.accountId
      ? `../email_accounts/${item.accountId}/settings`
      : `../email_accounts/add?slotId=${item.id}`,
    'path',
  );

  const handleEditServiceClick = () => {
    const action = item.accountId ? EDIT_EMAIL_ACCOUNT : CONFIGURE_SLOT;
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [action],
    });
    navigate(hrefEditService);
  };

  const hrefEmailAccountAliases = useGenerateUrl(
    `../email_accounts/${item.accountId}/aliases`,
    'path',
  );

  const handleEmailAliasesClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [GO_EMAIL_ACCOUNT_ALIASES],
    });
    navigate(hrefEmailAccountAliases);
  };

  const hrefDeleteEmailAccount = useGenerateUrl(
    `../email_accounts/${item.accountId}/delete`,
    'path',
  );

  const handleDeleteEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_EMAIL_ACCOUNT],
    });
    navigate(hrefDeleteEmailAccount);
  };

  const hrefCancelSlot = useGenerateUrl(`../email_accounts/slot/${item.id}/cancel`, 'path');

  const handleCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CANCEL_SLOT],
    });
    navigate(hrefCancelSlot);
  };

  const hrefUndoCancelSlot = useGenerateUrl(
    `../email_accounts/slot/${item.id}/undo_cancel`,
    'path',
  );

  const handleUndoCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UNDO_CANCEL_SLOT],
    });
    navigate(hrefUndoCancelSlot);
  };

  const hrefUpdateOfferServiceAccount = useGenerateUrl(
    `../email_accounts/slot/${item.id}/update_offer`,
    'path',
  );

  const handleUpdateOfferServiceClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UPDATE_OFFER_SLOT],
    });
    navigate(hrefUpdateOfferServiceAccount);
  };

  const actionItems: ActionItem[] = [
    {
      id: 1,
      onClick: handleEditServiceClick,
      urn: platformUrn,
      iamActions: [item.accountId ? IAM_ACTIONS.account.edit : IAM_ACTIONS.slot.get],
      label: item.accountId ? t(`${NAMESPACES.ACTIONS}:modify`) : t('configure_account'),
    },
    {
      id: 2,
      onClick: handleUpdateOfferServiceClick,
      urn: platformUrn,
      iamActions: [item.accountId ? IAM_ACTIONS.account.edit : IAM_ACTIONS.slot.get],
      label: t('update_offer'),
    },
  ];

  if (item.status === ResourceStatus.READY) {
    actionItems.push(
      {
        id: 3,
        onClick: handleEmailAliasesClick,
        urn: platformUrn,
        iamActions: [IAM_ACTIONS.alias.get],
        label: t('alias'),
      },
      {
        id: 4,
        onClick: handleDeleteEmailClick,
        urn: platformUrn,
        iamActions: [IAM_ACTIONS.account.delete],
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        color: BUTTON_COLOR.critical,
      },
    );
  }

  if (item?.service?.state === ServiceBillingState.AUTOMATIC_RENEWAL) {
    actionItems.push({
      id: 5,
      onClick: handleCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t(`${NAMESPACES.ACTIONS}:terminate`),
      color: BUTTON_COLOR.critical,
    });
  }

  if (item?.service?.state === ServiceBillingState.CANCELATION_PLANNED) {
    actionItems.push({
      id: 6,
      onClick: handleUndoCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('undo_cancel_slot'),
      color: BUTTON_COLOR.critical,
    });
  }

  return <ActionMenu id={item.id} items={actionItems} variant={BUTTON_VARIANT.ghost} isCompact />;
};

export default ActionButtonService;
