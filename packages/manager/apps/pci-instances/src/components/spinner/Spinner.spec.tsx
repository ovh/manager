import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Spinner } from './Spinner.component';

describe('Spinner component', () => {
  test('Should render spinner with medium size', () => {
    const { getByTestId } = render(<Spinner />);
    const spinnerEl = getByTestId('spinner');
    expect(spinnerEl).toHaveStyle(`width: ${ODS_SPINNER_SIZE.md}`);
  });
});
