import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Datepicker, DatepickerContent, DatepickerControl } from '@/components';

describe('Datepicker Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <Datepicker>
        <DatepickerControl />
        <DatepickerContent />
      </Datepicker>,
    );
    expect(container).toMatchSnapshot();
  });
});
