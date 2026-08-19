import { describe, expect, it, vi } from 'vitest';

import SiretSearchModalCtrl from './siret-search-modal.controller';

// Verbatim payload of a non-disclosed company, provider
// DATA_GOUV_RECHERCHE_ENTREPRISES: the withheld values come back as empty
// strings, not as [ND] tokens.
const ND_ENTRY = {
  address: '',
  area: '32',
  city: 'COURRIERES',
  creationDate: '2024-02-24',
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

// `init: false` for the tests that drive $onInit themselves — everywhere else
// the controller is initialised like the component would, so the tracking prefix
// is set before any hit is emitted.
const build = ({ getSiret, init = true, ...bindings } = {}) => {
  const atInternet = { trackClick: vi.fn(), trackPage: vi.fn() };
  const siretService = {
    getSiret: getSiret || (() => Promise.resolve({ entryList: [] })),
  };
  const ctrl = new SiretSearchModalCtrl(atInternet, siretService);
  Object.assign(ctrl, {
    country: 'FR',
    legalForm: 'corporation',
    trackingMode: 'modification',
    onValidate: vi.fn(),
    onCancel: vi.fn(),
    ...bindings,
  });
  if (init) {
    ctrl.$onInit();
  }
  return { ctrl, atInternet, siretService };
};

describe('auto-search on open', () => {
  it('searches the SIRET the account already holds', async () => {
    const getSiret = vi.fn(() => Promise.resolve({ entryList: [FULL_ENTRY] }));
    const { ctrl, atInternet } = build({
      getSiret,
      init: false,
      initialSearch: '98471504500014',
    });

    ctrl.$onInit();
    await Promise.resolve();

    expect(getSiret).toHaveBeenCalledWith({
      country: 'FR',
      identifier: '98471504500014',
    });
    // nothing was clicked, so no click hit — the outcome is still tracked
    expect(atInternet.trackClick).not.toHaveBeenCalled();
    expect(atInternet.trackPage).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.stringContaining('::list') }),
    );
  });

  it('strips spaces out of the SIRET it was given', async () => {
    const getSiret = vi.fn(() => Promise.resolve({ entryList: [] }));
    const { ctrl } = build({
      getSiret,
      init: false,
      initialSearch: '984 715 045 00014',
    });

    ctrl.$onInit();

    expect(getSiret).toHaveBeenCalledWith({
      country: 'FR',
      identifier: '98471504500014',
    });
  });

  it.each([
    ['984715045', 'a SIREN'],
    ['', 'nothing'],
    [undefined, 'no binding at all'],
    ['9847150450001A', 'a malformed value'],
  ])('does not search when the account holds %p (%s)', (initialSearch) => {
    const getSiret = vi.fn();
    const { ctrl } = build({ getSiret, init: false, initialSearch });

    ctrl.$onInit();

    expect(getSiret).not.toHaveBeenCalled();
  });
});

describe('stale responses', () => {
  it('drops a response for a SIRET the customer has since edited', async () => {
    let resolveSearch;
    const getSiret = () =>
      new Promise((resolve) => {
        resolveSearch = resolve;
      });
    const { ctrl } = build({ getSiret, initialSearch: '98471504500014' });

    ctrl.$onInit();
    // the customer retypes while the auto-search is still in flight
    ctrl.search = '42476141900045';
    ctrl.onSearchChange();
    resolveSearch({ entryList: [FULL_ENTRY], type: 'siret' });
    await Promise.resolve();
    await Promise.resolve();

    expect(ctrl.selected).toBeNull();
    expect(ctrl.suggest).toBeNull();
    // the retry loop is available again
    expect(ctrl.canSearch()).toBe(true);
    expect(ctrl.getSearchButtonLabelKey()).toBe('siret_search_button');
  });

  it('drops a response that lands after the modal was closed', async () => {
    let resolveSearch;
    const getSiret = () =>
      new Promise((resolve) => {
        resolveSearch = resolve;
      });
    const { ctrl, atInternet } = build({
      getSiret,
      init: false,
      initialSearch: '98471504500014',
    });

    ctrl.$onInit();
    ctrl.$onDestroy();
    resolveSearch({ entryList: [FULL_ENTRY], type: 'siret' });
    await Promise.resolve();
    await Promise.resolve();

    expect(ctrl.suggest).toBeNull();
    // no navigation hit for a screen nobody saw
    expect(atInternet.trackPage).not.toHaveBeenCalled();
  });

  it('keeps a response whose SIRET is still the one on screen', async () => {
    const { ctrl } = build({
      getSiret: () => Promise.resolve({ entryList: [FULL_ENTRY], type: 'siret' }),
      init: false,
      initialSearch: '42476141900045',
    });

    ctrl.$onInit();
    await Promise.resolve();
    await Promise.resolve();

    expect(ctrl.selected).toEqual(FULL_ENTRY);
  });
});

