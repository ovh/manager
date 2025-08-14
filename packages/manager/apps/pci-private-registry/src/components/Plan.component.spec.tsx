import { beforeAll, describe, vi } from 'vitest';
import { render, RenderResult } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import * as useCatalogModule from '@ovh-ux/manager-pci-common';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import PlanComponent from './Plan.component';
import { wrapper } from '@/wrapperRenders';
import { TRegistryPlan } from '@/api/data/registry';

import { DeploymentMode, PlanName } from '@/types';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t(key: string, data: Record<string, string>) {
      const templates: Record<
        string,
        (data: Record<string, string>) => string
      > = {
        private_registry_upgrade_plan_connections: (d) =>
          `private_registry_upgrade_plan_connections:${d.total}`,
        private_registry_upgrade_core_registry: (d) =>
          `private_registry_upgrade_core_registry_${d.percent}`,
        private_registry_upgrade_other_components: (d) =>
          `private_registry_upgrade_other_components_${d.percent}`,
      };

      return templates[key]?.(data) ?? key;
    },
  })),
}));

const defaultAddon = {
  planCode: 'planCode.hour.consumption',
  blobs: {
    technical: {
      bandwidth: {
        unlimited: false,
      },
    },
  },
  pricings: [
    {
      price: 42,
      tax: 1,
    },
  ],
};
vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-pci-common')
  >();
  return {
    ...actual,
    useCatalog: () => ({
      data: {
        addons: [defaultAddon],
      },
      isPending: false,
    }),
    Pricing: ({ pricing }: { pricing: useCatalogModule.TPricing }) => (
      <div>{pricing.price}</div>
    ),
  };
});

const defaultPlan: TRegistryPlan = {
  id: 'planId',
  code: 'planCode.hour.consumption',
  features: {
    vulnerability: false,
  },
  name: PlanName.SMALL,
  registryLimits: {
    imageStorage: 10,
    parallelRequest: 50,
  },
  createdAt: '',
  updatedAt: '',
};

