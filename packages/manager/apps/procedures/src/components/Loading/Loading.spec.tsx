import React from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import Loading from './Loading';

describe('Loading', () => {
  it('should render with the correct layout', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('.flex.justify-center.items-center')).toBeInTheDocument();
    expect(container.querySelector('.w-28')).toBeInTheDocument();
  });
});
