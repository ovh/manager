import { useCallback } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useUpdateAttachedDomainService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

interface ActivateCdnModalState {
  serviceName: string;
  domain: string;
}

export default function ActivateCdnModal() {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ACTIONS]);
  const { state } = useLocation() as Location<ActivateCdnModalState>;
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();

  const { updateAttachedDomainService, isPending } = useUpdateAttachedDomainService(
    state.serviceName,
    () => {
      addSuccess(t('multisite:multisite_cdn_activate_success'), true);
      navigate(-1);
    },
    (error: ApiError) => {
      addError(error?.response?.data?.message || t('multisite:multisite_cdn_activate_error'), true);
    },
  );

  const onClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onPrimaryButtonClick = useCallback(() => {
    updateAttachedDomainService({ domain: state.domain, cdn: 'active' });
  }, [updateAttachedDomainService, state.domain]);

  return (
    <Modal
      heading={t('multisite:multisite_modal_domain_configuration_modify_step1_cdn')}
      onDismiss={onClose}
      isOpen
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isPrimaryButtonDisabled={isPending}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('multisite:multisite_cdn_activate_description')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-4">
        {t('multisite:multisite_cdn_activate_question')}
      </OdsText>
    </Modal>
  );
}
