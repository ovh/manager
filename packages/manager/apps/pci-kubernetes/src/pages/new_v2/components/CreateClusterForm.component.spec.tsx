import { RenderResult, render } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { CreateClusterForm } from './CreateClusterForm.component';

const validClusterName = 'my_magical_cluster';
const invalidClusterName = '---';

const mockMacroRegions = [
  {
    name: 'BHS',
    countryCode: 'ca' as const,
    deploymentMode: 'region' as const,
    continentCode: 'NA' as const,
    microRegionIds: ['BHS5'],
    availabilityZones: [],
  },
  {
    name: 'UK1',
    countryCode: 'uk' as const,
    deploymentMode: 'region' as const,
    continentCode: 'EU' as const,
    microRegionIds: ['UK1'],
    availabilityZones: [],
  },
  {
    name: 'GRA',
    countryCode: 'fr' as const,
    deploymentMode: 'region' as const,
    continentCode: 'EU' as const,
    microRegionIds: ['GRA5', 'GRA7'],
    availabilityZones: [],
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
}));

vi.mock('@/api/hooks/useRegions', () => ({
  useRegions: vi.fn(),
}));

describe('CreateClusterForm name management', () => {
  let user: UserEvent;
  let renderedDom: RenderResult;
  let nameField: Element;

  beforeEach(async () => {
    user = userEvent.setup();
    renderedDom = render(<CreateClusterForm />);

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
    const { useRegions } = await import('@/api/hooks/useRegions');

    vi.mocked(useRegions).mockImplementation(
      ({ select }: any) =>
        ({
          data: select ? select(mockRegions) : mockRegions,
          isPending: false,
          isError: false,
          error: null,
        }) as any,
    );

    let user = userEvent.setup();
    const renderedDom = render(<CreateClusterForm />);

    const targetedRegion = renderedDom.getByRole('radio', { name: /Londres/i });
    await user.click(targetedRegion);

    const cartElement = renderedDom.getByTestId('cart');
    expect(cartElement).toHaveTextContent('Londres (UK1)');
  });
});
