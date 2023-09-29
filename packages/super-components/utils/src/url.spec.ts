import { getURL } from './url';

describe('msc:utils url', () => {
  it('returns location.origin if no context is provided', () => {
    expect(getURL({ path: '/test', params: { toto: 'toto' } })).toBe(
      'http://localhost/test?toto=toto',
    );
  });

  it('returns the URL with the appPlubicURL if there is a context', () => {
    expect(
      getURL({
        appPublicURL: 'https://ovh.com/#/test-app/',
        path: '/test',
        params: { toto: 'toto2' },
      }),
    ).toBe('https://ovh.com/#/test-app/test?toto=toto2');
  });

  it('returns the right base URL if there is a context', () => {
    expect(
      getURL({
        region: 'EU',
        subsidiary: 'GB',
        path: '/test',
        params: { toto: 'toto3' },
      }),
    ).toBe('www.ovh.com/en-gb/test?toto=toto3');
  });

  it('returns the location.origin if there is only a subsidiary provided as a context', () => {
    expect(
      getURL({
        subsidiary: 'GB',
        path: '/test',
        params: { toto: 'toto4' },
      }),
    ).toBe('http://localhost/test?toto=toto4');
  });
});
