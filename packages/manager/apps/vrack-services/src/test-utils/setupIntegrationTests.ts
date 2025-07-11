import { beforeAll, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import {
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import 'element-internals-polyfill';

declare const global: any;

const server = setupServer(
  ...toMswHandlers([
    ...getAuthenticationMocks({ isAuthMocked: true, region: 'EU' }),
  ]),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  delete global.server;
  global.__VERSION__ = null;
  global.server = server;
});

afterAll(() => {
  server.close();

  delete global.__VERSION__;
});

afterEach(() => {
  server.resetHandlers();
});

vi.mock('element-internals-polyfill/dist/utils.js', async () => {
  console.log('🔧 mock polyfill');
  const actual = await vi.importActual<any>(
    'element-internals-polyfill/dist/utils.js',
  );
  return {
    ...actual,
    upgradeInternals: (internals: any = {}) => {
      const {
        labels = [],
        validationMessage = '',
        validity = {},
        willValidate = false,
        ...rest
      } = internals || {};
      return { labels, validationMessage, validity, willValidate, ...rest };
    },
  };
});

const mockLabels: NodeListOf<HTMLLabelElement> = {
  item: vi.fn(),
  forEach: vi.fn(),
  entries: vi.fn(),
  keys: vi.fn(),
  values: vi.fn(),
  [Symbol.iterator]: vi.fn(),
  length: 0,
};

const mockValidity: ValidityState = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: false,
  valueMissing: false,
};

const mockState: CustomStateSet = {
  forEach: vi.fn(),
  add: vi.fn(),
  clear: vi.fn(),
  delete: vi.fn(),
  has: vi.fn(),
  size: 0,
  entries: vi.fn(),
  keys: vi.fn(),
  values: vi.fn(),
  [Symbol.iterator]: vi.fn(),
  [Symbol.toStringTag]: '',
};

if (!HTMLElement.prototype.attachInternals) {
  console.log('🔧 attachInternals polyfill used');
  HTMLElement.prototype.attachInternals = () => ({
    labels: mockLabels,
    validity: mockValidity,
    willValidate: false,
    setFormValue: () => {},
    states: mockState,
    shadowRoot: null,
    ariaAtomic: null,
    ariaAutoComplete: null,
    ariaBrailleLabel: null,
    ariaBrailleRoleDescription: null,
    ariaBusy: null,
    ariaChecked: null,
    ariaColCount: null,
    ariaColIndex: null,
    ariaColIndexText: null,
    ariaColSpan: null,
    ariaCurrent: null,
    ariaDescription: null,
    ariaDisabled: null,
    ariaExpanded: null,
    ariaHasPopup: null,
    ariaHidden: null,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLevel: null,
    ariaLive: null,
    ariaModal: null,
    ariaMultiLine: null,
    ariaMultiSelectable: null,
    ariaOrientation: null,
    ariaPlaceholder: null,
    ariaPosInSet: null,
    ariaPressed: null,
    ariaReadOnly: null,
    ariaRelevant: null,
    ariaRequired: null,
    ariaRoleDescription: null,
    ariaRowCount: null,
    ariaRowIndex: null,
    ariaRowIndexText: null,
    ariaRowSpan: null,
    ariaSelected: null,
    ariaSetSize: null,
    ariaSort: null,
    ariaValueMax: null,
    ariaValueMin: null,
    ariaValueNow: null,
    ariaValueText: null,
    role: null,
    checkValidity: vi.fn(),
    form: null,
    reportValidity: vi.fn(),
    setValidity: vi.fn(),
    validationMessage: null,
  });
}

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
