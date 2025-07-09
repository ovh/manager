import '@/test-utils/unit-test-setup';
import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import TagTypeCell from './tagTypeCell.component';
import { IamTagListItem, TagType } from '@/data/api/get-iam-tags';

/** RENDER */
const renderComponent = (item: IamTagListItem) => {
  return render(<TagTypeCell {...item} />);
};

describe('TagListTopBar Component', async () => {
  it('Should display custom tooltip', async () => {
    const { getByText } = renderComponent({
      name: 'test:test',
      count: 1,
      type: TagType.CUSTOM_TAG,
    });

    expect(getByText('tagType_custom_tooltip')).toBeInTheDocument();
  });

  it('Should display system tooltip', async () => {
    const { getByText } = renderComponent({
      name: 'test:test',
      count: 1,
      type: TagType.SYSTEM_TAG,
    });

    expect(getByText('tagType_system_tooltip')).toBeInTheDocument();
  });

  it('Should display predefined tooltip', async () => {
    const { getByText } = renderComponent({
      name: 'test:test',
      count: 1,
      type: TagType.PREDEFINED_TAG,
    });

    expect(getByText('tagType_predefined_tooltip')).toBeInTheDocument();
  });
});
