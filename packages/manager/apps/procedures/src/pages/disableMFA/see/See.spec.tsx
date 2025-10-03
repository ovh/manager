import React from 'react';

import { render, screen } from '@testing-library/react';

import SeeRequest from './See.page';

describe('SeeRequest Component', () => {
  it('should render all text elements with the correct translation keys', () => {
    render(<SeeRequest />);

    expect(screen.getByText('account-disable-2fa-see-title')).toBeInTheDocument();

    expect(screen.getByText('account-disable-2fa-see-description1')).toBeInTheDocument();
    expect(screen.getByText('account-disable-2fa-see-description2')).toBeInTheDocument();
  });
});
