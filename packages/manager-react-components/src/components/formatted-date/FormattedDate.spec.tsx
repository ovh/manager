import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormattedDate } from './FormattedDate';
import * as useFormattedDateHook from '../../hooks/date/useFormattedDate';

describe('FormattedDate', () => {
  it('renders formatted date', () => {
    vi.spyOn(useFormattedDateHook, 'useFormattedDate').mockReturnValue(
      'Janv 1, 1970',
    );

    render(
      <FormattedDate
        dateString="01/01/1970"
        format={useFormattedDateHook.DateFormat.display}
      />,
    );

    expect(screen.getByText('Janv 1, 1970')).toBeInTheDocument();
  });
});
