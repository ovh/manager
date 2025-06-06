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
import { useState, useEffect, useCallback } from 'react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { STATUS_ENABLED } from '@/constants';

export type TTagMap = Record<string, string>;
export type TDraftTag = { key: string; value: string };
export type TDraftTags = Record<string, TDraftTag>;
export type TErrorMap = Record<string, string | undefined>;
export type TIsTouched = Record<string, boolean>;
export type TTagOrder = string[];

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
  tagOrder: TTagOrder;
  setTagOrder: React.Dispatch<React.SetStateAction<TTagOrder>>;
  isEditMode?: boolean;
};

const MAX_TAGS = 10;
const TAG_PATTERNS = {
  KEY: /^[a-zA-Z0-9+\-=._:@/]{1,128}$/,
  VALUE: /^[a-zA-Z0-9+\-=._:@/]{1,256}$/,
};

const RESTRICTED_VALUES = ['ovh', 'aws'];
const RESTRICTED_PREFIXES = ['ovh:', 'aws:'];

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
  tagOrder,
  setTagOrder,
  isEditMode,
}: TReplicationRuleTagProps) {
  const { t } = useTranslation([
    'containers/add',
    'containers/replication/add',
    'pci-common',
  ]);

  const [showAddInputs, setShowAddInputs] = useState<boolean>(true);
  const [isValidAdd, setIsValidAdd] = useState<boolean>(false);
  const [isTabPressed, setIsTabPressed] = useState<boolean>(false);
  const [editingTags, setEditingTags] = useState<Record<string, boolean>>({});

  const tagEntries = tagOrder
    .filter((key) => replicationRuleTags[key] !== undefined)
    .map((key) => [key, replicationRuleTags[key]]);

  useEffect(() => {
    const tagCount = Object.keys(replicationRuleTags).length;

    if (isEditMode && tagCount > 0 && tagCount < MAX_TAGS) {
      setShowAddInputs(false);
      setIsValidAdd(true);
    }
  }, [isEditMode]);

  const hasRestrictedPattern = (str: string): boolean => {
    const lowerStr = str.toLowerCase();
    return (
      RESTRICTED_PREFIXES.some((prefix) => lowerStr.startsWith(prefix)) ||
      RESTRICTED_VALUES.some((value) => lowerStr === value)
    );
  };

  const validateTagKey = useCallback(
    (key: string, currentKey?: string): string | undefined => {
      if (!key) {
        return t('pci-common:common_field_error_required');
      }
      if (!TAG_PATTERNS.KEY.test(key) || hasRestrictedPattern(key)) {
        return t('pci-common:common_field_error_pattern');
      }

      const isDuplicate = Object.keys(replicationRuleTags).some(
        (existingKey) => existingKey === key && existingKey !== currentKey,
      );

      if (isDuplicate) {
        return t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_tag_key_duplicate_error',
        );
      }

      return undefined;
    },
    [replicationRuleTags, t],
  );

  const validateTagValue = useCallback(
    (value: string): string | undefined => {
      if (!value) return undefined;

      if (!TAG_PATTERNS.VALUE.test(value) || hasRestrictedPattern(value)) {
        return t('pci-common:common_field_error_pattern');
      }

      return undefined;
    },
    [t],
  );

  const handleTagChange = useCallback(
    (key: string, field: 'key' | 'value', value: string) => {
      setDraftTags((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || { key, value: replicationRuleTags[key] }),
          [field]: value,
        },
      }));

      if (field === 'key') {
        const error = validateTagKey(value, key);
        setKeyErrors((prev) => ({ ...prev, [key]: error }));
      } else if (field === 'value') {
        const error = validateTagValue(value);
        setValueErrors((prev) => ({ ...prev, [key]: error }));
      }

      setIsTouched((prev) => ({ ...prev, [key]: true }));
    },
    [
      replicationRuleTags,
      setDraftTags,
      setKeyErrors,
      setValueErrors,
      validateTagKey,
      validateTagValue,
      setIsTouched,
    ],
  );

  const commitTagChange = useCallback(
    (key: string) => {
      const draftTag = draftTags[key];
      if (!draftTag) return;

      const keyError = validateTagKey(draftTag.key, key);
      const valueError = validateTagValue(draftTag.value);

      setKeyErrors((prev) => ({ ...prev, [key]: keyError }));
      setValueErrors((prev) => ({ ...prev, [key]: valueError }));
      setIsTouched((prev) => ({ ...prev, [key]: true }));

      if (!keyError && !valueError) {
        const newTags = { ...replicationRuleTags };
        if (key !== draftTag.key) {
          delete newTags[key];
          setTagOrder((prev) => {
            const index = prev.indexOf(key);
            if (index !== -1) {
              const newOrder = [...prev];
              newOrder[index] = draftTag.key;
              return newOrder;
            }
            return prev;
          });
        }

        newTags[draftTag.key] = draftTag.value;
        setReplicationRuleTags(newTags);

        if (key !== draftTag.key) {
          setDraftTags((prev) => {
            const newDraftTags = { ...prev };
            delete newDraftTags[key];
            newDraftTags[draftTag.key] = draftTag;
            return newDraftTags;
          });
        }

        setEditingTags((prev) => {
          const newEditingTags = { ...prev };
          delete newEditingTags[key];
          return newEditingTags;
        });
      }
    },
    [
      draftTags,
      replicationRuleTags,
      setDraftTags,
      setKeyErrors,
      setReplicationRuleTags,
      setTagOrder,
      setValueErrors,
      validateTagKey,
      validateTagValue,
      setIsTouched,
    ],
  );

  const handleNewTagChange = useCallback(
    (field: 'key' | 'value', value: string) => {
      setDraftTags((prev) => ({
        ...prev,
        new: {
          ...(prev.new || { key: '', value: '' }),
          [field]: value,
        },
      }));

      if (field === 'key') {
        if (value) {
          const errorKey = validateTagKey(value);
          setKeyErrors((prev) => ({ ...prev, new: errorKey }));
        } else {
          setKeyErrors((prev) => ({ ...prev, new: undefined }));
        }
      } else if (field === 'value') {
        const errorValue = validateTagValue(value);
        setValueErrors((prev) => ({ ...prev, new: errorValue }));

        if (value) {
          const errorKey = validateTagKey(draftTags.new?.key);
          setKeyErrors((prev) => ({ ...prev, new: errorKey }));
        }
      }
      setIsTouched((prev) => ({ ...prev, new: true }));
    },
    [
      draftTags.new?.key,
      setDraftTags,
      setIsTouched,
      setKeyErrors,
      setValueErrors,
      validateTagKey,
      validateTagValue,
    ],
  );

  const addNewTag = useCallback(() => {
    const newDraftTag = draftTags.new;
    if (!newDraftTag || Object.keys(replicationRuleTags).length >= MAX_TAGS)
      return;

    let keyError = validateTagKey(newDraftTag.key);
    if (newDraftTag.key === '') {
      keyError = undefined;
    }

    const valueError = validateTagValue(newDraftTag.value);

    setKeyErrors((prev) => ({ ...prev, new: keyError }));
    setValueErrors((prev) => ({ ...prev, new: valueError }));

    if (!keyError && !valueError && newDraftTag.key) {
      const isDuplicate = Object.keys(replicationRuleTags).includes(
        newDraftTag.key,
      );
      if (isDuplicate) {
        setKeyErrors((prev) => ({
          ...prev,
          new: t('containers/replication/add:tag_key_duplicate_error'),
        }));
        return;
      }

      setReplicationRuleTags({
        ...replicationRuleTags,
        [newDraftTag.key]: newDraftTag.value || '',
      });

      setTagOrder((prev) => [...prev, newDraftTag.key]);

      setDraftTags((prev) => {
        const newDraftTags = { ...prev };
        delete newDraftTags.new;
        return newDraftTags;
      });

      setKeyErrors((prev) => {
        const newKeyErrors = { ...prev };
        delete newKeyErrors.new;
        return newKeyErrors;
      });

      setValueErrors((prev) => {
        const newValueErrors = { ...prev };
        delete newValueErrors.new;
        return newValueErrors;
      });

      setIsTouched((prev) => {
        const newTouched = { ...prev };
        delete newTouched.new;
        return newTouched;
      });

      setShowAddInputs(false);
      if (tagEntries.length < MAX_TAGS - 1) {
        setIsValidAdd(true);
      }
    }
  }, [
    draftTags.new,
    replicationRuleTags,
    setDraftTags,
    setIsTouched,
    setIsValidAdd,
    setKeyErrors,
    setReplicationRuleTags,
    setTagOrder,
    setValueErrors,
    t,
    validateTagKey,
    validateTagValue,
    tagEntries,
  ]);

  const handleNewTagValidate = useCallback(() => {
    setIsTouched((prev) => ({ ...prev, new: true }));
    const newDraftTag = draftTags.new;
    setIsValidAdd(false);

    if (newDraftTag?.key && !isTabPressed) {
      addNewTag();
    }
    setIsTabPressed(false);
  }, [addNewTag, draftTags.new, isTabPressed, setIsTouched]);

  const removeTag = useCallback(
    (key: string) => {
      setReplicationRuleTags((prev) => {
        const newTags = { ...prev };
        delete newTags[key];
        return newTags;
      });

      setTagOrder((prev) => prev.filter((k) => k !== key));

      setDraftTags((prev) => {
        const newDraftTags = { ...prev };
        delete newDraftTags[key];
        return newDraftTags;
      });

      setKeyErrors((prev) => {
        const newKeyErrors = { ...prev };
        delete newKeyErrors[key];
        return newKeyErrors;
      });

      setValueErrors((prev) => {
        const newValueErrors = { ...prev };
        delete newValueErrors[key];
        return newValueErrors;
      });

      setIsTouched((prev) => {
        const newTouched = { ...prev };
        delete newTouched[key];
        return newTouched;
      });

      setEditingTags((prev) => {
        const newEditingTags = { ...prev };
        delete newEditingTags[key];
        return newEditingTags;
      });

      if (!isValidAdd && tagEntries.length === 10) {
        setIsValidAdd(true);
      }
    },
    [
      setDraftTags,
      setIsTouched,
      setKeyErrors,
      setReplicationRuleTags,
      setTagOrder,
      setValueErrors,
      tagEntries,
      isValidAdd,
    ],
  );

  const handleTagFocus = (key: string) => {
    setEditingTags((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_subtitle',
        )}
      </label>

      {tagEntries.map(([key, value]) => {
        const draftTag = draftTags[key] || { key, value };
        const isEditing = editingTags[key];
        const showKeyError = isTouched[key] && keyErrors[key];
        const showValueError = isTouched[key] && valueErrors[key];

        return (
          <div
            key={key}
            className="flex flex-col md:flex-row md:items-end gap-4 mb-4 mt-4"
          >
            <OdsFormField
              className="mt-2 w-full md:w-auto md:min-w-[300px] block"
              error={showKeyError ? keyErrors[key] : undefined}
            >
              <label slot="label">
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_key',
                )}
              </label>
              <OdsInput
                className={clsx(
                  'w-full',
                  showValueError && !showKeyError && 'margin-error',
                )}
                placeholder={t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_key_placeholder',
                )}
                hasError={showKeyError ? !!keyErrors[key] : false}
                value={draftTag.key}
                name={`tag-key-${key}`}
                color="primary"
                onOdsChange={(event) =>
                  handleTagChange(key, 'key', event.detail.value.toString())
                }
                onOdsFocus={() => handleTagFocus(key)}
                onOdsBlur={() => {
                  setIsTouched((prev) => ({ ...prev, [key]: true }));
                }}
              />
            </OdsFormField>

            <OdsFormField
              className="mt-2 w-full md:w-auto md:min-w-[300px] block"
              error={showValueError ? valueErrors[key] : undefined}
            >
              <label slot="label">
                {t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_value',
                )}
              </label>
              <OdsInput
                className={clsx(
                  'w-full',
                  showKeyError && !showValueError && 'margin-error',
                )}
                placeholder={t(
                  'containers/replication/add:pci_projects_project_storages_containers_replication_add_value_placeholder',
                )}
                hasError={showValueError ? !!valueErrors[key] : false}
                value={draftTag.value}
                name={`tag-value-${key}`}
                color="primary"
                onOdsChange={(event) =>
                  handleTagChange(key, 'value', event.detail.value.toString())
                }
                onOdsFocus={() => handleTagFocus(key)}
                onOdsBlur={() => {
                  setIsTouched((prev) => ({ ...prev, [key]: true }));
                }}
              />
            </OdsFormField>

            <div className="w-full md:w-auto mb-2 md:mb-0">
              {isEditing ? (
                <OdsButton
                  className={clsx(
                    'w-full md:w-auto',
                    (showKeyError || showValueError) && 'margin-button-error',
                  )}
                  icon="check"
                  size="sm"
                  label=""
                  variant={ODS_BUTTON_VARIANT.outline}
                  onClick={() => commitTagChange(key)}
                  isDisabled={!!showKeyError || !!showValueError}
                ></OdsButton>
              ) : (
                <OdsButton
                  className={clsx(
                    'w-full md:w-auto',
                    (showKeyError || showValueError) && 'margin-button-error',
                  )}
                  icon="trash"
                  size="sm"
                  label=""
                  variant={ODS_BUTTON_VARIANT.outline}
                  onClick={() => removeTag(key)}
                ></OdsButton>
              )}
            </div>
          </div>
        );
      })}

      {showAddInputs && tagEntries.length < MAX_TAGS && (
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
              hasError={isTouched.new && keyErrors.new !== undefined}
              placeholder={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_key_placeholder',
              )}
              value={draftTags.new?.key || ''}
              name="new-tag-key"
              color="primary"
              onOdsChange={(event) =>
                handleNewTagChange('key', event.detail.value.toString())
              }
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
              hasError={isTouched.new && valueErrors.new !== undefined}
              placeholder={t(
                'containers/replication/add:pci_projects_project_storages_containers_replication_add_value_placeholder',
              )}
              value={draftTags.new?.value || ''}
              name="new-tag-value"
              color="primary"
              onOdsChange={(event) =>
                handleNewTagChange('value', event.detail.value.toString())
              }
            />
          </OdsFormField>

          <div className="w-full md:w-auto">
            <div className="flex">
              <OdsButton
                className={clsx(
                  'w-full md:w-auto',
                  ((isTouched.new && keyErrors.new) ||
                    (isTouched.new && valueErrors.new)) &&
                    'margin-error',
                )}
                icon="check"
                label=""
                variant={ODS_BUTTON_VARIANT.outline}
                size="sm"
                onClick={handleNewTagValidate}
                isDisabled={
                  deleteMarkerReplication === STATUS_ENABLED ||
                  keyErrors.new !== undefined ||
                  valueErrors.new !== undefined ||
                  draftTags.new?.key === ''
                }
              ></OdsButton>

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
      <div className="w-full md:w-auto mt-4 mb-2 md:mb-0">
        <OdsButton
          isDisabled={!isValidAdd}
          label={t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_add_new_tag',
          )}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            setShowAddInputs(true);
            setIsValidAdd(false);
          }}
        ></OdsButton>
      </div>
    </OdsFormField>
  );
}