describe('search state', () => {
  it('refuses to search a SIRET that is not 14 digits', () => {
    const { ctrl } = build();
    ctrl.search = '9847150450001';
    expect(ctrl.canSearch()).toBe(false);
  });

  it('refuses to search while a search runs', () => {
    const { ctrl } = build();
    ctrl.search = '98471504500014';
    ctrl.searching = true;
    expect(ctrl.canSearch()).toBe(false);
  });

  it('only flags an invalid SIRET once the field was left', () => {
    const { ctrl } = build();
    ctrl.search = '9847';
    expect(ctrl.isSearchInvalid()).toBe(false);
    ctrl.onSearchBlur();
    expect(ctrl.isSearchInvalid()).toBe(true);
  });

  it('does not flag an empty field', () => {
    const { ctrl } = build();
    ctrl.onSearchBlur();
    ctrl.search = '';
    expect(ctrl.isSearchInvalid()).toBe(false);
  });

  it('searches on Enter and stops the keypress reaching the outer form', () => {
    const getSiret = vi.fn(() => Promise.resolve({ entryList: [] }));
    const { ctrl } = build({ getSiret });
    ctrl.search = '98471504500014';
    const event = { key: 'Enter', preventDefault: vi.fn() };

    ctrl.onSearchKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(getSiret).toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const getSiret = vi.fn();
    const { ctrl } = build({ getSiret });
    ctrl.search = '98471504500014';
    const event = { key: 'a', preventDefault: vi.fn() };

    ctrl.onSearchKeyDown(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(getSiret).not.toHaveBeenCalled();
  });
});

describe('non-disclosed company', () => {
  it('names every value the customer has to complete', () => {
    const { ctrl } = build();
    ctrl.selected = ND_ENTRY;

    expect(ctrl.isNonDiffusible()).toBe(true);
    // city came back, so it is not listed
    expect(ctrl.getMissingFieldLabelKeys()).toEqual([
      'siret_manual_company_name_corporation',
      'siret_modal_non_diffusible_field_address',
      'siret_modal_non_diffusible_field_zip',
    ]);
  });

  it('names the missing company after the legal form', () => {
    const { ctrl } = build({ legalForm: 'association' });
    ctrl.selected = ND_ENTRY;

    expect(ctrl.getMissingFieldLabelKeys()[0]).toBe(
      'siret_manual_company_name_association',
    );
  });

  it('treats withheld [ND] tokens the same as empty values', () => {
    const { ctrl } = build();
    ctrl.selected = { ...FULL_ENTRY, address: '[ND]' };

    expect(ctrl.isNonDiffusible()).toBe(true);
    expect(ctrl.getMissingFieldLabelKeys()).toEqual([
      'siret_modal_non_diffusible_field_address',
    ]);
  });

  it('lists nothing for a fully disclosed company', () => {
    const { ctrl } = build();
    ctrl.selected = FULL_ENTRY;

    expect(ctrl.isNonDiffusible()).toBe(false);
    expect(ctrl.getMissingFieldLabelKeys()).toEqual([]);
  });

  it('asks to complete rather than to validate', () => {
    const { ctrl } = build();
    ctrl.selected = ND_ENTRY;
    expect(ctrl.getValidateLabelKey()).toBe('siret_modal_complete');

    ctrl.selected = FULL_ENTRY;
    expect(ctrl.getValidateLabelKey()).toBe('siret_modal_validate');
  });

  it('reuses the same array while the selection does not change', () => {
    // ng-repeat must not get a fresh array on every digest
    const { ctrl } = build();
    ctrl.selected = ND_ENTRY;
    expect(ctrl.getMissingFieldLabelKeys()).toBe(
      ctrl.getMissingFieldLabelKeys(),
    );
  });
});

describe('wording of the intro', () => {
  it('asks for the SIRET before anything was found', () => {
    const { ctrl } = build();
    expect(ctrl.getIntroKey()).toBe('siret_update_search_assistant_info');
  });

  it('asks to check the information once a company is on screen', () => {
    const { ctrl } = build({ legalForm: 'administration' });
    ctrl.selected = FULL_ENTRY;
    expect(ctrl.getIntroKey()).toBe(
      'siret_modal_review_intro_administration',
    );
  });
});

describe('result shapes', () => {
  it('preselects the single establishment a SIRET matches', async () => {
    const { ctrl } = build({
      getSiret: () => Promise.resolve({ entryList: [FULL_ENTRY], type: 'siret' }),
    });
    ctrl.search = '42476141900045';

    await ctrl.submitSearch();

    expect(ctrl.selected).toEqual(FULL_ENTRY);
    expect(ctrl.hasEntries()).toBe(true);
    expect(ctrl.hasNoResult()).toBe(false);
  });

  it('reports no result on the 404 shape', async () => {
    const { ctrl, atInternet } = build({
      getSiret: () =>
        Promise.resolve({ error: false, searched: '98471504500014', entryList: [] }),
    });
    ctrl.search = '98471504500014';

    await ctrl.submitSearch();

    expect(ctrl.hasNoResult()).toBe(true);
    expect(ctrl.selected).toBeNull();
    expect(atInternet.trackPage).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.stringContaining('::no-result') }),
    );
  });

  it('reports an error payload that carries no entryList', async () => {
    const { ctrl } = build({
      getSiret: () => Promise.resolve({ error: true, message: 'boom' }),
    });
    ctrl.search = '98471504500014';

    await ctrl.submitSearch();

    expect(ctrl.hasError()).toBe(true);
    expect(ctrl.hasEntries()).toBe(false);
    expect(ctrl.hasNoResult()).toBe(false);
  });

  it('survives a rejected lookup', async () => {
    const { ctrl } = build({ getSiret: () => Promise.reject(new Error('net')) });
    ctrl.search = '98471504500014';

    await ctrl.submitSearch();

    expect(ctrl.hasError()).toBe(true);
    expect(ctrl.searching).toBe(false);
  });

  it('lets the customer pick when several establishments come back', async () => {
    const second = { ...FULL_ENTRY, secondaryCNIN: '42476141900046' };
    const { ctrl } = build({
      getSiret: () =>
        Promise.resolve({ entryList: [FULL_ENTRY, second], type: 'siret' }),
    });
    ctrl.search = '42476141900045';

    await ctrl.submitSearch();

    expect(ctrl.hasManyEntries()).toBe(true);
    // nothing preselected: the customer chooses
    expect(ctrl.selected).toBeNull();
    ctrl.selectSuggest(second);
    expect(ctrl.selected).toEqual(second);
  });
});

