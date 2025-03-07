import { render, renderHook } from '@testing-library/react';
import UserInformationTile from './UserInformationTile.component';

describe('UserInformationTile tests', () => {
  it('Should match snapshot', () => {
    const props = {
      title: <p>a custom title</p>,
      username: 'username',
      description: 'just a description',
      accessKey: 'an accessKey',
      secret: 'a secret secret',
    };

    const { container } = render(<UserInformationTile {...props} />);

    expect(container).toMatchSnapshot();
  });
});
