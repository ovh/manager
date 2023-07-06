import { mockFetch } from '@stencil/core/testing';
import { setupE2eTest } from './setup';
import * as TradFR from '../src/translations/Messages_fr_FR.json';
import * as TradEN from '../src/translations/Messages_en_GB.json';

jest.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: jest.fn(() => Promise.resolve({})),
  },
}));

describe('e2e:msc-billing-tile', () => {
  beforeEach(() => {
    mockFetch.json(TradFR, '/translations/Messages_fr_FR.json');
    mockFetch.json(TradEN, '/translations/Messages_en_GB.json');
  });

  describe('defaults', () => {
    it('should render', async () => {
      const { el, page } = await setupE2eTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      page.waitForChanges();
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });

  it('should render 11 osds-text', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts).not.toBeNull();
    expect(texts.length).toBe(11);
  });

  it('should render 1st osds-text with "Subscription"', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[0].textContent).toBe('Subscription');
  });

  it('should render 1st osds-text with "Abonnement" (fr-FR) ', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'fr-FR',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[0].textContent).toBe('Abonnement');
  });

  it('should render offer vps-0baa4fcf.vps.ovh.net', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'fr-FR',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[2].textContent).toBe('vps-0baa4fcf.vps.ovh.net');
  });

  it('should render osds-text with subdivisions "Solution", "Creation date", "Next payment date", "Commitment", "Contacts"', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[1].textContent).toBe('Solution');
    expect(texts[3].textContent).toBe('Creation date');
    expect(texts[5].textContent).toBe('Next payment date');
    expect(texts[7].textContent).toBe('Commitment');
    expect(texts[9].textContent).toBe('Contacts');
  });

  it('should render 5 subdivisions', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const dividers = await page.findAll('msc-billing-tile >>> osds-divider');
    expect(dividers).not.toBeNull();
    expect(dividers.length).toBe(5);
  });

  it('should render 2 osds-chip', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const chips = await page.findAll('msc-billing-tile >>> osds-chip');
    expect(chips).not.toBeNull();
    expect(chips.length).toBe(2);
  });

  it('should have green sm chip Automatic renewal', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });
    await page.waitForChanges();

    const chips = await page.findAll('msc-billing-tile >>> osds-chip');
    expect(chips[0].textContent).toBe('Automatic renewal');
    expect(chips[0].getAttribute('color')).toBe('success');
    expect(chips[0].getAttribute('size')).toBe('sm');
    expect(chips[0].getAttribute('variant')).toBe('flat');
  });

  it('should have red sm chip None', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const chips = await page.findAll('msc-billing-tile >>> osds-chip');
    expect(chips[1].textContent).toBe('None');
    expect(chips[1].getAttribute('color')).toBe('error');
    expect(chips[1].getAttribute('size')).toBe('sm');
    expect(chips[1].getAttribute('variant')).toBe('flat');
  });

  it('should render 2 menu', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const menu = await page.findAll('msc-billing-tile >>> menu-custom');
    expect(menu).not.toBeNull();
    expect(menu.length).toBe(2);
  });

  it('should render contacts with 3 sections', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[9].textContent).toBe('Contacts');
    const contactDivision = await texts[10].findAll('div');
    expect(contactDivision.length).toBe(3);
  });

  it('should render contacts with 3 contacts nicknames', async () => {
    const { page } = await setupE2eTest({
      attributes: {
        language: 'en-GB',
        servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
        offer: 'vps-0baa4fcf.vps.ovh.net',
      },
    });
    await page.waitForChanges();

    const texts = await page.findAll('msc-billing-tile >>> osds-text');
    expect(texts[9].textContent).toBe('Contacts');
    const contactDivision = await texts[10].findAll('div');

    expect(contactDivision[0].textContent).toBe('ls148374-ovh Administrator');
    expect(contactDivision[1].textContent).toBe('ls148374-ovh Technical');
    expect(contactDivision[2].textContent).toBe('ls148374-ovh Billing');
  });
});
