import React from 'react';
import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { render } from '@/setupTest';
import { FilterTagsForm } from '../FilterTagsForm.component';
import { FilterTagsFormProps } from '../FilterTagsForm.props';

const mocks = vi.hoisted(() => ({
  useGetResourceTags: vi.fn(),
}));

vi.mock('../../../../hooks/iam/useOvhIam', () => ({
  useGetResourceTags: mocks.useGetResourceTags,
}));

const TestWrapper = () => {
  const [tagKey, setTagKey] = React.useState('');
  const [value, setValue] = React.useState('');

  const defaultProps: FilterTagsFormProps = {
    resourceType: 'testResource',
    tagKey,
    setTagKey,
    value,
    setValue,
  };

  return <FilterTagsForm {...defaultProps} />;
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
    const { container, queryByTestId } = render(<TestWrapper />);

    expect(queryByTestId('tags-filter-form-key-field')).not.toBeInTheDocument();
    expect(
      queryByTestId('tags-filter-form-value-field'),
    ).not.toBeInTheDocument();

    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows tag key options when loaded', async () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [
        { key: 'env', values: ['prod', 'dev'] },
        { key: 'region', values: ['EU', 'US'] },
      ],
      isError: false,
      isLoading: false,
    });
    const { getByTestId } = render(<TestWrapper />);

    await waitFor(() => {
      expect(getByTestId('tags-filter-form-key-field')).toBeInTheDocument();
    });

    const tagKeyCombo = getByTestId('tags-filter-form-key-field');
    const tagValueCombo = getByTestId('tags-filter-form-value-field');
    expect(tagKeyCombo).toBeInTheDocument();
    expect(tagValueCombo).toBeInTheDocument();

    const tagKeyInput = tagKeyCombo.querySelector('input');
    const tagValueInput = tagValueCombo.querySelector('input');
    expect(tagKeyInput).toBeInTheDocument();
    expect(tagValueInput).toBeInTheDocument();
    expect(tagKeyInput).not.toBeDisabled();
  });

  it('disables tag value combobox until tag key is selected', async () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [{ key: 'env', values: ['prod', 'dev'] }],
      isError: false,
      isLoading: false,
    });
    const { getByTestId } = render(<TestWrapper />);

    await waitFor(() => {
      expect(getByTestId('tags-filter-form-key-field')).toBeInTheDocument();
    });

    const tagKeyCombo = getByTestId('tags-filter-form-key-field');
    const tagValueCombo = getByTestId('tags-filter-form-value-field');

    const tagKeyInput = tagKeyCombo.querySelector('input');
    const tagValueInput = tagValueCombo.querySelector('input');

    expect(tagValueInput).toBeDisabled();
    expect(tagKeyInput).not.toBeDisabled();
  });
});
