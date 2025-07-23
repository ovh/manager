import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { FEATURE_AVAILABILITY, MAX_PRO_ACCOUNTS } from '@/constants';
import { ResourceStatus, ServiceBillingState, ZimbraPlanCodes } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import {
  CANCEL_SLOT,
  DELETE_EMAIL_ACCOUNT,
  EDIT_EMAIL_ACCOUNT,
  GO_EMAIL_ACCOUNT_ALIASES,
  UNDO_CANCEL_SLOT,
  UPGRADE_SLOT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { EmailAccountItem } from './EmailAccounts.types';

interface ActionButtonEmailAccountProps {
  item: EmailAccountItem;
}

export const ActionButtonEmailAccount: React.FC<ActionButtonEmailAccountProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const { proCount } = useAccountsStatistics();
  const { data: availability } = useFeatureAvailability([FEATURE_AVAILABILITY.PRO_BETA]);

  const hrefEditEmailAccount = useGenerateUrl(`./${item.id}/settings`, 'path');

  const handleEditEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_EMAIL_ACCOUNT],
    });
    navigate(hrefEditEmailAccount);
  };

  const hrefEmailAccountAliases = useGenerateUrl(`./${item.id}/aliases`, 'path');

  const handleEmailAliasesClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [GO_EMAIL_ACCOUNT_ALIASES],
    });
    navigate(hrefEmailAccountAliases);
  };

  const hrefDeleteEmailAccount = useGenerateUrl(`./${item.id}/delete`, 'path');

  const handleDeleteEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_EMAIL_ACCOUNT],
    });
    navigate(hrefDeleteEmailAccount);
  };

  const hrefCancelSlot = useGenerateUrl(`./slot/${item.slotId}/cancel`, 'path');

  const handleCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CANCEL_SLOT],
    });
    navigate(hrefCancelSlot);
  };

  const hrefUndoCancelSlot = useGenerateUrl(`./slot/${item.slotId}/undo_cancel`, 'path');

  const handleUndoCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UNDO_CANCEL_SLOT],
    });
    navigate(hrefUndoCancelSlot);
  };

  const hrefUpgradeEmailAccount = useGenerateUrl(`./slot/${item?.slotId}/upgrade`, 'path');

  const handleUpgradeEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UPGRADE_SLOT],
    });
    navigate(hrefUpgradeEmailAccount);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleEditEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t(`${NAMESPACES.ACTIONS}:modify`),
    },
    {
      id: 2,
      onClick: handleEmailAliasesClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.alias.get],
      label: t('alias'),
    },
    {
      id: 3,
      onClick: handleDeleteEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.delete],
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  if (item?.service?.state === ServiceBillingState.AUTOMATIC_RENEWAL) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t(`${NAMESPACES.ACTIONS}:terminate`),
      color: ODS_BUTTON_COLOR.critical,
    });
  }

  if (item?.service?.state === ServiceBillingState.CANCELATION_PLANNED) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleUndoCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('undo_cancel_slot'),
      color: ODS_BUTTON_COLOR.critical,
    });
  }

  if (
    availability?.[FEATURE_AVAILABILITY.PRO_BETA] &&
    item?.service?.planCode !== ZimbraPlanCodes.ZIMBRA_PRO &&
    proCount < MAX_PRO_ACCOUNTS
  ) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleUpgradeEmailClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('upgrade_pro'),
    });
  }

  return (
    <ActionMenu
      id={item.id}
      isDisabled={item.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonEmailAccount;
