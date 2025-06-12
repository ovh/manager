import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { getDatagridColumns } from './datagrid-columns';
import { TProjectWithService } from '@/data/types/project.type';

// Mock the StatusComponent
vi.mock('./Status.component', () => ({
  default: ({ project }: { project: TProjectWithService }) => (
    <div data-testid="status-component">{project.aggregatedStatus}</div>
  ),
}));

describe('getDatagridColumns', () => {
  const mockTranslate = vi.fn((key: string) => key);
  const mockGetProjectUrl = vi.fn((projectId: string) =>
    Promise.resolve(`https://example.com/project/${projectId}`),
  );
  const mockProject: TProjectWithService = ({
    description: 'Test Project',
    aggregatedStatus: 'active',
    project_id: 'test-id',
    planCode: 'test-plan',
    isDefault: false,
  } as unknown) as TProjectWithService;

  const mockDefaultProject: TProjectWithService = ({
    ...mockProject,
    isDefault: true,
  } as unknown) as TProjectWithService;

  beforeEach(() => {
    mockTranslate.mockClear();
    mockGetProjectUrl.mockClear();
  });

  it('should return an array of 3 columns', () => {
    const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
    expect(columns).toHaveLength(3);
  });

  describe('description column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      expect(descriptionColumn.id).toBe('description');
      expect(descriptionColumn.label).toBe('pci_projects_description');
      expect(descriptionColumn.isSearchable).toBe(true);
      expect(descriptionColumn.isSortable).toBe(true);
      expect(descriptionColumn.isFilterable).toBe(true);
      expect(descriptionColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_description');
    });

    it('should render description text in cell', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      await waitFor(() => {
        expect(screen.getByTestId('text-cell')).toBeInTheDocument();
        expect(screen.getByText('Test Project')).toBeInTheDocument();
      });
    });

    it('should render link with correct href', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      await waitFor(() => {
        const link = screen.getByTestId('ods-link');
        expect(link).toHaveAttribute(
          'href',
          'https://example.com/project/test-id',
        );
        expect(link).toHaveTextContent('Test Project');
      });
    });

    it('should render default project badge when isDefault is true', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockDefaultProject));

      await waitFor(() => {
        expect(
          screen.getByText('pci_projects_project_default_project'),
        ).toBeInTheDocument();
        expect(mockTranslate).toHaveBeenCalledWith(
          'pci_projects_project_default_project',
        );
      });
    });

    it('should not render default project badge when isDefault is false', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      await waitFor(() => {
        expect(
          screen.queryByText('pci_projects_project_default_project'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('aggregatedStatus column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const statusColumn = columns[1];

      expect(statusColumn.id).toBe('aggregatedStatus');
      expect(statusColumn.label).toBe('pci_projects_status');
      expect(statusColumn.isSearchable).toBe(false);
      expect(statusColumn.isSortable).toBe(true);
      expect(statusColumn.isFilterable).toBe(false);
      expect(statusColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_status');
    });

    it('should render StatusComponent in cell', async () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const statusColumn = columns[1];

      render(statusColumn.cell(mockProject));

      await waitFor(() => {
        expect(screen.getByTestId('text-cell')).toBeInTheDocument();
        expect(screen.getByTestId('status-component')).toBeInTheDocument();
        expect(screen.getByText('active')).toBeInTheDocument();
      });
    });
  });

  describe('actions column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGetProjectUrl);
      const actionsColumn = columns[2];

      expect(actionsColumn.id).toBe('actions');
      expect(actionsColumn.label).toBe('');
      expect(actionsColumn.isSortable).toBe(false);
      expect(actionsColumn.isSearchable).toBe(false);
    });
  });
});
