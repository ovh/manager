import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MODAL_COLOR, Modal, useNotifications } from '@ovh-ux/muk';

import { useDeleteDomainCertificate } from '@/data/hooks/ssl/useSsl';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function DisableSslModal() {
  const { serviceName, domain } = useParams();

  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation(['ssl', NAMESPACES.ACTIONS]);

  const { deleteDomainCertificate } = useDeleteDomainCertificate(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_delete_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_dashboard_ssl_delete_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onConfirm = () => {
    deleteDomainCertificate(domain);
    closeModal();
  };

  return (
    <Modal
      onOpenChange={closeModal}
      open
      type={MODAL_COLOR.critical}
      heading={t('delete_ssl')}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: closeModal,
      }}
    >
      <div className="my-8 flex flex-col space-y-8">
        <div className="flex flex-row">
          <Text preset={TEXT_PRESET.heading6} className="mr-10 flex w-1/2 justify-end">
            {t('hosting_domain_name')}
          </Text>
          <Text className="w-1/2">{domain}</Text>
        </div>
        <Text>{t('delete_ssl_message')}</Text>
      </div>
    </Modal>
  );
}
