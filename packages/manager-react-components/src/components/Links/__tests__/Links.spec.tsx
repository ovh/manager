import AxiosMockAdapter from 'axios-mock-adapter';
import { screen, waitFor } from '@testing-library/react';
import apiClient from '@ovh-ux/manager-core-api';
import { Links } from '../Links.component';
import { LinkType } from '../Links.props';
import { render } from '../../../utils/test.provider';

const PROPS_LINK = {
  children: 'Link',
  href: 'https://www.example.com',
};

describe('Link component', () => {
  it('renders a simple link correctly', () => {
    const props = {
      children: 'test link',
      href: 'https://www.example.com',
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('test link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a back link correctly', () => {
    const props = {
      children: 'Back to the list',
      href: 'https://www.example.com',
      type: LinkType.back,
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('Back to the list');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-left"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a next link correctly', () => {
    const props = {
      children: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };
    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('Next Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-right"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders a external link correctly with label as prop', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      children: 'External Page',
      type: LinkType.external,
    };

    const { asFragment } = render(<Links {...props} />);
    const linkElement = screen.getByText('External Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="external-link"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.ovhcloud.com/');
    expect(asFragment()).toMatchSnapshot();
  });

  const mockAdapter = new AxiosMockAdapter(apiClient.v2);

  it('not renders a link when we have not the autorization', async () => {
    mockAdapter.onPost('/iam/resource/test/authorization/check').reply(200, []);

    render(<Links urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);

    const link = screen.getByText('Link');
    expect(link).toBeInTheDocument();

    waitFor(() => {
      expect(link).toBeDisabled();
    });
  });

  it('renders a link when we have the autorization', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(<Links urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);
    const linkElement = screen.getByText('Link');
    expect(linkElement).toBeInTheDocument();

    waitFor(() => {
      expect(linkElement).not.toBeDisabled();
    });
  });

  it('renders a disabled link when we have the autorization but forced disabled', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(
      <Links
        urn="test"
        iamActions={['subscribe']}
        {...PROPS_LINK}
        disabled={true}
      />,
    );
    const linkElement = screen.getByText('Link');
    expect(linkElement).toBeInTheDocument();

    waitFor(() => {
      expect(linkElement).toBeDisabled();
    });
  });
});
