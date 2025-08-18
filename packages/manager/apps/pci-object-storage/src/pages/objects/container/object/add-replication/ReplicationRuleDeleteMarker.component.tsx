import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { useMemo } from 'react';
import { STATUS_DISABLED, STATUS_ENABLED } from '@/constants';
import { TReplicationStatus } from './ManageReplicationPage.form';
import { TTagMap } from './ReplicationRuleTag.component';
import { TNewTag } from '../../../../../utils/useTagValidation';

type TReplicationRuleDeleteMarkerProps = {
  deleteMarkerReplication: TReplicationStatus;
  setDeleteMarkerReplication: (
    deleteMarkerReplication: TReplicationStatus,
  ) => void;
  asyncReplicationLink: string;
  tags: TTagMap;
  newTag: TNewTag;
  isReplicationApplicationLimited: boolean;
};

export function ReplicationRuleDeleteMarker({
  deleteMarkerReplication,
  setDeleteMarkerReplication,
  asyncReplicationLink,
  tags,
  newTag,
  isReplicationApplicationLimited,
}: TReplicationRuleDeleteMarkerProps) {
  const { t } = useTranslation(['containers/replication/add']);

  const isReplicateDeleteMarkerDisabled = useMemo(() => {
    return (
      (newTag.key || newTag.value || Object.keys(tags).length > 0) &&
      isReplicationApplicationLimited
    );
  }, [newTag.key, newTag.value, tags, isReplicationApplicationLimited]);

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
            isDisabled={isReplicateDeleteMarkerDisabled}
          />
          <label htmlFor="vreplicate-delete-marker-true">
            <OdsText>
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_status_enabled',
              )}
            </OdsText>
          </label>
          {isReplicateDeleteMarkerDisabled && (
            <div className="mt-2 ml-3 cursor-pointer">
              <OdsIcon
                id="trigger-popover"
                name="circle-question"
                className="text-[var(--ods-color-information-500)]"
              />
              <OdsPopover triggerId="trigger-popover">
                <OdsText preset="caption">
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_replicatDelete_marker_tooltip',
                  )}
                </OdsText>
              </OdsPopover>
            </div>
          )}
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
