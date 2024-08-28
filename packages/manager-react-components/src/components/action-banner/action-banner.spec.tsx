import { fireEvent, screen } from '@testing-library/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { ActionBanner, ActionBannerProps } from './action-banner.component';
import { render } from '../../utils/test.provider';

const renderComponent = (props: ActionBannerProps) => {
  return render(<ActionBanner {...props} />);
};

describe('ActionBanner tests', () => {
  it('should display message', () => {
    renderComponent({
      color: ODS_MESSAGE_COLOR.information,
      message: 'hello world',
      cta: 'custom action',
      onClick: () => {},
    });
    expect(screen.getAllByText('hello world')).not.toBeNull();
  });

  it('should have a working call to action button', () => {
    const onClick = jest.fn();
    renderComponent({
      color: ODS_MESSAGE_COLOR.information,
      message: 'hello world',
      cta: 'custom action',
      onClick,
    });
    expect(screen.getByTestId('actionBanner-button')).not.toBeNull();
    const cta = screen.queryByTestId('actionBanner-button');
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(cta);
    expect(onClick).toHaveBeenCalled();
  });

  it('should have a link action', () => {
    const href = 'www.ovhcloud.com';
    renderComponent({
      color: ODS_MESSAGE_COLOR.information,
      message: 'hello world',
      cta: 'custom action',
      href,
    });
    const link = screen.queryByTestId('action-banner-link');
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
