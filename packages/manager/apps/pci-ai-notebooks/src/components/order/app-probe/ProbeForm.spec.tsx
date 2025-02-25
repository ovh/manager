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
import ProbeForm from './ProbeForm.component';

describe('Probe form component', () => {
  afterEach(() => {
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
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Probe Form without any activation', async () => {
    render(
      <ProbeForm
        onChange={onChange}
        probeValue={{ path: '/health', port: 8080 }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('probe-swith-button')).toBeInTheDocument();
      expect(screen.queryByTestId('prob-form-input')).not.toBeInTheDocument();
    });
  });

  it('should display Probe Form and activate', async () => {
    render(<ProbeForm onChange={onChange} probeValue={{}} />);
    await waitFor(() => {
      expect(screen.getByTestId('probe-swith-button')).toBeInTheDocument();
      expect(screen.queryByTestId('prob-form-input')).not.toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('probe-swith-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('path-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('port-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('probe-add-button')).toBeInTheDocument();
    });
  });

  it('should display Probe Form and trigger on change on submit', async () => {
    render(<ProbeForm onChange={onChange} probeValue={{}} />);
    act(() => {
      fireEvent.click(screen.getByTestId('probe-swith-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('path-input-field')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('path-input-field'), {
        target: {
          value: '/health',
        },
      });
      fireEvent.change(screen.getByTestId('port-input-field'), {
        target: {
          value: 8080,
        },
      });
      fireEvent.click(screen.getByTestId('probe-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ path: '/health', port: 8080 });
    });
  });
});
