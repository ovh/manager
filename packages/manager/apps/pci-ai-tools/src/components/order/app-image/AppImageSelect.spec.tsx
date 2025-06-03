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
    vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => {
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
  const onTabChange = vi.fn();
  it('should display Docker Image component with preset image select', async () => {
    render(
      <AppImagesSelect
        appImages={[
          mockedPartnerImagePerApp,
          mockedPartnerSignedImagePerReplica,
        ]}
        onTabChange={onTabChange}
        activeTab="customerImage"
        value={''}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('custom-image-trigger')).toBeTruthy();
      expect(screen.getByTestId('partner-image-trigger')).toBeTruthy();
      expect(screen.getByTestId('docker-custom-image')).toBeTruthy();
      expect(screen.queryByTestId('partner-image-select')).toBeNull();
    });
  });

  it('should display personnal image input on custom image trigger', async () => {
    render(
      <AppImagesSelect
        onTabChange={onTabChange}
        activeTab="partnerImage"
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
      expect(screen.queryByTestId('docker-custom-image')).toBeNull();
      expect(screen.getByTestId('partner-image-select')).toBeTruthy();
    });
  });
});
