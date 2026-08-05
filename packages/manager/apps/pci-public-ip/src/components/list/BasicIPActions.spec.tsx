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

const buildRow = (isAttached: boolean): TBasicIpRow => ({
  id: '203.0.113.42',
  ip: '203.0.113.42',
  ipVersion: 4,
  region: 'GRA11',
  associatedResourceId: isAttached ? 'instance-id' : '',
  associatedResourceType: isAttached ? 'instance' : '',
  associatedResourceName: isAttached ? 'my-instance' : '',
  isAttached,
  status: 'READY',
  search: '',
});

const renderActions = (isAttached: boolean, canEditAssociation: boolean) =>
  render(
    <BasicIPActions
      basicIp={buildRow(isAttached)}
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
  describe('without the create-edit feature', () => {
    it('lets a detached ip be deleted', () => {
      const { container, queryByText } = renderActions(false, false);

      expect(deleteButton(container)).not.toHaveAttribute('disabled');
      expect(queryByText(ATTACH_LABEL)).not.toBeInTheDocument();
      expect(queryByText(DETACH_LABEL)).not.toBeInTheDocument();
    });

    it('prevents an attached ip from being deleted', () => {
      const { container } = renderActions(true, false);

      expect(deleteButton(container)).toHaveAttribute('disabled');
    });
  });

  describe('with the create-edit feature', () => {
    it('lets an attached ip be deleted and offers to detach it', () => {
      const { container, getByText } = renderActions(true, true);

      expect(deleteButton(container)).not.toHaveAttribute('disabled');
      expect(getByText(DETACH_LABEL)).toBeInTheDocument();
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
