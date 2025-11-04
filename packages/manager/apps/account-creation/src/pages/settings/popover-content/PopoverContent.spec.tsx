import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountSettingsPopoverContent from './PopoverContent';

describe('AccountSettingsPopoverContent', () => {
  it('should render the description', () => {
    render(<AccountSettingsPopoverContent description="Test description" />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render all list items when list is provided', () => {
    const listItems = ['Item 1', 'Item 2', 'Item 3'];
    render(
      <AccountSettingsPopoverContent
        description="List test"
        list={listItems}
      />,
    );

    listItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should not render the list when list is empty', () => {
    render(
      <AccountSettingsPopoverContent description="Empty list" list={[]} />,
    );

    const listElement = screen.queryByRole('list');
    expect(listElement).not.toBeInTheDocument();
  });

  it('should not render the list when list is undefined', () => {
    render(<AccountSettingsPopoverContent description="No list" />);

    const listElement = screen.queryByRole('list');
    expect(listElement).not.toBeInTheDocument();
  });
});
