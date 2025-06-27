import { render } from '@testing-library/react';
import UserInformationTile from './UserInformationTile.component';

describe('UserInformationTile tests', () => {
  it('should find text', () => {
    const props = {
      title: <p>a custom title</p>,
      username: 'username',
      description: 'just a description',
      accessKey: 'an accessKey',
      secret: 'a secret secret',
      trackingPrefix: 'a tracking prefix',
    };

    const { getByText } = render(<UserInformationTile {...props} />);

    expect(
      getByText(
        'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
      ),
    ).toBeDefined();

    expect(getByText('a custom title')).toBeDefined();
  });
});
