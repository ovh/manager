import { beforeAll, afterAll, vi, Mock } from 'vitest';
import { setupServer } from 'msw/node';
import {
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import 'element-internals-polyfill';
import { NavLinkProps, useParams } from 'react-router-dom';
import {
  vrackListMocks,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';

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

beforeEach(() => {
  (useParams as Mock).mockReturnValue({
    id: vrackServicesListMocks[0].id,
    vrackId: vrackListMocks[0],
    urn: '',
  });
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
    ariaActiveDescendantElement: null,
    ariaControlsElements: [],
    ariaDescribedByElements: [],
    ariaDetailsElements: [],
    ariaErrorMessageElements: [],
    ariaFlowToElements: [],
    ariaLabelledByElements: [],
    ariaOwnsElements: []
  });
}

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

vi.mock('@ovh-ux/manager-module-common-api', async () => {
  const original = await vi.importActual('@ovh-ux/manager-module-common-api');
  return {
    ...original,
    useDeleteService: vi.fn().mockReturnValue({
      terminateService: vi.fn(),
      isPending: false,
      error: false,
      isError: false,
    }),
  };
});

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    Navigate: vi.fn(),
    useNavigate: () => vi.fn(),
    useSearchParams: () => [{ get: (str: string) => str }],
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
    useParams: vi.fn(),
    NavLink: ({ ...params }: NavLinkProps) => params.children,
  };
});
