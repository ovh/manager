import { RenderResult, act, render } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { TMacroRegion } from '@/domain/entities/regions';

import { CreateClusterForm } from './CreateClusterForm.component';

const validClusterName = 'my_magical_cluster';
const invalidClusterName = '---';

const mockMacroRegions: Array<TMacroRegion> = [
  {
    name: 'BHS',
    countryCode: 'ca',
    continentCode: 'NA',
    microRegionIds: ['BHS5'],
    plans: ['mks.standard.hour.consumption.3az'],
    enabled: true,
  },
  {
    name: 'UK',
    countryCode: 'uk',
    continentCode: 'EU',
    microRegionIds: ['UK1'],
    plans: ['mks.standard.hour.consumption.3az'],
    enabled: true,
  },
  {
    name: 'GRA',
    countryCode: 'fr',
    continentCode: 'EU',
    microRegionIds: ['GRA5', 'GRA7'],
    plans: ['mks.standard.hour.consumption.3az'],
    enabled: true,
  },
];

const mockRegions = {
  entities: {
    macroRegions: {
      byId: new Map(mockMacroRegions.map((region) => [region.name, region])),
      allIds: mockMacroRegions.map((region) => region.name),
    },
    microRegions: {
      byId: new Map(),
      allIds: [],
    },
  },
};

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn((price: number) => `${price}`),
    getFormattedHourlyCatalogPrice: vi.fn(),
    getFormattedMonthlyCatalogPrice: vi.fn(),
  }),
  useTranslatedMicroRegions: vi.fn().mockReturnValue({
    translateMacroRegion: (name: string) => {
      const translations: Record<string, string> = {
        BHS: 'Beauharnois',
        UK1: 'Londres',
        GRA: 'Gravelines',
      };
      return translations[name] || name;
    },
    translateMicroRegion: (name: string) => name,
    translateContinentRegion: (name: string) => name,
  }),
  useMe: vi.fn().mockReturnValue({
    me: {
      ovhSubsidiary: 'FR',
      currency: {
        code: 'EUR',
      },
    },
  }),
}));

vi.mock('@/api/hooks/useAvailabilityRegions', () => ({
  useAvailabilityRegions: vi.fn().mockImplementation(
    ({ select }: any) =>
      ({
        data: select ? select(mockRegions) : mockRegions,
        isPending: false,
        isError: false,
        error: null,
      }) as any,
  ),
}));

describe('CreateClusterForm name management', () => {
  let user: UserEvent;
  let renderedDom: RenderResult;
  let nameField: Element;

  beforeEach(async () => {
    user = userEvent.setup();
    renderedDom = render(<CreateClusterForm is3azAvailable />);

    const field = renderedDom.getByRole('textbox', { name: 'kubernetes_add_name_placeholder' });
    if (!field) throw new Error('Unable to find name field');

    await user.clear(field);
    nameField = field;
  });

  it('keeps synchronized name input and cart subtitle', async () => {
    await user.type(nameField, validClusterName);

    const cartElement = renderedDom.getByTestId('cart');
    expect(cartElement).toHaveTextContent(validClusterName);
  });

  it('disables create button when name is invalid', async () => {
    await user.type(nameField, invalidClusterName);

    const createButton = renderedDom.getByText('kubernetes_add_create_cluster');
    expect(createButton).toBeDisabled();
  });
});

describe('CreateClusterForm location management', () => {
  it('keeps synchronized location selection and cart display', async () => {
    let user = userEvent.setup();
    const renderedDom = render(<CreateClusterForm is3azAvailable />);

    const targetedRegion = renderedDom.getByRole('radio', {
      name: /@ovh-ux\/manager-common-translations\/region:region_UK/i,
    });
    expect(targetedRegion).toBeInTheDocument();
    await act(() => user.click(targetedRegion));

    const cartElement = renderedDom.getByTestId('cart');
    expect(cartElement).toHaveTextContent(
      '@ovh-ux/manager-common-translations/region:region_UK_micro',
    );
  });
});
