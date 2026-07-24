import { describe, it, expect, vi } from 'vitest';
import Ctrl from './new-account-form-einvoicing.controller';

// The AngularJS account module has no test runner of its own; this "homemade"
// spec runs under the account-creation app's vitest (esbuild resolves the bare
// imports). The controller is a plain class with injected deps, so we build it
// directly — no Angular runtime, $scope only needs $on.
const buildCtrl = ({
  rule = null,
  model = {},
  siret,
  legalForm,
  country = 'FR',
  service,
} = {}) => {
  const handlers = {};
  const $scope = {
    $on: (evt, cb) => {
      handlers[evt] = cb;
    },
  };
  const ctrl = new Ctrl($scope);
  ctrl.model = model;
  ctrl.siret = siret;
  ctrl.legalForm = legalForm;
  ctrl.country = country;
  ctrl.rule = rule;
  ctrl.userAccountServiceInfos = service;
  ctrl.__handlers = handlers;
  return ctrl;
};

const rule = (over = {}) => ({
  visible: true,
  mandatory: true,
  in: null,
  defaultValue: null,
  ...over,
});

describe('NewAccountFormEinvoicingController', () => {
  describe('B2B / B2G detection', () => {
    it('is B2G for administration only', () => {
      expect(buildCtrl({ legalForm: 'administration' }).isB2g()).toBe(true);
      expect(buildCtrl({ legalForm: 'corporation' }).isB2g()).toBe(false);
      expect(buildCtrl({ legalForm: 'association' }).isB2g()).toBe(false);
    });
  });

  describe('address helpers', () => {
    it('reflects the rule.in cardinality', () => {
      expect(buildCtrl({ rule: rule({ in: [] }) }).isEmpty()).toBe(true);
      expect(buildCtrl({ rule: rule({ in: ['a'] }) }).hasSingleAddress()).toBe(
        true,
      );
      expect(
        buildCtrl({ rule: rule({ in: ['a', 'b'] }) }).hasMultipleAddresses(),
      ).toBe(true);
    });

    it('getSingleAddress prefers default_value, else the only entry', () => {
      expect(
        buildCtrl({
          rule: rule({ in: ['a'], defaultValue: 'd' }),
        }).getSingleAddress(),
      ).toBe('d');
      expect(buildCtrl({ rule: rule({ in: ['a'] }) }).getSingleAddress()).toBe(
        'a',
      );
      expect(
        buildCtrl({ rule: rule({ in: ['a', 'b'] }) }).getSingleAddress(),
      ).toBe(null);
    });
  });

  describe('syncModelValue', () => {
    it('clears the value when hidden / empty', () => {
      const c = buildCtrl({
        rule: rule({ visible: false, in: [] }),
        model: { einvoicingBillingAddress: 'x' },
      });
      c.syncModelValue();
      expect(c.model.einvoicingBillingAddress).toBe(null);

      const c2 = buildCtrl({
        rule: rule({ in: [] }),
        model: { einvoicingBillingAddress: 'x' },
      });
      c2.syncModelValue();
      expect(c2.model.einvoicingBillingAddress).toBe(null);
    });

    it('auto-selects the single address (default_value)', () => {
      const c = buildCtrl({
        rule: rule({ in: ['only'], defaultValue: 'only' }),
        model: {},
      });
      c.syncModelValue();
      expect(c.model.einvoicingBillingAddress).toBe('only');
    });

    it('keeps a still-valid current value in the multiple case (pre-selection)', () => {
      const c = buildCtrl({
        rule: rule({ in: ['a', 'b', 'c'] }),
        model: { einvoicingBillingAddress: 'b' },
      });
      c.syncModelValue();
      expect(c.model.einvoicingBillingAddress).toBe('b');
      expect(c.selectedAddress).toEqual({ value: 'b', label: 'b' });
    });

    it('drops a stale current value not in value.in (multiple)', () => {
      const c = buildCtrl({
        rule: rule({ in: ['a', 'b'] }),
        model: { einvoicingBillingAddress: 'gone' },
      });
      c.syncModelValue();
      expect(c.model.einvoicingBillingAddress).toBe(null);
      expect(c.selectedAddress).toBe(null);
    });
  });

  describe('oui-select glue', () => {
    it('memoizes items to a stable reference (no infdig)', () => {
      const c = buildCtrl({ rule: rule({ in: ['a', 'b'] }) });
      const first = c.getAddressItems();
      expect(first).toEqual([
        { value: 'a', label: 'a' },
        { value: 'b', label: 'b' },
      ]);
      expect(c.getAddressItems()).toBe(first); // same ref across digests
      c.rule = rule({ in: ['a', 'b', 'c'] }); // source changed
      expect(c.getAddressItems()).not.toBe(first);
    });

    it('onAddressChange writes the picked id back to the scalar model', () => {
      const c = buildCtrl({ rule: rule({ in: ['a', 'b'] }), model: {} });
      c.selectedAddress = { value: 'b', label: 'b' };
      c.onAddressChange();
      expect(c.model.einvoicingBillingAddress).toBe('b');
      c.selectedAddress = null;
      c.onAddressChange();
      expect(c.model.einvoicingBillingAddress).toBe(null);
    });
  });

  describe('eligibility', () => {
    it('requires FR + eligible legal form + 14-digit SIRET', () => {
      expect(
        buildCtrl({
          country: 'FR',
          legalForm: 'corporation',
          siret: '32682006500083',
        }).isEligible(),
      ).toBe(true);
      expect(
        buildCtrl({
          country: 'GB',
          legalForm: 'corporation',
          siret: '32682006500083',
        }).isEligible(),
      ).toBe(false);
      expect(
        buildCtrl({
          country: 'FR',
          legalForm: 'individual',
          siret: '32682006500083',
        }).isEligible(),
      ).toBe(false);
      expect(
        buildCtrl({
          country: 'FR',
          legalForm: 'corporation',
          siret: '123',
        }).isEligible(),
      ).toBe(false);
    });
  });

  describe('refreshRules', () => {
    it('clears the rule and skips the call when not eligible', () => {
      const service = { getEinvoicingRules: vi.fn() };
      const c = buildCtrl({ country: 'GB', service, rule: rule() });
      expect(c.refreshRules()).toBe(null);
      expect(c.rule).toBe(null);
      expect(service.getEinvoicingRules).not.toHaveBeenCalled();
    });

    it('fetches the rule and syncs the model when eligible', async () => {
      const fetched = rule({ in: ['a'], defaultValue: 'a' });
      const service = {
        getEinvoicingRules: vi.fn().mockResolvedValue(fetched),
      };
      const c = buildCtrl({
        country: 'FR',
        legalForm: 'corporation',
        siret: '32682006500083',
        model: {},
        service,
      });
      await c.refreshRules();
      expect(service.getEinvoicingRules).toHaveBeenCalledWith({
        siret: '32682006500083',
        legalForm: 'corporation',
      });
      expect(c.rule).toBe(fetched);
      expect(c.model.einvoicingBillingAddress).toBe('a'); // single → auto
      expect(c.loading).toBe(false);
    });

    it('hides the field when the rules call fails', async () => {
      const service = {
        getEinvoicingRules: vi.fn().mockRejectedValue(new Error('boom')),
      };
      const c = buildCtrl({
        country: 'FR',
        legalForm: 'corporation',
        siret: '32682006500083',
        model: {},
        service,
      });
      await c.refreshRules();
      expect(c.rule).toBe(null);
      expect(c.loading).toBe(false);
    });
  });

  describe('RG6 stale address', () => {
    it('on einvoicing.staleAddress: flags stale, clears value, refreshes', () => {
      const service = { getEinvoicingRules: vi.fn() };
      const c = buildCtrl({
        country: 'GB', // not eligible → refreshRules is a no-op we can assert on
        model: { einvoicingBillingAddress: 'x' },
        service,
      });
      const refreshSpy = vi.spyOn(c, 'refreshRules');
      c.$onInit();
      c.__handlers['einvoicing.staleAddress']();
      expect(c.staleAddress).toBe(true);
      expect(c.model.einvoicingBillingAddress).toBe(null);
      expect(refreshSpy).toHaveBeenCalled();
    });
  });
});
