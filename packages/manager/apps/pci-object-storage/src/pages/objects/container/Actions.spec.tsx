import { render } from '@testing-library/react';
import { describe } from 'vitest';
import { Actions } from './Actions';
import { TStorage } from '@/api/data/storages';
import { wrapper } from '@/wrapperRenders';

describe('Actions', () => {
  it('Action sould displayed', () => {
    const storage = {
      id: 'id',
      name: 'name',
      containerType: 'public',
      region: 'region',
      s3StorageType: 's3StorageType',
      deploymentMode: 'deploymentMode',
    } as TStorage;
    const { container } = render(
      <Actions storage={storage} isEmptyUsers={false} />,
      { wrapper },
    );
    expect(container).toMatchSnapshot();
  });
});
