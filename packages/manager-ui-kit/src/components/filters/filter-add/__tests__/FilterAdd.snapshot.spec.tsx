import { act } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { cleanup, render } from '@/setupTest';

import { FilterAddProps } from '../FilterAdd.props';
import { FilterAdd } from '../Filteradd.component';

const mockUseGetResourceTags = vi.fn();
const mockUseAuthorizationIam = vi.fn();

vi.mock('../../../../hooks/iam/useOvhIam', () => ({
  useGetResourceTags: () => mockUseGetResourceTags(),
  useAuthorizationIam: () => mockUseAuthorizationIam(),
}));

const renderComponent = (props: FilterAddProps) => {
  return render(<FilterAdd {...props} />);
};

describe('FilterAdd Snapshot Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-15T12:00:00.000Z'));

    mockUseGetResourceTags.mockReturnValue({
      tags: [],
      isError: false,
      isLoading: false,
    });
    mockUseAuthorizationIam.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  afterEach(async () => {
    vi.runAllTimers();
    vi.useRealTimers();

    // Wait for all pending async operations and state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    cleanup();

    // Wait for cleanup and any library internal async operations
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    vi.resetAllMocks();

    // Remove scroll lock attribute that modal/popover adds to body
    document.body.removeAttribute('data-scroll-lock');
  });

  it('should match snapshot with string filter type', () => {
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: ['includes', 'starts_with', 'ends_with', 'is_equal', 'is_different'],
          type: 'String',
        },
      ],
      onAddFilter: vi.fn(),
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it.skip('should match snapshot with date filter type', () => {
    const props = {
      columns: [
        {
          id: 'createdAt',
          label: 'Created At',
          type: 'Date',
          comparators: ['is_before', 'is_after', 'is_equal'],
        },
      ],
      onAddFilter: vi.fn(),
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with numeric filter type', () => {
    const props = {
      columns: [
        {
          id: 'age',
          label: 'Age',
          type: 'Numeric',
          comparators: ['is_lower', 'is_higher', 'is_equal'],
        },
      ],
      onAddFilter: vi.fn(),
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with select options', () => {
    const props = {
      columns: [
        {
          id: 'status',
          label: 'Status',
          comparators: ['is_equal', 'is_different'],
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      ],
      onAddFilter: vi.fn(),
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with tags filter type', () => {
    const props = {
      columns: [
        {
          id: 'tags',
          label: 'Tags',
          type: 'Tags',
          comparators: ['EQ', 'NEQ', 'EXISTS', 'NOT_EXISTS'],
        },
      ],
      onAddFilter: vi.fn(),
      resourceType: 'dedicatedServer',
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with multiple columns', () => {
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: ['includes', 'is_equal'],
          type: 'String',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'Numeric',
          comparators: ['is_lower', 'is_higher'],
        },
        {
          id: 'createdAt',
          label: 'Created At',
          type: 'Date',
          comparators: ['is_before', 'is_after'],
        },
      ],
      onAddFilter: vi.fn(),
    } as FilterAddProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });
});
