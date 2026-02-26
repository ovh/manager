import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks, WebHostingWebsiteMocks } from '@/data/__mocks__/websites';
import { GitStatus, ResourceStatus } from '@/data/types/status';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import MultisitePage from '../Multisite.page';

const mockNavigate = vi.fn();
const mockUseWebHostingWebsite = vi.fn();
const mockUseWebHostingWebsiteDomains = vi.fn();
const mockUseWebHostingAttachedDomain = vi.fn();
const mockUseOverridePage = vi.fn();

const expandFirstWebsiteRow = async () => {
  await waitFor(() => {
    expect(screen.getByTestId('manager-button')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('manager-button'));
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: (): typeof mockNavigate => mockNavigate,
    useParams: (): { serviceName: string } => ({ serviceName: 'test-service' }),
  };
});

vi.mock('@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite', () => ({
  useWebHostingWebsite: (): ReturnType<typeof mockUseWebHostingWebsite> =>
    mockUseWebHostingWebsite(),
}));

vi.mock('@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain', () => ({
  useWebHostingWebsiteDomains: (): ReturnType<typeof mockUseWebHostingWebsiteDomains> =>
    mockUseWebHostingWebsiteDomains(),
}));

vi.mock('@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain', () => ({
  useWebHostingAttachedDomain: (): ReturnType<typeof mockUseWebHostingAttachedDomain> =>
    mockUseWebHostingAttachedDomain(),
}));

vi.mock('@/hooks/overridePage/useOverridePage', () => ({
  useOverridePage: (): ReturnType<typeof mockUseOverridePage> => mockUseOverridePage(),
}));

vi.mock('@/pages/websites/Cells.component', () => ({
  DiagnosticCell: ({ fqdn }: { serviceName: string; fqdn: string }) => (
    <div data-testid={`diagnostic-cell-${fqdn}`}>Diagnostic: {fqdn}</div>
  ),
}));

vi.mock('../component/ActionButtonMultisite.component', () => ({
  default: ({
    context,
    siteId,
    domainId,
    domain,
    site,
    isDisabled,
  }: {
    context: string;
    siteId?: string;
    domainId?: string;
    domain?: string;
    site?: string;
    isDisabled?: boolean;
  }) => (
    <div
      data-testid={`action-button-${context}-${siteId ?? domainId}-${domain ?? site}`}
      aria-disabled={isDisabled}
    >
      Actions {context} {siteId ?? domainId} {domain ?? site}
    </div>
  ),
}));

