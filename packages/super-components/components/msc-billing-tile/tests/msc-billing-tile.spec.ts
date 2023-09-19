import { Locale } from '@ovhcloud/msc-utils';
import { setupSpecTest } from './setup';

describe('specs:msc-billing-tile', () => {
  it('renders without error', async () => {
    const {
      page,
      billingTile,
      commitmentBlock,
      contactBlock,
      creationDate,
      offerBlock,
      renewalBlock,
    } = await setupSpecTest();

    expect(page.rootInstance).toBeTruthy();
    expect(billingTile).toBeTruthy();
    expect(commitmentBlock).toBeTruthy();
    expect(contactBlock).toBeTruthy();
    expect(creationDate).toBeTruthy();
    expect(offerBlock).toBeTruthy();
    expect(renewalBlock).toBeTruthy();
  });

  it.each(['fr-FR', 'en-GB'] as Locale[])(
    'Switch locale to %s',
    async (locale) => {
      const { title, tradFR, tradEN } = await setupSpecTest({ locale });
      expect(title.textContent).toContain(
        locale === 'fr-FR'
          ? tradFR.manager_billing_subscription
          : tradEN.manager_billing_subscription,
      );
    },
  );

  describe('offer', () => {
    it('renders no offer', async () => {
      const { offerBlock } = await setupSpecTest({
        servicePath: 'vps/vps-00000000.vps.ovh.net',
      });

      expect(offerBlock?.innerHTML).toBeFalsy();
    });

    it('renders an offer without menu', async () => {
      const { offerBlock } = await setupSpecTest({
        servicePath: 'domain/domain-test.ovh',
      });

      const offer = Array.from(
        offerBlock?.querySelectorAll('osds-text') as NodeList,
      )[1];
      expect(offer.textContent).toBe('platinum');
      expect(offerBlock?.querySelector('menu-custom')).toBeFalsy();
    });

    it('renders an offer with a menu', async () => {
      const { offerBlock } = await setupSpecTest({
        servicePath: 'hosting/web/abcdef.test.hosting.ovh.net',
      });

      const offer = Array.from(
        offerBlock?.querySelectorAll('osds-text') as NodeList,
      )[1];
      expect(offer.textContent).toBe('perf2014x4');

      expect(offerBlock?.querySelector('menu-custom')).toBeTruthy();
    });
  });

  describe('contacts', () => {
    it('renders the list of contacts', async () => {
      const { contactBlock } = await setupSpecTest();
      const contacts = Array.from(
        contactBlock?.querySelectorAll('osds-text') as NodeList,
      )[1] as HTMLElement;
      const contactList = Array.from(contacts.querySelectorAll('div')).map(
        (contact) => contact.textContent,
      );
      expect(contactList).toMatchInlineSnapshot(`
        Array [
          "ls111111-ovh Administrateur",
          "ls111111-ovh Facturation",
          "ls222222-ovh Technique",
        ]
      `);
    });

    it('renders the list of contacts and the owner of the product', async () => {
      const { contactBlock } = await setupSpecTest({
        servicePath: 'domain/domain-test.ovh',
      });

      const contacts = Array.from(
        contactBlock?.querySelectorAll('osds-text') as NodeList,
      )[1] as HTMLElement;
      const contactList = Array.from(contacts.querySelectorAll('div')).map(
        (contact) => contact.textContent,
      );
      expect(contactList).toMatchInlineSnapshot(`
        Array [
          "ls111111-ovh Administrateur",
          "ls111111-ovh Facturation",
          "ls111111-ovh Technique",
          "Annie Galou Lalie Panouc: Propriétaire",
        ]
      `);
    });
  });
});
