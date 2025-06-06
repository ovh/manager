import { useTranslation } from 'react-i18next';

import {
  OdsRadio,
  OdsText,
  OdsFormField,
} from '@ovhcloud/ods-components/react';

export type TReplicationRuleApplication = {
  replicationApplication: boolean;
  setReplicationApplication: (value: boolean) => void;
};
export function ReplicationRuleApplication({
  replicationApplication,
  setReplicationApplication,
}: TReplicationRuleApplication) {
  const { t } = useTranslation(['containers/replication/add']);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        <OdsText preset="heading-5">
          {t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags',
          )}
        </OdsText>

        <OdsText preset="caption" className="mt-2">
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
        <div className="flex items-center gap-4">
          <OdsRadio
            value="enabled"
            name="replication-application"
            onOdsChange={() => setReplicationApplication(true)}
            inputId="replication-application-true"
            isChecked={replicationApplication === true}
          />
          <label htmlFor="replication-application-true">
            <OdsText>
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_application_limited',
              )}
            </OdsText>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <OdsRadio
            value="disabled"
            isChecked={!replicationApplication}
            name="replication-application"
            inputId="replication-application-false"
            onOdsChange={() => setReplicationApplication(false)}
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
    </OdsFormField>
  );
}
