import { describe, expect, it, vi } from 'vitest';

import NewAccountFormCtrl from './new-account-form-controller';

// The app bundle provides angular as a global; the controller relies on it
// rather than importing it. Only these three helpers are reached from here.
global.angular = {
  noop: () => {},
  copy: (value) => JSON.parse(JSON.stringify(value ?? null)),
  equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
};

const ADDRESS = 'FR:SIRET:42476141900045';
const OTHER = 'FR:SIRET:42476141900099';

const einvoicingRule = (addresses) => ({
  fieldName: 'einvoicingBillingAddress',
  in: addresses,
});
const otherRule = { fieldName: 'organisation', in: null };

// Only the collaborators these two decisions reach: the controller takes twelve
// injected services, none of the others are involved.
const build = ({ address = ADDRESS, rules } = {}) => {
  const broadcasts = [];
  const listeners = {};
  const $scope = {
    $broadcast: (name) => broadcasts.push(name),
    $on: (name, fn) => {
      listeners[name] = fn;
    },
  };
  const alerter = { alertFromSWS: vi.fn(), resetMessage: vi.fn() };
  const ctrl = new NewAccountFormCtrl(
    { resolve: (v) => Promise.resolve(v) },
    {},
    (fn) => fn(),
    {},
    { trackClick: vi.fn() },
    { getUser: () => ({}), getUserLocale: () => 'fr_FR' },
    alerter,
    { instant: (k) => k },
    vi.fn(),
    $scope,
    // nothing of $onInit past the listener registration is exercised here
    { checkFeatureAvailability: () => new Promise(() => {}) },
    {},
  );
  ctrl.model = { einvoicingBillingAddress: address, organisation: 'OVH' };
  ctrl.rules = rules || [otherRule, einvoicingRule([ADDRESS, OTHER])];
  ctrl.siretFieldIsAvailable = () => false;
  return { ctrl, broadcasts, listeners, alerter };
};

// stands in for the /newAccount/rules refresh
const refreshReturning = (ctrl, newRules) => {
  ctrl.fetchRules = vi.fn(() => Promise.resolve(newRules));
};

const staleWasFlagged = (broadcasts) =>
  broadcasts.includes('einvoicing.staleAddress');

describe('a submit error the directory does not confirm', () => {
  // the reported regression: an error forced on the company data emptied a field
  // the API had never pointed at
  it('keeps the address when the directory still offers it', async () => {
    const { ctrl, broadcasts } = build();
    refreshReturning(ctrl, [otherRule, einvoicingRule([ADDRESS, OTHER])]);

    await ctrl.refreshEinvoicingAddressOnError({ status: 400 });

    expect(ctrl.model.einvoicingBillingAddress).toBe(ADDRESS);
    expect(staleWasFlagged(broadcasts)).toBe(false);
  });

  it('keeps it when the refresh brings no address at all', async () => {
    const { ctrl, broadcasts } = build();
    refreshReturning(ctrl, [otherRule, einvoicingRule([''])]);

    await ctrl.refreshEinvoicingAddressOnError({ status: 400 });

    expect(ctrl.model.einvoicingBillingAddress).toBe(ADDRESS);
    expect(staleWasFlagged(broadcasts)).toBe(false);
  });

  it('keeps it when the refresh drops the entry entirely', async () => {
    const { ctrl, broadcasts } = build();
    refreshReturning(ctrl, [otherRule]);

    await ctrl.refreshEinvoicingAddressOnError({ status: 400 });

    expect(ctrl.model.einvoicingBillingAddress).toBe(ADDRESS);
    expect(staleWasFlagged(broadcasts)).toBe(false);
  });
});

describe('a submit error the directory does confirm', () => {
  it('flags the address as stale when other addresses replaced it', async () => {
    const { ctrl, broadcasts } = build();
    refreshReturning(ctrl, [otherRule, einvoicingRule([OTHER])]);

    await ctrl.refreshEinvoicingAddressOnError({ status: 400 });

    expect(staleWasFlagged(broadcasts)).toBe(true);
  });
});

