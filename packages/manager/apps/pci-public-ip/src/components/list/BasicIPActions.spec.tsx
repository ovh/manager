import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TBasicIpRow } from '@/types/publicip.type';
import BasicIPActions from './BasicIPActions.component';

vi.mock('react-router-dom', () => ({
  useHref: (to: string) => `/resolved${to.replace('.', '')}`,
}));

const DELETE_LABEL = 'pci_additional_ips_delete';
const ATTACH_LABEL = 'pci_additional_ips_basic_ip_attach';
const DETACH_LABEL = 'pci_additional_ips_basic_ip_detach';

const buildRow = (
  isAttached: boolean,
  associatedResourceType = 'instance',
): TBasicIpRow => ({
  id: '203.0.113.42',
  ip: '203.0.113.42',
  ipVersion: 4,
  region: 'GRA11',
  associatedResourceId: isAttached ? 'instance-id' : '',
  associatedResourceType: isAttached ? associatedResourceType : '',
  associatedResourceName: isAttached ? 'my-instance' : '',
  isAttached,
  status: 'READY',
  search: '',
});

const renderActions = (
  isAttached: boolean,
  canEditAssociation: boolean,
  associatedResourceType = 'instance',
) =>
  render(
    <BasicIPActions
      basicIp={buildRow(isAttached, associatedResourceType)}
      canEditAssociation={canEditAssociation}
      onAttach={vi.fn()}
      onDetach={vi.fn()}
    />,
  );

const deleteButton = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('osds-button')).find((button) =>
    button.textContent?.includes(DELETE_LABEL),
  );

describe('BasicIPActions', () => {
  describe.each<{ case: string; isAttached: boolean; resourceType: string }>([
    { case: 'a parked address', isAttached: false, resourceType: '' },
    {
      case: 'an address attached to an instance',
      isAttached: true,
      resourceType: 'instance',
    },
    {
      case: 'an address carried by a gateway',
      isAttached: true,
      resourceType: 'gateway',
    },
  ])(
    'the api parts with $case, so its deletion is always offered',
    ({ isAttached, resourceType }) => {
      it.each([true, false])(
        'offers the deletion with the create-edit feature set to %s',
        (canEditAssociation) => {
          const { container } = renderActions(
            isAttached,
            canEditAssociation,
            resourceType,
          );

          expect(deleteButton(container)).not.toHaveAttribute('disabled');
        },
      );
    },
  );

  describe('without the create-edit feature', () => {
    it('offers no association action', () => {
      const { queryByText } = renderActions(false, false);

      expect(queryByText(ATTACH_LABEL)).not.toBeInTheDocument();
      expect(queryByText(DETACH_LABEL)).not.toBeInTheDocument();
    });
  });

  describe('with the create-edit feature', () => {
    it('offers to detach an attached ip', () => {
      const { getByText, queryByText } = renderActions(true, true);

      expect(getByText(DETACH_LABEL)).toBeInTheDocument();
      expect(queryByText(ATTACH_LABEL)).not.toBeInTheDocument();
    });

    it('offers to attach a detached ip', () => {
      const { getByText, queryByText } = renderActions(false, true);

      expect(getByText(ATTACH_LABEL)).toBeInTheDocument();
      expect(queryByText(DETACH_LABEL)).not.toBeInTheDocument();
    });
  });

  it('calls back with the ip when the association action is used', () => {
    const onDetach = vi.fn();
    const basicIp = buildRow(true);

    const { getByText } = render(
      <BasicIPActions
        basicIp={basicIp}
        canEditAssociation
        onAttach={vi.fn()}
        onDetach={onDetach}
      />,
    );

    getByText(DETACH_LABEL)
      .closest('osds-button')
      .click();

    expect(onDetach).toHaveBeenCalledWith(basicIp);
  });
});
