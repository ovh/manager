import { vi, expect, it, describe } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../../../test-utils';
import { urls } from '../../../../../routes/routes.constant';

vi.mock('@ovh-ux/manager-react-components', async (ogMod) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await ogMod();
  return {
    ...actual,
    Drawer: vi.fn(
      ({ heading, primaryButtonLabel, secondaryButtonLabel, children }) => (
        <div data-testid="drawer">
          <header>{heading}</header>
          <section>{children}</section>
          <footer>
            <button>{primaryButtonLabel}</button>
            <button>{secondaryButtonLabel}</button>
          </footer>
        </div>
      ),
    ),
  };
});

const config = {
  org: organizationList[0],
  vdc: datacentreList[0],
  labels: { ...labels.datacentresEdgeGateway, ...labels.actions },
  waitOptions: { timeout: 10_000 },
};
const content = {
  drawerElements: [
    config.labels.edge_add_title,
    config.labels.edge_add_input_name_label,
    config.labels.edge_ip_block,
  ],
  drawerButtons: [
    { label: config.labels.edge_add_submit },
    { label: config.labels.cancel },
  ],
};

describe('Datacentre Edge Gateway Add Page', () => {
  const initialRoute = urls.edgeGatewayAdd
    .replace(':id', config.org.id)
    .replace(':vdcId', config.vdc.id);

  it('access and display AddEdgeGateway page drawer', async () => {
    await renderTest({ initialRoute });

    // wait for drawer to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeVisible();
    }, config.waitOptions);

    const drawer = screen.getByTestId('drawer');

    // check drawer content
    content.drawerElements.forEach((el) =>
      expect(within(drawer).getByText(el)).toBeVisible(),
    );

    // check drawer buttons
    content.drawerButtons.forEach((btn) => {
      expect(
        within(drawer).getByRole('button', { name: btn.label }),
      ).toBeVisible();
    });
  });
});
