import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import { LoadingCell } from './LoadingCell.component';

describe('Considering the loading cell component', () => {
  test.each`
    isLoading
    ${false}
    ${true}
  `(
    'Should render component correctly depending on isLoading property <$isLoading>',
    ({ isLoading }) => {
      render(
        <LoadingCell isLoading={isLoading}>
          <div>Foo</div>
        </LoadingCell>,
      );
      const loadingCellElement = screen.getByTestId('loading-cell');
      expect(loadingCellElement).toBeInTheDocument();
      if (isLoading) {
        const skeletonElement = screen.getByTestId('skeleton');
        expect(skeletonElement).toBeTruthy();
      } else {
        const childrenElement = screen.getByText('Foo');
        expect(childrenElement).toBeTruthy();
      }
    },
  );
});
