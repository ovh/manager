import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import AppImagesSelect from './AppImageSelect.component';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import {
  mockedPartnerImage,
  mockedPartnerImageBis,
} from '@/__tests__/helpers/mocks/partnerAppImage';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { Locale } from '@/hooks/useLocale';

describe('Docker Image Select component', () => {
  afterEach(() => {
    vi.mock('@ovh-ux/manager-react-shell-client', () => {
      return {
        useShell: vi.fn(() => ({
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

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
  it('should display Docker Image component with preset image select', async () => {
    render(
      <AppImagesSelect
        appImages={[mockedPartnerImage, mockedPartnerImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('custom-image-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('partner-image-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('docker-custom-image')).toBeInTheDocument();
      expect(
        screen.queryByTestId('partner-image-select'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display personnal image input on custom image trigger', async () => {
    render(
      <AppImagesSelect
        appImages={[mockedPartnerImage, mockedPartnerImageBis]}
        value={''}
        onChange={onChange}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await userEvent.click(screen.getByTestId('partner-image-trigger'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('docker-custom-image'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('partner-image-select')).toBeInTheDocument();
    });
  });
});
