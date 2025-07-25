import { TTagMap } from '../pages/objects/container/object/add-replication/ReplicationRuleTag.component';

export const TAG_PATTERNS = {
  KEY: /^[a-zA-Z0-9+\-=._:@/]{1,128}$/,
  VALUE: /^[a-zA-Z0-9+\-=._:@/]{0,256}$/,
} as const;

export const RESTRICTED_VALUES = ['ovh', 'aws'] as const;
export const RESTRICTED_PREFIXES = ['ovh:', 'aws:'] as const;

export const emptyTag = { key: '', value: '' };

export type TValidationErrors = {
  [id: number]: {
    key?: string;
    value?: string;
  };
};

export type TTagValidationResult = {
  key?: string;
  value?: string;
};

export type TValidateTagParams = {
  key: string;
  value: string;
  t: (key: string) => string;
};
export type TNewTag = { key: string; value: string };
export type TValidateAllTagsParams = {
  tags: TTagMap;
  newTag: TNewTag;
  t: (key: string) => string;
};

export type TValidateAllTagsResult = {
  validationErrors: TValidationErrors;
  newTagErrors: TTagValidationResult;
};

export const validateTag = ({
  key,
  value,
  t,
}: TValidateTagParams): TTagValidationResult => {
  const errors: TTagValidationResult = {};

  const isRestricted = (input: string): boolean =>
    RESTRICTED_VALUES.includes(
      input.toLowerCase() as typeof RESTRICTED_VALUES[number],
    ) ||
    RESTRICTED_PREFIXES.some((prefix) =>
      input.toLowerCase().startsWith(prefix),
    );

  const isValidPattern = (input: string, pattern: RegExp): boolean =>
    pattern.test(input);

  if (!key) {
    if (!value) {
      return {};
    }
    errors.key = t('pci-common:common_field_error_required');
  } else if (!isValidPattern(key, TAG_PATTERNS.KEY) || isRestricted(key)) {
    errors.key = t('pci-common:common_field_error_pattern');
  }

  if (value) {
    if (!isValidPattern(value, TAG_PATTERNS.VALUE) || isRestricted(value)) {
      errors.value = t('pci-common:common_field_error_pattern');
    }
  }

  return errors;
};

export const validateAllTags = ({
  tags,
  newTag,
  t,
}: TValidateAllTagsParams): TValidateAllTagsResult => {
  const tagsArray = Object.entries(tags).map(([id, { key, value }]) => ({
    id: Number(id),
    key,
    value,
  }));

  const validationErrors: TValidationErrors = {};
  let newTagErrors: TTagValidationResult = {};

  if (newTag.key || newTag.value) {
    newTagErrors = validateTag({ key: newTag.key, value: newTag.value, t });

    const isDuplicate = tagsArray.some((tag) => tag.key === newTag.key);
    if (isDuplicate) {
      newTagErrors.key = t(
        'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_tag_key_duplicate_error',
      );
    }
  }

  tagsArray.forEach((tag) => {
    const validation = validateTag({ key: tag.key, value: tag.value, t });
    if (validation.key || validation.value) {
      validationErrors[tag.id] = validation;
    }
  });

  const keyOccurrences: Record<string, number[]> = {};

  tagsArray.forEach((tag) => {
    if (!keyOccurrences[tag.key]) {
      keyOccurrences[tag.key] = [];
    }
    keyOccurrences[tag.key].push(tag.id);
  });

  Object.entries(keyOccurrences).forEach(([, ids]) => {
    if (ids.length > 1) {
      ids.slice(1).forEach((id) => {
        validationErrors[id] = validationErrors[id] || {};

        if (tags[id].key) {
          validationErrors[id].key = t(
            'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_tag_key_duplicate_error',
          );
        }
      });
    }
  });

  return { validationErrors, newTagErrors };
};
