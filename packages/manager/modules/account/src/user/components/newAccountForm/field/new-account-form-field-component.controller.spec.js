import { describe, expect, it, vi } from 'vitest';

import NewAccountFormFieldCtrl from './new-account-form-field-component.controller';

// The app bundle provides angular as a global; the controller relies on it
// rather than importing it. setInitialValue is the only reach from here.
global.angular = {
  copy: (value) => JSON.parse(JSON.stringify(value ?? null)),
};

const PIXEL_RESET = 'account.pixelTrackingConsent.reset';
const RESYNC = 'account.consent.resync';
const PIXEL = 'pixelTrackingConsent';
const EMAIL_CONSENT = 'commercialCommunicationsApproval';

const checkboxRule = (fieldName, initialValue = null) => ({
  fieldName,
  fieldType: 'checkbox',
  mandatory: false,
  defaultValue: null,
  initialValue,
});

const build = (rule) => {
  const listeners = {};
  const $scope = {
    $watch: () => {},
    $emit: () => {},
    $on: (name, fn) => {
      listeners[name] = fn;
    },
  };
  const onFieldChange = vi.fn();
  const ctrl = new NewAccountFormFieldCtrl(
    vi.fn(),
    {},
    $scope,
    (fn) => fn(),
    { instant: (key) => key },
    { trackClick: vi.fn() },
    { getUser: () => ({}) },
  );
  ctrl.rule = rule;
  ctrl.fieldset = {};
  ctrl.isIndianSubsidiary = false;
  ctrl.newAccountForm = { onFieldChange, model: {}, rules: [] };
  ctrl.$onInit();
  return { ctrl, listeners, onFieldChange };
};

describe('the state a consent checkbox renders with', () => {
  // business rule 1, and it keeps the Save button disabled on load
  it('renders unchecked and writes nothing into the parent model', () => {
    const { ctrl, onFieldChange } = build(checkboxRule(PIXEL, false));

    expect(ctrl.value).toBeUndefined();
    expect(onFieldChange).not.toHaveBeenCalled();
  });

  it('renders checked when the API granted it', () => {
    const { ctrl } = build(checkboxRule(PIXEL, true));

    expect(ctrl.value).toBe(true);
  });
});

describe('revoking marketing email consent while pixel tracking is on', () => {
  // THE regression this file exists for: onChange() re-reads the pre-toggle
  // local value and inverts it, so it has to run BEFORE this.value = false.
  // Swap the two statements and the model receives true instead.
  it('pushes false into the model, not true', () => {
    const rule = checkboxRule(PIXEL, true);
    const { ctrl, listeners, onFieldChange } = build(rule);

    listeners[PIXEL_RESET]();

    expect(onFieldChange).toHaveBeenCalledWith(rule, false, ctrl.fieldset);
    expect(ctrl.value).toBe(false);
  });

  it('does nothing when the box is already unchecked', () => {
    const { ctrl, listeners, onFieldChange } = build(checkboxRule(PIXEL));

    listeners[PIXEL_RESET]();

    expect(onFieldChange).not.toHaveBeenCalled();
    expect(ctrl.value).toBeUndefined();
  });

  it('is not listened for by any other checkbox', () => {
    const { listeners } = build(checkboxRule(EMAIL_CONSENT, true));

    expect(listeners[PIXEL_RESET]).toBeUndefined();
  });

  it('is not listened for by the sms consent checkbox either', () => {
    const { listeners } = build(checkboxRule('smsConsent', true));

    expect(listeners[PIXEL_RESET]).toBeUndefined();
    expect(listeners['account.smsConsent.reset']).toBeTypeOf('function');
  });

  // The sms reset is byte-identical to the pixel one and carries the same
  // invisible ordering contract, but nothing covered it: a first-match
  // "tidy-up" of `this.onChange(); this.value = false;` lands on THAT block
  // and pushes true into the model with the suite still green. It costs one
  // assertion to close, and the harness is already built.
  it('pins the same ordering contract on the sms consent reset', () => {
    const rule = checkboxRule('smsConsent', true);
    const { ctrl, listeners, onFieldChange } = build(rule);

    listeners['account.smsConsent.reset']();

    expect(onFieldChange).toHaveBeenCalledWith(rule, false, ctrl.fieldset);
    expect(ctrl.value).toBe(false);
  });
});

describe('a decision the API handed back after refusing a write', () => {
  it('repaints the pixel checkbox from it', () => {
    const { ctrl, listeners } = build(checkboxRule(PIXEL, true));

    listeners[RESYNC](null, { [EMAIL_CONSENT]: true, [PIXEL]: false });

    expect(ctrl.value).toBe(false);
  });

  it('repaints the marketing email checkbox from the same event', () => {
    const { ctrl, listeners } = build(checkboxRule(EMAIL_CONSENT));

    listeners[RESYNC](null, { [EMAIL_CONSENT]: true, [PIXEL]: false });

    expect(ctrl.value).toBe(true);
  });

  // the parent already dropped the refused values, so the model matches the
  // server: re-notifying would only dirty the form again
  it('does not write back into the model', () => {
    const { listeners, onFieldChange } = build(checkboxRule(PIXEL, true));

    listeners[RESYNC](null, { [EMAIL_CONSENT]: true, [PIXEL]: false });

    expect(onFieldChange).not.toHaveBeenCalled();
  });

  it('reads only its own field out of the payload', () => {
    const { ctrl, listeners } = build(checkboxRule(PIXEL, true));

    listeners[RESYNC](null, { [EMAIL_CONSENT]: true });

    expect(ctrl.value).toBe(false);
  });

  it('survives an event carrying no decision', () => {
    const { ctrl, listeners } = build(checkboxRule(PIXEL, true));

    listeners[RESYNC](null);

    expect(ctrl.value).toBe(false);
  });

  it('is not registered on an unrelated field', () => {
    const { listeners } = build(checkboxRule('smsConsent', true));

    expect(listeners[RESYNC]).toBeUndefined();
  });
});
