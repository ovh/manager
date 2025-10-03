import React from 'react';
import { vi, vitest } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  TagsFilterForm,
  TagsFilterFormProps,
} from './tags-filter-form.component';
import { render } from '../../utils/test.provider';

const mocks = vi.hoisted(() => ({
  useGetResourceTags: vi.fn(),
}));

vi.mock('../../hooks/iam/useOvhIam', () => ({
  useGetResourceTags: mocks.useGetResourceTags,
}));

const TestWrapper = () => {
  const [tagKey, setTagKey] = React.useState('');
  const [value, setValue] = React.useState('');

  const defaultProps: TagsFilterFormProps = {
    resourceType: 'testResource',
    tagKey,
    setTagKey,
    value,
    setValue,
  };

  return <TagsFilterForm {...defaultProps} />;
};

describe('FilterTagValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons when loading', async () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [],
      isError: false,
      isLoading: true,
    });
    const { container } = render(<TestWrapper />);
    expect(container.querySelectorAll('ods-skeleton').length).toBeGreaterThan(
      0,
    );
  });

  it('shows tag key options when loaded', () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [
        { key: 'env', values: ['prod', 'dev'] },
        { key: 'region', values: ['EU', 'US'] },
      ],
      isError: false,
      isLoading: false,
    });
    const { getByTestId, getByText } = render(<TestWrapper />);
    const tagKeyCombo = getByTestId('tags-filter-form-key-field');
    const tagValueCombo = getByTestId('tags-filter-form-value-field');
    expect(tagKeyCombo).toBeInTheDocument();
    expect(tagValueCombo).toBeInTheDocument();

    fireEvent.click(tagKeyCombo);
    expect(getByText('env')).toBeInTheDocument();
    expect(getByText('region')).toBeInTheDocument();
  });

  it('disables tag value combobox until tag key is selected', () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [{ key: 'env', values: ['prod', 'dev'] }],
      isError: false,
      isLoading: false,
    });
    const { getByTestId } = render(<TestWrapper />);
    const tagValueCombo = getByTestId('tags-filter-form-value-field');
    const tagKeyCombo = getByTestId('tags-filter-form-key-field');
    expect(tagKeyCombo).not.toHaveAttribute('is-disabled');
    expect(tagValueCombo).toHaveAttribute('is-disabled');
  });
});
