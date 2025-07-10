import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  convertToBase64,
  constructPostParams,
  parseFormSessionId,
} from './utils';

// Helper function to decode base64 with proper unicode handling
const decodeBase64Unicode = (base64String: string): string => {
  return decodeURIComponent(
    atob(base64String)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
};

// Helper function to encode unicode strings to base64
const encodeToBase64 = (data: Record<string, unknown>): string => {
  const jsonString = JSON.stringify(data);
  return btoa(
    encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(`0x${p1}`, 16)),
    ),
  );
};

describe('Adyen Utils', () => {
  beforeEach(() => {
    // Mock window.location.origin
    vi.stubGlobal('location', {
      origin: 'https://example.com',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('convertToBase64', () => {
    it('should convert simple string to base64', () => {
      const input = 'hello world';
      const result = convertToBase64(input);

      // Decode back to verify
      const decoded = atob(result);
      expect(decoded).toBe(input);
    });

    it('should handle unicode characters', () => {
      const input = 'héllo wörld 测试';
      const result = convertToBase64(input);

      // Should return a valid base64 string
      expect(result).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);

      // Decode and verify (using proper unicode decoding)
      const decoded = decodeBase64Unicode(result);
      expect(decoded).toBe(input);
    });

    it('should handle special characters', () => {
      const input = '{"special": "chars @#$%^&*()"}';
      const result = convertToBase64(input);

      expect(result).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);
    });

    it('should handle empty string', () => {
      const input = '';
      const result = convertToBase64(input);

      expect(result).toBe('');
    });
  });

  describe('constructPostParams', () => {
    it('should construct post params with form data', () => {
      const mockState = {
        data: {
          paymentMethod: 'card',
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
        },
      };

      const result = constructPostParams(mockState);

      expect(result).toHaveProperty('formData');
      expect(typeof result.formData).toBe('string');
      expect(result.formData).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);

      // Decode and verify the content
      const decoded = JSON.parse(decodeBase64Unicode(result.formData));

      expect(decoded).toEqual({
        ...mockState.data,
        origin: 'https://example.com',
      });
    });

    it('should include window origin in the data', () => {
      const mockState = {
        data: {
          testField: 'testValue',
        },
      };

      const result = constructPostParams(mockState);

      // Decode and verify origin is included
      const decoded = JSON.parse(decodeBase64Unicode(result.formData));

      expect(decoded.origin).toBe('https://example.com');
      expect(decoded.testField).toBe('testValue');
    });

    it('should handle empty data object', () => {
      const mockState = {
        data: {},
      };

      const result = constructPostParams(mockState);

      expect(result).toHaveProperty('formData');

      const decoded = JSON.parse(decodeBase64Unicode(result.formData));

      expect(decoded).toEqual({
        origin: 'https://example.com',
      });
    });

    it('should handle complex nested data', () => {
      const mockState = {
        data: {
          paymentMethod: {
            type: 'card',
            details: {
              number: '4111111111111111',
              expiryMonth: 12,
              expiryYear: 2025,
            },
          },
          metadata: {
            sessionId: 'session123',
            timestamp: 1234567890,
          },
        },
      };

      const result = constructPostParams(mockState);

      const decoded = JSON.parse(decodeBase64Unicode(result.formData));

      expect(decoded.paymentMethod).toEqual(mockState.data.paymentMethod);
      expect(decoded.metadata).toEqual(mockState.data.metadata);
      expect(decoded.origin).toBe('https://example.com');
    });
  });

  describe('parseFormSessionId', () => {
    it('should parse valid base64 encoded JSON', () => {
      const originalData = {
        action: 'authorize',
        paymentMethodId: 123,
        resultCode: 'Authorised',
      };

      // Encode the data (reverse of convertToBase64)
      const base64String = encodeToBase64(originalData);

      const result = parseFormSessionId(base64String);

      expect(result).toEqual(originalData);
    });

    it('should handle complex nested objects', () => {
      const originalData = {
        action: {
          type: 'redirect',
          url: 'https://test.adyen.com/checkout',
          data: {
            MD: 'test_md',
            PaReq: 'test_pareq',
          },
        },
        paymentMethodId: 456,
        transactionId: 789,
        resultCode: 'RedirectShopper',
      };

      const base64String = encodeToBase64(originalData);

      const result = parseFormSessionId(base64String);

      expect(result).toEqual(originalData);
    });

    it('should handle unicode characters in parsed data', () => {
      const originalData = {
        message: 'Paiement réussi ✓',
        description: 'Votre paiement a été traité avec succès',
        resultCode: 'Authorised',
      };

      const base64String = encodeToBase64(originalData);

      const result = parseFormSessionId(base64String);

      expect(result).toEqual(originalData);
    });

    it('should throw error for invalid base64', () => {
      const invalidBase64 = 'invalid_base64_string!!!';

      expect(() => {
        parseFormSessionId(invalidBase64);
      }).toThrow();
    });

    it('should throw error for invalid JSON', () => {
      // Create a valid base64 string but with invalid JSON content
      const invalidJson = 'invalid json content {{{';
      const base64String = btoa(invalidJson);

      expect(() => {
        parseFormSessionId(base64String);
      }).toThrow();
    });

    it('should handle empty object', () => {
      const originalData = {};

      const base64String = encodeToBase64(originalData);

      const result = parseFormSessionId(base64String);

      expect(result).toEqual(originalData);
    });

    it('should handle arrays in the data', () => {
      const originalData = {
        actions: ['authorize', 'capture'],
        paymentMethods: [
          { type: 'card', name: 'Credit Card' },
          { type: 'paypal', name: 'PayPal' },
        ],
        resultCode: 'Authorised',
      };

      const base64String = encodeToBase64(originalData);

      const result = parseFormSessionId(base64String);

      expect(result).toEqual(originalData);
    });
  });

  describe('utils integration', () => {
    it('should work together for round-trip encoding/decoding', () => {
      const originalData = {
        paymentMethod: 'card',
        amount: 1000,
        currency: 'EUR',
        reference: 'test-payment-123',
      };

      // Simulate the flow: data -> constructPostParams -> parseFormSessionId
      const state = { data: originalData };
      const postParams = constructPostParams(state);

      // The result should include the origin, so we expect that in the parsed result
      const expectedData = {
        ...originalData,
        origin: 'https://example.com',
      };

      const parsedData = parseFormSessionId(postParams.formData);

      expect(parsedData).toEqual(expectedData);
    });

    it('should handle special characters in round-trip', () => {
      const originalData = {
        resultCode: 'my result',
        refusalReason: 'my refusal reason',
      };

      const state = { data: originalData };
      const postParams = constructPostParams(state);
      const parsedData = parseFormSessionId(postParams.formData);

      expect(parsedData.refusalReason).toBe(originalData.refusalReason);
      expect(parsedData.resultCode).toBe(originalData.resultCode);
    });
  });
});