describe('errors that must not reach the field', () => {
  it.each([
    [{ status: 500 }, 'a server error'],
    [{ status: 403 }, 'a forbidden'],
    [undefined, 'no error object'],
  ])('does nothing on %p (%s)', async (err) => {
    const { ctrl, broadcasts } = build();
    refreshReturning(ctrl, [otherRule]);

    await ctrl.refreshEinvoicingAddressOnError(err);

    expect(ctrl.fetchRules).not.toHaveBeenCalled();
    expect(ctrl.model.einvoicingBillingAddress).toBe(ADDRESS);
    expect(staleWasFlagged(broadcasts)).toBe(false);
  });

  it('does nothing when no address was selected', async () => {
    const { ctrl } = build({ address: null });
    refreshReturning(ctrl, [otherRule]);

    await ctrl.refreshEinvoicingAddressOnError({ status: 400 });

    expect(ctrl.fetchRules).not.toHaveBeenCalled();
  });
});

describe('a rules refresh that omits the e-invoicing entry', () => {
  it('carries the entry over so the picker stays on screen', async () => {
    const { ctrl } = build();
    refreshReturning(ctrl, [otherRule]);

    await ctrl.updateRules();

    expect(ctrl.getEinvoicingRule()).toEqual(einvoicingRule([ADDRESS, OTHER]));
    expect(ctrl.model.einvoicingBillingAddress).toBe(ADDRESS);
  });

  it('takes the fresh entry when the refresh brings one', async () => {
    const { ctrl } = build();
    refreshReturning(ctrl, [otherRule, einvoicingRule([OTHER])]);

    await ctrl.updateRules();

    expect(ctrl.getEinvoicingRule()).toEqual(einvoicingRule([OTHER]));
  });

  // the generic behaviour must stay untouched for every other field
  it('still drops the model value of any other vanished rule', async () => {
    const { ctrl } = build();
    refreshReturning(ctrl, [einvoicingRule([ADDRESS, OTHER])]);

    await ctrl.updateRules();

    expect('organisation' in ctrl.model).toBe(false);
  });

  it('carries nothing over when there was no entry to begin with', async () => {
    const { ctrl } = build({ rules: [otherRule] });
    refreshReturning(ctrl, [otherRule]);

    await ctrl.updateRules();

    expect(ctrl.getEinvoicingRule()).toBeUndefined();
  });
});

describe('the API errors the form displays', () => {
  // validating a company replaces the data those errors were about
  const validateCompany = () => {
    const built = build();
    built.ctrl.$onInit();
    built.ctrl.submitError = { status: 400, data: { message: 'nope' } };
    built.listeners['siret:companySelected']();
    return built;
  };

  it('are dropped when the customer validates a company', () => {
    const { ctrl } = validateCompany();

    expect(ctrl.submitError).toBe(null);
  });

  it('drops the alert banner too, not just the inline message', () => {
    const { alerter } = validateCompany();

    expect(alerter.resetMessage).toHaveBeenCalledWith('InfoErrors');
  });

  it('listens for the company the siret component hands over', () => {
    const { ctrl, listeners } = build();

    ctrl.$onInit();

    expect(listeners['siret:companySelected']).toBeTypeOf('function');
  });

  it('clears both on demand', () => {
    const { ctrl, alerter } = build();
    ctrl.submitError = { status: 400 };

    ctrl.clearApiErrors();

    expect(ctrl.submitError).toBe(null);
    expect(alerter.resetMessage).toHaveBeenCalledWith('InfoErrors');
  });
});

// --- pixel-tracking consent -----------------------------------------------

const CAMPAIGN = 'consent-marketing-email';
const PIXEL = 'pixelTrackingConsent';
const EMAIL_CONSENT = 'commercialCommunicationsApproval';
// `spareEmail` is load-bearing, not padding: it is the real /newAccount/rules
// field that sorts BETWEEN the two consent checkboxes if the pixel entry ever
// leaves its FIELD_NAME_LIST slot. Without it the adjacency assertion below
// holds wherever that entry sits, and the slot is pinned by nothing.
const API_RULES = [
  { fieldName: 'email' },
  { fieldName: 'spareEmail' },
  { fieldName: 'phone' },
];