describe('MultisitePage component', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    mockUseOverridePage.mockReturnValue(false);
    mockUseWebHostingWebsite.mockReturnValue({
      data: WebHostingWebsiteMocks,
      isLoading: false,
    });
    mockUseWebHostingWebsiteDomains.mockReturnValue([
      {
        data: WebHostingWebsiteDomainMocks,
        isLoading: false,
        refetch: vi.fn(),
      },
    ]);
    mockUseWebHostingAttachedDomain.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  describe('Rendering', () => {
    it('should render the Datagrid and its topbar button', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-website-button')).toBeInTheDocument();
      });
      const button = screen.getByTestId('add-website-button');
      expect(button).toHaveTextContent(commonTranslation.add_website);
    });

    it('should display all column headers', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_linked_domains),
        ).toBeInTheDocument();
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_path),
        ).toBeInTheDocument();
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_git),
        ).toBeInTheDocument();
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_firewall),
        ).toBeInTheDocument();
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_cdn),
        ).toBeInTheDocument();
        expect(
          screen.getByText(commonTranslation.web_hosting_status_header_diagnostic),
        ).toBeInTheDocument();
      });
    });

    it('should render website data correctly', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
        expect(screen.getByText('www')).toBeInTheDocument();
      });
    });

    it('should render domain data when expanded', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('manager-button'));

      await waitFor(() => {
        expect(screen.getByText('test.site')).toBeInTheDocument();
        expect(screen.getByText('www.test.site')).toBeInTheDocument();
      });
    });
  });

  describe('Empty states', () => {
    it('should handle empty websites list', async () => {
      mockUseWebHostingWebsite.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-website-button')).toBeInTheDocument();
      });
    });

    it('should handle undefined websites', async () => {
      mockUseWebHostingWebsite.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-website-button')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to add website page when clicking add button', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-website-button')).toBeInTheDocument();
      });

      const button = screen.getByTestId('add-website-button');
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('add-website'));
    });

    it('should navigate to edit-name when clicking edit button', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      const editButton = screen.getByTestId('edit-name');
      fireEvent.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith('./edit-name', {
        state: {
          siteName: 'nom de test1',
          siteId: '1',
        },
      });
    });
  });

  describe('Git status badges', () => {
    it('should handle website without git status', async () => {
      const websiteWithoutGit = [
        {
          ...WebHostingWebsiteMocks[0],
          currentState: {
            ...WebHostingWebsiteMocks[0].currentState,
            git: undefined,
          },
        },
      ];

      mockUseWebHostingWebsite.mockReturnValue({
        data: websiteWithoutGit,
        isLoading: false,
      });

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      const gitBadge = screen.queryByTestId('git-status-1');
      expect(gitBadge).not.toBeInTheDocument();
    });
  });

  describe('Firewall and CDN badges', () => {
    it('should display firewall status badge for domain', async () => {
      render(<MultisitePage />, { wrapper });

      await expandFirstWebsiteRow();
      const firewallBadges = screen.getAllByTestId('badge-status-NONE');
      expect(firewallBadges.length).toBeGreaterThan(0);
    });

    it('should display CDN status badge for domain', async () => {
      render(<MultisitePage />, { wrapper });

      await expandFirstWebsiteRow();
      const cdnBadges = screen.getAllByTestId('badge-status-ACTIVE');
      expect(cdnBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Linked domains', () => {
    it('should display linked domains count for website', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      const linkedDomainsText = screen.getByText(/2\s+domaines?/i);
      expect(linkedDomainsText).toBeInTheDocument();
    });

    it('should display linked domain FQDN for domain rows', async () => {
      render(<MultisitePage />, { wrapper });

      await expandFirstWebsiteRow();
      expect(screen.getByText('test.site')).toBeInTheDocument();
      expect(screen.getByText('www.test.site')).toBeInTheDocument();
    });

    it('should handle website with no linked domains', async () => {
      const websiteNoDomains = [
        {
          ...WebHostingWebsiteMocks[0],
          currentState: {
            ...WebHostingWebsiteMocks[0].currentState,
            linkedDomains: 0,
          },
        },
      ];

      mockUseWebHostingWebsite.mockReturnValue({
        data: websiteNoDomains,
        isLoading: false,
      });

      mockUseWebHostingWebsiteDomains.mockReturnValue([
        {
          data: [],
          isLoading: false,
          refetch: vi.fn(),
        },
      ]);

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      const linkedDomainsText = screen.getByText(/0\s+domaine/i);
      expect(linkedDomainsText).toBeInTheDocument();
    });
  });

  describe('Diagnostic cell', () => {
    it('should render DiagnosticCell for domain rows', async () => {
      render(<MultisitePage />, { wrapper });

      await expandFirstWebsiteRow();

      expect(screen.getByTestId('diagnostic-cell-test.site')).toBeInTheDocument();
      expect(screen.getByTestId('diagnostic-cell-www.test.site')).toBeInTheDocument();
    });

    it('should not render DiagnosticCell for website rows', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });

      // Diagnostic cells should only be for domains
      const diagnosticCells = screen.queryAllByTestId(/diagnostic-cell-/);
      expect(diagnosticCells).toHaveLength(0);
    });
  });

  describe('Action buttons', () => {
    it('should render ActionButtonMultisite for website rows', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('action-button-site-1-nom de test1')).toBeInTheDocument();
      });
    });

    it('should render ActionButtonMultisite for domain rows', async () => {
      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('manager-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('manager-button'));

      await waitFor(() => {
        expect(screen.getByTestId('action-button-domain-1-test.site')).toBeInTheDocument();
        expect(screen.getByTestId('action-button-domain-1-www.test.site')).toBeInTheDocument();
      });
    });

    it('should disable action button for default attached domain', async () => {
      const attachedDomain = [
        {
          id: '1',
          currentState: {
            fqdn: 'test.site',
            isDefault: true,
          },
        },
      ];

      mockUseWebHostingAttachedDomain.mockReturnValue({
        data: attachedDomain,
        isLoading: false,
      });

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('manager-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('manager-button'));

      await waitFor(() => {
        const actionButton = screen.getByTestId('action-button-domain-1-test.site');
        expect(actionButton).toBeInTheDocument();
        expect(actionButton).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('Override page', () => {
    it('should not render Datagrid when page is overridden', () => {
      mockUseOverridePage.mockReturnValue(true);

      render(<MultisitePage />, { wrapper });

      expect(screen.queryByTestId('add-website-button')).not.toBeInTheDocument();
    });

    it('should render Datagrid when page is not overridden', async () => {
      mockUseOverridePage.mockReturnValue(false);

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-website-button')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple websites', () => {
    it('should handle multiple websites correctly', async () => {
      const multipleWebsites = [
        ...WebHostingWebsiteMocks,
        {
          id: '2',
          checksum: '',
          currentState: {
            path: 'www2',
            name: 'nom de test2',
            linkedDomains: 0,
            git: {
              status: GitStatus.DEPLOYING,
              vcsBranch: 'main',
              vcsUrl: 'https://github.com/test.git',
            },
          },
          currentTasks: [],
          resourceStatus: ResourceStatus.READY,
          targetSpec: { name: 'test2' },
        },
      ];

      mockUseWebHostingWebsite.mockReturnValue({
        data: multipleWebsites,
        isLoading: false,
      });

      mockUseWebHostingWebsiteDomains.mockReturnValue([
        {
          data: WebHostingWebsiteDomainMocks,
          isLoading: false,
          refetch: vi.fn(),
        },
        {
          data: [],
          isLoading: false,
          refetch: vi.fn(),
        },
      ]);

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
        expect(screen.getByText('nom de test2')).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle website with linkedDomains but no domain data', async () => {
      const websiteWithLinkedDomains = [
        {
          ...WebHostingWebsiteMocks[0],
          currentState: {
            ...WebHostingWebsiteMocks[0].currentState,
            linkedDomains: 2,
          },
        },
      ];

      mockUseWebHostingWebsite.mockReturnValue({
        data: websiteWithLinkedDomains,
        isLoading: false,
      });

      mockUseWebHostingWebsiteDomains.mockReturnValue([
        {
          data: [],
          isLoading: false,
          refetch: vi.fn(),
        },
      ]);

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });
    });

    it('should handle domain without fqdn', async () => {
      const domainWithoutFqdn = [
        {
          ...WebHostingWebsiteDomainMocks[0],
          currentState: {
            ...WebHostingWebsiteDomainMocks[0].currentState,
            fqdn: undefined,
          },
        },
      ];

      mockUseWebHostingWebsiteDomains.mockReturnValue([
        {
          data: domainWithoutFqdn,
          isLoading: false,
          refetch: vi.fn(),
        },
      ]);

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });
    });

    it('should handle website without path', async () => {
      const websiteWithoutPath = [
        {
          ...WebHostingWebsiteMocks[0],
          currentState: {
            ...WebHostingWebsiteMocks[0].currentState,
            path: undefined,
          },
        },
      ];

      mockUseWebHostingWebsite.mockReturnValue({
        data: websiteWithoutPath,
        isLoading: false,
      });

      render(<MultisitePage />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText('nom de test1')).toBeInTheDocument();
      });
    });
  });
  it.skip('should have a valid html with a11y and w3c', async () => {
    const { container } = render(<MultisitePage />, { wrapper });
    const html = container.innerHTML;
    await expect(html).toBeValidHtml();
    /*- ._button--sm_6crpx_209
    Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  Element's default semantics were not overridden with role="none" or role="presentation"
  - #edit-name
    Fix any of the following:
  Element does not have inner text that is visible to screen readers
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  Element's default semantics were not overridden with role="none" or role="presentation"
More: https://dequeuniversity.com/rules/axe/4.11/button-name?application=axeAPI

[empty-table-header] Table header text should not be empty
  - th:nth-child(1)
    Fix any of the following:
  Element does not have text that is visible to screen readers
  - th:nth-child(9)
    Fix any of the following:
  Element does not have text that is visible to screen readers


    await expect(container).toBeAccessible();*/
  });
});
