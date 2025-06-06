import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsInput,
  OdsText,
  OdsButton,
  OdsIcon,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import './style.scss';
import { STATUS_ENABLED } from '@/constants';

const omitNew = <V,>(
  obj: Partial<Record<number | 'new', V>>,
): Partial<Record<number, V>> =>
  Object.keys(obj).reduce((acc, key) => {
    if (key !== 'new') {
      const numericKey = Number(key as unknown);
      if (!Number.isNaN(numericKey)) {
        acc[numericKey as number] = obj[(key as unknown) as number] as V;
      }
    }
    return acc;
  }, {} as Partial<Record<number, V>>);

export type TErrorMap = {
  [key: number]: string | undefined;
} & {
  new?: string | undefined;
};

export type TTagMap = Record<string, string>;
export type TDraftTag = { key: string; value: string };
export type TDraftTags = Partial<Record<number | 'new', TDraftTag>>;

export type TIsTouched = Partial<Record<number | 'new', boolean>>;

export type TReplicationRuleTagProps = {
  replicationRuleTags: TTagMap;
  setReplicationRuleTags: React.Dispatch<React.SetStateAction<TTagMap>>;
  draftTags: TDraftTags;
  setDraftTags: React.Dispatch<React.SetStateAction<TDraftTags>>;
  keyErrors: TErrorMap;
  setKeyErrors: React.Dispatch<React.SetStateAction<TErrorMap>>;
  valueErrors: TErrorMap;
  setValueErrors: React.Dispatch<React.SetStateAction<TErrorMap>>;
  isTouched: TIsTouched;
  setIsTouched: React.Dispatch<React.SetStateAction<TIsTouched>>;
  deleteMarkerReplication: string;
};

