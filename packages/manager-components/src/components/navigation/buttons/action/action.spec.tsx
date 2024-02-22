import { waitFor, screen } from '@testing-library/react';
import { actionButton } from './action.stories';
import { ActionButton, ActionButtonProps } from './action.component';
import { render } from '../../../../utils/test.provider';
import '@testing-library/jest-dom';

const setupSpecTest = async (customProps?: Partial<ActionButtonProps>) =>
  waitFor(() => render(<ActionButton {...actionButton} {...customProps} />));

describe('ActionButton', () => {
  it('renders actions correctly', async () => {
    await setupSpecTest();

    const action1 = screen.getByText('Action 1');
    const action2 = screen.getByText('Action 2');
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
  });
});
