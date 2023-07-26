import { mockFetch } from '@stencil/core/testing';
import { setupSpecTest } from './setup';

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
    mockFetch.json(
      {
        manager_billing_subscription: 'Abonnement',
        manager_billing_subscription_creation: 'Date de création',
        manager_billing_subscription_next_due_date: 'Prochaine échéance',
        manager_billing_subscription_engagement: 'Engagement',
        manager_billing_subscription_engagement_status_none: 'Aucun',
        manager_billing_subscription_contacts: 'Contacts',
        manager_billing_subscription_contacts_admin: 'Administrateur',
        manager_billing_subscription_contacts_tech: 'Technique',
        manager_billing_subscription_contacts_billing: 'Facturation',
        manager_billing_subscription_contacts_management: 'Gérer les contacts',
        manager_billing_subscription_error:
          'Une erreur est survenue lors de la récupération des informations : {{ message }}',
        manager_billing_subscription_engagement_commit: 'S’engager',
        manager_billing_subscription_engagement_commit_again: 'Se réengager',
        manager_billing_subscription_engagement_commit_with_discount:
          'S’engager et bénéficier d’une remise',
        manager_billing_subscription_engagement_commit_again_with_discount:
          "Se réengager et bénéficier d'une remise",
        manager_billing_subscription_engagement_status_engaged:
          'Se termine le {{ endDate }}',
        manager_billing_subscription_engagement_status_engaged_renew:
          'Se renouvelle le {{ endDate }}',
        manager_billing_subscription_engagement_status_engaged_expired:
          'Terminé le {{ endDate }}',
        manager_billing_subscription_engagement_status_commitement_pending:
          'Votre service sera engagé à partir du {{ nextBillingDate }}',
        manager_billing_subscription_offer: 'Offre',
        manager_billing_service_status: 'Statut',
        manager_billing_service_status_auto: 'Renouvellement automatique',
        manager_billing_service_status_automatic: 'Renouvellement automatique',
        manager_billing_service_status_manual: 'Renouvellement manuel',
        manager_billing_service_status_manualPayment: 'Renouvellement manuel',
        manager_billing_service_status_pending_debt: 'Facture à régler',
        manager_billing_service_status_delete_at_expiration:
          'Résiliation demandée',
        manager_billing_service_status_expired: 'Résilié',
        manager_billing_service_status_billing_suspended:
          'Facturation reportée',
        manager_billing_service_status_forced_manual:
          'Renouvellement manuel forcé',
        billing_services_actions_menu_label: "Plus d'actions sur ce service",
        billing_autorenew_service_enable_autorenew:
          'Activer le paiement automatique',
        billing_services_actions_menu_pay_bill: 'Régler ma facture',
        billing_services_actions_menu_manage_renew:
          'Configurer le renouvellement',
        billing_services_actions_menu_exchange_update_accounts:
          'Configurer le renouvellement des comptes',
        billing_services_actions_menu_anticipate_renew: 'Anticiper le paiement',
        billing_services_actions_menu_resiliate: 'Résilier',
        billing_services_actions_menu_resiliate_my_engagement:
          'Résilier mon engagement',
        billing_services_actions_menu_renew_label:
          'Renouveler le service : {{ serviceName }} (Nouvelle fenêtre)',
        billing_services_actions_menu_renew: 'Renouveler le service',
        billing_services_actions_menu_exchange_update:
          'Modifier la facturation',
        billing_services_actions_menu_resiliate_EMAIL_DOMAIN:
          'Supprimer immédiatement le MX Plan',
        billing_services_actions_menu_resiliate_ENTERPRISE_CLOUD_DATABASE:
          "Supprimer immédiatement l'enterprise cloud databases",
        billing_services_actions_menu_resiliate_HOSTING_WEB:
          "Supprimer immédiatement l'hébergement",
        billing_services_actions_menu_resiliate_HOSTING_PRIVATE_DATABASE:
          'Supprimer mon hébergement SQL privé',
        billing_services_actions_menu_resiliate_WEBCOACH:
          'Supprimer mon WebCoach',
        billing_services_actions_menu_sms_credit: 'Ajouter des crédits',
        billing_services_actions_menu_sms_renew:
          'Configurer la recharge automatique',
        billing_services_actions_menu_resiliate_cancel:
          'Annuler la résiliation du service',
        billing_services_actions_menu_see_dashboard:
          'Voir le détail du service',
        billing_services_actions_menu_commit: 'Gérer mon engagement',
        billing_services_actions_menu_commit_cancel:
          "Annuler la demande d'engagement",
        billing_services_actions_menu_change_owner: 'Changer de propriétaire',
        billing_services_actions_menu_configuration_update_owner:
          'Actualiser les informations du propriétaire',
      },
      '/translations/Messages_fr_FR.json',
    );

    mockFetch.json(
      {
        manager_billing_subscription: 'Subscription',
        manager_billing_subscription_creation: 'Creation date',
        manager_billing_subscription_next_due_date: 'Next payment date',
        manager_billing_subscription_engagement: 'Commitment',
        manager_billing_subscription_engagement_status_none: 'None',
        manager_billing_subscription_contacts: 'Contacts',
        manager_billing_subscription_contacts_admin: 'Administrator',
        manager_billing_subscription_contacts_tech: 'Technical',
        manager_billing_subscription_contacts_billing: 'Billing',
        manager_billing_subscription_contacts_management: 'Manage contacts',
        manager_billing_subscription_error:
          'An error has occurred retrieving information: {{ message }}',
        manager_billing_subscription_engagement_commit: 'Commit',
        manager_billing_subscription_engagement_commit_again: 'Re-commit',
        manager_billing_subscription_engagement_status_engaged:
          'Ends {{ endDate }}',
        manager_billing_subscription_engagement_status_engaged_expired:
          'Ended {{ endDate }}',
        manager_billing_subscription_engagement_status_engaged_renew:
          'Renews on {{endDate}}',
        manager_billing_subscription_engagement_status_commitement_pending:
          'Your service commitment will begin from {{nextBillingDate}}',
        manager_billing_subscription_engagement_commit_with_discount:
          'Commit and get a discount',
        manager_billing_subscription_engagement_commit_again_with_discount:
          'Re-commit and get a discount',
        manager_billing_subscription_offer: 'Solution',
        manager_billing_service_status: 'Status',
        manager_billing_service_status_auto: 'Automatic renewal',
        manager_billing_service_status_automatic: 'Automatic renewal',
        manager_billing_service_status_manual: 'Manual renewal',
        manager_billing_service_status_manualPayment: 'Manual renewal',
        manager_billing_service_status_pending_debt: 'Bill to pay',
        manager_billing_service_status_delete_at_expiration:
          'Cancellation requested',
        manager_billing_service_status_expired: 'Cancelled',
        manager_billing_service_status_billing_suspended: 'Deferred billing',
        manager_billing_service_status_forced_manual: 'Manual renewal',
        billing_services_actions_menu_label: 'Further actions on this service ',
        billing_autorenew_service_enable_autorenew: 'Enable automatic payment',
        billing_services_actions_menu_pay_bill: 'Pay my bill',
        billing_services_actions_menu_manage_renew: 'Configure renewal',
        billing_services_actions_menu_exchange_update_accounts:
          'Configure renewal for accounts',
        billing_services_actions_menu_anticipate_renew: 'Bring forward payment',
        billing_services_actions_menu_resiliate: 'Cancel subscription',
        billing_services_actions_menu_renew_label:
          'Renew the following service: {{ serviceName }} (New window)',
        billing_services_actions_menu_renew: 'Renew service',
        billing_services_actions_menu_exchange_update: 'Modify billing',
        billing_services_actions_menu_resiliate_EMAIL_DOMAIN:
          'Delete MX Plan immediately',
        billing_services_actions_menu_resiliate_ENTERPRISE_CLOUD_DATABASE:
          'Delete Enterprise Cloud Database immediately',
        billing_services_actions_menu_resiliate_HOSTING_WEB:
          'Delete web hosting plan immediately',
        billing_services_actions_menu_resiliate_HOSTING_PRIVATE_DATABASE:
          'Delete my Private SQL hosting service',
        billing_services_actions_menu_resiliate_WEBCOACH: 'Delete my Web Coach',
        billing_services_actions_menu_sms_credit: 'Add credits',
        billing_services_actions_menu_sms_renew:
          'Configure automatic reloading',
        billing_services_actions_menu_resiliate_cancel:
          'Stop cancellation of service',
        billing_services_actions_menu_see_dashboard: 'View service details',
        billing_services_actions_menu_commit: 'Manage my commitment',
        billing_services_actions_menu_commit_cancel:
          'Cancel subscription request',
        billing_services_actions_menu_resiliate_my_engagement:
          'Cancel subscription',
        billing_services_actions_menu_change_owner: 'Change owner',
        billing_services_actions_menu_configuration_update_owner:
          'Refresh holder information',
      },
      '/translations/Messages_en_GB.json',
    );
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
