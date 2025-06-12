import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import PartnerImageSelect from './PartnerImageSelect.component';
import { mockedPartnerImagePerApp } from '@/__tests__/helpers/mocks/partner/partner';
import { ImagePartnerApp } from '@/types/orderFunnel';

const mockedPartnerWithOtherId: ImagePartnerApp = {
  ...mockedPartnerImagePerApp,
  id: 'otherIdAppImage',
};

describe('Partner Image Select component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
  });

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

  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Image Partner Select', async () => {
    render(
      <PartnerImageSelect
        images={[mockedPartnerImagePerApp, mockedPartnerWithOtherId]}
        value={mockedPartnerImagePerApp.id}
        onChange={onChange}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('partner-image-select')).toBeTruthy();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPartnerImagePerApp.id}`),
      ).toBeTruthy();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPartnerImagePerApp.id}`),
      ).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('contract-checkbox'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        mockedPartnerImagePerApp.id,
        undefined,
        true,
      );
    });
  });

  it('should trigger callback when selected', async () => {
    render(
      <PartnerImageSelect
        images={[mockedPartnerImagePerApp, mockedPartnerWithOtherId]}
        value={mockedPartnerImagePerApp.id}
        onChange={onChange}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    const imgRadioTileId = `image-radio-tile-${mockedPartnerWithOtherId.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(imgRadioTileId)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(imgRadioTileId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        mockedPartnerWithOtherId.id,
        '1',
        false,
      );
    });
  });
});
