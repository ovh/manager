import { urlToStringRegex } from '@/utils/urlToStringRegex';

describe('urlToStringRegex', () => {
  it.each([
    ['/service', '/service', ['/service']] as const,
    [
      '/service/:id',
      '/service/[a-zA-Z0-9-]+',
      ['/service/123', '/service/abc', '/service/xyz-123'],
    ] as const,
    [
      '/service/:otherId',
      '/service/[a-zA-Z0-9-]+',
      ['/service/123', '/service/abc', '/service/xyz-123'],
    ] as const,
    [
      '/service/:anotherId/agents',
      '/service/[a-zA-Z0-9-]+/agents',
      ['/service/123/agents', '/service/abc/agents', '/service/xyz-123/agents'],
    ] as const,
  ] as const)('convert url : $url to $regex and test regex', (url, regex, urlsExample) => {
    const urlString = urlToStringRegex(url);
    expect(urlString).toEqual(regex);

    urlsExample.forEach((urlExample) => {
      expect(urlExample.match(new RegExp(urlString))).toBeTruthy();
    });
  });
});
