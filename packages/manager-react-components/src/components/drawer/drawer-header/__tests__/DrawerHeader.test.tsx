import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { render } from '@testing-library/react';
import { DrawerHeader } from '../DrawerHeader.component';

it('should display the title', async () => {
  render(<DrawerHeader title="Drawer header title" />);

  await assertTextVisibility('Drawer header title');
});
