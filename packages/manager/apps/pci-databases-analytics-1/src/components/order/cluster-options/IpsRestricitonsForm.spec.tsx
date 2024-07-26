import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import IpsRestrictionsForm from '@/components/order/cluster-options/IpsRestrictionsForm.component';
import { mockedOrderFunnelIps } from '@/__tests__/helpers/mocks/order-funnel';
import * as database from '@/types/cloud/project/database';

describe('IpsRestrictionsForm component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display all element without IpRemoveButton', async () => {
    const onChange = vi.fn();
    render(
      <IpsRestrictionsForm onChange={onChange} disabled={false} value={[]} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ip-field-label')).toBeInTheDocument();
      expect(
        screen.getByTestId('ip-description-field-label'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ip-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('ip-add-button')).toBeInTheDocument();
      expect(
        screen.queryByTestId('ip-remove-button-0'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('configured-ips')).toBeInTheDocument();
    });
  });

  it('should display all element', async () => {
    const onChange = vi.fn();
    render(
      <IpsRestrictionsForm
        onChange={onChange}
        disabled={false}
        value={mockedOrderFunnelIps}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ip-field-label')).toBeInTheDocument();
      expect(
        screen.getByTestId('ip-description-field-label'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ip-input-field')).toBeInTheDocument();
      expect(
        screen.getByTestId('ip-description-input-field'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ip-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('ip-remove-button-0')).toBeInTheDocument();
      expect(screen.getByTestId('ip-remove-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('configured-ips')).toBeInTheDocument();
    });
  });

  it('should trigger onChange and Add an IP', async () => {
    let ipsList: database.IpRestrictionCreation[] = mockedOrderFunnelIps;
    const dom = (
      onChange: (newIp: database.IpRestrictionCreation[]) => void,
    ) => (
      <IpsRestrictionsForm
        onChange={onChange}
        disabled={false}
        value={ipsList}
      />
    );

    const mockOnChange = vi.fn((newIp: database.IpRestrictionCreation[]) => {
      ipsList = [...newIp];
    });

    const component = render(
      dom((newIps) => {
        mockOnChange(newIps);
        component.rerender(dom(() => {}));
      }),
    );
    const inputDescriptionIp = screen.getByTestId('ip-description-input-field');
    const inputIp = screen.getByTestId('ip-input-field');
    const addButton = screen.getByTestId('ip-add-button');

    act(() => {
      fireEvent.input(inputDescriptionIp, {
        target: {
          value: 'ip3',
        },
      });
      fireEvent.input(inputIp, {
        target: {
          value: '104.140.106.0/32',
        },
      });
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      expect(screen.getByText('104.140.106.0/32')).toBeInTheDocument();
      expect(inputDescriptionIp).toHaveValue('');
      expect(inputIp).toHaveValue('');
    });
  });

  it('should trigger onChange and remove an IP', async () => {
    let ipsList: database.IpRestrictionCreation[] = mockedOrderFunnelIps;
    const dom = (
      onChange: (newIp: database.IpRestrictionCreation[]) => void,
    ) => (
      <IpsRestrictionsForm
        onChange={onChange}
        disabled={false}
        value={ipsList}
      />
    );

    const mockOnChange = vi.fn((newIp: database.IpRestrictionCreation[]) => {
      ipsList = [...newIp];
    });

    const component = render(
      dom((newIps) => {
        mockOnChange(newIps);
        component.rerender(dom(() => {}));
      }),
    );
    const removeButton = screen.getByTestId('ip-remove-button-1');

    act(() => {
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      expect(
        screen.queryByText(mockedOrderFunnelIps[1].ip),
      ).not.toBeInTheDocument();
      expect(screen.getByText(mockedOrderFunnelIps[0].ip)).toBeInTheDocument();
      expect(screen.getByTestId('ip-remove-button-0')).toBeInTheDocument();
      expect(
        screen.queryByTestId('ip-remove-button-1'),
      ).not.toBeInTheDocument();
    });
  });
});
