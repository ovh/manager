import { vi } from 'vitest';
import { PointerEvent } from './helpers/pointerEvent';

// use a custom pointerEvent as jest does not implement it.
// it is requiered for DropdownMenus
// source: https://github.com/radix-ui/primitives/issues/856#issuecomment-928704064
window.PointerEvent = PointerEvent as any;

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
        put,
        delete: del,
      },
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@datatr-ux/uxlib', async (importOriginal) => {
  const toastMock = vi.fn();
  const mod = await importOriginal<typeof import('@datatr-ux/uxlib')>();
  return {
    ...mod,
    useToast: vi.fn(() => ({
      toasts: [],
      toast: toastMock,
      dismiss: vi.fn(),
    })),
  };
});

const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
