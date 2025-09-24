import {
  OdsFormField,
  OdsInput,
  OdsButton,
  OdsIcon,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { TReplicationStatus } from './ManageReplicationPage.form';
import { STATUS_ENABLED } from '@/constants';
import { DEFAULT_MAX_TAGS } from './ReplicationRuleTag.component';
import { TNewTag } from '@/utils/useTagValidation';

export type TNewTagFormProps = {
  newTag: TNewTag;
  onNewTagChange: (field: 'key' | 'value', value: string) => void;
  onNewKeyFocus: () => void;
  onNewValueFocus: () => void;
  onAddNewTag: () => void;
  onRemoveNewTag: () => void;
  showNewTagForm: boolean;
  t: (key: string) => string;
  deleteMarkerReplication: TReplicationStatus;
  tagsLength: number;
  errors?: {
    key?: string;
    value?: string;
  };
};

export const NewTagForm = ({
  newTag,
  onNewTagChange,
  onAddNewTag,
  onNewKeyFocus,
  onNewValueFocus,
  onRemoveNewTag,
  showNewTagForm,
  t,
  deleteMarkerReplication,
  tagsLength,
  errors,
}: TNewTagFormProps) => (
  <>
    {showNewTagForm && (
      <div className="flex flex-col md:flex-row md:items-end gap-4 mt-4">
        <OdsFormField
          className="mt-2 w-full md:w-auto md:min-w-[300px] block"
          error={errors?.key}
        >
          <label slot="label">
            {t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_key',
            )}
          </label>
          <OdsInput
            className={clsx(
              'w-full',
              errors?.value && !errors?.key && 'mb-[21px]',
            )}
            placeholder={t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_key_placeholder',
            )}
            value={newTag.key}
            name="new-tag-key"
            color="primary"
            hasError={!!errors?.key}
            onFocus={() => onNewKeyFocus()}
            onOdsChange={(event) =>
              onNewTagChange('key', event.detail.value.toString())
            }
            isDisabled={deleteMarkerReplication === STATUS_ENABLED}
          />
        </OdsFormField>

        <OdsFormField
          className="mt-2 w-full md:w-auto md:min-w-[300px] block"
          error={errors?.value}
        >
          <label slot="label">
            {t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_value',
            )}
          </label>
          <OdsInput
            className={clsx(
              'w-full',
              errors?.key && !errors?.value && 'mb-[21px]',
            )}
            placeholder={t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_value_placeholder',
            )}
            value={newTag.value}
            name="new-tag-value"
            color="primary"
            hasError={!!errors?.value}
            onFocus={onNewValueFocus}
            onOdsChange={(event) =>
              onNewTagChange('value', event.detail.value.toString())
            }
            isDisabled={deleteMarkerReplication === STATUS_ENABLED}
          />
        </OdsFormField>
        <div className="w-full md:w-auto mb-2 md:mb-0 flex gap-2">
          <OdsButton
            className={clsx(
              'w-full md:w-auto',
              (errors?.value || errors?.key) && 'mb-[18px]',
            )}
            icon="trash"
            size="sm"
            label=""
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={() => onRemoveNewTag()}
            isDisabled={deleteMarkerReplication === STATUS_ENABLED}
          />
          {deleteMarkerReplication === STATUS_ENABLED && (
            <div className="mt-4 ml-3 cursor-pointer">
              <OdsIcon
                id="trigger-popover"
                name="circle-question"
                className="text-[var(--ods-color-information-500)]"
              />
              <OdsPopover triggerId="trigger-popover">
                <OdsText preset="caption">
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_add_new_tag_tooltip',
                  )}
                </OdsText>
              </OdsPopover>
            </div>
          )}
        </div>
      </div>
    )}
    <OdsText preset="caption" className="mt-4">
      {t(
        'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_helper_text',
      )}
    </OdsText>
    <div className="w-full md:w-auto mt-4 mb-2 md:mb-0">
      <OdsButton
        label={t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_add_new_tag',
        )}
        variant={ODS_BUTTON_VARIANT.outline}
        onClick={onAddNewTag}
        isDisabled={
          deleteMarkerReplication === STATUS_ENABLED ||
          (tagsLength >= DEFAULT_MAX_TAGS - 1 && showNewTagForm)
        }
      />
    </div>
  </>
);
