import { screen, waitFor } from '@testing-library/react';
import AxiosMockAdapter from 'axios-mock-adapter';

import { v2 } from '@ovh-ux/manager-core-api';

import { render } from '@/commons/tests-utils/Render.utils';
import { Link } from '@/components/link/Link.component';
import { LinkType } from '@/components/link/Link.props';

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
      type: LinkType.back,
    };
    render(<Link {...props} />);
    const linkElement = screen.getByText('Back to the list');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement.closest('a')?.querySelector('[class*="arrow-left"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
  });

  it('renders a next link correctly', () => {
    const props = {
      children: 'Next Page',
      href: 'https://www.example.com',
      type: LinkType.next,
    };
    render(<Link {...props} />);
    const linkElement = screen.getByText('Next Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement.closest('a')?.querySelector('[class*="arrow-right"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.example.com');
  });

  it('renders a survey link correctly', () => {
    const props = {
      type: LinkType.survey,
      surveyLink: { applicationKey: 'COM', email: 'test@example.com' },
    };
    render(<Link {...props} />);
    const linkElement = screen.getByText('Donnez-nous votre avis !');
    expect(linkElement).toBeInTheDocument();

    expect(linkElement).toHaveAttribute(
      'href',
      'https://s.elq.fr/ovhsat/COM_evaluation_survey?email=test%40example.com',
    );
  });

  it('renders a external link correctly with label as prop', () => {
    const props = {
      href: 'https://www.ovhcloud.com/',
      target: '_blank',
      children: 'External Page',
      type: LinkType.external,
    };

    render(<Link {...props} />);
    const linkElement = screen.getByText('External Page');
    expect(linkElement).toBeInTheDocument();

    const iconElement = linkElement.closest('a')?.querySelector('[class*="external-link"]');
    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://www.ovhcloud.com/');
  });

  const mockAdapter = new AxiosMockAdapter(v2);

  it('not renders a link when we have not the autorization', async () => {
    mockAdapter.onPost('/iam/resource/test/authorization/check').reply(200, []);

    render(<Link urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);

    const link = screen.getByText('Link');
    expect(link).toBeInTheDocument();

    await waitFor(() => {
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('renders a link when we have the autorization', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(<Link urn="test" iamActions={['subscribe']} {...PROPS_LINK} />);
    const linkElement = screen.getByText('Link');
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
      expect(linkElement).not.toBeDisabled();
    });
  });

  it('renders a disabled link when we have the autorization but forced disabled', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    render(<Link urn="test" iamActions={['subscribe']} {...PROPS_LINK} disabled={true} />);
    const linkElement = screen.getByText('Link');
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
      expect(linkElement).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
