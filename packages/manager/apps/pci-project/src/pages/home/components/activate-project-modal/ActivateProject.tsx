import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

/**
 * ActivateProjectModal prompts users to activate their discovery project.
 * This modal is triggered by the "activateDiscovery=1" query parameter.
 *
 * Flow:
 * 1. User tries to access /new (creation page)
 * 2. CreationGuard detects a discovery project exists
 * 3. User is redirected to /:projectId?activateDiscovery=1
 * 4. This modal opens automatically
 * 5. User can either:
 *    - Activate: Navigate to the activation page
 *    - Cancel: Close modal and stay on current page
 */
export default function ActivateProjectModal() {
  const { t } = useTranslation(['activate', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activateDiscovery = searchParams.get('activateDiscovery');

  useEffect(() => {
    if (activateDiscovery) {
      setIsOpen(true);
    }
  }, [activateDiscovery]);

  const handleClose = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.ACTIVATE_PROJECT_MODAL.CTA_CANCEL,
    });

    setIsOpen(false);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('activateDiscovery');
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleActivate = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.ACTIVATE_PROJECT_MODAL.CTA_CONFIRM,
    });

    navigate(`./${urls.activate}`);
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.information}
      primaryLabel={t('pci_projects_project_activateDiscovery_heading')}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={handleActivate}
      onSecondaryButtonClick={handleClose}
      onDismiss={handleClose}
      isOpen={isOpen}
    >
      <OdsText>{t('pci_projects_project_activateDiscovery_info')}</OdsText>
    </Modal>
  );
}
