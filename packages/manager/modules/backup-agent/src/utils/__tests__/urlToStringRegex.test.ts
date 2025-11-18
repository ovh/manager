import { urlToStringRegex } from '@/utils/urlToStringRegex';

describe('urlToStringRegex', () => {
  it.each([
    ['/services', '/services', ['/services']] as const,
    [
      '/services/:id',
      '/services/[a-zA-Z0-9-]+',
      ['/services/123', '/services/abc', '/services/xyz-123'],
    ] as const,
    [
      '/services/:otherId',
      '/services/[a-zA-Z0-9-]+',
      ['/services/123', '/services/abc', '/services/xyz-123'],
    ] as const,
    [
      '/services/:anotherId/agents',
      '/services/[a-zA-Z0-9-]+/agents',
      ['/services/123/agents', '/services/abc/agents', '/services/xyz-123/agents'],
    ] as const,
  ] as const)('convert url : $url to $regex and test regex', (url, regex, urlsExample) => {
    const urlString = urlToStringRegex(url);
    expect(urlString).toEqual(regex);

    urlsExample.forEach((urlExample) => {
      expect(urlExample.match(new RegExp(urlString))).toBeTruthy();
    });
  });
});
