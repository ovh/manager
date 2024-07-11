import { fireEvent, screen } from '@testing-library/react';
import { ActionBanner, ActionBannerProps } from './action-banner.component';
import { render } from '../../utils/test.provider';

const renderComponent = (props: ActionBannerProps) => {
  return render(<ActionBanner {...props} />);
};

describe('ActionBanner tests', () => {
  it('should display message', () => {
    renderComponent({
      title: 'hello world',
      description: 'custom action',
      cta: 'custom action',
      onClick: () => {},
    });
    expect(screen.getAllByText('hello world')).not.toBeNull();
  });

  it('should have a working call to action button', () => {
    const onClick = jest.fn();
    renderComponent({
      title: 'hello world',
      description: 'a beautiful description',
      cta: 'custom action',
      onClick,
    });
    expect(screen.getAllByText('custom action')).not.toBeNull();
    const cta = screen.getByText('custom action');
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(cta);
    expect(onClick).toHaveBeenCalled();
  });
});
