import { Link } from '../Link.component';
import { LinkType } from '../Link.props';
import { render } from '../../../utils/test.provider';

describe('Link component', () => {
  it('renders a simple link correctly', () => {
    const props = {
      children: 'test link',
      href: 'https://www.example.com',
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a back link correctly', () => {
    const props = {
      children: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a next link correctly', () => {
    const props = {
      children: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a external link correctly with label as prop', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      children: 'External Page',
      type: LinkType.external,
    };

    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a link with urn and iamActions correctly', () => {
    const props = {
      children: 'Protected Link',
      href: 'https://www.example.com',
      urn: 'urn:v1:eu:resource:unknown:unknown-id',
      iamActions: ['unknown:apiovh:resource/edit'],
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a disabled link with urn and iamActions correctly', () => {
    const props = {
      children: 'Disabled Protected Link',
      href: 'https://www.example.com',
      urn: 'urn:v1:eu:resource:test:test-resource-id',
      iamActions: ['test:apiovh:resource/edit'],
      disabled: true,
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a link with urn and iamActions without tooltip', () => {
    const props = {
      children: 'Protected Link No Tooltip',
      href: 'https://www.example.com',
      urn: 'urn:v1:eu:resource:demo:demo-resource-id',
      iamActions: ['demo:apiovh:resource/edit'],
      displayTooltip: false,
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a link with disabled IAM check', () => {
    const props = {
      children: 'Link with Disabled IAM Check',
      href: 'https://www.example.com',
      urn: 'urn:v1:eu:resource:mock:mock-resource-id',
      iamActions: ['mock:apiovh:resource/edit'],
      disableIamCheck: true,
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a link with multiple iamActions', () => {
    const props = {
      children: 'Link with Multiple IAM Actions',
      href: 'https://www.example.com',
      urn: 'urn:v1:eu:resource:example:example-resource-id',
      iamActions: [
        'example:apiovh:resource/edit',
        'example:apiovh:resource/delete',
        'example:apiovh:resource/view',
      ],
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a link with custom className and IAM props', () => {
    const props = {
      children: 'Custom Styled Protected Link',
      href: 'https://www.example.com',
      className: 'custom-link-class',
      urn: 'urn:v1:eu:resource:generic:generic-resource-id',
      iamActions: ['generic:apiovh:resource/edit'],
    };
    const { asFragment } = render(<Link {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
