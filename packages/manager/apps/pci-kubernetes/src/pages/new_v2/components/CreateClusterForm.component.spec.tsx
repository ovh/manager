import { createContext } from 'react';

import { RenderResult, act, render, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TCloudCatalog,
  TCloudCatalogPlan,
  TCloudCatalogPricing,
} from '@/domain/entities/cloudCatalog';
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
    plans: [
      'mks.standard.hour.consumption.3az',
      'mks.free.hour.consumption',
      'mks.standard.hour.consumption',
    ],
    enabled: true,
  },
  {
    name: 'UK',
    countryCode: 'uk',
    continentCode: 'EU',
    microRegionIds: ['UK1'],
    plans: [
      'mks.standard.hour.consumption.3az',
      'mks.free.hour.consumption',
      'mks.standard.hour.consumption',
    ],
    enabled: true,
  },
  {
    name: 'GRA',
    countryCode: 'fr',
    continentCode: 'EU',
    microRegionIds: ['GRA5', 'GRA7'],
    plans: [
      'mks.standard.hour.consumption.3az',
      'mks.free.hour.consumption',
      'mks.standard.hour.consumption',
    ],
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

const createMockPricing = (price: number, tax: number = 0): TCloudCatalogPricing => ({
  phase: 1,
  capacities: [],
  commitment: 0,
  description: 'Test pricing',
  interval: 1,
  intervalUnit: 'hour',
  price,
  formattedPrice: `${price}`,
  tax,
  mode: 'default',
  strategy: 'strategy',
  mustBeCompleted: false,
  type: 'purchase',
});

const createMockPlan = (
  planCode: string,
  price: number = 0,
  tax: number = 0,
): TCloudCatalogPlan => ({
  planCode,
  invoiceName: 'Test Plan',
  product: 'kubernetes',
  pricingType: 'consumption',
  consumptionConfiguration: null,
  pricings: [createMockPricing(price, tax)],
});

const mockCatalog: TCloudCatalog = {
  entities: {
    plans: {
      'mks.free.hour.consumption': createMockPlan('mks.free.hour.consumption', 0, 0),
      'mks.standard.hour.consumption': createMockPlan('mks.standard.hour.consumption', 0.04, 0.008),
      'mks.standard.hour.consumption.3az': createMockPlan(
        'mks.standard.hour.consumption.3az',
        0.12,
        0.024,
      ),
    },
  },
};

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

vi.mock('@/api/hooks/useKubeRegions', () => ({
  useKubeRegions: vi.fn().mockReturnValue({
    data: ['BHS5', 'UK1', 'GRA5', 'GRA7'],
    isLoading: false,
  }),
}));

const mockUseCloudCatalog = vi.fn().mockImplementation(({ select }: any) => ({
  data: select ? select(mockCatalog) : mockCatalog,
  isLoading: false,
  isPending: false,
  isError: false,
  error: null,
}));

vi.mock('@/api/hooks/useCloudCatalog', () => ({
  useCloudCatalog: mockUseCloudCatalog,
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const mod: typeof import('@ovh-ux/manager-react-shell-client') = await vi.importActual(
    '@ovh-ux/manager-react-shell-client',
  );

  return {
    ...mod,
    ShellContext: createContext({
      environment: {
        getUser: vi.fn(() => ({
          ovhSubsidiary: 'FR',
        })),
      },
    }),
  };
});

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
      name: /regions:region_UK/i,
    });
    expect(targetedRegion).toBeInTheDocument();
    await act(() => user.click(targetedRegion));

    const cartElement = renderedDom.getByTestId('cart');
    expect(cartElement).toHaveTextContent('regions:region_UK');
  });
});

describe('CreateClusterForm plan management', () => {
  it('keeps synchronized plan selection and cart display', async () => {
    const user = userEvent.setup();
    const renderedDom = render(<CreateClusterForm is3azAvailable />);

    await waitFor(() => {
      expect(renderedDom.getByTestId('cart')).toBeInTheDocument();
    });

    const cartElement = renderedDom.getByTestId('cart');

    await waitFor(() => {
      const freePlanTitle = renderedDom.queryByText('kube_add_plan_title_free');
      expect(freePlanTitle).toBeInTheDocument();
    });

    const freePlanTitle = renderedDom.getByText('kube_add_plan_title_free');
    const freePlanCard = freePlanTitle.closest('[role="radio"]') || freePlanTitle.closest('div');
    if (!freePlanCard) {
      throw new Error('Unable to find free plan card');
    }

    await act(() => user.click(freePlanCard));

    await waitFor(() => {
      expect(cartElement).toHaveTextContent('kube_add_plan_title_free');
    });
  });

  it('selects first available plan automatically when plans are loaded', async () => {
    const renderedDom = render(<CreateClusterForm is3azAvailable />);

    await waitFor(() => {
      expect(renderedDom.getByTestId('cart')).toBeInTheDocument();
    });

    const cartElement = renderedDom.getByTestId('cart');

    await waitFor(() => {
      expect(cartElement).toHaveTextContent('kube_add_plan_title_standard');
    });
  });

  it('updates cart when plan changes from standard to free', async () => {
    const user = userEvent.setup();
    const renderedDom = render(<CreateClusterForm is3azAvailable />);

    await waitFor(() => {
      expect(renderedDom.getByTestId('cart')).toBeInTheDocument();
    });

    const cartElement = renderedDom.getByTestId('cart');

    await waitFor(() => {
      expect(cartElement).toHaveTextContent('kube_add_plan_title_standard');
    });

    await waitFor(() => {
      const freePlanTitle = renderedDom.queryByText('kube_add_plan_title_free');
      expect(freePlanTitle).toBeInTheDocument();
    });

    const freePlanTitle = renderedDom.getByText('kube_add_plan_title_free');
    const freePlanCard = freePlanTitle.closest('[role="radio"]') || freePlanTitle.closest('div');
    if (!freePlanCard) {
      throw new Error('Unable to find free plan card');
    }

    await act(() => user.click(freePlanCard));

    await waitFor(() => {
      expect(cartElement).toHaveTextContent('kube_add_plan_title_free');
      expect(cartElement).not.toHaveTextContent('kube_add_plan_title_standard');
    });
  });
});
