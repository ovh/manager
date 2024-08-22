import { render, screen } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { RedirectionGuard } from './redirection-guard.component';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(() => null),
}));

describe('RedirectionGuard', () => {
  it('should render children when condition is false', () => {
    const { getByText } = render(
      <RedirectionGuard condition={false} isLoading={false} route="/test">
        <div>Test Child</div>
      </RedirectionGuard>,
    );

    expect(getByText('Test Child')).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled();
  });

  it('should navigate when condition is true', () => {
    render(
      <RedirectionGuard condition={true} isLoading={false} route="/test">
        <div>Test Child</div>
      </RedirectionGuard>,
    );

    expect(Navigate).toHaveBeenCalledWith({ to: '/test' }, {});
  });

  it('should render spinner when isLoading is true', () => {
    render(
      <RedirectionGuard condition={false} isLoading={true} route="/test">
        <div>Test Child</div>
      </RedirectionGuard>,
    );
    expect(screen.getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
  });
});