// The consent path reaches collaborators build() deliberately leaves out: its
// feature-flip promise never settles, so nothing past $onInit's first .then()
// runs there. Widening build() would make fetchRules run for real in all 16
// tests above.
const buildWithConsent = (options = {}) => {
  const {
    decision = { value: true, pixel: { value: false } },
    isRegionUs = false,
    updateConsentDecision,
    fetchConsentDecision,
  } = options;
  // deliberately NOT a destructuring default: `{ country: undefined }` is one
  // of the cases under test (an account with no registered country, which must
  // fail closed) and a default would silently turn it into 'FR'
  const country = 'country' in options ? options.country : 'FR';
  const broadcasts = [];
  const $scope = {
    $broadcast: (name, payload) => broadcasts.push({ name, payload }),
    $on: () => {},
  };
  const $q = {
    resolve: (value) => Promise.resolve(value),
    reject: (value) => Promise.reject(value),
    // fetchRules passes an object hash, submit() passes an array
    all: (value) =>
      Array.isArray(value)
        ? Promise.all(value)
        : Promise.all(Object.values(value)).then((settled) =>
            Object.fromEntries(
              Object.keys(value).map((key, index) => [key, settled[index]]),
            ),
          ),
  };
  const service = {
    postRules: vi.fn(() =>
      Promise.resolve(API_RULES.map((rule) => ({ ...rule }))),
    ),
    fetchConsentDecision:
      fetchConsentDecision || vi.fn(() => Promise.resolve(decision)),
    fetchMarketingConsentDecision: vi.fn(() => Promise.resolve({ sms: {} })),
    updateConsentDecision:
      updateConsentDecision || vi.fn(() => Promise.resolve(null)),
    updateSmsMarketingConsentDecision: vi.fn(() => Promise.resolve(null)),
    updateUseraccountInfos: vi.fn(() => Promise.resolve(null)),
    changeEmail: vi.fn(() => Promise.resolve(null)),
  };
  const alerter = { alertFromSWS: vi.fn(), resetMessage: vi.fn() };
  const atInternet = { trackClick: vi.fn(), trackPage: vi.fn() };
  const ctrl = new NewAccountFormCtrl(
    $q,
    {},
    (fn) => fn(),
    {},
    atInternet,
    {
      getUser: () => ({ country: 'fr', ovhSubsidiary: 'FR' }),
      getUserLocale: () => 'fr_FR',
      isRegion: (region) => isRegionUs && region === 'US',
      updateUser: vi.fn(),
      setUserLocale: vi.fn(),
    },
    alerter,
    { instant: (key) => key },
    vi.fn(),
    $scope,
    {
      checkFeatureAvailability: () =>
        Promise.resolve({
          isFeatureAvailable: (feature) => feature === 'account:email-consent',
        }),
    },
    { environment: { setUser: vi.fn() } },
  );
  ctrl.model = { country, email: 'me@ovhcloud.com' };
  ctrl.readonly = [];
  ctrl.action = 'update';
  ctrl.userAccountServiceInfos = service;
  ctrl.getKycStatus = vi.fn(() => Promise.resolve({}));
  return { ctrl, broadcasts, service, atInternet, alerter };
};

const pixelRule = (ctrl) =>
  (ctrl.rules || []).find((rule) => rule.fieldName === PIXEL);
const broadcastNames = (broadcasts) => broadcasts.map(({ name }) => name);
const consentPayload = (service) =>
  service.updateConsentDecision.mock.calls[0][1];

