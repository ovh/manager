import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import LinkToOngoingOperations from './LinkToOngoingOperations';
import { TOngoingOperationTarget } from '@/domain/constants/serviceDetail';


describe('LinkToOngoingOperations', () => {
  it('should display the link with the correct URL', () => {
    render(<LinkToOngoingOperations target="domain" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/domain'));
  });

  it('should display the correct translation text', () => {
    render(<LinkToOngoingOperations target="domain" />);

    expect(
      screen.getByText(
        'domain_tab_general_information_banner_link_ongoing_operations',
      ),
    ).toBeInTheDocument();
  });

  it('should display the arrow-right icon', () => {
    render(<LinkToOngoingOperations target="domain" />);

    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
  });

  it('should render the link and icon in the correct order', () => {
    render(<LinkToOngoingOperations target="domain" />);

    const link = screen.getByRole('link');
    const children = link.childNodes;

    expect(children.length).toBeGreaterThanOrEqual(2);
    expect(children[children.length - 1]).toBe(
      screen.getByTestId('icon-arrow-right'),
    );
  });

  it('should support different target values', () => {
    const targets: TOngoingOperationTarget[] = ['alldom', 'dns', 'domain'];

    targets.forEach((target) => {
      const { unmount } = render(<LinkToOngoingOperations target={target} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining(`/${target}`),
      );
      expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
      expect(
        screen.getByText(
          'domain_tab_general_information_banner_link_ongoing_operations',
        ),
      ).toBeInTheDocument();

      unmount();
    });
  });

  it('should render the component without error with valid props', () => {
    expect(() => {
      render(<LinkToOngoingOperations target="domain" />);
    }).not.toThrow();
  });
});
