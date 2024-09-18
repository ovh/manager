import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import * as odsComponentsModule from '@ovhcloud/ods-components/react';
import { UseQueryResult } from '@tanstack/react-query';
import { ResponseAPIError, TProject } from '@ovh-ux/manager-pci-common';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import CreatePage from '@/pages/create/Create.page';
import { wrapper } from '@/wrapperRenders';

const compute = () => render(<CreatePage />, { wrapper });

describe('CreatePage', () => {
  vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
    const actual = (await importOriginal()) as typeof import('@ovhcloud/ods-components/react');
    return {
      ...actual,
      OsdsBreadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
    };
  });
  vi.mock('@ovh-ux/manager-react-components', (importOriginal) => ({
    ...importOriginal,
    Headers: () => <div>Headers</div>,
    Notifications: () => <div>Notifications</div>,
    useNotifications: () => ({ push: () => null }),
    useProjectUrl: () => 'projectUrl',
  }));

  vi.mock('@ovh-ux/manager-pci-common', (importOriginal) => ({
    ...importOriginal,
    useProject: () => ({
      data: {
        projectId: 'projectId',
        description: 'projectDescription',
      },
    }),
    useProjectLocalisation: () => ({ region: 'region' }),
    PciDiscoveryBanner: () => null,
    isDiscoveryProject: () => false,
  }));

  vi.mock('react-router-dom', (importOriginal) => ({
    ...importOriginal,
    useParams: () => ({ projectId: 'projectId' }),
    useHref: () => ({ pathname: '' }),
    useNavigate: () => ({ navigate: () => null }),
  }));

  vi.mock('@/pages/create/steps/RegionStep', () => ({
    default: () => <div data-testid="region-step">RegionStep</div>,
  }));

  vi.mock('@/pages/create/steps/NameStep', () => ({
    default: () => <div data-testid="name-step">NameStep</div>,
  }));

  vi.mock('@/pages/create/steps/PlanStep', () => ({
    default: () => <div data-testid="plan-step">PlanStep</div>,
  }));

  vi.mock('react-i18next', () => ({
    useTranslation: vi.fn().mockImplementation(() => ({
      t(key: string) {
        return key;
      },
    })),
  }));

  it('should render', () => {
    const { container } = render(<CreatePage />, { wrapper });
    expect(container).toMatchSnapshot();
  });

  describe('Breadcrumb', () => {
    describe('project is loaded', () => {
      it('should show breadcrumb', async () => {
        vi.spyOn(pciCommonModule, 'useProject').mockReturnValueOnce({
          data: {} as TProject,
        } as UseQueryResult<TProject, ResponseAPIError>);

        const { queryByTestId } = compute();

        expect(queryByTestId('breadcrumb')).toBeInTheDocument();
      });

      it('should show breadcrumb with right props', async () => {
        vi.spyOn(pciCommonModule, 'useProject').mockReturnValueOnce({
          data: {} as TProject,
        } as UseQueryResult<TProject, ResponseAPIError>);

        vi.spyOn(odsComponentsModule, 'OsdsBreadcrumb');

        const props = {
          items: [
            Object({
              href: 'projectUrl',
              label: undefined,
            }),
            {
              href: {
                pathname: '',
              },
              label: 'private_registry_title',
            },
            {
              label: 'private_registry_create',
            },
          ],
        };

        compute();

        expect(OsdsBreadcrumb).toHaveBeenNthCalledWith(1, props, {});
      });
    });

    it('should not show breadcrumb if project is not loaded', () => {
      vi.spyOn(pciCommonModule, 'useProject').mockReturnValue({
        data: undefined,
      } as UseQueryResult<TProject, ResponseAPIError>);

      const { queryByTestId } = compute();

      expect(queryByTestId('breadcrumb')).not.toBeInTheDocument();
    });
  });

  describe.skip('Tracking', () => {
    it('should', () => {});
  });
});
