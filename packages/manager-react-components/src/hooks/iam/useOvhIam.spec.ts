import { getAuthorizationCheckUrl } from './useOvhIam';

describe('getAuthorizationCheckUrl', () => {
  it('encodes the urn if it contains /', () => {
    expect(getAuthorizationCheckUrl('test/urn')).toBe(
      '/iam/resource/test%2Furn/authorization/check',
    );
  });
});