describe('where the pixel-tracking checkbox is offered', () => {
  // France and Italy only, all French territory included
  it.each([
    ['FR', 'metropolitan France'],
    ['GP', 'Guadeloupe'],
    ['MQ', 'Martinique'],
    ['GF', 'French Guiana'],
    ['RE', 'Reunion'],
    ['YT', 'Mayotte'],
    ['BL', 'Saint-Barthelemy'],
    ['MF', 'Saint-Martin'],
    ['PM', 'Saint-Pierre-et-Miquelon'],
    ['WF', 'Wallis-et-Futuna'],
    ['PF', 'French Polynesia'],
    ['NC', 'New Caledonia'],
    ['TF', 'French Southern Territories'],
    ['IT', 'Italy'],
  ])('offers it to a %s account (%s)', async (country) => {
    const { ctrl } = buildWithConsent({ country });

    await ctrl.$onInit();

    expect(pixelRule(ctrl)).toBeDefined();
  });

  // never for any other country: nothing renders at all
  it.each([
    ['DE', 'Germany'],
    ['ES', 'Spain'],
    ['GB', 'the United Kingdom'],
    ['CH', 'Switzerland, which bills through the IT subsidiary'],
    ['SM', 'San Marino, which bills through the IT subsidiary'],
    ['VA', 'the Vatican, which bills through the IT subsidiary'],
    [undefined, 'no country at all'],
    ['UNKNOWN', 'the UNKNOWN placeholder'],
  ])('builds no rule for %p (%s)', async (country) => {
    const { ctrl } = buildWithConsent({ country });

    await ctrl.$onInit();

    expect(pixelRule(ctrl)).toBeUndefined();
    expect(PIXEL in ctrl.model).toBe(false);
  });

  it('accepts a registered country written in lower case', async () => {
    const { ctrl } = buildWithConsent({ country: 'it' });

    await ctrl.$onInit();

    expect(pixelRule(ctrl)).toBeDefined();
  });

  // the label names the mailbox, so it has to be handed the address
  it('hands the label the registered account email', async () => {
    const { ctrl } = buildWithConsent();

    await ctrl.$onInit();

    expect(pixelRule(ctrl).translateValues).toEqual({
      email: 'me@ovhcloud.com',
    });
  });

  // a pending changeEmail() is not the mailbox receiving anything yet
  it('keeps naming the registered email while a new one is being typed', async () => {
    const { ctrl } = buildWithConsent();
    await ctrl.$onInit();

    ctrl.model.email = 'nouvelle@ovhcloud.com';
    await ctrl.updateRules();

    expect(pixelRule(ctrl).translateValues).toEqual({
      email: 'me@ovhcloud.com',
    });
  });

  it('renders it right under the marketing email checkbox', async () => {
    const { ctrl } = buildWithConsent();

    await ctrl.$onInit();
    const contact = ctrl
      .getRulesBySection('contact')
      .map((rule) => rule.fieldName);

    expect(contact.indexOf(PIXEL)).toBe(contact.indexOf(EMAIL_CONSENT) + 1);
  });

  it('renders neither consent checkbox in the US region', async () => {
    const { ctrl } = buildWithConsent({ isRegionUs: true });

    await ctrl.$onInit();

    expect(pixelRule(ctrl)).toBeUndefined();
    expect(
      ctrl.rules.find((rule) => rule.fieldName === EMAIL_CONSENT),
    ).toBeUndefined();
  });

  // the country select is editable on this screen, so the scope is re-decided
  // on every edit rather than frozen at load
  it('takes the checkbox away when the customer edits the country out of scope', async () => {
    const { ctrl } = buildWithConsent({ country: 'IT' });
    await ctrl.$onInit();

    ctrl.model.country = 'DE';
    await ctrl.updateRules();

    expect(pixelRule(ctrl)).toBeUndefined();
    expect(ctrl.isPixelTrackingAvailable).toBe(false);
  });

  it('brings it in when the customer edits the country into scope', async () => {
    const { ctrl } = buildWithConsent({ country: 'DE' });
    await ctrl.$onInit();

    ctrl.model.country = 'IT';
    await ctrl.updateRules();

    expect(pixelRule(ctrl)).toBeDefined();
    expect(ctrl.isPixelTrackingAvailable).toBe(true);
  });

  // a box that left the screen must not leave its value behind in the payload
  it('drops an unsaved pixel choice when the country leaves the scope', async () => {
    const { ctrl } = buildWithConsent({ country: 'IT' });
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    ctrl.model.country = 'DE';
    await ctrl.updateRules();

    expect(PIXEL in ctrl.model).toBe(false);
  });

  it('sends no pixel key once the country has left the scope', async () => {
    const { ctrl, service } = buildWithConsent({ country: 'IT' });
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;
    ctrl.model[PIXEL] = true;

    ctrl.model.country = 'DE';
    await ctrl.updateRules();
    await ctrl.submit();

    expect(consentPayload(service)).toEqual({ value: true });
  });

  // the click went with the box, so coming back shows the server state again
  it('rebuilds the box from the loaded decision when the country comes back', async () => {
    const { ctrl } = buildWithConsent({
      country: 'IT',
      decision: { value: true, pixel: { value: false } },
    });
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    ctrl.model.country = 'DE';
    await ctrl.updateRules();
    ctrl.model.country = 'IT';
    await ctrl.updateRules();

    expect(pixelRule(ctrl).initialValue).toBe(false);
  });

  // while the country stays in scope the rule is re-injected on every refresh,
  // so updateRules' delete loop never sees it disappear
  it('survives a rules refresh with the customer choice intact', async () => {
    const { ctrl } = buildWithConsent();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.updateRules();

    expect(pixelRule(ctrl)).toBeDefined();
    expect(ctrl.model[PIXEL]).toBe(true);
  });
});

