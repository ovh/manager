import '@/common/setupTests';
import { describe, it, expect } from 'vitest';
import { generateGuideLinks } from './generateGuideLinks';

describe('generateGuideLinks', () => {
  const template = 'https://help.ovhcloud.com/csm/{{lang}}-example-guide';

  it('should replace {{lang}} with correct values for each language', () => {
    const links = generateGuideLinks(template);

    expect(links.FR).toBe('https://help.ovhcloud.com/csm/fr-example-guide');
    expect(links.EN).toBe('https://help.ovhcloud.com/csm/en-gb-example-guide');
    expect(links.DE).toBe('https://help.ovhcloud.com/csm/de-example-guide');
    expect(links.ES).toBe('https://help.ovhcloud.com/csm/es-es-example-guide');
    expect(links.IT).toBe('https://help.ovhcloud.com/csm/it-example-guide');
    expect(links.PL).toBe('https://help.ovhcloud.com/csm/pl-example-guide');
    expect(links.PT).toBe('https://help.ovhcloud.com/csm/pt-example-guide');
    expect(links.DEFAULT).toBe(
      'https://help.ovhcloud.com/csm/fr-example-guide',
    );
  });

  it('should return same URL for FR and DEFAULT', () => {
    const links = generateGuideLinks(template);
    expect(links.FR).toBe(links.DEFAULT);
  });

  it('should not mutate the original template', () => {
    const original = 'https://example.com/{{lang}}/doc';
    generateGuideLinks(original);
    expect(original).toBe('https://example.com/{{lang}}/doc');
  });
});
