import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { AliasItem } from './EmailAccountsAlias.page';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { EMAIL_ACCOUNT_DELETE_ALIAS } from '@/tracking.constant';

interface ActionButtonAliasAccountProps {
  aliasItem: AliasItem;
}

const ActionButtonAlias: React.FC<ActionButtonAliasAccountProps> = ({
  aliasItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');

  const hrefDeleteAlias = useGenerateUrl('./delete', 'path', {
    deleteAliasId: aliasItem.id,
    editEmailAccountId,
  });

  const handleDeleteAliasClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EMAIL_ACCOUNT_DELETE_ALIAS],
    });
    navigate(hrefDeleteAlias);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleDeleteAliasClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.alias.delete],
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

  return (
    <ActionMenu
      id={aliasItem.id}
      isDisabled={aliasItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonAlias;
