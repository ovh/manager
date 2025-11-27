import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, ActionMenuItemProps } from '@ovh-ux/muk';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { DELETE_DOMAIN, DOMAIN_DIAGNOSTICS, EDIT_DOMAIN } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { DomainItem } from './Domains.types';

interface ActionButtonDomainProps {
  item: DomainItem;
}

export const ActionButtonDomain: React.FC<ActionButtonDomainProps> = ({ item }) => {
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();

  const hrefDeleteDomain = useGenerateUrl(`./${item.id}/delete`);

  const handleDeleteDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_DOMAIN],
    });
    navigate(hrefDeleteDomain);
  };

  const hrefEditDomain = useGenerateUrl(`./${item.id}/edit`);

  const handleEditDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_DOMAIN],
    });
    navigate(hrefEditDomain);
  };

  const hrefDiagnosticsDomain = useGenerateUrl(`./${item.id}/diagnostics/mx`);

  const handleDiagnosticsDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DOMAIN_DIAGNOSTICS],
    });
    navigate(hrefDiagnosticsDomain);
  };

  const actionItems: ActionMenuItemProps[] = [
    {
      id: 1,
      onClick: handleEditDomainClick,
      label: t(`${NAMESPACES.ACTIONS}:configure`),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 2,
      onClick: handleDiagnosticsDomainClick,
      label: t('common:diagnostics'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 3,
      onClick: handleDeleteDomainClick,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.delete],
      color: BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={item.id}
      isDisabled={item.status !== ResourceStatus.READY}
      items={actionItems}
      variant={BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonDomain;
