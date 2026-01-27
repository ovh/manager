import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { createElement } from 'react';
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

const translateMock = (key: string) => key;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: translateMock,
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

type OdsQuantityMockProps = {
  ariaLabel?: string;
  value?: number | null;
  onOdsChange?: (event: { detail: { value?: number } }) => void;
  onOdsBlur?: () => void;
  hasError?: boolean;
  min?: number;
  max?: number;
  step?: number;
} & Record<string, unknown>;

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('@ovhcloud/ods-components/react')>();

  return {
    ...mod,
    OdsQuantity: ({
      ariaLabel,
      value,
      onOdsChange,
      onOdsBlur,
      hasError: _hasError,
      min,
      max,
      step,
      ...props
    }: OdsQuantityMockProps) => {
      const hasDecimalStep =
        typeof step === 'number' && Number.isFinite(step) && step % 1 !== 0;

      return createElement('input', {
        ...props,
        role: 'spinbutton',
        type: 'number',
        inputMode: hasDecimalStep ? 'decimal' : 'numeric',
        'aria-label': ariaLabel,
        'aria-valuemin': min != null ? String(min) : undefined,
        'aria-valuemax': max != null ? String(max) : undefined,
        min,
        max,
        step,
        value: value ?? '',
        onBlur: onOdsBlur,
        onChange: (event: { target: { value: string } }) => {
          const inputValue = event.target.value;
          onOdsChange?.({
            detail: { value: inputValue === '' ? undefined : Number(inputValue) },
          });
        },
      });
    },
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
