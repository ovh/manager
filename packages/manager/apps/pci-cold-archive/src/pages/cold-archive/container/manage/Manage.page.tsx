import {
  OdsButton,
  OdsModal,
  OdsText,
  OdsSpinner,
  OdsLink,
  OdsFormField,
  OdsClipboard,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { MANAGE_ARCHIVE_DOC_LINK } from '@/constants';
import {
  useArchiveRegionDetails,
  useProductRegionsAvailability,
} from '@/api/hooks/useProductRegionsAvailability';
import LabelComponent from '@/components/Label.component';

export default function Manage() {
  const { t } = useTranslation(['cold-archive', 'pci-common']);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  const onCancel = () => {
    navigate('..');
  };

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(ovhSubsidiary);

  const {
    data: archiveRegion,
    isPending: isArchiveRegionPending,
  } = useArchiveRegionDetails(projectId, regions ? regions[0] : '');
  const getDocumentationUrl = () => {
    return MANAGE_ARCHIVE_DOC_LINK[ovhSubsidiary];
  };

  const endpoint = archiveRegion?.services[0]?.endpoint;

  const isPending = isArchiveRegionPending || isRegionsPending;
  return (
    <OdsModal isOpen onOdsClose={onClose} className="modal">
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
          <div className="mt-6 mb-8">
            <OdsLink
              icon="external-link"
              href={getDocumentationUrl()}
              label={t(
                'pci_projects_project_storages_cold_archive_container_manage_documentation_link',
              )}
            />
            <OdsText preset="paragraph" className="mt-6">
              {t(
                'pci_projects_project_storages_cold_archive_container_manage_description_1',
              )}
            </OdsText>
            <OdsText preset="paragraph" className="mt-6">
              {t(
                'pci_projects_project_storages_cold_archive_container_manage_description_2',
              )}
            </OdsText>
            <OdsFormField className="w-full mt-6">
              <LabelComponent
                text={t(
                  'pci_projects_project_storages_cold_archive_containers_container_manage_endpoint_label',
                )}
              />
              <OdsClipboard
                value={endpoint}
                className="w-full"
                labelCopy={t('pci-common:common_clipboard_copy_to_clipboard')}
                labelCopySuccess={t('pci-common:common_clipboard_copied')}
              />
            </OdsFormField>
            <OdsFormField className="w-full mt-6">
              <LabelComponent
                text={t(
                  'pci_projects_project_storages_cold_archive_containers_container_manage_region_label',
                )}
              />
              <OdsClipboard
                value={regions[0].toLowerCase()}
                className="w-full"
                labelCopy={t('pci-common:common_clipboard_copy_to_clipboard')}
                labelCopySuccess={t('pci-common:common_clipboard_copied')}
              />
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
        isDisabled={isRegionsPending}
        slot="actions"
      />
    </OdsModal>
  );
}
