import { describe, it, expect } from 'vitest';
import { encodeSecretPath, decodeSecretPath } from './secretPath';

describe('secretPath', () => {
  describe('encodeSecretPath', () => {
    it('should replace slashes with tildes', () => {
      expect(encodeSecretPath('path/to/my/secret')).toBe('path~to~my~secret');
    });
  });

  describe('decodeSecretPath', () => {
    it('should replace tildes with slashes', () => {
      expect(decodeSecretPath('path~to~secret')).toBe('path/to/secret');
    });
  });

  describe('encode and decode roundtrip', () => {
    it('should return the original string after encoding and decoding', () => {
      const original = 'path/to/my/secret/value';
      const encoded = encodeSecretPath(original);
      const decoded = decodeSecretPath(encoded);
      expect(decoded).toBe(original);
    });
  });
});