describe('the state the pixel checkbox loads with', () => {
  it('is checked when the API granted pixel tracking', async () => {
    const { ctrl } = buildWithConsent({
      decision: { value: true, pixel: { value: true } },
    });

    await ctrl.$onInit();

    expect(pixelRule(ctrl).initialValue).toBe(true);
  });

  it('is unchecked when the API denied it', async () => {
    const { ctrl } = buildWithConsent({
      decision: { value: true, pixel: { value: false } },
    });

    await ctrl.$onInit();

    expect(pixelRule(ctrl).initialValue).toBe(false);
  });

  // business rule 1: no default consent
  it('is unchecked by default, writing nothing into the model', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: true } });

    await ctrl.$onInit();

    expect(pixelRule(ctrl).initialValue).toBe(false);
    expect(pixelRule(ctrl).defaultValue).toBe(null);
    expect(pixelRule(ctrl).fieldType).toBe('checkbox');
    expect(PIXEL in ctrl.model).toBe(false);
    expect(ctrl.hasChanges()).toBe(false);
  });

  // A pixel consent the email gate would DISABLE is a consent the customer
  // cannot withdraw from this screen (GDPR art. 7(3)), so an inconsistent pair
  // renders unchecked rather than checked-and-greyed.
  it('is unchecked when the API grants pixel tracking without email consent', async () => {
    const { ctrl } = buildWithConsent({
      decision: { value: false, pixel: { value: true } },
    });

    await ctrl.$onInit();

    expect(ctrl.pixelConsentDecision).toBe(false);
    expect(pixelRule(ctrl).initialValue).toBe(false);
    expect(pixelRule(ctrl).disabled()).toBe(true);
    // and the submit-time state agrees with what the box shows
    expect(ctrl.isPixelConsentGranted()).toBe(false);
  });

  // nothing under the label, so the box renders like the marketing-email
  // checkbox above it
  it('carries no description under the label', async () => {
    const { ctrl } = buildWithConsent();

    await ctrl.$onInit();

    expect(pixelRule(ctrl).descriptionKey).toBeUndefined();
  });

  // pixel.history is CNIL audit-trail data, not a UI need
  it('ignores the audit trail and reads only pixel.value', async () => {
    const { ctrl } = buildWithConsent({
      decision: {
        value: true,
        history: [{ value: true, timestamp: '2024-03-01T10:00:00Z' }],
        pixel: {
          value: false,
          history: [
            { value: true, timestamp: '2026-04-10T08:00:00Z' },
            { value: false, timestamp: '2026-06-01T14:22:00Z' },
          ],
        },
      },
    });

    await ctrl.$onInit();

    expect(ctrl.pixelConsentDecision).toBe(false);
    expect(pixelRule(ctrl).initialValue).toBe(false);
  });

  // fetchRules re-runs on every field change and re-reads the decision, but a
  // checkbox already on screen is never repainted by it: the rendered state is
  // the field component's own local copy, set once at its $onInit. So the
  // loaded state has to be captured once, or a decision that moved in another
  // tab becomes the submit-time fallback for a box still showing the old one —
  // writing a consent the customer cannot see on the screen they are saving.
  it('keeps the state it rendered when the decision moves under it', async () => {
    const fetchConsentDecision = vi
      .fn()
      .mockResolvedValueOnce({ value: true, pixel: { value: false } })
      // granted in another tab, after this form rendered its unchecked box
      .mockResolvedValue({ value: true, pixel: { value: true } });
    const { ctrl, service } = buildWithConsent({ fetchConsentDecision });
    await ctrl.$onInit();

    // any field change refreshes the rules, and with them the decision
    await ctrl.updateRules();

    expect(ctrl.pixelConsentDecision).toBe(false);
    expect(ctrl.isPixelConsentGranted()).toBe(false);
    expect(pixelRule(ctrl).initialValue).toBe(false);

    // and saving an untouched pixel box cannot grant what it never showed
    ctrl.model[EMAIL_CONSENT] = true;
    await ctrl.submit();

    expect(consentPayload(service)).toEqual({
      value: true,
      pixel: { value: false },
    });
  });
});

