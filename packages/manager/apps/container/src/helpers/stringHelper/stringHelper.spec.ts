import { capitalize, truncate, toScreamingSnakeCase } from '@/helpers';

describe('stringHelpers', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('foo')).toEqual('Foo');
    });

    it('should change the case of the rest of the string to lowercase in accordance to lodash.capitalize', () => {
      expect(capitalize('FOOBAR')).toEqual('Foobar');
    });

    it('should return an empty string if the input is empty', () => {
      expect(capitalize('')).toEqual('');
    });
  });

  describe('truncate', () => {
    it('should truncate a string to the specified length', () => {
      expect(truncate('foo', { length: 3 })).toEqual('foo');
      expect(truncate('foo', { length: 2 })).toEqual('fo...');
    });

    it('should return the original string if it is shorter than the specified length', () => {
      expect(truncate('foo', { length: 5 })).toEqual('foo');
    });
  });

  describe('toScreamingSnakeCase', () => {
    it('should return an empty string if the input is empty', () => {
      expect(toScreamingSnakeCase('')).toEqual('');
    });

    it('should return a screaming snake case version of the input', () => {
      expect(toScreamingSnakeCase('fooBar')).toEqual('FOO_BAR');
    });
  });
});
