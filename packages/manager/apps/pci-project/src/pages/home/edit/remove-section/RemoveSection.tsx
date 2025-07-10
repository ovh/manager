import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { useServiceIds } from '@/data/hooks/useServices';

type RemoveSectionProps = {
  isDiscovery: boolean;
};

export default function RemoveSection({ isDiscovery }: RemoveSectionProps) {
  const { t } = useTranslation('edit');

  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: serviceIds, isPending: isServiceIdsPending } = useServiceIds(
    projectId,
  );

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-3">
        {t('pci_projects_project_edit_remove')}
      </OdsText>

      {!isDiscovery && (
        <OdsText preset="paragraph">
          {t('pci_projects_project_edit_remove_description')}
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
          navigate(`./${urls.remove}?serviceId=${serviceIds?.[0]}`);
        }}
      />
    </section>
  );
}
