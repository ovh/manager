import { describe, expect, it, vi } from 'vitest';

import SiretCtrl from './siret.controller';

// Verbatim payload of a non-disclosed company (provider
// DATA_GOUV_RECHERCHE_ENTREPRISES): withheld values are empty strings.
const ND_ENTRY = {
  address: '',
  area: '32',
  city: 'COURRIERES',
  legalFormCode: '1000',
  name: '',
  primaryCNIN: '984715045',
  secondaryCNIN: '98471504500014',
  vatID: 'FR59984715045',
  zipCode: '',
};

const FULL_ENTRY = {
  address: '2 rue Kellermann',
  city: 'ROUBAIX',
  legalFormCode: '5710',
  name: 'OVH',
  primaryCNIN: '424761419',
  secondaryCNIN: '42476141900045',
  vatID: 'FR22424761419',
  zipCode: '59100',
};

// mode: null for the creation flow — undefined would trigger the default below,
// exactly as AngularJS leaves the binding unset when the attribute is absent.
const build = ({ model = {}, mode = 'modification', ...bindings } = {}) => {
  const broadcasts = [];
  const $rootScope = {
    $broadcast: (name, payload) => broadcasts.push({ name, payload }),
  };
  const $scope = { $on: vi.fn() };
  const $timeout = (fn) => fn();
  const $element = [document.createElement('div')];
  const coreConfig = { getUser: () => ({ legalform: 'corporation' }) };
  const $translate = { instant: (key) => key };
  const siretService = { getSiret: vi.fn() };

  const ctrl = new SiretCtrl(
    { trackClick: vi.fn(), trackPage: vi.fn() },
    $translate,
    siretService,
    coreConfig,
    $rootScope,
    $scope,
    $timeout,
    $element,
  );
  Object.assign(ctrl, {
    mode,
    country: 'FR',
    trackingMode: mode === 'modification' ? 'modification' : 'creation',
    model,
    rules: {},
    ...bindings,
  });
  ctrl.$onInit();
  return { ctrl, broadcasts, $element };
};

const broadcastOf = (broadcasts, name) =>
  broadcasts.filter((b) => b.name === name).pop();

describe('$onInit in modification mode', () => {
  it('keeps the edition form mounted so the customer never loses their data', () => {
    const { ctrl } = build();
    expect(ctrl.displayManualForm).toBe(true);
    expect(ctrl.isFirstSearch).toBe(false);
    expect(ctrl.searchModalOpen).toBe(false);
  });

  it('opens the modal straight away on a deep link', () => {
    const { ctrl } = build({ fieldToFocus: 'siretForm' });
    expect(ctrl.searchModalOpen).toBe(true);
  });

  it('listens for a request to reopen the modal', () => {
    const { ctrl } = build();
    expect(ctrl.$scope.$on).toHaveBeenCalledWith(
      'siret:openSearchModal',
      expect.any(Function),
    );
  });
});

describe('opening the modal', () => {
  it('changes nothing but the modal visibility', () => {
    const model = {
      organisation: 'PREVIOUS COMPANY',
      companyNationalIdentificationNumber: '42476141900045',
      vat: 'FR22424761419',
    };
    const { ctrl, broadcasts } = build({ model });
    const before = { ...model };

    ctrl.openSearchModal();

    expect(ctrl.searchModalOpen).toBe(true);
    // the whole promise of the modal: dismissing must be a no-op
    expect(ctrl.model).toEqual(before);
    expect(broadcastOf(broadcasts, 'siret:companySelected')).toBeUndefined();
  });

  it('leaves the model untouched when the modal is dismissed', () => {
    const model = { organisation: 'PREVIOUS COMPANY' };
    const { ctrl } = build({ model });

    ctrl.openSearchModal();
    ctrl.closeSearchModal();

    expect(ctrl.searchModalOpen).toBe(false);
    expect(ctrl.model).toEqual({ organisation: 'PREVIOUS COMPANY' });
  });
});

describe('applySuggestion on a fully disclosed company', () => {
  it('writes the company found into the shared model', () => {
    const { ctrl, broadcasts } = build({ model: { organisation: 'OLD' } });

    ctrl.applySuggestion(FULL_ENTRY);

    expect(ctrl.model.organisation).toBe('OVH');
    expect(ctrl.model.companyNationalIdentificationNumber).toBe(
      '42476141900045',
    );
    expect(ctrl.model.vat).toBe('FR22424761419');
    expect(ctrl.isNonDiffusible).toBe(false);
    expect(broadcastOf(broadcasts, 'siret:companySelected').payload).toEqual({
      address: '2 rue Kellermann',
      city: 'ROUBAIX',
      zip: '59100',
    });
  });

  it('unticks the confirmation checkbox so fresh data is confirmed again', () => {
    const { ctrl } = build();
    ctrl.informationConfirmed = true;

    ctrl.applySuggestion(FULL_ENTRY);

    expect(ctrl.informationConfirmed).toBe(false);
  });

  it('locks the fields the assistant filled in', () => {
    const { ctrl } = build();

    ctrl.applySuggestion(FULL_ENTRY);

    expect(ctrl.isOrganisationDisabled()).toBe(true);
    expect(ctrl.isSiretDisabled()).toBe(true);
  });
});

