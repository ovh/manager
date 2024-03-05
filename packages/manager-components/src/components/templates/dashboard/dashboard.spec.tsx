import '@testing-library/jest-dom';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { DashboardLayout } from './dashboard.component';
import { defaultProps } from './dashboard.stories';

describe('DashboardLayout component', () => {
  it('renders dashboard layout correctly', async () => {
    render(<DashboardLayout {...defaultProps} />);
    waitFor(() => {
      expect(screen.getByText('Vrack Services')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Back to the list')).toBeInTheDocument();
    });
  });
});
