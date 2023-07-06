import { mockFetch } from '@stencil/core/testing';
import { setupSpecTest } from './setup';
import * as TradFR from '../src/translations/Messages_fr_FR.json';
import * as TradEN from '../src/translations/Messages_en_GB.json';
import { vpsResponseUnified } from './mockRequests';

jest.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v6: {
      get: jest.fn(() =>
        Promise.resolve({
          data: vpsResponseUnified,
        }),
      ),
    },
  },
}));

describe('specs:msc-billing-tile', () => {
  beforeEach(() => {
    mockFetch.json(TradFR, '/translations/Messages_fr_FR.json');
    mockFetch.json(TradEN, '/translations/Messages_en_GB.json');
  });

  it('renders without error', async () => {
    const { page } = await setupSpecTest({});

    expect(page.root?.shadowRoot).toBeTruthy();
    expect(page.rootInstance).toBeTruthy();
  });

  it('Language should be french and title is "Abonnement"', async () => {
    const { page } = await setupSpecTest({});

    const element = page.root?.shadowRoot?.querySelector('*');
    expect(element).not.toBeNull();
    expect(element?.textContent).toContain('Abonnement');
  });

  it('Language should be english and title is "Subscription"', async () => {
    const { page } = await setupSpecTest({
      attributes: { language: 'en-GB' },
    });

    const element = page.root?.shadowRoot?.querySelector('*');
    expect(element).not.toBeNull();
    expect(element?.textContent).toContain('Subscription');
  });

  describe('attribute tracking', () => {
    it('should put the tracking', async () => {
      const testTrackingLabel = 'test';
      const { page } = await setupSpecTest({
        attributes: { dataTracking: testTrackingLabel },
      });
      expect(page.rootInstance?.dataTracking).toEqual(testTrackingLabel);
    });
  });

  describe('attribute language', () => {
    it('should put en-GB if set', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.language).toEqual('en-GB');
    });

    it('en-GB with billing_services_actions_menu_configuration_update_owner', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(
        page.rootInstance?.localStrings
          ?.billing_services_actions_menu_configuration_update_owner,
      ).toEqual('Refresh holder information');
    });

    it('should put fr-FR by default', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.language).toEqual('fr-FR');
    });

    it('fr-FR with billing_services_actions_menu_configuration_update_owner', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(
        page.rootInstance?.localStrings
          ?.billing_services_actions_menu_configuration_update_owner,
      ).toEqual('Actualiser les informations du propriétaire');
    });
  });

  describe('menu', () => {
    it('renders 2 menus for renew and contacts', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });

      const menus = page.root?.shadowRoot?.querySelectorAll('menu-custom');

      expect(menus?.length).toBe(2);
    });
  });

  describe('API requests', () => {
    it('contactBilling', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.contactBilling).toBe('ls148374-ovh');
    });
    it('contactTech', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.contactTech).toBe('ls148374-ovh');
    });
    it('contactAdmin', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.contactAdmin).toBe('ls148374-ovh');
    });
    it('serviceId', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.serviceId).toBe('118977335');
    });
  });

  describe('renewStatus', () => {
    it('renewStatus is automatic on this service', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.renewStatus).toBe('automatic');
    });
  });

  describe('commitmentStatus', () => {
    it('commitmentStatus is none on this service', async () => {
      const { page } = await setupSpecTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(page.rootInstance?.commitmentStatus).toBe('none');
    });
  });
});