describe('the email gate on the pixel checkbox (business rule 9)', () => {
  it('disables it while marketing email consent is denied', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: false } });

    await ctrl.$onInit();

    expect(pixelRule(ctrl).disabled()).toBe(true);
  });

  // the trap: the email checkbox's loaded state never reaches the model, so a
  // naive !this.model.commercialCommunicationsApproval would disable the box
  // for exactly the customers who are eligible for it
  it('leaves it enabled for an account that consented and has not touched the box', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: true } });

    await ctrl.$onInit();

    expect(EMAIL_CONSENT in ctrl.model).toBe(false);
    expect(pixelRule(ctrl).disabled()).toBe(false);
  });

  it('follows the checkbox rather than the loaded decision once it is clicked', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: true } });
    await ctrl.$onInit();

    ctrl.model[EMAIL_CONSENT] = false;
    expect(pixelRule(ctrl).disabled()).toBe(true);

    ctrl.model[EMAIL_CONSENT] = true;
    expect(pixelRule(ctrl).disabled()).toBe(false);
  });

  // it is invoked by a one-way binding on every digest pass
  it('answers without touching the model', async () => {
    const { ctrl } = buildWithConsent();
    await ctrl.$onInit();
    const before = { ...ctrl.model };

    pixelRule(ctrl).disabled();
    pixelRule(ctrl).disabled();

    expect(ctrl.model).toEqual(before);
  });
});

describe('unchecking the marketing email checkbox', () => {
  it('asks the pixel checkbox to clear itself', async () => {
    const { ctrl, broadcasts } = buildWithConsent();
    await ctrl.$onInit();

    await ctrl.onFieldChange({ fieldName: EMAIL_CONSENT }, false);

    expect(broadcastNames(broadcasts)).toContain(
      'account.pixelTrackingConsent.reset',
    );
  });

  // business rule 6: re-enabling is one-directional
  it('never asks for anything when email consent is granted again', async () => {
    const { ctrl, broadcasts } = buildWithConsent({
      decision: { value: false },
    });
    await ctrl.$onInit();

    await ctrl.onFieldChange({ fieldName: EMAIL_CONSENT }, true);

    expect(broadcastNames(broadcasts)).not.toContain(
      'account.pixelTrackingConsent.reset',
    );
  });

  // no bundled toggle, no "accept all" side effect
  it('never auto-checks pixel tracking by granting email consent', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: false } });
    await ctrl.$onInit();

    await ctrl.onFieldChange({ fieldName: EMAIL_CONSENT }, true);

    expect(PIXEL in ctrl.model).toBe(false);
    expect(ctrl.isPixelConsentGranted()).toBe(false);
  });

  it('leaves a previously refused pixel choice refused', async () => {
    const { ctrl } = buildWithConsent({ decision: { value: false } });
    await ctrl.$onInit();
    ctrl.model[PIXEL] = false;

    await ctrl.onFieldChange({ fieldName: EMAIL_CONSENT }, true);

    expect(ctrl.model[PIXEL]).toBe(false);
  });

  it('asks for nothing on an account the checkbox is not offered to', async () => {
    const { ctrl, broadcasts } = buildWithConsent({ country: 'DE' });
    await ctrl.$onInit();

    await ctrl.onFieldChange({ fieldName: EMAIL_CONSENT }, false);

    expect(broadcastNames(broadcasts)).not.toContain(
      'account.pixelTrackingConsent.reset',
    );
  });
});

