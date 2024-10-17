import { waitFor, screen, fireEvent } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { DashboardLayout } from './dashboard.component';
import { defaultProps } from './dashboard.stories';

describe('DashboardLayout component', () => {
  it('renders dashboard layout correctly', async () => {
    render(<DashboardLayout {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Vrack Services')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('clicks on back link triggers return fn', async () => {
    const backLinkLabel = 'back link';
    const spy = jest.fn();

    render(
      <DashboardLayout
        {...defaultProps}
        backLinkLabel={backLinkLabel}
        onClickReturn={spy}
      />,
    );

    fireEvent.click(screen.getByText(backLinkLabel));

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
