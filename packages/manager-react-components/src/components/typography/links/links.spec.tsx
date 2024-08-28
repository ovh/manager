import { Links, LinkType } from './links.component';
import { render } from '../../../utils/test.provider';

describe('Links component', () => {
  it('renders a back link correctly', () => {
    const props = {
      label: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };
    const { container } = render(<Links {...props} />);
    const linkElement = container.querySelector('[label="Back to the list"]');
    expect(linkElement).toBeInTheDocument();
  });

  it('renders a next link correctly', () => {
    const props = {
      label: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };
    const { container } = render(<Links {...props} />);
    const linkElement = container.querySelector('[label="Next Page"]');
    expect(linkElement).toBeInTheDocument();
  });
  it('renders a external link correctly', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      label: 'External Page',
      type: LinkType.external,
    };

    const { container } = render(<Links {...props} />);
    const linkElement = container.querySelector('[label="External Page"]');

    expect(linkElement).toBeInTheDocument();
  });
});
