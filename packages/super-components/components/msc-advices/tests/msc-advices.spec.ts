import { Locale } from '@ovhcloud/msc-utils';
import { setupSpecTest } from './setup';

describe('specs:msc-advices', () => {
  it('renders without error', async () => {
    const { page } = await setupSpecTest({});

    expect(page.root?.shadowRoot).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  it.each(['fr-FR', 'en-GB'] as Locale[])(
    'Switch locale to %s',
    async (locale) => {
      const { title, tradFR, tradEN } = await setupSpecTest({ locale });
      expect(title.textContent).toContain(
        locale === 'fr-FR' ? tradFR.advices_heading : tradEN.advices_heading,
      );
    },
  );
});

describe('Should have dividers', () => {
  it('VPS should have 2 dividers', async () => {
    const { advicesTile } = await setupSpecTest({
      serviceType: 'vps',
      serviceName: 'vps-abcd1234.vps.ovh.net',
    });
    const dividers = advicesTile.querySelectorAll('osds-divider');

    expect(dividers.length).toBe(2);
  });

  it('Domain should have 1 divider', async () => {
    const { advicesTile } = await setupSpecTest({
      serviceType: 'domain-web',
      serviceName: 'abcd1234.fr',
    });
    const dividers = advicesTile.querySelectorAll('osds-divider');

    expect(dividers.length).toBe(1);
  });
});

describe('Should have links', () => {
  it('VPS should have 2 links and 1 is external and should be first link', async () => {
    const { advicesTile } = await setupSpecTest({
      serviceType: 'vps',
      serviceName: 'vps-abcd1234.vps.ovh.net',
    });

    const links = await advicesTile.querySelectorAll('osds-button');

    const externalLinks = await advicesTile.querySelectorAll(
      'osds-icon[name="external-link"]',
    );

    expect(links.length).toBe(2);
    expect(externalLinks.length).toBe(1);
    expect(
      links[0].querySelector('osds-icon[name="external-link"]'),
    ).toBeTruthy();
    expect(
      links[1].querySelector('osds-icon[name="external-link"]'),
    ).toBeFalsy();
  });

  it('Domain should have 2 links and 1 is external and should be second link', async () => {
    const { advicesTile } = await setupSpecTest({
      serviceType: 'domain-web',
      serviceName: 'abcd1234.fr',
    });

    const links = await advicesTile.querySelectorAll('osds-button');

    const externalLinks = await advicesTile.querySelectorAll(
      'osds-icon[name="external-link"]',
    );

    expect(links.length).toBe(2);
    expect(externalLinks.length).toBe(1);
    expect(
      links[0].querySelector('osds-icon[name="external-link"]'),
    ).toBeFalsy();
    expect(
      links[1].querySelector('osds-icon[name="external-link"]'),
    ).toBeTruthy();
  });
});
