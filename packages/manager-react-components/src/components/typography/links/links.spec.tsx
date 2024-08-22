import { screen } from '@testing-library/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Links, LinkType } from './links.component';
import { render } from '../../../utils/test.provider';

describe('Links component', () => {
  it('renders a back link correctly', () => {
    const props = {
      label: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };

    render(<Links {...props} />);

    const linkElement = screen.getByText('Back to the list');

    expect(linkElement).toBeInTheDocument();
  });

  it('renders a next link correctly', () => {
    const props = {
      label: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };

    render(<Links {...props} />);
    const linkElement = screen.getByText('Next Page');

    expect(linkElement).toBeInTheDocument();
  });
  it('renders a external link correctly', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: OdsHTMLAnchorElementTarget._blank,
      label: 'External Page',
      type: LinkType.external,
    };

    render(<Links {...props} />);
    const linkElement = screen.getByText('External Page');

    expect(linkElement).toBeInTheDocument();
  });
});
