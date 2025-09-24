import { describe, it, expect } from 'vitest';
import {
  validateTag,
  validateAllTags,
  TAG_PATTERNS,
  RESTRICTED_VALUES,
  RESTRICTED_PREFIXES,
} from './useTagValidation';

describe('tagValidation', () => {
  const mockT = (key: string) => {
    const translations: Record<string, string> = {
      'pci-common:common_field_error_required': 'This field is required',
      'pci-common:common_field_error_pattern': 'Restricted value',
      'containers/replication/add:pci_projects_project_storages_containers_replication_add_tags_tag_key_duplicate_error':
        'Duplicate key',
    };
    return translations[key] || key;
  };

  describe('TAG_PATTERNS', () => {
    it('should validate correct key patterns', () => {
      expect(TAG_PATTERNS.KEY.test('validKey123')).toBe(true);
      expect(TAG_PATTERNS.KEY.test('valid-key.123')).toBe(true);
      expect(TAG_PATTERNS.KEY.test('valid+key=123')).toBe(true);
      expect(TAG_PATTERNS.KEY.test('valid:key@123')).toBe(true);
      expect(TAG_PATTERNS.KEY.test('a'.repeat(128))).toBe(true);
    });

    it('should reject invalid key patterns', () => {
      expect(TAG_PATTERNS.KEY.test('')).toBe(false);
      expect(TAG_PATTERNS.KEY.test('invalid key')).toBe(false);
      expect(TAG_PATTERNS.KEY.test('invalid*key')).toBe(false);
      expect(TAG_PATTERNS.KEY.test('a'.repeat(129))).toBe(false);
    });

    it('should validate correct value patterns', () => {
      expect(TAG_PATTERNS.VALUE.test('')).toBe(true);
      expect(TAG_PATTERNS.VALUE.test('validValue123')).toBe(true);
      expect(TAG_PATTERNS.VALUE.test('valid-value.123')).toBe(true);
      expect(TAG_PATTERNS.VALUE.test('valid+value=123')).toBe(true);
      expect(TAG_PATTERNS.VALUE.test('valid:value@123')).toBe(true);
      expect(TAG_PATTERNS.VALUE.test('a'.repeat(256))).toBe(true);
    });

    it('should reject invalid value patterns', () => {
      expect(TAG_PATTERNS.VALUE.test('invalid value')).toBe(false);
      expect(TAG_PATTERNS.VALUE.test('invalid*value')).toBe(false);
      expect(TAG_PATTERNS.VALUE.test('a'.repeat(257))).toBe(false);
    });
  });

  describe('validateTag', () => {
    it('should return no errors for valid tag', () => {
      const result = validateTag({
        key: 'validKey',
        value: 'validValue',
        t: mockT,
      });
      expect(result).toEqual({});
    });

    it('should return no errors when both key and value are empty', () => {
      const result = validateTag({ key: '', value: '', t: mockT });
      expect(result).toEqual({});
    });

    it('should require key when value is provided', () => {
      const result = validateTag({ key: '', value: 'someValue', t: mockT });
      expect(result).toEqual({ key: 'This field is required' });
    });

    it('should validate key pattern', () => {
      const result = validateTag({ key: 'invalid key', value: '', t: mockT });
      expect(result).toEqual({ key: 'Restricted value' });
    });

    it('should validate value pattern when provided', () => {
      const result = validateTag({
        key: 'validKey',
        value: 'invalid value',
        t: mockT,
      });
      expect(result).toEqual({ value: 'Restricted value' });
    });

    it('should reject restricted values in key', () => {
      RESTRICTED_VALUES.forEach((value) => {
        const result = validateTag({ key: value, value: '', t: mockT });
        expect(result).toEqual({ key: 'Restricted value' });
      });
    });

    it('should reject restricted prefixes in key', () => {
      RESTRICTED_PREFIXES.forEach((prefix) => {
        const result = validateTag({
          key: `${prefix}something`,
          value: '',
          t: mockT,
        });
        expect(result).toEqual({ key: 'Restricted value' });
      });
    });

    it('should reject restricted values in value', () => {
      RESTRICTED_VALUES.forEach((value) => {
        const result = validateTag({ key: 'validKey', value, t: mockT });
        expect(result).toEqual({ value: 'Restricted value' });
      });
    });

    it('should reject restricted prefixes in value', () => {
      RESTRICTED_PREFIXES.forEach((prefix) => {
        const result = validateTag({
          key: 'validKey',
          value: `${prefix}something`,
          t: mockT,
        });
        expect(result).toEqual({ value: 'Restricted value' });
      });
    });

    it('should handle case insensitivity for restricted values', () => {
      const result = validateTag({ key: 'OVH', value: 'AWS', t: mockT });
      expect(result).toEqual({
        key: 'Restricted value',
        value: 'Restricted value',
      });
    });
  });

  describe('validateAllTags', () => {
    it('should return no errors for empty tags and empty new tag', () => {
      const result = validateAllTags({
        tags: {},
        newTag: { key: '', value: '' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {},
        newTagErrors: {},
      });
    });

    it('should validate new tag', () => {
      const result = validateAllTags({
        tags: {},
        newTag: { key: 'invalid key', value: 'invalid value' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {},
        newTagErrors: {
          key: 'Restricted value',
          value: 'Restricted value',
        },
      });
    });

    it('should detect duplicate key in new tag', () => {
      const result = validateAllTags({
        tags: {
          1: { key: 'existingKey', value: 'value1' },
        },
        newTag: { key: 'existingKey', value: 'value2' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {},
        newTagErrors: {
          key: 'Duplicate key',
        },
      });
    });

    it('should validate existing tags', () => {
      const result = validateAllTags({
        tags: {
          1: { key: 'invalid key', value: 'validValue' },
          2: { key: 'validKey', value: 'invalid value' },
        },
        newTag: { key: '', value: '' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {
          1: { key: 'Restricted value' },
          2: { value: 'Restricted value' },
        },
        newTagErrors: {},
      });
    });

    it('should detect duplicate keys among existing tags', () => {
      const result = validateAllTags({
        tags: {
          1: { key: 'duplicateKey', value: 'value1' },
          2: { key: 'duplicateKey', value: 'value2' },
          3: { key: 'uniqueKey', value: 'value3' },
        },
        newTag: { key: '', value: '' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {
          2: { key: 'Duplicate key' },
        },
        newTagErrors: {},
      });
    });

    it('should handle multiple validation issues', () => {
      const result = validateAllTags({
        tags: {
          1: { key: 'invalid key', value: 'validValue' },
          2: { key: 'duplicateKey', value: 'invalid value' },
          3: { key: 'duplicateKey', value: 'validValue' },
        },
        newTag: { key: 'duplicateKey', value: 'invalid value' },
        t: mockT,
      });
      expect(result).toEqual({
        validationErrors: {
          1: { key: 'Restricted value' },
          2: { value: 'Restricted value' },
          3: { key: 'Duplicate key' },
        },
        newTagErrors: {
          key: 'Duplicate key',
          value: 'Restricted value',
        },
      });
    });

    it('should not mark first occurrence of key as duplicate', () => {
      const result = validateAllTags({
        tags: {
          1: { key: 'duplicateKey', value: 'value1' },
          2: { key: 'duplicateKey', value: 'value2' },
        },
        newTag: { key: '', value: '' },
        t: mockT,
      });
      expect(result.validationErrors[1]).toBeUndefined();
      expect(result.validationErrors[2]?.key).toBe('Duplicate key');
    });
  });
});
