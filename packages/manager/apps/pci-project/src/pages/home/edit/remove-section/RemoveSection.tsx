import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useServiceIds } from '@/data/hooks/useServices';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type RemoveSectionProps = {
  isDiscovery: boolean;
};

export default function RemoveSection({ isDiscovery }: RemoveSectionProps) {
  const { t } = useTranslation('edit');
  const { trackClick } = useOvhTracking();

  const projectId = useProjectIdFromParams();
  const navigate = useNavigate();

  const { data: serviceIds, isPending: isServiceIdsPending } = useServiceIds(projectId);

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-2">{t('pci_projects_project_edit_remove')}</OdsText>

      {!isDiscovery && (
        <OdsText preset="paragraph">
          <Trans t={t} i18nKey="pci_projects_project_edit_remove_description" />
        </OdsText>
      )}

      <OdsButton
        className="w-fit"
        size="md"
        color="critical"
        label={t('pci_projects_project_edit_remove')}
        isDisabled={isServiceIdsPending || serviceIds?.length === 0}
        data-testid="remove-section_remove-button"
        onClick={() => {
          trackClick({
            actionType: 'action',
            actions: PROJECTS_TRACKING.SETTINGS.CTA_DELETE_PROJECT,
          });
          navigate(`./${urls.remove}?serviceId=${serviceIds?.[0]}`);
        }}
      />
    </section>
  );
}
