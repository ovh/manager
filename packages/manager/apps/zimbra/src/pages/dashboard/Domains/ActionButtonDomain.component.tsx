import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DomainsItem } from './Domains';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import {
  DELETE_DOMAIN,
  DOMAIN_DIAGNOSTICS,
  EDIT_DOMAIN,
} from '@/tracking.constant';

interface ActionButtonDomainProps {
  domainItem: DomainsItem;
}
const ActionButtonDomain: React.FC<ActionButtonDomainProps> = ({
  domainItem,
}) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();

  const hrefDeleteDomain = useGenerateUrl(`./${domainItem.id}/delete`);

  const handleDeleteDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DELETE_DOMAIN],
    });
    navigate(hrefDeleteDomain);
  };

  const hrefEditDomain = useGenerateUrl(`./${domainItem.id}/edit`);

  const handleEditDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EDIT_DOMAIN],
    });
    navigate(hrefEditDomain);
  };

  const hrefDiagnosticsDomain = useGenerateUrl(
    `./${domainItem.id}/diagnostics/mx`,
  );

  const handleDiagnosticsDomainClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [DOMAIN_DIAGNOSTICS],
    });
    navigate(hrefDiagnosticsDomain);
  };

  const actionItems = [
    {
      id: 1,
      onclick: handleEditDomainClick,
      label: t('common:configure'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 2,
      onclick: handleDiagnosticsDomainClick,
      label: t('common:diagnostics'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 3,
      onclick: handleDeleteDomainClick,
      label: t('common:delete'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.delete],
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={domainItem.id}
      isDisabled={domainItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonDomain;
