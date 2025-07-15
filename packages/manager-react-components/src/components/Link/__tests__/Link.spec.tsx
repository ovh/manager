import AxiosMockAdapter from 'axios-mock-adapter';
import { screen, waitFor } from '@testing-library/react';
import apiClient from '@ovh-ux/manager-core-api';
import { Link } from '../Link.component';
import { LINK_TYPE } from '../Link.props';
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
    render(<Link {...props} />);
    const linkElement = screen.getByText('test link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
  });

  it('renders a back link correctly', () => {
    const props = {
      children: 'Back to the list',
      href: 'https://www.example.com',
      type: LINK_TYPE.back,
    };
    render(<Link {...props} />);
    const linkElement = screen.getByText('Back to the list');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-left"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
  });

  it('renders a next link correctly', () => {
    const props = {
      children: 'Next Page',
      href: 'https://www.example.com',
      type: LINK_TYPE.next,
    };
    render(<Link {...props} />);
    const linkElement = screen.getByText('Next Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="arrow-right"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
  });

  it('renders a external link correctly with label as prop', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      children: 'External Page',
      type: LINK_TYPE.external,
    };

    render(<Link {...props} />);
    const linkElement = screen.getByText('External Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement
      .closest('a')
      ?.querySelector('[class*="external-link"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.ovhcloud.com/');
  });

  const mockAdapter = new AxiosMockAdapter(apiClient.v2);

  it('not renders a link when we have not the autorization', () => {
    mockAdapter.onPost('/iam/resource/test/authorization/check').reply(200, []);

    render(<Link urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);

    const link = screen.getByText('Link');
    expect(link).toBeInTheDocument();

    waitFor(() => {
      expect(link).toBeDisabled();
    });
  });

  it('renders a link when we have the autorization', () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(<Link urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);
    const linkElement = screen.getByText('Link');
    expect(linkElement).toBeInTheDocument();

    waitFor(() => {
      expect(linkElement).not.toBeDisabled();
    });
  });

  it('renders a disabled link when we have the autorization but forced disabled', () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(
      <Link
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
