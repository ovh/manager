import { beforeAll, describe, vi } from 'vitest';
import { render, RenderResult } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as useCatalogModule from '@ovh-ux/manager-pci-common';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import PlanComponent from './Plan.component';
import { wrapper } from '@/wrapperRenders';
import { TRegistryPlan } from '@/api/data/registry';

const defaultPlan: TRegistryPlan = {
  id: 'planId',
  code: 'planCode',
  features: {
    vulnerability: false,
  },
  name: 'SMALL',
  registryLimits: {
    imageStorage: 10,
    parallelRequest: 50,
  },
  createdAt: '',
  updatedAt: '',
};

const defaultAddon = {
  planCode: 'planCode',
  blobs: {
    technical: {
      bandwidth: {
        unlimited: false,
      },
    },
  },
  pricings: [
    {
      price: 1,
      tax: 1,
    },
  ],
};

describe('PlanComponent', () => {
  vi.mock('react-i18next', () => ({
    useTranslation: vi.fn().mockImplementation(() => ({
      t(key: string, data: Record<string, unknown>) {
        return key === 'private_registry_upgrade_plan_connections'
          ? `private_registry_upgrade_plan_connections:${data.total}`
          : key;
      },
    })),
  }));

  vi.mock('@ovh-ux/manager-react-components', async () => ({
    useCatalogPrice: () => ({
      getFormattedMonthlyCatalogPrice: () => 'formattedPrice',
    }),
    useMe: () => ({ me: { ovhSubsidiary: 'ovhSubsidiary' } }),
  }));

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
    };
  });

  it('should render', () => {
    const { container } = render(<PlanComponent plan={defaultPlan} />, {
      wrapper,
    });

    expect(container).toMatchSnapshot();
  });

  it('should render plan name', () => {
    const { getByTestId } = render(<PlanComponent plan={defaultPlan} />, {
      wrapper,
    });
    expect(getByTestId('name')).toHaveTextContent('S');
  });

  it('should show capacity', () => {
    const { getByTestId } = render(<PlanComponent plan={defaultPlan} />, {
      wrapper,
    });
    expect(getByTestId('capacity')).toHaveTextContent(
      'private_registry_upgrade_plan_available_storage10 unit_size_B',
    );
  });

  it('should show concurrent connections', () => {
    const { getByTestId } = render(<PlanComponent plan={defaultPlan} />, {
      wrapper,
    });
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
        result = render(<PlanComponent plan={defaultPlan} />, {
          wrapper,
        });
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
          name: 'MEDIUM',
        };
        result = render(<PlanComponent plan={plan} />, {
          wrapper,
        });
      });

      it("should show 'core registry 95'", async () => {
        const { getByTestId, findByTestId, findByText } = result;
        expect(await findByTestId('core-registry-95')).toBeInTheDocument();
        expect(getByTestId('core-registry-95')).toHaveTextContent(
          'private_registry_upgrade_core_registry_95',
        );
        expect(
          await findByText('private_registry_upgrade_other_components'),
        ).toBeInTheDocument();
      });

      it("should not show 'core registry 99'", async () => {
        const { queryByTestId } = result;
        expect(queryByTestId('core-registry-99')).not.toBeInTheDocument();
      });
    });
  });

  describe('Vulnerability', () => {
    it("should not show vulnerability text if plan doesn't have vulnerability", () => {
      const { queryByText } = render(<PlanComponent plan={defaultPlan} />, {
        wrapper,
      });

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
      const { queryByText } = render(<PlanComponent plan={plan} />, {
        wrapper,
      });

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
      const { queryByText } = render(<PlanComponent plan={defaultPlan} />, {
        wrapper,
      });

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
      const { queryByText } = render(<PlanComponent plan={defaultPlan} />, {
        wrapper,
      });

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

    const { getByTestId } = render(<PlanComponent plan={defaultPlan} />, {
      wrapper,
    });

    expect(getByTestId('price').textContent).toBe('formattedPrice');
  });
});
