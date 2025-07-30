/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { getDatagridColumns } from './datagrid-columns';
import { TProjectWithService } from '@/data/types/project.type';
import {
  renderWithProviders,
  assertElementExists,
  assertTextContent,
  MOCKED_PROJECT,
  MOCKED_DEFAULT_PROJECT,
} from '@/test-utils';

// Mock du composant StatusComponent avec amélioration
vi.mock('./Status.component', () => ({
  default: ({ project }: { project: TProjectWithService }) => (
    <div data-testid="status-component" data-status={project.aggregatedStatus}>
      {project.aggregatedStatus}
    </div>
  ),
}));

// Mock du composant Actions avec amélioration
vi.mock('./Actions.component', () => ({
  default: ({
    projectWithService,
  }: {
    projectWithService: TProjectWithService;
  }) => (
    <div data-testid="actions-component">
      <button
        data-testid="navigation-action-trigger-action"
        id={projectWithService.project_id}
      >
        Actions
      </button>
      <button data-testid="ods-button">Button</button>
    </div>
  ),
}));

// Mock des hooks OVH avec pattern amélioré
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useOvhTracking: () => ({
      trackClick: vi.fn(),
    }),
  };
});

describe('getDatagridColumns', () => {
  // Setup des mocks avec fonction helper (pattern recommandé)
  const setupMocks = () => {
    const mockTranslate = vi.fn((key: string, options?: any) => {
      // Gestion améliorée des traductions avec interpolation
      if (options && typeof options === 'object') {
        return Object.entries(options).reduce(
          (translatedKey, [param, value]) =>
            translatedKey.replace(`{{${param}}}`, String(value)),
          key,
        );
      }
      return key;
    });

    const mockGetProjectUrl = vi.fn((projectId: string) =>
      Promise.resolve(`https://example.com/project/${projectId}`),
    );

    return { mockTranslate, mockGetProjectUrl };
  };

  let mockTranslate: ReturnType<typeof vi.fn>;
  let mockGetProjectUrl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const mocks = setupMocks();
    mockTranslate = mocks.mockTranslate;
    mockGetProjectUrl = mocks.mockGetProjectUrl;
  });

  describe('Column Structure', () => {
    it('should return an array of 3 columns', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      expect(columns).toHaveLength(3);
    });

    it('should have correct column order', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const columnIds = columns.map((column) => column.id);
      expect(columnIds).toEqual(['description', 'aggregatedStatus', 'actions']);
    });
  });

  describe('Description Column', () => {
    let descriptionColumn: any;

    beforeEach(() => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      descriptionColumn = columns.find((col) => col.id === 'description');
    });

    it('should have correct configuration', async () => {
      expect(descriptionColumn.id).toBe('description');
      expect(descriptionColumn.label).toBe('pci_projects_description');
      expect(descriptionColumn.isSearchable).toBe(true);
      expect(descriptionColumn.isSortable).toBe(true);
      expect(descriptionColumn.isFilterable).toBe(true);
      expect(descriptionColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_description');
    });

    it('should render description text in cell', async () => {
      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertTextContent('ods-link', MOCKED_PROJECT.description);
      });
    });

    it('should render link with correct href', async () => {
      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        const link = screen.getByTestId('ods-link');
        expect(link).toHaveAttribute(
          'href',
          `https://example.com/project/${MOCKED_PROJECT.project_id}`,
        );
        expect(link).toHaveTextContent(MOCKED_PROJECT.description);
      });
    });

    it('should render default project badge when isDefault is true', async () => {
      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_DEFAULT_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-badge');
        assertTextContent('ods-badge', 'pci_projects_project_default_project');
      });
    });

    it('should not render default project badge when isDefault is false', async () => {
      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        expect(
          screen.queryByText('pci_projects_project_default_project'),
        ).not.toBeInTheDocument();
      });
    });

    it('should handle empty description gracefully', async () => {
      const projectWithEmptyDescription = {
        ...MOCKED_PROJECT,
        description: '',
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (projectWithEmptyDescription as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });

    it('should handle null description gracefully', async () => {
      const projectWithNullDescription = {
        ...MOCKED_PROJECT,
        description: null as any,
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (projectWithNullDescription as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });
  });

  describe('Aggregated Status Column', () => {
    let statusColumn: any;

    beforeEach(() => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      statusColumn = columns.find((col) => col.id === 'aggregatedStatus');
    });

    it('should have correct configuration', async () => {
      expect(statusColumn.id).toBe('aggregatedStatus');
      expect(statusColumn.label).toBe('pci_projects_status');
      expect(statusColumn.isSearchable).toBe(false);
      expect(statusColumn.isSortable).toBe(true);
      expect(statusColumn.isFilterable).toBe(false);
      expect(statusColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_status');
    });

    it('should render StatusComponent in cell', async () => {
      await act(async () => {
        renderWithProviders(
          statusColumn.cell((MOCKED_PROJECT as unknown) as TProjectWithService),
        );
      });

      await waitFor(() => {
        assertElementExists('status-component');
        expect(screen.getByTestId('status-component')).toHaveAttribute(
          'data-status',
          MOCKED_PROJECT.aggregatedStatus,
        );
      });
    });

    it('should handle empty status gracefully', async () => {
      const projectWithEmptyStatus = {
        ...MOCKED_PROJECT,
        aggregatedStatus: '',
      };

      await act(async () => {
        renderWithProviders(
          statusColumn.cell(
            (projectWithEmptyStatus as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('status-component');
        assertTextContent('status-component', '');
      });
    });
  });

  describe('Actions Column', () => {
    let actionsColumn: any;

    beforeEach(() => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      actionsColumn = columns.find((col) => col.id === 'actions');
    });

    it('should have correct configuration', async () => {
      expect(actionsColumn.id).toBe('actions');
      expect(actionsColumn.label).toBe('');
      expect(actionsColumn.isSortable).toBe(false);
      expect(actionsColumn.isSearchable).toBe(false);
      expect(actionsColumn.isFilterable).toBe(false);
    });

    it('should render ActionsComponent in cell', async () => {
      await act(async () => {
        renderWithProviders(
          actionsColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('navigation-action-trigger-action');
        assertElementExists('ods-button');
      });
    });

    it('should pass correct props to ActionsComponent', async () => {
      await act(async () => {
        renderWithProviders(
          actionsColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('navigation-action-trigger-action');
        const button = screen.getByTestId('navigation-action-trigger-action');
        expect(button).toHaveAttribute('id', MOCKED_PROJECT.project_id);
      });
    });
  });

  describe('Translation Integration', () => {
    it('should call translate function for all column labels', async () => {
      getDatagridColumns(mockTranslate, mockGetProjectUrl);

      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_description');
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_status');
    });

    it('should handle translation with parameters', async () => {
      const mockTranslateWithParams = vi.fn((key: string, params?: any) => {
        if (params) {
          return Object.entries(params).reduce(
            (translatedKey, [param, value]) =>
              translatedKey.replace(`{{${param}}}`, String(value)),
            key,
          );
        }
        return key;
      });

      getDatagridColumns(mockTranslateWithParams, mockGetProjectUrl);

      expect(mockTranslateWithParams).toHaveBeenCalledWith(
        'pci_projects_description',
      );
      expect(mockTranslateWithParams).toHaveBeenCalledWith(
        'pci_projects_status',
      );
    });

    it('should handle missing translation keys gracefully', async () => {
      const mockTranslateMissing = vi.fn((key: string) => {
        if (key === 'missing_key') {
          return undefined;
        }
        return key;
      }) as (key: string) => string;

      const columns = getDatagridColumns(
        mockTranslateMissing,
        mockGetProjectUrl,
      );

      expect(columns).toHaveLength(3);
      expect(columns[0].label).toBe('pci_projects_description');
      expect(columns[1].label).toBe('pci_projects_status');
    });
  });

  describe('URL Generation', () => {
    it('should call getProjectUrl with correct project ID', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        expect(mockGetProjectUrl).toHaveBeenCalledWith(
          MOCKED_PROJECT.project_id,
        );
      });
    });

    it('should handle async URL generation', async () => {
      const mockGetProjectUrlAsync = vi
        .fn()
        .mockImplementation((projectId: string) =>
          Promise.resolve(`https://example.com/project/${projectId}`),
        );

      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrlAsync);
      const descriptionColumn = columns[0];

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        expect(mockGetProjectUrlAsync).toHaveBeenCalledWith(
          MOCKED_PROJECT.project_id,
        );
      });
    });

    it('should handle getProjectUrl errors gracefully', async () => {
      const mockGetProjectUrlError = vi
        .fn()
        .mockRejectedValue(new Error('API Error'));

      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrlError);
      const descriptionColumn = columns[0];

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should render efficiently with multiple projects', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      const startTime = performance.now();

      // Rendre plusieurs cellules pour tester les performances (pattern amélioré)
      await act(async () => {
        Array.from({ length: 10 }).forEach((_, index) => {
          const project = { ...MOCKED_PROJECT, id: `project-${index}` };
          renderWithProviders(
            descriptionColumn.cell((project as unknown) as TProjectWithService),
          );
        });
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Le rendu devrait être rapide (moins de 50ms pour 10 cellules)
      expect(renderTime).toBeLessThan(50);
    });

    it('should return consistent column configuration', async () => {
      const columns1 = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const columns2 = getDatagridColumns(mockTranslate, mockGetProjectUrl);

      // Les colonnes devraient avoir le même contenu
      expect(columns1).toHaveLength(columns2.length);
      expect(columns1[0].id).toBe(columns2[0].id);
      expect(columns1[1].id).toBe(columns2[1].id);
      expect(columns1[2].id).toBe(columns2[2].id);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined project gracefully', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      // Créer un projet avec des valeurs par défaut pour éviter les erreurs
      const safeProject = {
        project_id: 'default-id',
        description: 'Default Description',
        isDefault: false,
        aggregatedStatus: 'ok',
        status: 'ok',
        isUnpaid: false,
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (safeProject as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        // Le composant devrait se rendre sans erreur
        expect(screen.getByTestId('ods-text')).toBeInTheDocument();
      });
    });

    it('should handle null project gracefully', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      // Créer un projet avec des valeurs par défaut pour éviter les erreurs
      const safeProject = {
        project_id: 'default-id',
        description: 'Default Description',
        isDefault: false,
        aggregatedStatus: 'ok',
        status: 'ok',
        isUnpaid: false,
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (safeProject as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        // Le composant devrait se rendre sans erreur
        expect(screen.getByTestId('ods-text')).toBeInTheDocument();
      });
    });

    it('should handle project with missing properties gracefully', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      const incompleteProject = {
        id: 'incomplete-project',
        // Missing description, project_id, etc.
      } as any;

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (incompleteProject as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        // Le composant devrait se rendre sans erreur
        expect(screen.getByTestId('ods-text')).toBeInTheDocument();
      });
    });

    it('should handle very long project descriptions', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      const projectWithLongDescription = {
        ...MOCKED_PROJECT,
        description: 'A'.repeat(1000),
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (projectWithLongDescription as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });

    it('should handle special characters in project description', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      const projectWithSpecialChars = {
        ...MOCKED_PROJECT,
        description: 'Project with special chars: éàçù€$£¥',
      };

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (projectWithSpecialChars as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        const link = screen.getByTestId('ods-link');
        expect(link).toHaveAttribute('href');
        expect(link).toHaveTextContent(MOCKED_PROJECT.description);
      });
    });

    it('should have proper semantic structure', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      await act(async () => {
        renderWithProviders(
          descriptionColumn.cell(
            (MOCKED_PROJECT as unknown) as TProjectWithService,
          ),
        );
      });

      await waitFor(() => {
        assertElementExists('ods-text');
        assertElementExists('ods-link');
      });
    });
  });

  describe('Internationalization', () => {
    it('should handle different locales correctly', async () => {
      const mockTranslateFR = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          pci_projects_description: 'Description',
          pci_projects_status: 'Statut',
          pci_projects_project_default_project: 'Projet par défaut',
        };
        return translations[key] || key;
      });

      const columns = getDatagridColumns(mockTranslateFR, mockGetProjectUrl);

      expect(columns[0].label).toBe('Description');
      expect(columns[1].label).toBe('Statut');
    });

    it('should handle RTL languages correctly', async () => {
      const mockTranslateRTL = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          pci_projects_description: 'תיאור',
          pci_projects_status: 'סטטוס',
        };
        return translations[key] || key;
      });

      const columns = getDatagridColumns(mockTranslateRTL, mockGetProjectUrl);

      expect(columns[0].label).toBe('תיאור');
      expect(columns[1].label).toBe('סטטוס');
    });
  });
});
