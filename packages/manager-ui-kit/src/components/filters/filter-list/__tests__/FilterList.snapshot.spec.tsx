import { vi } from 'vitest';

import { FilterList } from '@/components/filters/filter-list/FilterList.component';
import { render } from '@/setupTest';

import { FilterListProps } from '../FilterList.props';

const renderComponent = (props: FilterListProps) => {
  return render(<FilterList {...props} />);
};

describe('FilterList Snapshot Tests', () => {
  it('should match snapshot with empty filters', () => {
    const props = {
      filters: [],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with single string filter', () => {
    const props = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'john_doe',
          label: "Nom d'utilisateur",
          type: 'String',
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with date filter', () => {
    const props = {
      filters: [
        {
          key: 'createdAt',
          comparator: 'is_equal',
          value: new Date('2023-10-15').toISOString(),
          label: 'Date de création',
          type: 'Date',
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with numeric filter', () => {
    const props = {
      filters: [
        {
          key: 'age',
          comparator: 'is_higher',
          value: '25',
          label: 'Age',
          type: 'Numeric',
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with multiple filters', () => {
    const props = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'admin',
          label: 'Username',
          type: 'String',
        },
        {
          key: 'status',
          comparator: 'is_equal',
          value: 'active',
          label: 'Status',
        },
        {
          key: 'createdAt',
          comparator: 'is_after',
          value: new Date('2023-01-01').toISOString(),
          label: 'Created After',
          type: 'Date',
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with different comparators', () => {
    const props = {
      filters: [
        {
          key: 'name',
          comparator: 'starts_with',
          value: 'Test',
          label: 'Name',
        },
        {
          key: 'email',
          comparator: 'ends_with',
          value: '@example.com',
          label: 'Email',
        },
        {
          key: 'role',
          comparator: 'is_different',
          value: 'guest',
          label: 'Role',
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(props);
    expect(container).toMatchSnapshot();
  });
});
