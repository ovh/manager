import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import PartnerImageSelect from './PartnerImageSelect.component';
import {
  mockedPartnerImage,
  mockedPartnerImageBis,
} from '@/__tests__/helpers/mocks/partnerAppImage';
import { Locale } from '@/hooks/useLocale';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('Partner Image Select component', () => {
  beforeEach(async () => {
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
