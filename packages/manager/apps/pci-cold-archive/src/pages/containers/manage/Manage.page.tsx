import { Clipboard } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsButton,
  OdsFormField,
  OdsLink,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MANAGE_ARCHIVE_DOC_LINK } from '@/constants';
import LabelComponent from '@/components/Label.component';
import { useArchiveRegion } from '@/api/hooks/useArchive';
import { useProjectRegionDetails } from '@/api/hooks/useRegions';

export default function Manage() {
  const { t } = useTranslation(['cold-archive', 'pci-common']);
  const { projectId } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onClose = goBack;
  const onCancel = goBack;

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const documentationUrl = MANAGE_ARCHIVE_DOC_LINK[ovhSubsidiary];

  const region = useArchiveRegion();

  const { data: archiveRegion, isPending } = useProjectRegionDetails(
    projectId,
    region,
  );

  const endpoint = archiveRegion?.services[0]?.endpoint;

  return (
    <OdsModal isOpen onOdsClose={onClose}>
      <OdsText preset="heading-3">
        {t('pci_projects_project_storages_cold_archive_container_manage')}
      </OdsText>
      <slot name="content">
        {isPending ? (
          <OdsSpinner
            size="md"
            className="block text-center mt-6 mb-8"
            data-testid="pciModal-spinner"
          />
        ) : (
          <div className="flex flex-col gap-6 mt-6 mb-8">
            <OdsLink
              icon="external-link"
              target="_blank"
              href={documentationUrl}
              label={t(
                'pci_projects_project_storages_cold_archive_container_manage_documentation_link',
              )}
            />
            <OdsText preset="paragraph">
              {t(
                'pci_projects_project_storages_cold_archive_container_manage_description_1',
              )}
            </OdsText>
            <OdsText preset="paragraph">
              {t(
                'pci_projects_project_storages_cold_archive_container_manage_description_2',
              )}
            </OdsText>
            <OdsFormField className="w-full">
              <LabelComponent
                text={t(
                  'pci_projects_project_storages_cold_archive_containers_container_manage_endpoint_label',
                )}
              />
              <Clipboard value={endpoint} className="w-full" />
            </OdsFormField>
            <OdsFormField className="w-full">
              <LabelComponent
                text={t(
                  'pci_projects_project_storages_cold_archive_containers_container_manage_region_label',
                )}
              />
              <Clipboard value={region?.toLowerCase()} className="w-full" />
            </OdsFormField>
          </div>
        )}
      </slot>
      <OdsButton
        label={t(
          'pci_projects_project_storages_cold_archive_containers_container_manage_close_label',
        )}
        color="primary"
        variant="ghost"
        className="mt-6"
        onClick={onCancel}
        isDisabled={!region}
        slot="actions"
      />
    </OdsModal>
  );
}
