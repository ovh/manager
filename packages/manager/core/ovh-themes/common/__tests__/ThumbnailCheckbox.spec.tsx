import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { ThumbnailCheckbox } from '../components';

expect.extend(toHaveNoViolations);

describe('ThumbnailCheckbox', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThumbnailCheckbox checkboxTitle={'Value A'} />,
    );

    const a11yResults = await axe(container);

    expect(a11yResults).toHaveNoViolations();
  });
});
