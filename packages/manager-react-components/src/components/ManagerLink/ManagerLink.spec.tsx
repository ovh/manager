import AxiosMockAdapter from 'axios-mock-adapter';
import apiClient from '@ovh-ux/manager-core-api';
import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { ManagerLink } from './ManagerLink.component';

const PROPS_LINK = {
  label: 'Link',
  href: 'https://www.example.com',
};

const mockAdapter = new AxiosMockAdapter(apiClient.v2);

describe('Manager Links component', () => {
  it('renders a link correctly', () => {
    const { container } = render(<ManagerLink {...PROPS_LINK} />);
    const linkElement = container.querySelector('[label="Link"]');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveAttribute('is-disabled');
  });

  it('not renders a link when we have not the autorization', async () => {
    mockAdapter.onPost('/iam/resource/test/authorization/check').reply(200, []);

    const { container } = render(
      <ManagerLink urn="test" iamActions={['subscribe']} {...PROPS_LINK} />,
    );
    const linkElement = container.querySelector('[label="Link"]');
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
      expect(linkElement).toHaveAttribute('is-disabled', 'true');
    });
  });

  it('renders a link when we have the autorization', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    const { container } = render(
      <ManagerLink urn="test" iamActions={['subscribe']} {...PROPS_LINK} />,
    );
    const linkElement = container.querySelector('[label="Link"]');
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
      expect(linkElement).not.toHaveAttribute('is-disabled');
    });
  });

  it('renders a disabled link when we have the autorization but forced disabled', async () => {
    mockAdapter
      .onPost('/iam/resource/test/authorization/check')
      .reply(200, { authorizedActions: ['subscribe'] });

    const { container } = render(
      <ManagerLink
        urn="test"
        iamActions={['subscribe']}
        {...PROPS_LINK}
        isDisabled
      />,
    );
    const linkElement = container.querySelector('[label="Link"]');
    expect(linkElement).toBeInTheDocument();

    await waitFor(() => {
      expect(linkElement).toHaveAttribute('is-disabled', 'true');
    });
  });
});
