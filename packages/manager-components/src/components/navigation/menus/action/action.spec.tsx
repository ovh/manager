import { waitFor, screen } from '@testing-library/react';
import { actionMenu } from './action.stories';
import { ActionMenu, ActionMenuProps } from './action.component';
import { render } from '../../../../utils/test.provider';
import '@testing-library/jest-dom';

const setupSpecTest = async (customProps?: Partial<ActionMenuProps>) =>
  waitFor(() => render(<ActionMenu {...actionMenu} {...customProps} />));

describe('ActionMenu', () => {
  it('renders menu actions correctly', async () => {
    await setupSpecTest();

    const action1 = screen.getByText('Action 1');
    const action2 = screen.getByText('Action 2');
    const actionMenuIcon = screen.getByTestId('action-menu-icon');

    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
    expect(actionMenuIcon.getAttribute('name')).toBe('arrow-down-concept');
  });

  it('renders compact menu correctly', async () => {
    await setupSpecTest({ isCompact: true });
    const actionMenuIcon = screen.getByTestId('action-menu-icon');
    expect(actionMenuIcon.getAttribute('name')).toBe('ellipsis');
  });
});