describe('what saving writes to the consent campaign', () => {
  it('sends both checkbox states in a single request', async () => {
    const { ctrl, service } = buildWithConsent({ decision: { value: false } });
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(service.updateConsentDecision).toHaveBeenCalledTimes(1);
    expect(service.updateConsentDecision).toHaveBeenCalledWith(CAMPAIGN, {
      value: true,
      pixel: { value: true },
    });
  });

  // a pixel-only change must not send value:false and revoke email consent
  it('keeps the loaded email consent when only the pixel one changed', async () => {
    const { ctrl, service } = buildWithConsent({
      decision: { value: true, pixel: { value: true } },
    });
    await ctrl.$onInit();
    ctrl.model[PIXEL] = false;

    await ctrl.submit();

    expect(consentPayload(service)).toEqual({
      value: true,
      pixel: { value: false },
    });
  });

  // the email-keyed guard would have sent nothing at all
  it('writes when only the pixel checkbox changed', async () => {
    const { ctrl, service } = buildWithConsent();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(service.updateConsentDecision).toHaveBeenCalledTimes(1);
  });

  it('sends no pixel key at all for an account out of the country scope', async () => {
    const { ctrl, service } = buildWithConsent({ country: 'DE' });
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;

    await ctrl.submit();

    expect(consentPayload(service)).toEqual({ value: true });
    expect('pixel' in consentPayload(service)).toBe(false);
  });

  // the one combination the API refuses, and it fails the whole request
  it('can never send pixel consent without email consent', async () => {
    const { ctrl, service } = buildWithConsent({
      decision: { value: true, pixel: { value: true } },
    });
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = false;
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(consentPayload(service)).toEqual({ value: false });
  });

  // Revoking email consent sends the bare body the contract documents for it
  // ("the backend cascades pixel to denied for you"), not the undocumented
  // { value: false, pixel: { value: false } } — this is the most common save
  // an FR/IT customer makes, on a validator we do not control.
  it('sends the documented bare body when email consent is revoked', async () => {
    const { ctrl, service } = buildWithConsent({
      decision: { value: true, pixel: { value: true } },
    });
    await ctrl.$onInit();
    // exactly what the cascade leaves behind: both keys false
    ctrl.model[EMAIL_CONSENT] = false;
    ctrl.model[PIXEL] = false;

    await ctrl.submit();

    expect(consentPayload(service)).toEqual({ value: false });
    expect('pixel' in consentPayload(service)).toBe(false);
  });

  it('writes nothing when neither checkbox was touched', async () => {
    const { ctrl, service } = buildWithConsent();
    await ctrl.$onInit();

    await ctrl.submit();

    expect(service.updateConsentDecision).not.toHaveBeenCalled();
  });

  it('keeps the field out of PUT /me and out of /newAccount/rules', async () => {
    const { ctrl, service } = buildWithConsent();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.submit();
    await ctrl.updateRules();

    expect(PIXEL in service.updateUseraccountInfos.mock.calls[0][0]).toBe(
      false,
    );
    service.postRules.mock.calls.forEach(([params]) => {
      expect(PIXEL in params).toBe(false);
    });
  });
});

