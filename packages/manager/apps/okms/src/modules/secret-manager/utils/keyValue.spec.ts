import { isSimpleKeyValueObject } from './keyValue';

describe('isSimpleKeyValueObject', () => {
  describe('should return true for valid simple key/value objects', () => {
    it('should return true for empty object', () => {
      expect(isSimpleKeyValueObject({})).toBe(true);
    });

    it('should return true for object with string values', () => {
      expect(isSimpleKeyValueObject({ key1: 'value1', key2: 'value2' })).toBe(
        true,
      );
    });

    it('should return true for object with number values', () => {
      expect(isSimpleKeyValueObject({ count: 42, price: 99.99 })).toBe(true);
    });

    it('should return true for object with boolean values', () => {
      expect(isSimpleKeyValueObject({ isActive: true, isVisible: false })).toBe(
        true,
      );
    });

    it('should return true for object with null values', () => {
      expect(isSimpleKeyValueObject({ name: null, description: null })).toBe(
        true,
      );
    });

    it('should return true for object with undefined values', () => {
      expect(
        isSimpleKeyValueObject({ optional: undefined, missing: undefined }),
      ).toBe(true);
    });

    it('should return true for object with mixed primitive types', () => {
      expect(
        isSimpleKeyValueObject({
          name: 'John',
          age: 30,
          isActive: true,
          score: null,
          description: undefined,
        }),
      ).toBe(true);
    });

    it('should return true for object with numeric string keys', () => {
      expect(isSimpleKeyValueObject({ '0': 'zero', '1': 'one' })).toBe(true);
    });

    it('should return true for object with special character keys', () => {
      expect(
        isSimpleKeyValueObject({
          'key-with-dash': 'value',
          key_with_underscore: 'value',
        }),
      ).toBe(true);
    });
  });

  describe('should return false for invalid objects', () => {
    it('should return false for null', () => {
      expect(isSimpleKeyValueObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isSimpleKeyValueObject(undefined)).toBe(false);
    });

    it('should return false for primitive types', () => {
      expect(isSimpleKeyValueObject('string')).toBe(false);
      expect(isSimpleKeyValueObject(42)).toBe(false);
      expect(isSimpleKeyValueObject(true)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isSimpleKeyValueObject([])).toBe(false);
      expect(isSimpleKeyValueObject([1, 2, 3])).toBe(false);
      expect(isSimpleKeyValueObject(['a', 'b', 'c'])).toBe(false);
    });

    it('should return false for objects with nested objects', () => {
      expect(isSimpleKeyValueObject({ user: { name: 'John', age: 30 } })).toBe(
        false,
      );
      expect(
        isSimpleKeyValueObject({ data: { nested: { deep: 'value' } } }),
      ).toBe(false);
    });

    it('should return false for objects with array values', () => {
      expect(isSimpleKeyValueObject({ items: [1, 2, 3] })).toBe(false);
      expect(isSimpleKeyValueObject({ tags: ['tag1', 'tag2'] })).toBe(false);
    });

    it('should return false for objects with function values', () => {
      expect(isSimpleKeyValueObject({ callback: () => 'test' })).toBe(false);
      expect(
        isSimpleKeyValueObject({
          method() {
            return 'test';
          },
        }),
      ).toBe(false);
    });

    it('should return false for Date objects', () => {
      expect(isSimpleKeyValueObject(new Date())).toBe(false);
    });

    it('should return false for RegExp objects', () => {
      expect(isSimpleKeyValueObject(/test/)).toBe(false);
      expect(isSimpleKeyValueObject(new RegExp('test'))).toBe(false);
    });

    it('should return false for Error objects', () => {
      expect(isSimpleKeyValueObject(new Error('test'))).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isSimpleKeyValueObject(() => 'test')).toBe(false);
      expect(
        isSimpleKeyValueObject(function test() {
          return 'test';
        }),
      ).toBe(false);
    });

    it('should return false for objects with mixed valid and invalid values', () => {
      expect(
        isSimpleKeyValueObject({
          valid: 'string',
          invalid: { nested: 'object' },
        }),
      ).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle objects with inherited properties', () => {
      const obj = Object.create({ inherited: 'value' });
      obj.own = 'property';
      expect(isSimpleKeyValueObject(obj)).toBe(true);
    });

    it('should handle objects with non-enumerable properties', () => {
      const obj = { visible: 'value' };
      Object.defineProperty(obj, 'hidden', {
        value: 'hidden',
        enumerable: false,
      });
      expect(isSimpleKeyValueObject(obj)).toBe(true);
    });

    it('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const obj = { [sym]: 'value', regular: 'key' };
      expect(isSimpleKeyValueObject(obj)).toBe(true);
    });
  });
});
