import { useCallback } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
      onOpenChange={onClose}
      open={true}
      dismissible={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onPrimaryButtonClick,
        disabled: isPending,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      <Text preset={TEXT_PRESET.paragraph}>
        {t('multisite:multisite_cdn_activate_description')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph} className="mt-4">
        {t('multisite:multisite_cdn_activate_question')}
      </Text>
    </Modal>
  );
}
