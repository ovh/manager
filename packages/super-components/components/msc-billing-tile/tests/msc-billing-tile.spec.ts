import { mockFetch } from '@stencil/core/testing';
import { setupSpecTest } from './setup';
import * as TradFR from '../src/translations/Messages_fr_FR.json';
import * as TradEN from '../src/translations/Messages_en_GB.json';

jest.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          glueRecordMultiIpSupported: true,
          parentService: null,
          suspensionState: 'not_suspended',
          glueRecordIpv6Supported: true,
          whoisOwner: '13466563',
          offer: 'platinum',
          lastUpdate: '2022-12-06T17:00:45+01:00',
          nameServerType: 'external',
          hostSupported: true,
          owoSupported: false,
          transferLockStatus: 'locked',
          dnssecSupported: true,
          renewalType: 'automaticV2016',
          contactBilling: 'ls148374-ovh',
          contactTech: 'ls148374-ovh',
          domain: 'vps-0baa4fcf.vps.ovh.net',
          expiration: '2023-08-01',
          canDeleteAtExpiration: true,
          serviceId: '118977335',
          creation: '2023-01-16',
          possibleRenewPeriod: [1, 3, 6, 12],
          renew: {
            automatic: true,
            deleteAtExpiration: false,
            forced: false,
            manualPayment: false,
            period: 1,
          },
          status: 'ok',
          contactAdmin: 'ls148374-ovh',
          route: {
            path: '/vps/{serviceName}',
            url: '/vps/vps-0baa4fcf.vps.ovh.net',
            vars: [
              {
                key: 'serviceName',
                value: 'vps-0baa4fcf.vps.ovh.net',
              },
            ],
          },
          billing: {
            nextBillingDate: '2023-08-01T17:31:17+02:00',
            expirationDate: '2023-08-01T17:31:17+02:00',
            plan: {
              code: 'vps-elite-8-8-160',
              invoiceName: 'VPS Elite 8-8-160',
            },
            pricing: {
              capacities: ['renew'],
              description: 'Monthly fees',
              interval: 1,
              duration: 'P1M',
              minimumQuantity: 1,
              maximumQuantity: 100,
              minimumRepeat: 1,
              maximumRepeat: null,
              price: {
                currencyCode: 'EUR',
                text: '34.50 €',
                value: 34.5,
              },
              priceInUcents: 3450000000,
              pricingMode: 'default',
              pricingType: 'rental',
              engagementConfiguration: null,
            },
            group: null,
            lifecycle: {
              current: {
                pendingActions: [],
                terminationDate: null,
                creationDate: '2023-01-16T17:31:17+02:00',
                state: 'active',
              },
              capacities: {
                actions: ['earlyRenewal', 'terminateAtExpirationDate'],
              },
            },
            renew: {
              current: {
                mode: 'automatic',
                nextDate: '2023-08-01T17:31:17+02:00',
                period: 'P1M',
              },
              capacities: {
                mode: ['automatic', 'manual'],
              },
            },
            engagement: null,
            engagementRequest: null,
          },
          resource: {
            displayName: 'vps-0baa4fcf.vps.ovh.net',
            name: 'vps-0baa4fcf.vps.ovh.net',
            state: 'active',
            product: {
              name: 'vps-elite-8-8-160',
              description: 'VPS Elite 8 vCPU 8 GB RAM 160 GB disk',
            },
            resellingProvider: null,
          },
          parentServiceId: null,
          customer: {
            contacts: [
              {
                customerCode: 'ls148374-ovh',
                type: 'administrator',
              },
              {
                customerCode: 'ls148374-ovh',
                type: 'technical',
              },
              {
                customerCode: 'ls148374-ovh',
                type: 'billing',
              },
            ],
          },
          tags: [],
        },
      }),
    ),
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

  // describe('tracking', () => {
  //   it('should put the tracking attribute on the inner link', async () => {
  //     const testTrackingLabel = 'test';
  //     const { innerLink } = await setupSpecTest({
  //       attributes: { dataTracking: testTrackingLabel },
  //     });
  //     expect(innerLink).toEqualAttribute('data-tracking', testTrackingLabel);
  //   });
  // });

  // describe('chips', () => {
  //   it('renders chip with correct color and text for each status', async () => {
  //     const { page } = await setupSpecTest({
  //       attributes: { language: 'en-GB' },
  //     });
  //     // Mock getTranslation method
  //     page.rootInstance.getTranslation = jest.fn((key) => key);

  //     const statuses = [
  //       'deleteAtExpiration',
  //       'automatic',
  //       'manualPayment',
  //       'cancelled',
  //     ];
  //     const expectedColors = [
  //       'OdsThemeColorIntent.error',
  //       'OdsThemeColorIntent.accent',
  //       'OdsThemeColorIntent.warning',
  //       'OdsThemeColorIntent.error',
  //     ];
  //     const expectedTexts = statuses.map(
  //       (status) => `mb_service_status_${status}`,
  //     );

  //     statuses.forEach((status, i) => {
  //       page.rootInstance.renewStatus = status;

  //       const chip = page.root?.querySelector('osds-chip');
  //       expect(chip).toHaveAttribute('color', expectedColors[i]);
  //       expect(chip).toHaveTextContent(expectedTexts[i]);
  //     });
  //   });
  // });
});
