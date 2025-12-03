import React from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { useHostingDeleteLocation } from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';
import { subRoutes, urls } from '@/routes/routes.constants';

type LocationState = {
  address?: string;
  companyName?: string;
  email?: string;
};

export default function RemoveSeoSubscriptionModal() {
  const location = useLocation() as { state: LocationState };
  const { serviceName, locationId } = useParams();
  const { address, companyName, email } = location.state;
  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();

  const closeModal = () => navigate(urls.localSeo.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation(['local-seo', NAMESPACES.ACTIONS]);

  const { hostingDeleteLocation } = useHostingDeleteLocation(
    serviceName,
    () => {
      addSuccess(t('hosting_tab_LOCAL_SEO_delete_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_tab_LOCAL_SEO_delete_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onConfirm = () => {
    hostingDeleteLocation(locationId);
    closeModal();
  };

  return (
    <Modal
      onOpenChange={closeModal}
      open
      heading={t('hosting_tab_LOCAL_SEO_delete')}
      primaryButton={{
        label: t(t('hosting_tab_LOCAL_SEO_delete')),
        onClick: onConfirm,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: closeModal,
      }}
    >
      <div className="mb-10 mt-5 flex flex-col space-y-8">
        <Text>{t('hosting_tab_LOCAL_SEO_delete_confirm')}</Text>
        <div className="flex">
          <Text preset={TEXT_PRESET.heading6} className="w-1/2 pr-4 text-right">
            {t('hosting_tab_LOCAL_SEO_table_header_name')}
          </Text>
          <Text className="w-1/2">{companyName}</Text>
        </div>
        <div className="flex">
          <Text preset={TEXT_PRESET.heading6} className="w-1/2 pr-4 text-right">
            {t('hosting_tab_LOCAL_SEO_table_header_address')}
          </Text>
          <Text className="w-1/2">
            {address || t('hosting_tab_LOCAL_SEO_table_value_undefined')}
          </Text>
        </div>
        <div className="flex">
          <Text preset={TEXT_PRESET.heading6} className="w-1/2 pr-4 text-right">
            {t('hosting_tab_LOCAL_SEO_table_header_email')}
          </Text>
          <Text className="w-1/2">{email}</Text>
        </div>
      </div>
    </Modal>
  );
}
