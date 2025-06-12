import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { STATUS_DISABLED, STATUS_ENABLED } from '@/constants';
import { TReplicationStatus } from './AddReplication.page';

type TReplicationRuleDeleteMarkerProps = {
  deleteMarkerReplication: TReplicationStatus;
  setDeleteMarkerReplication: (
    deleteMarkerReplication: TReplicationStatus,
  ) => void;
  asyncReplicationLink: string;
};

export function ReplicationRuleDeleteMarker({
  deleteMarkerReplication,
  setDeleteMarkerReplication,
  asyncReplicationLink,
}: TReplicationRuleDeleteMarkerProps) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_delete_markers',
        )}
      </label>

      <div className="flex flex-col gap-4 mt-4 mb-4">
        <div className="flex items-center gap-4">
          <OdsRadio
            value="enabled"
            name="replicate-delete-marker"
            onOdsChange={() => setDeleteMarkerReplication(STATUS_ENABLED)}
            inputId="replicate-delete-marker-true"
            isChecked={deleteMarkerReplication === STATUS_ENABLED}
          />
          <label htmlFor="vreplicate-delete-marker-true">
            <OdsText>
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_status_enabled',
              )}
            </OdsText>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <OdsRadio
            value="disabled"
            isChecked={deleteMarkerReplication === STATUS_DISABLED}
            name="replicate-delete-marker"
            inputId="replicate-delete-markerg-false"
            onOdsChange={() => setDeleteMarkerReplication(STATUS_DISABLED)}
          />
          <label htmlFor="replicate-delete-marker-false">
            <OdsText>
              <span>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_status_disabled',
                )}
              </span>
            </OdsText>
          </label>
        </div>
      </div>
      <OdsText slot="helper" preset="caption" className="max-w-2xl mt-3">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_delete_markers_helper_text',
        )}
        <Links
          className="ml-4"
          href={asyncReplicationLink}
          target="_blank"
          type={LinkType.external}
          label={t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_warning_link',
          )}
        />
      </OdsText>
    </OdsFormField>
  );
}
