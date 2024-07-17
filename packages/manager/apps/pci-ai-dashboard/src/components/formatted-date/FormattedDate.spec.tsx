import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import FormattedDate from './FormattedDate.component';
import { Locale } from '@/hooks/useLocale.hook';

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  type CallbackType = (localePros: { locale: string }) => void;
  let localeChangeCallback: CallbackType | null = null;
  const onLocaleChange = (callback: CallbackType) => {
    localeChangeCallback = callback;
  };
  const getLocale = vi.fn();
  return {
    useShell: vi.fn(() => ({
      i18n: {
        getLocale,
        onLocaleChange,
        setLocale: vi.fn((newLocale: string) => {
          if (localeChangeCallback) {
            localeChangeCallback({ locale: newLocale });
          }
        }),
      },
    })),
  };
});

describe('FormattedDate component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should render the date with french locale', async () => {
    const date = new Date(2024, 5, 8, 12, 42, 50, 151);
    vi.mocked(useShell().i18n.getLocale).mockResolvedValue(Locale.fr_FR);
    render(<FormattedDate date={date} />);
    await waitFor(() => {
      expect(screen.getByText('08/06/2024')).toBeInTheDocument();
    });
  });
  it('should render the date with PT locale', async () => {
    vi.mocked(useShell().i18n.getLocale).mockResolvedValue(() => Locale.pt_PT);
    const date = new Date(2024, 5, 8, 12, 42, 50, 151);
    render(
      <FormattedDate
        date={date}
        options={{
          dateStyle: 'long',
          timeStyle: 'medium',
        }}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText('8 de junho de 2024 às 12:42:50'),
      ).toBeInTheDocument();
    });
  });

  it('should render the date with EN locale', async () => {
    vi.mocked(useShell().i18n.getLocale).mockResolvedValue(() => Locale.en_GB);
    const date = new Date(2024, 5, 8, 12, 42, 50, 151);
    render(
      <FormattedDate
        date={date}
        options={{
          dateStyle: 'long',
          timeStyle: 'medium',
        }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('8 June 2024 at 12:42:50')).toBeInTheDocument();
    });
  });
});
