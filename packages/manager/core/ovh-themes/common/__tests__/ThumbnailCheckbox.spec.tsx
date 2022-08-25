import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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

  it('selects checkbox on click', () => {
    const { asFragment } = render(
      <ThumbnailCheckbox checkboxTitle={'Value B'} />,
    );
  });
});
