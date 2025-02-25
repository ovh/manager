import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import PrivacyRadioInput from './PrivacyRadio.component';
import { PrivacyEnum } from '@/types/orderFunnel';

describe('Privacy input component', () => {
  beforeEach(async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should call display radio and call onChange with public', async () => {
    render(
      <PrivacyRadioInput onChange={onChange} value={PrivacyEnum.public} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-radio-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('private-radio'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(PrivacyEnum.private);
    });
  });

  it('should call display radio and call onChange with private', async () => {
    render(
      <PrivacyRadioInput onChange={onChange} value={PrivacyEnum.private} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('privacy-radio-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('public-radio'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(PrivacyEnum.public);
    });
  });
});
