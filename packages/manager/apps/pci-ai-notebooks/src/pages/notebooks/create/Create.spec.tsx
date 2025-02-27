import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Notebook, {
  breadcrumb as Breadcrumb,
} from '@/pages/notebooks/create/Create.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import {
  mockedCapabilitiesRegionBHS,
  mockedCapabilitiesRegionGRA,
} from '@/__tests__/helpers/mocks/capabilities/region';
import {
  mockedEditor,
  mockedEditorBis,
} from '@/__tests__/helpers/mocks/capabilities/notebookEditor';
import {
  mockedSshKey,
  mockedSshKeyBis,
} from '@/__tests__/helpers/mocks/sshkey';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/capabilities/flavor';
import {
  mockedDatastoreWithContainerGit,
  mockedDatastoreWithContainerS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedSuggestionsForNotebook } from '@/__tests__/helpers/mocks/suggestion';
import {
  mockedFramework,
  mockedFrameworkBis,
} from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => mockedPciProject),
      };
    });

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
      addNotebook: vi.fn((notebook) => notebook),
    }));

    vi.mock('@/data/api/ai/notebook/suggestions.api', () => ({
      getSuggestions: vi.fn(() => mockedSuggestionsForNotebook),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [
        mockedCapabilitiesRegionGRA,
        mockedCapabilitiesRegionBHS,
      ]),
    }));

    vi.mock('@/data/api/ai/notebook/capabilities/framework.api', () => ({
      getFramework: vi.fn(() => [mockedFramework, mockedFrameworkBis]),
    }));

    vi.mock('@/data/api/ai/notebook/capabilities/editor.api', () => ({
      getEditor: vi.fn(() => [mockedEditor, mockedEditorBis]),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [
        mockedCapabilitiesRegionGRA,
        mockedCapabilitiesRegionBHS,
      ]),
      getFlavor: vi.fn(() => [mockedCapabilitiesFlavorCPU]),
    }));

    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [
        mockedDatastoreWithContainerGit,
        mockedDatastoreWithContainerS3,
      ]),
    }));

    vi.mock('@/data/api/sshkey/sshkey.api', () => ({
      getSshkey: vi.fn(() => [mockedSshKey, mockedSshKeyBis]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders the skeleton component while loading', async () => {
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  it('renders the order funnel', async () => {
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
      expect(screen.getByTestId('name-section')).toBeInTheDocument();
      expect(screen.getByTestId('flavor-section')).toBeInTheDocument();
      expect(screen.getByTestId('region-section')).toBeInTheDocument();
      expect(screen.getByTestId('framework-section')).toBeInTheDocument();
      expect(screen.getByTestId('editor-section')).toBeInTheDocument();
      expect(screen.getByTestId('advance-config-section')).toBeInTheDocument();
      expect(screen.getByTestId('order-submit-button')).toBeInTheDocument();
    });
  });

  it('trigger toast error on getCommand API Error', async () => {
    vi.mocked(notebookApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-button'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(notebookApi.getCommand).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger getCommand on Cli Command button click', async () => {
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cli-command-button'));
    });
    await waitFor(() => {
      expect(notebookApi.getCommand).toHaveBeenCalled();
    });
  });

  it('trigger toast error on addNotebook API Error', async () => {
    vi.mocked(notebookApi.addNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.addNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorCreatingNotebook',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger add notebook on click', async () => {
    render(<Notebook />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-container')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.addNotebook).toHaveBeenCalled();
    });
    expect(mockedUsedNavigate).toHaveBeenCalledWith('../notebooks/undefined');
  });
});
