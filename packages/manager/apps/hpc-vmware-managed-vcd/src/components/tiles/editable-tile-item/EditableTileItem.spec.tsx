import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditableTileItem from './EditableTileItem.component';

describe('EditableTileItem component unit test suite', () => {
  it('should display a label and the correct icon', () => {
    // given
    const label = 'Editable label';

    // when
    const renderComponent = () => {
      const queryClient = new QueryClient();
      return render(
        <QueryClientProvider client={queryClient}>
          <EditableTileItem
            urn="urn"
            iamActions={[]}
            label={label}
            onClickEdit={() => {}}
          />
        </QueryClientProvider>,
      );
    };

    const { getByTestId, getByText } = renderComponent();

    // then
    expect(getByText(label)).toBeInTheDocument();

    const icon = getByTestId('editIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('name', ODS_ICON_NAME.PEN);
    expect(icon).toHaveAttribute('size', ODS_ICON_SIZE.xs);
  });
});
