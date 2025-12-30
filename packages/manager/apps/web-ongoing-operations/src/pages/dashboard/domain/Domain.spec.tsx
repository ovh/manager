import '@/setupTests';
import '@testing-library/jest-dom';
import { Mock, vi, expect } from 'vitest';
import { useFeatureAvailability, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { domain } from '@/__mocks__/domain';
import Domain from '@/pages/dashboard/domain/Domain';
import { allDomFeatureAvailibility, domainFeatureAvailibility, taskMeDomain } from '@/constants';
import { wrapper } from '@/utils/test.provider';

const domainA11yRules = {
  'select-name': { enabled: false },
  'aria-prohibited-attr': { enabled: false },
  'empty-table-header': { enabled: false },
  'button-name': { enabled: false },
  'label': { enabled: false },
  'aria-command-name': { enabled: false },
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(),
}));

describe('Domain datagrid', () => {
  it('fetch in a good way using useResourcesIcebergV6', async () => {
    (useFeatureAvailability as Mock).mockReturnValue({
      data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
    }),
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      totalCount: domain.length,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    const { container } = render(<Domain />, { wrapper });

    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
        route: `${taskMeDomain.join('/')}?type=domain`,
        disableCache: true,
        queryKey: taskMeDomain,
      }),
    );
    await expect(container).toBeAccessible({ rules: domainA11yRules });
  });

  it('Display the datagrid element', async () => {
    (useFeatureAvailability as Mock).mockReturnValue({
      data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
    }),
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: domain,
      isLoading: false,
      totalCount: domain.length,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    vi.mock('@/hooks/data/query', () => ({
      useGetDomainInformation: vi.fn(() => {
        return {
          data: null,
        };
      }),
    }));

    const { container } = render(<Domain />, { wrapper });

    expect(screen.getByTestId('datagrid')).toBeInTheDocument();

    const domainName = screen.getByTestId('case-where-modal-cant-be-open.ovh');
    expect(domainName).toBeInTheDocument();
    expect(domainName).toHaveAttribute(
      'href',
      'https://ovh.test/#/web/domain/case-where-modal-cant-be-open.ovh/information',
    );

    const buttons = screen.getAllByTestId('navigation-action-trigger-action');
    expect(buttons[0]).toHaveAttribute('is-disabled', 'true');
    expect(buttons[1]).toBeEnabled();
    
    await expect(container).toBeAccessible({ rules: domainA11yRules });
  });
});
