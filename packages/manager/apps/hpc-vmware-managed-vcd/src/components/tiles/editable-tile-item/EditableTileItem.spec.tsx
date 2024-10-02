import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import EditableTileItem from './EditableTileItem.component';

describe('EditableTileItem component unit test suite', () => {
  it('should display a label and the correct icon', () => {
    // given
    const label = 'Editable label';

    // when
    const { getByTestId, getByText } = render(
      <EditableTileItem label={label} onClickEdit={() => {}} />,
    );

    // then
    expect(getByText(label)).toBeInTheDocument();

    const icon = getByTestId('editIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('name', ODS_ICON_NAME.PEN);
    expect(icon).toHaveAttribute('size', ODS_ICON_SIZE.xxs);
  });
});
