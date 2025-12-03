import {
  formatKeyValueArrayFromString,
  formatStringFromKeyValueArray,
  isKeyValueObject,
  isStringValidForKeyValueForm,
} from './keyValue';

describe('isKeyValueObject', () => {
  describe('should return true for valid simple key/value objects', () => {
    it('should return true for empty object', () => {
      expect(isKeyValueObject({})).toBe(true);
    });

    it('should return true for object with string values', () => {
      expect(isKeyValueObject({ key1: 'value1', key2: 'value2' })).toBe(true);
    });

    it('should return true for object with number values', () => {
      expect(isKeyValueObject({ count: 42, price: 99.99 })).toBe(true);
    });

    it('should return true for object with boolean values', () => {
      expect(isKeyValueObject({ isActive: true, isVisible: false })).toBe(true);
    });

    it('should return true for object with null values', () => {
      expect(isKeyValueObject({ name: null, description: null })).toBe(true);
    });

    it('should return true for object with undefined values', () => {
      expect(isKeyValueObject({ optional: undefined, missing: undefined })).toBe(true);
    });

    it('should return true for object with mixed primitive types', () => {
      expect(
        isKeyValueObject({
          name: 'John',
          age: 30,
          isActive: true,
          score: null,
          description: undefined,
        }),
      ).toBe(true);
    });

    it('should return true for object with numeric string keys', () => {
      expect(isKeyValueObject({ '0': 'zero', '1': 'one' })).toBe(true);
    });

    it('should return true for object with special character keys', () => {
      expect(
        isKeyValueObject({
          'key-with-dash': 'value',
          key_with_underscore: 'value',
        }),
      ).toBe(true);
    });
  });

  describe('should return false for invalid objects', () => {
    it('should return false for null', () => {
      expect(isKeyValueObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isKeyValueObject(undefined)).toBe(false);
    });

    it('should return false for primitive types', () => {
      expect(isKeyValueObject('string')).toBe(false);
      expect(isKeyValueObject(42)).toBe(false);
      expect(isKeyValueObject(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isKeyValueObject([])).toBe(false);
      expect(isKeyValueObject([1, 2, 3])).toBe(false);
      expect(isKeyValueObject(['a', 'b', 'c'])).toBe(false);
    });

    it('should return false for objects with nested objects', () => {
      expect(isKeyValueObject({ user: { name: 'John', age: 30 } })).toBe(false);
      expect(isKeyValueObject({ data: { nested: { deep: 'value' } } })).toBe(false);
    });

    it('should return false for objects with array values', () => {
      expect(isKeyValueObject({ items: [1, 2, 3] })).toBe(false);
      expect(isKeyValueObject({ tags: ['tag1', 'tag2'] })).toBe(false);
    });

    it('should return false for objects with function values', () => {
      expect(isKeyValueObject({ callback: () => 'test' })).toBe(false);
      expect(
        isKeyValueObject({
          method() {
            return 'test';
          },
        }),
      ).toBe(false);
    });

    it('should return false for Date objects', () => {
      expect(isKeyValueObject(new Date())).toBe(false);
    });

    it('should return false for RegExp objects', () => {
      expect(isKeyValueObject(/test/)).toBe(false);
      expect(isKeyValueObject(new RegExp('test'))).toBe(false);
    });

    it('should return false for Error objects', () => {
      expect(isKeyValueObject(new Error('test'))).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isKeyValueObject(() => 'test')).toBe(false);
      expect(
        isKeyValueObject(function test() {
          return 'test';
        }),
      ).toBe(false);
    });

    it('should return false for objects with mixed valid and invalid values', () => {
      expect(
        isKeyValueObject({
          valid: 'string',
          invalid: { nested: 'object' },
        }),
      ).toBe(false);
    });
  });
});

describe('isStringValidForKeyValueForm', () => {
  it('should return true for empty string', () => {
    expect(isStringValidForKeyValueForm('')).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isStringValidForKeyValueForm(undefined)).toBe(true);
  });

  it('should return true for valid JSON object', () => {
    expect(isStringValidForKeyValueForm('{"key1":"value1","key2":"value2"}')).toBe(true);
  });

  it('should return false for malformed JSON', () => {
    expect(isStringValidForKeyValueForm('{ invalid: "json" }')).toBe(false);
  });
});

describe('formatKeyValueArrayFromString', () => {
  it('should return array of key-value pairs for a good key/value object', () => {
    const result = formatKeyValueArrayFromString(
      '{"key1":"value1","key2":"value2","key3":"value3"}',
    );
    expect(result).toEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
      { key: 'key3', value: 'value3' },
    ]);
  });

  it('should return empty pair for an invalid key/value object', () => {
    const result = formatKeyValueArrayFromString('{"key":{"nested":"object"}}');
    expect(result).toEqual([{ key: '', value: '' }]);
  });

  it('should return empty pair for empty string', () => {
    const result = formatKeyValueArrayFromString('');
    expect(result).toEqual([{ key: '', value: '' }]);
  });
});

describe('formatStringFromKeyValueArray', () => {
  it('should return JSON string for array of key-value pairs', () => {
    const result = formatStringFromKeyValueArray([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
    expect(result).toBe('{"key1":"value1","key2":"value2"}');
  });

  it('should return empty string for empty array', () => {
    const result = formatStringFromKeyValueArray([]);
    expect(result).toBe('');
  });
});