describe('PlanComponent', () => {
  it('should render plan name', () => {
    const { getByTestId } = render(
      <PlanComponent type={DeploymentMode.MONO_ZONE} plan={defaultPlan} />,
      {
        wrapper,
      },
    );
    expect(getByTestId('name')).toHaveTextContent('S');
  });

  it('should show capacity', () => {
    const { getByTestId } = render(
      <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
      {
        wrapper,
      },
    );
    expect(getByTestId('capacity')).toHaveTextContent(
      'private_registry_upgrade_plan_available_storage10 unit_size_B',
    );
  });

  it('should show concurrent connections', () => {
    const { getByTestId } = render(
      <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
      {
        wrapper,
      },
    );
    expect(getByTestId('connections')).toHaveTextContent(
      'private_registry_upgrade_plan_connections:50',
    );
  });

  describe('core registry', () => {
    describe('plan is SMALL', () => {
      let result: RenderResult<
        typeof import('@testing-library/dom/types/queries'),
        HTMLElement,
        HTMLElement
      >;
      beforeAll(() => {
        result = render(
          <PlanComponent
            type={DeploymentMode.MULTI_ZONES}
            plan={defaultPlan}
          />,
          {
            wrapper,
          },
        );
      });

      it("should show 'core registry 99'", async () => {
        const { getByTestId, findByTestId } = result;
        expect(await findByTestId('core-registry-99')).toBeInTheDocument();
        expect(getByTestId('core-registry-99')).toHaveTextContent(
          'private_registry_upgrade_core_registry_99',
        );
      });

      it("should not show 'core registry 95'", async () => {
        const { queryByTestId } = result;
        expect(queryByTestId('core-registry-95')).not.toBeInTheDocument();
      });
    });

    describe('plan is not SMALL', () => {
      let result: RenderResult<
        typeof import('@testing-library/dom/types/queries'),
        HTMLElement,
        HTMLElement
      >;
      beforeAll(() => {
        const plan: typeof defaultPlan = {
          ...defaultPlan,
          name: PlanName.MEDIUM,
        };
        result = render(
          <PlanComponent type={DeploymentMode.MONO_ZONE} plan={plan} />,
          {
            wrapper,
          },
        );
      });

      it('should show core registry 95', async () => {
        const { getByText } = result;

        expect(
          getByText('private_registry_upgrade_core_registry_99.95'),
        ).toBeInTheDocument();
        expect(
          await getByText('private_registry_upgrade_other_components_99.9'),
        ).toBeInTheDocument();
        const { queryByTestId } = result;
        expect(queryByTestId('core-registry-99')).not.toBeInTheDocument();
      });

      it("should show 'core registry 99.99 for 3az regions'", async () => {
        const { getByText } = render(
          <PlanComponent
            type={DeploymentMode.MULTI_ZONES}
            plan={{ ...defaultPlan, name: PlanName.MEDIUM }}
          />,
          {
            wrapper,
          },
        );

        expect(
          getByText('private_registry_upgrade_core_registry_99.99'),
        ).toBeInTheDocument();
        expect(
          getByText('private_registry_upgrade_other_components_99.99'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Vulnerability', () => {
    it("should not show vulnerability text if plan doesn't have vulnerability", () => {
      const { queryByText } = render(
        <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
        {
          wrapper,
        },
      );

      expect(
        queryByText('private_registry_upgrade_plan_vulnerability'),
      ).not.toBeInTheDocument();
    });

    it('should show vulnerability text if plan has vulnerability', () => {
      const plan: typeof defaultPlan = {
        ...defaultPlan,
        features: {
          vulnerability: true,
        },
      };
      const { queryByText } = render(
        <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={plan} />,
        {
          wrapper,
        },
      );

      expect(
        queryByText('private_registry_upgrade_plan_vulnerability'),
      ).toBeInTheDocument();
    });
  });

  describe('Unlimited bandwidth', () => {
    it("should not show sla and traffic if addon doesn't have unlimited bandwidth", () => {
      vi.spyOn(useCatalogModule, 'useCatalog').mockReturnValueOnce({
        data: {
          addons: [defaultAddon],
        },
        isPending: false,
      } as UseQueryResult<TCatalog>);
      const { queryByText } = render(
        <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
        {
          wrapper,
        },
      );

      expect(
        queryByText('private_registry_upgrade_plan_traffic'),
      ).not.toBeInTheDocument();
    });

    it('should show sla and traffic if addon does have unlimited bandwidth', () => {
      const addon = {
        ...defaultAddon,
        blobs: {
          ...defaultAddon.blobs,
          technical: {
            ...defaultAddon.blobs.technical,
            bandwidth: {
              unlimited: true,
            },
          },
        },
      };
      vi.spyOn(useCatalogModule, 'useCatalog').mockReturnValueOnce({
        data: {
          addons: [addon],
        },
        isPending: false,
      } as UseQueryResult<TCatalog>);
      const { queryByText } = render(
        <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
        {
          wrapper,
        },
      );

      expect(
        queryByText('private_registry_upgrade_plan_traffic'),
      ).toBeInTheDocument();
    });
  });

  it('should show price', () => {
    vi.spyOn(useCatalogModule, 'useCatalog').mockReturnValueOnce({
      data: {
        addons: [defaultAddon],
      },
      isPending: false,
    } as UseQueryResult<TCatalog>);
    vi.mocked(useCatalogPrice).mockReturnValue(({
      getFormattedCatalogPrice: vi.fn().mockReturnValue('value'),
    } as unknown) as ReturnType<typeof useCatalogPrice>);
    const { getByTestId } = render(
      <PlanComponent type={DeploymentMode.MULTI_ZONES} plan={defaultPlan} />,
      {
        wrapper,
      },
    );

    expect(getByTestId('price').textContent).toBe(
      '42~ private_registry_monthly_price',
    );
  });
});