describe('a consent decision the API refuses (the defensive 400)', () => {
  const refusing = () => {
    const error = {
      status: 400,
      data: {
        message:
          'pixel tracking requires marketing email consent to be granted',
      },
    };
    const fetchConsentDecision = vi
      .fn()
      .mockResolvedValueOnce({ value: true, pixel: { value: true } })
      .mockResolvedValue({ value: false, pixel: { value: false } });
    return buildWithConsent({
      fetchConsentDecision,
      updateConsentDecision: vi.fn(() => Promise.reject(error)),
    });
  };

  it('re-reads the decision instead of trusting the optimistic state', async () => {
    const { ctrl, service } = refusing();
    await ctrl.$onInit();
    const readsOnLoad = service.fetchConsentDecision.mock.calls.length;
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(service.fetchConsentDecision.mock.calls.length).toBe(
      readsOnLoad + 1,
    );
    expect(ctrl.consentDecision).toBe(false);
    expect(ctrl.pixelConsentDecision).toBe(false);
  });

  it('repaints both checkboxes from the fresh answer', async () => {
    const { ctrl, broadcasts } = refusing();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    const resync = broadcasts.find(
      ({ name }) => name === 'account.consent.resync',
    );
    expect(resync.payload).toEqual({
      [EMAIL_CONSENT]: false,
      [PIXEL]: false,
    });
  });

  // Set to the fresh answer, NOT deleted: the model has to keep agreeing with
  // the boxes this handler just repainted, or the retry the error banner
  // invites builds no consent request at all and reports success having
  // written nothing.
  it('puts the server truth back into the model', async () => {
    const { ctrl } = refusing();
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(ctrl.model[EMAIL_CONSENT]).toBe(false);
    expect(ctrl.model[PIXEL]).toBe(false);
  });

  it('still writes on the retry the error banner invites', async () => {
    const { ctrl, service } = refusing();
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;
    ctrl.model[PIXEL] = true;
    await ctrl.submit();
    service.updateConsentDecision.mockImplementation(() =>
      Promise.resolve(null),
    );

    // the customer presses Save again without re-clicking anything
    await ctrl.submit();

    expect(service.updateConsentDecision).toHaveBeenCalledTimes(2);
    // and what it writes is what the repainted boxes show, never the value the
    // customer was trying to move away from
    expect(service.updateConsentDecision.mock.calls[1][1]).toEqual({
      value: false,
    });
  });

  // §0: the worldwide marketing-email checkbox is not in this epic's scope, and
  // out of the country scope the body carries no pixel key, so this route
  // cannot answer the pixel/email 400 at all
  it('leaves an out-of-scope account exactly as it was before this feature', async () => {
    // hoisted, like serverError below: the API rejects with a response object,
    // and prefer-promise-reject-errors flags the literal at the call site
    const refusal = { status: 400 };
    const { ctrl, service, broadcasts } = buildWithConsent({
      country: 'DE',
      updateConsentDecision: vi.fn(() => Promise.reject(refusal)),
    });
    await ctrl.$onInit();
    const readsOnLoad = service.fetchConsentDecision.mock.calls.length;
    ctrl.model[EMAIL_CONSENT] = true;

    await ctrl.submit();

    expect(service.fetchConsentDecision.mock.calls.length).toBe(readsOnLoad);
    expect(broadcastNames(broadcasts)).not.toContain('account.consent.resync');
    // the customer's click survives, so pressing Save again retries the write
    expect(ctrl.model[EMAIL_CONSENT]).toBe(true);
    expect(ctrl.submitError.status).toBe(400);
  });

  it('still reports the failure to the customer', async () => {
    const { ctrl, alerter } = refusing();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(ctrl.submitError.status).toBe(400);
    expect(alerter.alertFromSWS).toHaveBeenCalled();
  });

  it('does not re-read on an error that is not a 400', async () => {
    const serverError = { status: 500 };
    const { ctrl, service, broadcasts } = buildWithConsent({
      updateConsentDecision: vi.fn(() => Promise.reject(serverError)),
    });
    await ctrl.$onInit();
    const readsOnLoad = service.fetchConsentDecision.mock.calls.length;
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(service.fetchConsentDecision.mock.calls.length).toBe(readsOnLoad);
    expect(broadcastNames(broadcasts)).not.toContain('account.consent.resync');
    expect(ctrl.submitError).toBeTruthy();
  });
});

describe('what the pixel checkbox reports to analytics', () => {
  it('tracks the click as its own consent action', async () => {
    const { ctrl, atInternet } = buildWithConsent();
    await ctrl.$onInit();

    await ctrl.onFieldChange({ fieldName: PIXEL }, true);

    expect(atInternet.trackClick).toHaveBeenCalledWith({
      name: 'accountmodification::product-pixel-consent::enable',
      type: 'action',
      chapter1: 'account',
      chapter2: 'myaccount',
      chapter3: 'consent',
    });
  });

  it('reports the pixel decision on save', async () => {
    const { ctrl, atInternet } = buildWithConsent();
    await ctrl.$onInit();
    ctrl.model[PIXEL] = true;

    await ctrl.submit();

    expect(atInternet.trackPage).toHaveBeenCalledWith(
      expect.objectContaining({
        accountEmailConsent: 'opt-in',
        accountPixelConsent: 'opt-in',
      }),
    );
  });

  it('reports nothing about pixel tracking outside the country scope', async () => {
    const { ctrl, atInternet } = buildWithConsent({ country: 'DE' });
    await ctrl.$onInit();
    ctrl.model[EMAIL_CONSENT] = true;

    await ctrl.submit();

    expect(atInternet.trackPage.mock.calls[0][0]).not.toHaveProperty(
      'accountPixelConsent',
    );
  });
});
