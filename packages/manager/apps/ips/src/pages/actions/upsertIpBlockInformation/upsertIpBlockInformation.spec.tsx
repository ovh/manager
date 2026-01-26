import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock router
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...(actual as any),
    useNavigate: () => navigateMock,
    useParams: () => ({ id: '1.2.3.0/24' }),
    useSearchParams: () => [new URLSearchParams('')],
  };
});

// Mock Modal and notifications from muk
const addSuccessMock = vi.fn();
const addErrorMock = vi.fn();
const clearNotificationsMock = vi.fn();
vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    useNotifications: () => ({
      addSuccess: addSuccessMock,
      addError: addErrorMock,
      clearNotifications: clearNotificationsMock,
    }),
    Modal: (props: any) => (
      <div>
        <div data-testid="modal-heading">{props.heading}</div>
        <button
          data-testid="confirm-button"
          onClick={() => props.primaryButton?.onClick?.()}
        >
          {props.primaryButton?.label}
        </button>
        <button
          data-testid="cancel-button"
          onClick={() => props.secondaryButton?.onClick?.()}
        >
          {props.secondaryButton?.label}
        </button>
        <div>{props.children}</div>
      </div>
    ),
  };
});

// Mock ODS components used in the modal
vi.mock('@ovhcloud/ods-react', () => ({
  FormField: (p: any) => <div>{p.children}</div>,
  FormFieldLabel: (p: any) => <label>{p.children}</label>,
  Input: (p: any) => (
    <input
      data-testid={p.name}
      value={p.value}
      onChange={(e) => p.onChange && p.onChange(e)}
      disabled={p.disabled}
    />
  ),
  Textarea: (p: any) => (
    <textarea
      data-testid={p.name}
      value={p.value}
      onChange={(e) => p.onChange && p.onChange(e)}
      disabled={p.disabled}
    />
  ),
  Select: (p: any) => (
    <select
      data-testid={p.name}
      value={p.value?.[0] || ''}
      onChange={(e) =>
        p.onValueChange && p.onValueChange({ value: [e.target.value] })
      }
      disabled={p.disabled}
    >
      {(p.items || []).map((it: any) => (
        <option key={it.value} value={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  ),
  Text: (p: any) => <div>{p.children}</div>,
  Message: (p: any) => <div>{p.children}</div>,
  MessageBody: (p: any) => <div>{p.children}</div>,
  SelectContent: (p: any) => <div />,
  SelectControl: (p: any) => <div />,
  TEXT_PRESET: {},
  MESSAGE_COLOR: {},
}));

// Mock react-query hooks: useMutation and useQueryClient
const upsertRipeMutate = vi.fn();
const changeOrgMutate = vi.fn();
const invalidateQueriesMock = vi.fn();

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<any>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: (opts: any) => {
      // return a mutate function that calls the provided onSuccess synchronously
      if (
        opts?.mutationFn?.name === 'upsertIpRipeInformation' ||
        opts?.mutationFn?.toString().includes('upsertIpRipeInformation')
      ) {
        return {
          mutate: () => {
            opts.onSuccess && opts.onSuccess();
            upsertRipeMutate();
          },
          isPending: false,
        };
      }
      return {
        mutate: () => {
          opts.onSuccess && opts.onSuccess();
          changeOrgMutate();
        },
        isPending: false,
      };
    },
    useQueryClient: () => ({ invalidateQueries: invalidateQueriesMock }),
  };
});

// Mock data hooks
vi.mock('@/data/hooks', async () => ({
  useGetIpRipeInformation: () => ({
    ipRipeInfo: { netname: 'NET-NAME', description: 'DESC' },
    loading: false,
  }),
  useGetOrganisationsList: () => ({
    organisations: ['ripe_org1', 'arin_org2'],
    loading: false,
  }),
  useGetIpOrganisation: () => ({
    organisationId: 'ripe_org1',
    rirForOrganisation: 'RIPE',
    hasOnGoingChangeRipeOrgTask: false,
    loading: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original = await importOriginal<any>();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

import UpsertIpBlockInformation from './upsertIpBlockInformation.page';

describe('UpsertIpBlockInformation modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial values from hooks', () => {
    render(<UpsertIpBlockInformation />);

    expect(screen.getByTestId('modal-heading')).toBeDefined();
    const netname = screen.getByTestId('netname') as HTMLInputElement;
    const description = screen.getByTestId(
      'description',
    ) as HTMLTextAreaElement;
    const select = screen.getByTestId('organisation') as HTMLSelectElement;

    expect(netname.value).toBe('NET-NAME');
    expect(description.value).toBe('DESC');
    expect(select.value).toBe('ripe_org1');
  });

  it('calls mutations on confirm when fields changed', async () => {
    render(<UpsertIpBlockInformation />);

    const netname = screen.getByTestId('netname') as HTMLInputElement;
    const description = screen.getByTestId(
      'description',
    ) as HTMLTextAreaElement;
    const select = screen.getByTestId('organisation') as HTMLSelectElement;

    // change values
    fireEvent.change(netname, { target: { value: 'NET-NAME-NEW' } });
    fireEvent.change(description, { target: { value: 'DESC-NEW' } });
    fireEvent.change(select, { target: { value: 'arin_org2' } });

    // click confirm
    const confirm = screen.getByTestId('confirm-button');
    fireEvent.click(confirm);

    await waitFor(() => {
      expect(upsertRipeMutate).toHaveBeenCalled();
      expect(changeOrgMutate).toHaveBeenCalled();
      expect(addSuccessMock).toHaveBeenCalled();
      expect(invalidateQueriesMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalled();
    });
  });
});