export function ReplicationRuleTag({
  replicationRuleTags,
  setReplicationRuleTags,
  draftTags,
  setDraftTags,
  keyErrors,
  setKeyErrors,
  valueErrors,
  setValueErrors,
  isTouched,
  setIsTouched,
  deleteMarkerReplication,
}: TReplicationRuleTagProps) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
  ]);

  const MAX_TAGS = 10;
  const patternKey = /^[a-zA-Z0-9+\-=._:@]{1,128}$/;
  const patternValue = /^[a-zA-Z0-9+\-=._:@]{1,256}$/;

  const validateTagKey = (key: string): string | undefined => {
    if (
      !patternKey.test(key) ||
      key.toLowerCase() === 'ovh:' ||
      key.toLowerCase() === 'aws:' ||
      key.toLowerCase() === 'ovh' ||
      key.toLowerCase() === 'aws' ||
      key === ''
    ) {
      return t('pci-common:common_field_error_pattern');
    }

    return undefined;
  };

  const validateTagValue = (value: string): string | undefined => {
    if (!value) return undefined;

    if (
      !patternValue.test(value) ||
      value.toLowerCase() === 'ovh:' ||
      value.toLowerCase() === 'aws:' ||
      value.toLowerCase() === 'ovh' ||
      value.toLowerCase() === 'aws'
    ) {
      return t('pci-common:common_field_error_pattern');
    }

    return undefined;
  };

  const handleTagChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    setDraftTags((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {
          key: Object.keys(replicationRuleTags)[index],
          value: Object.values(replicationRuleTags)[index],
        }),
        [field]: value,
      },
    }));

    if (field === 'key') {
      const error = validateTagKey(value);
      setKeyErrors((prev) => ({ ...prev, [index]: error }));
    } else if (field === 'value') {
      const error = validateTagValue(value);
      setValueErrors((prev) => ({ ...prev, [index]: error }));
    }
  };

  const commitTagChange = (index: number) => {
    const draftTag = draftTags[index];
    if (!draftTag) return;

    const keyError = validateTagKey(draftTag.key);
    const valueError = validateTagValue(draftTag.value);

    setKeyErrors((prev) => ({ ...prev, [index]: keyError }));
    setValueErrors((prev) => ({ ...prev, [index]: valueError }));

    if (!keyError && !valueError) {
      const newTags = { ...replicationRuleTags };

      const oldKey = Object.keys(replicationRuleTags)[index];
      if (oldKey !== draftTag.key) {
        delete newTags[oldKey];
      }
      newTags[draftTag.key] = draftTag.value;
      setReplicationRuleTags(newTags);
    }
  };

  const handleNewTagChange = (field: 'key' | 'value', value: string) => {
    setDraftTags((prev) => ({
      ...prev,
      new: {
        ...(prev.new || { key: '', value: '' }),
        [field]: value,
      },
    }));

    if (field === 'key' && draftTags.new?.key !== undefined) {
      const error = validateTagKey(value);
      setKeyErrors((prev) => ({ ...prev, new: error }));
    } else if (field === 'value') {
      const error = validateTagValue(value);
      setValueErrors((prev) => ({ ...prev, new: error }));
    }
  };

  const addNewTag = () => {
    const newDraftTag = draftTags.new;
    if (!newDraftTag || Object.keys(replicationRuleTags).length >= MAX_TAGS)
      return;

    const keyError = validateTagKey(newDraftTag.key);
    const valueError = validateTagValue(newDraftTag.value);

    setKeyErrors((prev) => ({ ...prev, new: keyError }));
    setValueErrors((prev) => ({ ...prev, new: valueError }));

    if (!keyError && !valueError && newDraftTag.key) {
      setReplicationRuleTags({
        ...replicationRuleTags,
        [newDraftTag.key]: newDraftTag.value || '',
      });
      setKeyErrors((prev) => omitNew(prev));
      setValueErrors((prev) => omitNew(prev));
      setIsTouched((prev) => omitNew(prev) as TIsTouched);
      setDraftTags((prev) => omitNew(prev) as TDraftTags);
    }
  };

  const handleNewTagBlur = () => {
    setIsTouched((prev) => ({ ...prev, new: true }));
    const newDraftTag = draftTags.new;

    if (newDraftTag?.key) {
      addNewTag();
    } else {
      const keyError = validateTagKey(newDraftTag?.key || '');
      setKeyErrors((prev) => ({ ...prev, new: keyError }));
    }
  };

  const removeTag = (index: number) => {
    const newTags = { ...replicationRuleTags };
    const keyToRemove = Object.keys(newTags)[index];
    delete newTags[keyToRemove];
    setReplicationRuleTags(newTags);

    setDraftTags((prev) => {
      const newDraftTags = { ...prev };
      delete newDraftTags[index];
      return newDraftTags;
    });

    setKeyErrors((prev) => {
      const newKeyErrors = { ...prev };
      delete newKeyErrors[index];
      return newKeyErrors;
    });

    setValueErrors((prev) => {
      const newValueErrors = { ...prev };
      delete newValueErrors[index];
      return newValueErrors;
    });

    setIsTouched((prev) => {
      const newTouched = { ...prev };
      delete newTouched[index];
      return newTouched;
    });
  };

  const tagEntries = Object.entries(replicationRuleTags);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_subtitle',
        )}
      </label>

      {tagEntries.map(([key, value], index) => {
        const draftTag = draftTags[index] || { key, value };
        return (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-end gap-4 mb-4 mt-4"
          >
            <OdsFormField
              className="mt-2 w-full md:w-auto md:min-w-[300px] block"
              error={isTouched[index] ? keyErrors[index] : undefined}
            >
              <label slot="label">
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_key',
                )}
              </label>
              <OdsInput
                className={clsx(
                  'w-full',
                  isTouched[index] &&
                    valueErrors[index] &&
                    !keyErrors[index] &&
                    'margin-error',
                )}
                placeholder={t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_key_placeholder',
                )}
                value={draftTag.key}
                name={`tag-key-${index}`}
                color="primary"
                onOdsChange={(event) =>
                  handleTagChange(index, 'key', event.detail.value.toString())
                }
                onOdsBlur={() => {
                  setIsTouched((prev) => ({ ...prev, [index]: true }));
                  commitTagChange(index);
                }}
              />
            </OdsFormField>

            <OdsFormField
              className="mt-2 w-full md:w-auto md:min-w-[300px] block"
              error={isTouched[index] ? valueErrors[index] : undefined}
            >
              <label slot="label">
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_value',
                )}
              </label>
              <OdsInput
                className={clsx(
                  'w-full',
                  isTouched[index] &&
                    keyErrors[index] &&
                    !valueErrors[index] &&
                    'margin-error',
                )}
                placeholder={t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_value_placeholder',
                )}
                value={draftTag.value}
                name={`tag-value-${index}`}
                color="primary"
                onOdsChange={(event) =>
                  handleTagChange(index, 'value', event.detail.value.toString())
                }
                onOdsBlur={() => {
                  setIsTouched((prev) => ({ ...prev, [index]: true }));
                  commitTagChange(index);
                }}
              />
            </OdsFormField>

            <div className="w-full md:w-auto mb-2 md:mb-0">
              <OdsButton
                className={clsx(
                  'w-full md:w-auto',
                  ((isTouched[index] && keyErrors[index]) ||
                    (isTouched[index] && valueErrors[index])) &&
                    'margin-button-error',
                )}
                icon="trash"
                label=""
                color="primary"
                variant="ghost"
                onClick={() => removeTag(index)}
              ></OdsButton>
            </div>
          </div>
        );
      })}

      {tagEntries.length < MAX_TAGS && (
        <div className="flex flex-col md:flex-row md:items-end gap-4 mt-4">
          <OdsFormField
            className="mt-2 w-full md:w-auto md:min-w-[300px] block"
            error={isTouched.new ? keyErrors.new : undefined}
          >
            <label slot="label">
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_key',
              )}
            </label>
            <OdsInput
              isDisabled={deleteMarkerReplication === STATUS_ENABLED}
              className={clsx(
                'w-full',
                isTouched.new &&
                  valueErrors.new &&
                  !keyErrors.new &&
                  'margin-error',
              )}
              placeholder={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_key_placeholder',
              )}
              value={draftTags.new?.key || ''}
              name="new-tag-key"
              color="primary"
              onOdsChange={(event) =>
                handleNewTagChange('key', event.detail.value.toString())
              }
              onOdsBlur={handleNewTagBlur}
            />
          </OdsFormField>

          <OdsFormField
            className="mt-2 w-full md:w-auto md:min-w-[300px] block"
            error={isTouched.new ? valueErrors.new : undefined}
          >
            <label slot="label">
              {t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_value',
              )}
            </label>
            <OdsInput
              isDisabled={deleteMarkerReplication === STATUS_ENABLED}
              className={clsx(
                'w-full',
                isTouched.new &&
                  keyErrors.new &&
                  !valueErrors.new &&
                  'margin-error',
              )}
              placeholder={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_value_placeholder',
              )}
              value={draftTags.new?.value || ''}
              name="new-tag-value"
              color="primary"
              onOdsChange={(event) =>
                handleNewTagChange('value', event.detail.value.toString())
              }
              onOdsBlur={handleNewTagBlur}
            />
          </OdsFormField>

          <div className="w-full md:w-auto">
            <div className="flex">
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
        </div>
      )}

      <OdsText preset="caption" className="mt-4">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_helper_text',
        )}
      </OdsText>
    </OdsFormField>
  );
}
