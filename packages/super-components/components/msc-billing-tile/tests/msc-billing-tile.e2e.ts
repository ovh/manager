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
      const { el } = await setupE2eTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });
      expect(el).not.toBeNull();
      expect(el).toHaveClass('hydrated');
    });
  });

  // describe('defaults', () => {
  //   it('should render', async () => {
  //     const { el } = await setupE2eTest({
  //       attributes: {
  //         language: 'en-GB',
  //         servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
  //         offer: 'vps-0baa4fcf.vps.ovh.net',
  //       },
  //     });
  //     expect(el).not.toBeNull();
  //     expect(el).toHaveClass('hydrated');
  //   });
  /*
    it('should contain the text "Subscription"', async () => {
      const { el } = await setupE2eTest({
        attributes: {
          language: 'en-GB',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });

      expect(el).toContain('Subscription');
    });
/*
    it('should contain the text "Subscription"', async () => {
      const { el } = await setupE2eTest({
        attributes: {
          language: 'fr-FR',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });

      expect(el).toContain('Abonnement');
    });

    it('should contain the offer "vps-0baa4fcf.vps.ovh.net"', async () => {
      const { el } = await setupE2eTest({
        attributes: {
          language: 'fr-FR',
          servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
          offer: 'vps-0baa4fcf.vps.ovh.net',
        },
      });

      expect(el).toContain(el.getAttribute('offer'));
    });
      */
  // });
});
