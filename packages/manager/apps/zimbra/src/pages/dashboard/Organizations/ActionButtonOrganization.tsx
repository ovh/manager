import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import Modal, { ModalType } from '@/components/Modals/Modal';
import { usePlatform } from '@/hooks';
import { OrganizationItem } from './Organizations';
import {
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api';
import { deleteZimbraPlatformOrganization } from '@/api/DELETE/apiv2/services';

interface ActionButtonOrganizationProps {
  organizationItem: OrganizationItem;
  onDeleteSuccessCallback?: (error?: any) => void;
}

export const ActionButtonOrganization: React.FC<ActionButtonOrganizationProps> = ({
  organizationItem,
  onDeleteSuccessCallback,
}) => {
  const { t } = useTranslation('organisations');
  const { platformId } = usePlatform();
  const { data } = useQuery({
    queryKey: getZimbraPlatformDomainsQueryKey(
      platformId,
      organizationItem?.id,
    ),
    queryFn: () => getZimbraPlatformDomains(platformId, organizationItem?.id),
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const handleDeleteClick = () => {
    deleteZimbraPlatformOrganization(platformId, organizationItem?.id)
      .then(() => {
        onDeleteSuccessCallback?.();
        setModalOpen(false);
      })
      .catch((error) => {
        onDeleteSuccessCallback?.(error);
        console.log(error);
        setModalOpen(false);
      });
  };

  const actionItems = [
    {
      id: 1,
      href: 'https://ovhcloud.com',
      label: t('zimbra_organization_edit'),
    },
    {
      id: 2,
      onClick: () => setModalOpen(true),
      label: t('zimbra_organization_delete'),
    },
  ];
  const hasDomain = data?.length > 0;
  return (
    <>
      <ActionMenu items={actionItems} isCompact />
      {isModalOpen && (
        <Modal
          subtitle={t('zimbra_organization_delete_modal_subtitle')}
          content={t('zimbra_organization_delete_modal_label')}
          children={
            !hasDomain && (
              <OsdsMessage
                color={ODS_THEME_COLOR_INTENT.error}
                icon={ODS_ICON_NAME.WARNING_CIRCLE}
                className="mt-4"
              >
                <div className="flex flex-col text-left ml-4">
                  <div className="font-bold">
                    {t('zimbra_organization_delete_modal_label_disabled_part1')}
                  </div>
                  <div>
                    {t('zimbra_organization_delete_modal_label_disabled_part2')}
                  </div>
                </div>
              </OsdsMessage>
            )
          }
          buttonLabel={t('zimbra_organization_delete')}
          type={ModalType.error}
          modalClick={handleDeleteClick}
          disabled={!hasDomain}
        />
      )}
    </>
  );
};
