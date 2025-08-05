import { useTranslation } from 'react-i18next';

import {
  OdsRadio,
  OdsText,
  OdsFormField,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useCallback } from 'react';
import { TTagMap } from './ReplicationRuleTag.component';
import { TNewTag } from '../../../../../utils/useTagValidation';
import { TReplicationStatus } from './ManageReplicationPage.form';
import { STATUS_DISABLED } from '@/constants';

export type TReplicationRuleApplication = {
  isReplicationApplicationLimited: boolean;
  setIsReplicationApplicationLimited: (value: boolean) => void;
  tags: TTagMap;
  newTag: TNewTag;
  setDeleteMarkerReplication: (
    deleteMarkerReplication: TReplicationStatus,
  ) => void;
};
export function ReplicationRuleApplication({
  isReplicationApplicationLimited,
  setIsReplicationApplicationLimited,
  tags,
  newTag,
  setDeleteMarkerReplication,
}: TReplicationRuleApplication) {
  const { t } = useTranslation(['containers/replication/add']);

  const handleReplicationApplication = useCallback(() => {
    setIsReplicationApplicationLimited(true);

    if (newTag.key || newTag.value || Object.keys(tags).length > 0) {
      setDeleteMarkerReplication(STATUS_DISABLED);
    }
  }, [
    newTag.key,
    newTag.value,
    tags,
    setIsReplicationApplicationLimited,
    setDeleteMarkerReplication,
  ]);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        <OdsText preset="heading-5">
          {t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags',
          )}
        </OdsText>
        <div className="mb-2"></div>
        <OdsText preset="paragraph" className="mt-2">
          {t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_title_helper_text',
          )}
        </OdsText>
      </label>
      <label slot="label" className="block mt-8">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_application',
        )}
      </label>
      <div className="flex flex-col gap-4 mt-4 mb-4">
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-4 mb-0">
            <OdsRadio
              value="enabled"
              name="replication-application"
              onOdsChange={handleReplicationApplication}
              inputId="replication-application-true"
              isChecked={!!isReplicationApplicationLimited}
            />
            <label htmlFor="replication-application-true">
              <OdsText>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_application_limited',
                )}
              </OdsText>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <OdsRadio
            value="disabled"
            isChecked={!isReplicationApplicationLimited}
            name="replication-application"
            inputId="replication-application-false"
            onOdsChange={() => setIsReplicationApplicationLimited(false)}
          />
          <label htmlFor="replication-application-false">
            <OdsText>
              <span>
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_application_for_all',
                )}
              </span>
            </OdsText>
          </label>
        </div>
      </div>

      {isReplicationApplicationLimited && (
        <OdsMessage
          color="information"
          className="mt-6"
          isDismissible={false}
          variant="default"
        >
          {t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_application_limited_helper_text',
          )}
        </OdsMessage>
      )}
    </OdsFormField>
  );
}
