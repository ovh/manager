import { it, vi, describe, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import HamburgerMenu, {Props} from './HamburgerMenu';

const handleClick = vi.fn();

const props: Props = {
  isOpen: false,
  onClick: handleClick
}

const renderHamburgerMenu = (props: Props) => {
  return render(<HamburgerMenu isOpen={props.isOpen} onClick={props.onClick} />)
}

describe('HamburgerMenu.component', () => {
  it('should render', () => {
    expect(renderHamburgerMenu(props).queryByTestId('hamburgerMenu')).not.toBeNull();
  });

  it('should trigger callback', async () => {
    const {queryByTestId} = renderHamburgerMenu(props);
    const button = queryByTestId('hamburgerMenu');
    await act(() => fireEvent.click(button));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should have aria expended if open is true', () => {
    props.isOpen = true;
    const {queryByTestId} = renderHamburgerMenu(props);
    expect(queryByTestId('hamburgerMenu')).toHaveAttribute('aria-expanded');
  })
});