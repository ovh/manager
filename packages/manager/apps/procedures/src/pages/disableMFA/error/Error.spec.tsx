import React from 'react';

import { render, screen } from '@testing-library/react';

import ErrorPage from './Error.page';

describe('ErrorPage Component', () => {
  it('should render all text elements with the correct translation keys', () => {
    render(<ErrorPage />);

    expect(screen.getByText('account-disable-2fa-error-validation')).toBeInTheDocument();
    expect(screen.getByText('account-disable-2fa-error-verification')).toBeInTheDocument();
    expect(screen.getByText('account-disable-2fa-error-suggestion')).toBeInTheDocument();
  });
});
