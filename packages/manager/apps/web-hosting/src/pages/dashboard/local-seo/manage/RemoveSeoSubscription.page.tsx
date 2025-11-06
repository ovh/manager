import React from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

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
      onDismiss={closeModal}
      isOpen
      heading={t('hosting_tab_LOCAL_SEO_delete')}
      primaryLabel={t('hosting_tab_LOCAL_SEO_delete')}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <div className="flex flex-col space-y-8 mb-10 mt-5">
        <OdsText>{t('hosting_tab_LOCAL_SEO_delete_confirm')}</OdsText>
        <div className="flex">
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
            {t('hosting_tab_LOCAL_SEO_table_header_name')}
          </OdsText>
          <OdsText className="w-1/2">{companyName}</OdsText>
        </div>
        <div className="flex">
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
            {t('hosting_tab_LOCAL_SEO_table_header_address')}
          </OdsText>
          <OdsText className="w-1/2">
            {address || t('hosting_tab_LOCAL_SEO_table_value_undefined')}
          </OdsText>
        </div>
        <div className="flex">
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
            {t('hosting_tab_LOCAL_SEO_table_header_email')}
          </OdsText>
          <OdsText className="w-1/2">{email}</OdsText>
        </div>
      </div>
    </Modal>
  );
}
