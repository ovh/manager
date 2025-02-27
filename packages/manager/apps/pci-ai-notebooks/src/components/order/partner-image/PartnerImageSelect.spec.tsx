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
import {
  mockedPartnerImage,
  mockedPartnerImageBis,
} from '@/__tests__/helpers/mocks/partnerAppImage';

describe('Partner Image Select component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
  });

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

  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Image Partner Select', async () => {
    render(
      <PartnerImageSelect
        images={[mockedPartnerImage, mockedPartnerImageBis]}
        value={mockedPartnerImage.id}
        onChange={onChange}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByTestId('partner-image-select')).toBeInTheDocument();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPartnerImage.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPartnerImageBis.id}`),
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('contract-checkbox'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        mockedPartnerImage.id,
        undefined,
        true,
      );
    });
  });

  it('should trigger callback when selected', async () => {
    render(
      <PartnerImageSelect
        images={[mockedPartnerImage, mockedPartnerImageBis]}
        value={mockedPartnerImage.id}
        onChange={onChange}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    const imgRadioTileId = `image-radio-tile-${mockedPartnerImageBis.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(imgRadioTileId)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(imgRadioTileId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        mockedPartnerImageBis.id,
        '1',
        true,
      );
    });
  });
});
