import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsFormField } from '@ovhcloud/ods-components/react';

import {
  TTagValidationResult,
  TNewTag,
  TValidationErrors,
  emptyTag,
} from '../../../../../utils/useTagValidation';
import './style.scss';
import { TagRow } from './TagRow.component';
import { NewTagForm } from './NewTagForm.component';
import { TReplicationStatus } from './ManageReplicationPage.form';

export type TTag = {
  id: number;
  key: string;
  value: string;
};

export type TTagMap = Record<number, { key: string; value: string }>;

export type TReplicationRuleTagProps = {
  tags: TTagMap;
  setTags: React.Dispatch<React.SetStateAction<TTagMap>>;
  validationErrors: TValidationErrors;
  setValidationErrors: (validationErrors: TValidationErrors) => void;
  newTagErrors: TTagValidationResult;
  setNewTagErrors: (newTagErrors: { key?: string; value?: string }) => void;
  newTag: TNewTag;
  setNewTag: (newTag: { key: string; value: string }) => void;
  isEditMode?: boolean;
  deleteMarkerReplication: TReplicationStatus;
  maxTags?: number;
};

export const DEFAULT_MAX_TAGS = 10;

export function ReplicationRuleTag({
  tags,
  setTags,
  validationErrors,
  setValidationErrors,
  newTagErrors,
  setNewTagErrors,
  newTag,
  setNewTag,
  isEditMode,
  deleteMarkerReplication,
  maxTags = DEFAULT_MAX_TAGS,
}: TReplicationRuleTagProps) {
  const tagsArray = useMemo(() => {
    return Object.entries(tags).map(([id, { key, value }]) => ({
      id: Number(id),
      key,
      value,
    }));
  }, [tags]);

  const { t } = useTranslation(['containers/replication/add']);
  const [editingState, setEditingState] = useState<{
    id: number | null;
    key: string;
  }>({ id: null, key: '' });

  const shouldHideNewTagForm = isEditMode && Object.keys(tags).length > 0;

  const [nextId, setNextId] = useState<number>(() =>
    shouldHideNewTagForm ? Object.keys(tags).length + 1 : 1,
  );

  const [showNewTagForm, setShowNewTagForm] = useState<boolean>(
    () => !shouldHideNewTagForm,
  );

  const canAddMoreTags = tagsArray.length < maxTags;

  const clearInputErrors = useCallback(
    (id: number, field: 'key' | 'value') => {
      if (id === -1) {
        const newErrors = { ...newTagErrors };
        delete newErrors[field];
        setNewTagErrors(newErrors);
      } else {
        const newErrors = { ...validationErrors };

        if (newErrors[id]) {
          delete newErrors[id][field];
          if (Object.keys(newErrors[id]).length === 0) {
            delete newErrors[id];
          }
        }

        setValidationErrors(newErrors);
      }
    },
    [validationErrors, setValidationErrors, newTagErrors, setNewTagErrors],
  );

  const handleTagChange = useCallback(
    (id: number, field: 'key' | 'value', value: string) => {
      if (field === 'key') {
        setEditingState((prev) => ({ ...prev, key: value }));
        clearInputErrors(id, 'key');
      } else {
        setTags((prev) => ({
          ...prev,
          [id]: { ...prev[id], [field]: value },
        }));
        clearInputErrors(id, 'value');
      }
    },
    [setTags, clearInputErrors],
  );

  const handleKeyBlur = useCallback(
    (id: number) => {
      setTags((prev) => ({
        ...prev,
        [id]: { ...prev[id], key: editingState.key },
      }));

      setEditingState({ id: null, key: '' });
    },
    [editingState.key, setTags],
  );

  const handleNewTagChange = useCallback(
    (field: 'key' | 'value', value: string) => {
      setNewTag({ ...newTag, [field]: value });
    },
    [newTag, setNewTag],
  );

  const addNewTag = useCallback(() => {
    if (!showNewTagForm) {
      setShowNewTagForm(true);
    } else if (canAddMoreTags) {
      const id = nextId;

      setTags((prev) => ({
        ...prev,
        [id]: { key: newTag.key, value: newTag.value },
      }));
      setNewTag(emptyTag);
      setNextId((prevId) => prevId + 1);
      setNewTagErrors({});
    }
  }, [
    canAddMoreTags,
    newTag.key,
    newTag.value,
    nextId,
    setTags,
    setShowNewTagForm,
    setNewTag,
    setNextId,
    setNewTagErrors,
    showNewTagForm,
  ]);

  const removeTag = useCallback(
    (id: number) => {
      setTags((prev) => {
        const newTags = { ...prev };
        delete newTags[id];
        return newTags;
      });
      const newErrors = { ...validationErrors };
      delete newErrors[id];

      setValidationErrors(newErrors);
    },
    [setTags],
  );

  const removeNewTag = useCallback(() => {
    setNewTag(emptyTag);
    setNewTagErrors({});
    setShowNewTagForm(false);
  }, [setNewTag, setNewTagErrors]);

  const handleKeyFocus = useCallback(
    (id: number, currentKey: string) => {
      setEditingState({ id, key: currentKey });
      clearInputErrors(id, 'key');
    },
    [clearInputErrors],
  );

  const handleValueFocus = useCallback(
    (id: number) => {
      clearInputErrors(id, 'value');
    },
    [clearInputErrors],
  );

  const handleNewKeyFocus = useCallback(() => {
    clearInputErrors(-1, 'key');
  }, [clearInputErrors]);

  const handleNewValueFocus = useCallback(() => {
    clearInputErrors(-1, 'value');
  }, [clearInputErrors]);

  return (
    <OdsFormField className="mt-8 max-w-[800px] block">
      <label slot="label" className="block">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_subtitle',
        )}
      </label>

      {tagsArray.map(({ id, key, value }) => (
        <TagRow
          key={id}
          id={id}
          keyValue={key}
          value={value}
          isEditing={editingState.id === id}
          editingKey={editingState.key}
          onKeyFocus={handleKeyFocus}
          onValueFocus={handleValueFocus}
          onTagChange={handleTagChange}
          onKeyBlur={handleKeyBlur}
          onRemove={removeTag}
          t={t}
          errors={validationErrors[id]}
        />
      ))}

      {canAddMoreTags && (
        <NewTagForm
          newTag={newTag}
          onNewTagChange={handleNewTagChange}
          onAddNewTag={addNewTag}
          onNewKeyFocus={handleNewKeyFocus}
          onNewValueFocus={handleNewValueFocus}
          onRemoveNewTag={removeNewTag}
          showNewTagForm={showNewTagForm}
          t={t}
          deleteMarkerReplication={deleteMarkerReplication}
          tagsLength={tagsArray.length}
          errors={newTagErrors}
        />
      )}
    </OdsFormField>
  );
}
