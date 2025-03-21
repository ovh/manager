import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import AppImagesSelect from './AppImageSelect.component';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedPartnerImagePerApp,
  mockedPartnerSignedImagePerReplica,
} from '@/__tests__/helpers/mocks/partner/partner';

describe('Docker Image Select component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
          },
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Docker Image component with preset image select', async () => {
    render(
      <AppImagesSelect
        appImages={[
          mockedPartnerImagePerApp,
          mockedPartnerSignedImagePerReplica,
        ]}
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
        appImages={[
          mockedPartnerImagePerApp,
          mockedPartnerSignedImagePerReplica,
        ]}
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
