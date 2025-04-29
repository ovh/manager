import React from 'react';
import { vi, vitest } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  FilterTagValue,
  FilterTagValueProps,
} from './filter-tag-value.component';
import { render } from '../../utils/test.provider';

const mocks = vi.hoisted(() => ({
  useGetResourceTags: vi.fn(),
}));

vi.mock('../../hooks/iam/useOvhIam', () => ({
  useGetResourceTags: mocks.useGetResourceTags,
}));

describe('FilterTagValue', () => {
  const defaultProps: FilterTagValueProps = {
    resourceType: 'testResource',
    onTagInputChange: vitest.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons when loading', async () => {
    mocks.useGetResourceTags.mockReturnValue({
      tags: [],
      isError: false,
      isLoading: true,
    });
    const { container } = render(<FilterTagValue {...defaultProps} />);
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
    const { getByTestId, getByText } = render(
      <FilterTagValue {...defaultProps} />,
    );
    const tagKeyCombo = getByTestId('filter-tag_tag-key');
    const tagValueCombo = getByTestId('filter-tag_tag-value');
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
    const { getByTestId } = render(<FilterTagValue {...defaultProps} />);
    const tagValueCombo = getByTestId('filter-tag_tag-value');
    const tagKeyCombo = getByTestId('filter-tag_tag-key');
    expect(tagKeyCombo).not.toHaveAttribute('is-disabled');
    expect(tagValueCombo).toHaveAttribute('is-disabled');
  });
});