describe('applySuggestion on a non-disclosed company', () => {
  // this is the regression: the customer first searches a disclosed company,
  // then searches a company whose data the directory withholds
  const previous = {
    organisation: 'PREVIOUS COMPANY',
    companyNationalIdentificationNumber: '42476141900045',
    vat: 'FR22424761419',
  };

  it('does not keep the name of the company searched before', () => {
    const { ctrl } = build({ model: { ...previous } });

    ctrl.applySuggestion(ND_ENTRY);

    expect(ctrl.model.organisation).toBe('');
  });

  it('unlocks the fields the customer now has to fill in', () => {
    const { ctrl } = build({ model: { ...previous } });

    ctrl.applySuggestion(ND_ENTRY);

    // blanked, therefore editable
    expect(ctrl.isOrganisationDisabled()).toBe(false);
  });

  it('flags the company as non-disclosed even though nothing carries [ND]', () => {
    const { ctrl } = build({ model: { ...previous } });

    ctrl.applySuggestion(ND_ENTRY);

    expect(ctrl.isNonDiffusible).toBe(true);
  });

  it('blanks the address parts the directory withheld, keeping the city', () => {
    const { ctrl, broadcasts } = build({ model: { ...previous } });

    ctrl.applySuggestion(ND_ENTRY);

    expect(broadcastOf(broadcasts, 'siret:companySelected').payload).toEqual({
      address: '',
      city: 'COURRIERES',
      zip: '',
    });
  });

  it('still applies the SIRET and the VAT the directory did return', () => {
    const { ctrl } = build({ model: { ...previous } });

    ctrl.applySuggestion(ND_ENTRY);

    expect(ctrl.model.companyNationalIdentificationNumber).toBe(
      '98471504500014',
    );
    expect(ctrl.model.vat).toBe('FR59984715045');
    // the SIRET was found, so it stays locked
    expect(ctrl.isSiretDisabled()).toBe(true);
  });

  it('treats a withheld [ND] token exactly like an empty value', () => {
    const { ctrl } = build({ model: { ...previous } });

    ctrl.applySuggestion({ ...FULL_ENTRY, name: '[ND]' });

    expect(ctrl.model.organisation).toBe('');
    expect(ctrl.isNonDiffusible).toBe(true);
    expect(ctrl.isOrganisationDisabled()).toBe(false);
  });
});

describe('validating from the modal', () => {
  it('closes the modal and applies the company', () => {
    const { ctrl } = build();
    ctrl.searchModalOpen = true;

    ctrl.onSearchModalValidate(FULL_ENTRY);

    expect(ctrl.searchModalOpen).toBe(false);
    expect(ctrl.model.organisation).toBe('OVH');
  });

  it('applies nothing when no company came back', () => {
    const { ctrl } = build({ model: { organisation: 'KEEP ME' } });
    ctrl.searchModalOpen = true;

    ctrl.onSearchModalValidate(undefined);

    expect(ctrl.searchModalOpen).toBe(false);
    expect(ctrl.model.organisation).toBe('KEEP ME');
  });

  it('focuses the first field to fill on an incomplete company', () => {
    const form = document.createElement('form');
    const untouched = document.createElement('input');
    const invalid = document.createElement('input');
    invalid.className = 'ng-invalid';
    form.append(untouched, invalid);
    document.body.append(form);
    const { ctrl } = build();
    // the component lives inside the surrounding form
    form.append(ctrl.$element[0]);

    ctrl.onSearchModalValidate(ND_ENTRY);

    expect(document.activeElement).toBe(invalid);
    form.remove();
  });

  it('does not move the focus for a fully disclosed company', () => {
    const form = document.createElement('form');
    const invalid = document.createElement('input');
    invalid.className = 'ng-invalid';
    form.append(invalid);
    document.body.append(form);
    const { ctrl } = build();
    form.append(ctrl.$element[0]);

    ctrl.onSearchModalValidate(FULL_ENTRY);

    expect(document.activeElement).not.toBe(invalid);
    form.remove();
  });
});

describe('the account type detected from the company', () => {
  it('switches the account type and tells the parent to refetch its rules', () => {
    const onLegalFormChange = vi.fn();
    const { ctrl } = build({
      model: { legalform: 'corporation' },
      onLegalFormChange,
    });

    // INSEE category 9xxx is an association
    ctrl.applySuggestion({ ...FULL_ENTRY, legalFormCode: '9220' });

    expect(ctrl.model.legalform).toBe('association');
    expect(onLegalFormChange).toHaveBeenCalledWith({
      legalform: 'association',
    });
  });

  it('computes the FR VAT number of a corporation that has none', () => {
    const { ctrl } = build({ model: { legalform: 'corporation' } });

    ctrl.applySuggestion({ ...FULL_ENTRY, vatID: '' });

    expect(ctrl.model.vat).toBe('FR22424761419');
  });
});

describe('creation mode keeps the inline assistant', () => {
  it('does not mount the edition form nor the modal', () => {
    const { ctrl } = build({ mode: null });
    expect(ctrl.displayManualForm).toBe(false);
    expect(ctrl.isFirstSearch).toBe(true);
    expect(ctrl.searchModalOpen).toBe(false);
  });

  it('routes the assistant button to the inline search, not the modal', () => {
    const { ctrl } = build({ mode: null });

    ctrl.onSearchAssistantClick();

    expect(ctrl.searchModalOpen).toBe(false);
    expect(ctrl.displayManualForm).toBe(false);
    expect(ctrl.isFirstSearch).toBe(true);
  });

  it('routes the assistant button to the modal in modification', () => {
    const { ctrl } = build();

    ctrl.onSearchAssistantClick();

    expect(ctrl.searchModalOpen).toBe(true);
  });
});
