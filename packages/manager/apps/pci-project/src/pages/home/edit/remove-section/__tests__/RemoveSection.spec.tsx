import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { createWrapper } from '@/wrapperRenders';

import RemoveSection from '../RemoveSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ projectId: 'test-project-id' }),
  };
});

const mockUseServiceIds = vi.fn<() => { data: number[] | undefined; isPending: boolean }>();
vi.mock('@/data/hooks/useServices', () => ({
  useServiceIds: () => mockUseServiceIds() as { data: number[] | undefined; isPending: boolean },
}));

describe('RemoveSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and description when not discovery', () => {
    mockUseServiceIds.mockReturnValue({ data: [123], isPending: false });

    const { getByText, getAllByTestId } = render(<RemoveSection isDiscovery={false} />, {
      wrapper: createWrapper(),
    });

    expect(getByText(/^pci_projects_project_edit_remove_description$/)).toBeVisible();
    expect(getAllByTestId('ods-text')).toHaveLength(2);
  });

  it('renders only heading when discovery', () => {
    mockUseServiceIds.mockReturnValue({ data: [123], isPending: false });

    const { getAllByTestId } = render(<RemoveSection isDiscovery={true} />, {
      wrapper: createWrapper(),
    });

    expect(getAllByTestId('ods-text')).toHaveLength(1);
    expect(
      screen.queryByText('pci_projects_project_edit_remove_description', {
        exact: true,
      }),
    ).not.toBeInTheDocument();
  });

  it('disables button when serviceIds are loading', () => {
    mockUseServiceIds.mockReturnValue({ data: undefined, isPending: true });

    render(<RemoveSection isDiscovery={false} />, { wrapper: createWrapper() });

    const button = screen.getByTestId('remove-section_remove-button');
    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('disables button when no serviceIds', () => {
    mockUseServiceIds.mockReturnValue({ data: [], isPending: false });
    render(<RemoveSection isDiscovery={false} />, { wrapper: createWrapper() });

    const button = screen.getByTestId('remove-section_remove-button');
    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('navigates to remove page with serviceId on button click', () => {
    mockUseServiceIds.mockReturnValue({ data: [456], isPending: false });

    render(<RemoveSection isDiscovery={false} />, { wrapper: createWrapper() });

    const button = screen.getByTestId('remove-section_remove-button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('./remove?serviceId=456');
  });
});
