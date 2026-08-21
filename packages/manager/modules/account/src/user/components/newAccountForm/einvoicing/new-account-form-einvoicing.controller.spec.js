import { describe, expect, it, vi } from 'vitest';

import EinvoicingCtrl from './new-account-form-einvoicing.controller';

const A = 'FR:SIRET:42476141900045';
const B = 'FR:SIRET:42476141900099';
const SIRET = '42476141900045';
const SIRET_REGEX = '^[0-9]{14}$';

// the rules entry the parent hands down, as /newAccount/rules returns it
const rule = (addresses) => ({
  fieldName: 'einvoicingBillingAddress',
  in: addresses,
  mandatory: false,
});

const change = (currentValue, isFirst = false) => ({
  currentValue,
  isFirstChange: () => isFirst,
});

const build = ({ addresses = [A, B], selected = A } = {}) => {
  const ctrl = new EinvoicingCtrl({ $on: vi.fn() });
  Object.assign(ctrl, {
    model: { einvoicingBillingAddress: selected },
    rule: rule(addresses),
    siret: SIRET,
    siretRegex: SIRET_REGEX,
    legalForm: 'corporation',
    country: 'FR',
    onRefreshRules: vi.fn(),
  });
  ctrl.$onInit();
  // initial load: the parent pushes the rules entry down
  ctrl.$onChanges({ rule: change(ctrl.rule, true) });
  return ctrl;
};

// the parent refetched the rules and pushed a new entry down
const refreshWith = (ctrl, addresses) => {
  ctrl.rule = rule(addresses);
  ctrl.$onChanges({ rule: change(ctrl.rule) });
};

describe('a rules refresh triggered by another field', () => {
  // the reported regression: an unrelated field the API refuses made the whole
  // picker vanish, losing a choice the API had never rejected
  it('keeps the addresses when the refresh comes back with none', () => {
    const ctrl = build();

    refreshWith(ctrl, null);

    expect(ctrl.getAddresses()).toEqual([A, B]);
    expect(ctrl.hasMultipleAddresses()).toBe(true);
    expect(ctrl.model.einvoicingBillingAddress).toBe(A);
  });

  // /newAccount/rules answers with a single empty entry for "nothing known"
  it('keeps them when the refresh comes back with an empty entry', () => {
    const ctrl = build();

    refreshWith(ctrl, ['']);

    expect(ctrl.getAddresses()).toEqual([A, B]);
    expect(ctrl.model.einvoicingBillingAddress).toBe(A);
  });

  it('keeps the picker on screen rather than the "no address" banner', () => {
    const ctrl = build();

    refreshWith(ctrl, []);

    expect(ctrl.isEmpty()).toBe(false);
    expect(ctrl.hasMultipleAddresses()).toBe(true);
  });

  it('still takes a refresh that does bring addresses', () => {
    const ctrl = build();

    refreshWith(ctrl, [A, B, 'FR:SIRET:42476141900123']);

    expect(ctrl.getAddresses()).toHaveLength(3);
  });

  it('drops a selection the directory no longer offers', () => {
    const ctrl = build();

    refreshWith(ctrl, [B, 'FR:SIRET:42476141900123']);

    expect(ctrl.model.einvoicingBillingAddress).toBe(null);
  });
});

describe('a rules refresh after the company changed', () => {
  // a different company really may have no address at all (RG5)
  it('clears the addresses when the new SIRET has none', () => {
    const ctrl = build();

    ctrl.siret = '98471504500014';
    ctrl.$onChanges({ siret: change('98471504500014') });
    refreshWith(ctrl, ['']);

    expect(ctrl.getAddresses()).toEqual([]);
    expect(ctrl.isEmpty()).toBe(true);
    expect(ctrl.model.einvoicingBillingAddress).toBe(null);
  });

  it.each([
    ['legalForm', 'association'],
    ['country', 'GP'],
  ])('clears them when the %s changed', (binding, value) => {
    const ctrl = build();

    ctrl[binding] = value;
    ctrl.$onChanges({ [binding]: change(value) });
    refreshWith(ctrl, null);

    expect(ctrl.getAddresses()).toEqual([]);
  });

  it('goes back to keeping them on the refresh after that', () => {
    const ctrl = build();

    ctrl.$onChanges({ siret: change(SIRET) });
    refreshWith(ctrl, [A, B]);
    // an unrelated field is edited: the company did not change this time
    refreshWith(ctrl, null);

    expect(ctrl.getAddresses()).toEqual([A, B]);
  });
});

describe('the address the customer picked', () => {
  it('is cleared when the submit told us it is stale', () => {
    const listeners = {};
    const ctrl = new EinvoicingCtrl({
      $on: (name, fn) => {
        listeners[name] = fn;
      },
    });
    Object.assign(ctrl, {
      model: { einvoicingBillingAddress: A },
      rule: rule([A, B]),
      siret: SIRET,
      siretRegex: SIRET_REGEX,
      legalForm: 'corporation',
      country: 'FR',
      onRefreshRules: vi.fn(),
    });
    ctrl.$onInit();

    listeners['einvoicing.staleAddress']();

    expect(ctrl.model.einvoicingBillingAddress).toBe(null);
    expect(ctrl.staleAddress).toBe(true);
  });

  it('is cleared when the SIRET is no longer complete', () => {
    const ctrl = build();

    ctrl.siret = '424761419';
    ctrl.$onChanges({ siret: change('424761419') });

    expect(ctrl.model.einvoicingBillingAddress).toBe(null);
  });
});