describe('validate and cancel', () => {
  it('hands the confirmed company back to the caller', () => {
    const { ctrl } = build();
    ctrl.selected = FULL_ENTRY;

    ctrl.validate();

    expect(ctrl.onValidate).toHaveBeenCalledWith({ suggestion: FULL_ENTRY });
  });

  it('cannot validate without a company', () => {
    const { ctrl } = build();

    ctrl.validate();

    expect(ctrl.onValidate).not.toHaveBeenCalled();
  });

  it('cancels without touching the caller', () => {
    const { ctrl } = build();

    ctrl.cancel();

    expect(ctrl.onCancel).toHaveBeenCalled();
    expect(ctrl.onValidate).not.toHaveBeenCalled();
  });
});

describe('company review', () => {
  it('blanks withheld values instead of showing the token', () => {
    const { ctrl } = build();
    ctrl.selected = { ...FULL_ENTRY, name: '[ND]' };
    expect(ctrl.getCompanyName()).toBe('');
  });

  it('joins the address parts that came back', () => {
    const { ctrl } = build();
    ctrl.selected = FULL_ENTRY;
    expect(ctrl.getCompanyAddress()).toBe('2 rue Kellermann 59100 ROUBAIX');
  });

  it('keeps only the known parts of a partial address', () => {
    const { ctrl } = build();
    ctrl.selected = ND_ENTRY;
    expect(ctrl.getCompanyAddress()).toBe('COURRIERES');
  });
});
