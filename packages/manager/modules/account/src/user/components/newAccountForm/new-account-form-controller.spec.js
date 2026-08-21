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
