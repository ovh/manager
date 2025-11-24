import extractParamFromUrl from './extract-param-from-url';

describe('extractParamFromUrl', () => {
  it('should extract parameter from query string', () => {
    const url = 'https://example.com?id=123&name=test';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBe('123');
    expect(extractParamFromUrl({ url, paramName: 'name' })).toBe('test');
  });

  it('should handle URL encoded values', () => {
    const url = 'https://example.com?message=hello%20world';
    expect(extractParamFromUrl({ url, paramName: 'message' })).toBe(
      'hello world',
    );
  });

  it('should extract parameter from hash fragment', () => {
    const url = 'https://example.com#/path?id=456&name=hash';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBe('456');
    expect(extractParamFromUrl({ url, paramName: 'name' })).toBe('hash');
  });

  it('should return null when hash has no query parameters', () => {
    const url = 'https://example.com#/path/to/page';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBeNull();
  });

  it('should prioritize query parameters over hash parameters', () => {
    const url = 'https://example.com?id=123#/path?id=456';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBe('123');
  });

  it('should fall back to hash when parameter not in query', () => {
    const url = 'https://example.com?name=test#/path?id=456';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBe('456');
    expect(extractParamFromUrl({ url, paramName: 'name' })).toBe('test');
  });

  it('should return null for invalid inputs', () => {
    expect(extractParamFromUrl({ url: '', paramName: 'id' })).toBeNull();
    expect(
      extractParamFromUrl({ url: 'https://example.com', paramName: '' }),
    ).toBeNull();
    expect(
      extractParamFromUrl({ url: 'not-a-url', paramName: 'id' }),
    ).toBeNull();
  });

  it('should return null when parameter not found', () => {
    const url = 'https://example.com?name=test';
    expect(extractParamFromUrl({ url, paramName: 'id' })).toBeNull();
  });

  it('should handle payment callback URLs', () => {
    const url =
      'https://app.example.com/callback?paymentMethodId=pm_123#/dashboard?tab=payments';
    expect(extractParamFromUrl({ url, paramName: 'paymentMethodId' })).toBe(
      'pm_123',
    );
    expect(extractParamFromUrl({ url, paramName: 'tab' })).toBe('payments');
  });
});
