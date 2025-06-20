import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  const mockGoToProject = vi.fn();
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
    mockGoToProject.mockClear();
  });

  it('should return an array of 3 columns', () => {
    const columns = getDatagridColumns(mockTranslate, mockGoToProject);
    expect(columns).toHaveLength(3);
  });

  describe('description column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const descriptionColumn = columns[0];

      expect(descriptionColumn.id).toBe('description');
      expect(descriptionColumn.label).toBe('pci_projects_description');
      expect(descriptionColumn.isSearchable).toBe(true);
      expect(descriptionColumn.isSortable).toBe(true);
      expect(descriptionColumn.isFilterable).toBe(true);
      expect(descriptionColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_description');
    });

    it('should render description text in cell', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      expect(screen.getByTestId('text-cell')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('should call goToProject when button is clicked', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      const button = screen.getByRole('button', { name: 'Test Project' });
      fireEvent.click(button);

      expect(mockGoToProject).toHaveBeenCalledWith('test-id');
    });

    it('should render default project badge when isDefault is true', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockDefaultProject));

      expect(
        screen.getByText('pci_projects_project_default_project'),
      ).toBeInTheDocument();
      expect(mockTranslate).toHaveBeenCalledWith(
        'pci_projects_project_default_project',
      );
    });

    it('should not render default project badge when isDefault is false', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const descriptionColumn = columns[0];

      render(descriptionColumn.cell(mockProject));

      expect(
        screen.queryByText('pci_projects_project_default_project'),
      ).not.toBeInTheDocument();
    });
  });

  describe('aggregatedStatus column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const statusColumn = columns[1];

      expect(statusColumn.id).toBe('aggregatedStatus');
      expect(statusColumn.label).toBe('pci_projects_status');
      expect(statusColumn.isSearchable).toBe(false);
      expect(statusColumn.isSortable).toBe(true);
      expect(statusColumn.isFilterable).toBe(false);
      expect(statusColumn.type).toBe(FilterTypeCategories.String);
      expect(mockTranslate).toHaveBeenCalledWith('pci_projects_status');
    });

    it('should render StatusComponent in cell', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const statusColumn = columns[1];

      render(statusColumn.cell(mockProject));

      expect(screen.getByTestId('text-cell')).toBeInTheDocument();
      expect(screen.getByTestId('status-component')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  describe('actions column', () => {
    it('should have correct configuration', () => {
      const columns = getDatagridColumns(mockTranslate, mockGoToProject);
      const actionsColumn = columns[2];

      expect(actionsColumn.id).toBe('actions');
      expect(actionsColumn.label).toBe('');
      expect(actionsColumn.isSortable).toBe(false);
      expect(actionsColumn.isSearchable).toBe(false);
    });
  });
});
