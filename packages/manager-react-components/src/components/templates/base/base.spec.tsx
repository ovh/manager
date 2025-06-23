import React from 'react';
import { useLocation } from 'react-router-dom';
import { vitest } from 'vitest';
import { render } from '@testing-library/react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsTable,
  OdsBadge,
} from '@ovhcloud/ods-components/react';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { BaseLayout } from './base.component';
import { GuideButton, GuideItem } from '../../navigation';
import { Notifications } from '../../notifications/Notifications.component';

// Mock react-router-dom's useLocation
vitest.mock('react-router-dom', () => ({
  useLocation: vitest.fn(),
}));

const listingTmpltProps = {
  breadcrumb: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem href="/vrack-services" label="Vrack Services" />
      <OdsBreadcrumbItem href="/vrs-abc-def-ghi" label="vrs-abc-def-ghi" />
    </OdsBreadcrumb>
  ),
  header: {
    title: 'Vrack Services',
    headerButton: (
      <GuideButton
        items={
          [
            {
              id: 1,
              href: 'https://www.ovh.com',
              target: '_blank',
              label: 'ovh.com',
            },
            {
              id: 2,
              href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
              target: '_blank',
              label: 'Guides OVH',
            },
          ] as GuideItem[]
        }
      />
    ),
  },
  description:
    'Description de la listing, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: <Notifications />,
  children: (
    <OdsTable>
      <table>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              id: 'user-t',
              name: 'user-t',
              description: 'Lorem ipsum dolor',
            },
            {
              id: 'user-n',
              name: 'user-n',
              description: 'Lorem ipsum dolor',
            },
            {
              id: 'user-x',
              name: 'user-x',
              description: 'Lorem ipsum dolor',
            },
            {
              id: 'user-y',
              name: 'user-y',
              description: 'Lorem ipsum dolor',
            },
          ].map((element) => (
            <tr key={element.id}>
              <td scope="row">{element.name}</td>
              <td scope="row">{element.description}</td>
              <td scope="row">
                <OdsBadge label="Ready" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </OdsTable>
  ),
  subtitle: '',
  backLinkLabel: '',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription: '',
};

describe('BaseLayout component', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    (useLocation as any).mockReturnValue({ pathname: '/home' });
  });

  it('renders base component correctly', async () => {
    render(<BaseLayout {...listingTmpltProps} />);
    await waitFor(() => {
      expect(screen.getByText('Vrack Services')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Description de la listing, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('clicks on back link triggers return fn', async () => {
    const backLinkLabel = 'back link';
    const spy = vitest.fn();

    render(
      <BaseLayout
        {...listingTmpltProps}
        backLinkLabel={backLinkLabel}
        onClickReturn={spy}
      />,
    );
    expect(screen.getByTestId('manager-back-link')).toBeInTheDocument();
    expect(screen.getByTestId('manager-back-link')).toBeVisible();
    fireEvent.click(screen.getByTestId('manager-back-link'));
    waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
