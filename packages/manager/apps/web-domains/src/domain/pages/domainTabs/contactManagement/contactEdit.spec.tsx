import '@/common/setupTests';
import { vi, describe, it, beforeEach, expect, Mock } from 'vitest';
import {
  render,
  screen,
  fireEvent,
} from '@/common/utils/test.provider';
import { useParams } from 'react-router-dom';
import ContactEdit from './contactEdit';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import {
  useGetConfigurationRule,
  useUpdateContactMutation,
} from '@/domain/hooks/domainTabs/useContactEdit';
import { TConfigurationRuleField } from '@/domain/types/contactEdit';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainContact: vi.fn(),
}));

vi.mock('@/domain/hooks/domainTabs/useContactEdit', () => ({
  useGetConfigurationRule: vi.fn(),
  useUpdateContactMutation: vi.fn(),
}));

vi.mock('@/domain/components/ContactEdit/EditHolderFormField', () => ({
  default: ({
    rule,
    onFieldChange,
  }: {
    rule: TConfigurationRuleField;
    onFieldChange: (label: string, value: unknown) => void;
  }) => (
    <div data-testid={`form-field-${rule.label}`}>
      <button
        type="button"
        data-testid={`change-${rule.label}`}
        onClick={() => onFieldChange(rule.label, 'test-value')}
      >
        Form field: {rule.label}
      </button>
    </div>
  ),
}));

const mockUpdateContact = vi.fn();

const mockRules = {
  label: 'OWNER_CONTACT',
  fields: {
    and: [
      {
        label: 'legalForm',
        constraints: [
          { operator: 'required' },
          { operator: 'contains', values: ['individual', 'corporation'] },
        ],
      },
      {
        label: 'firstName',
        constraints: [{ operator: 'required' }],
      },
      {
        label: 'lastName',
        constraints: [{ operator: 'required' }],
      },
      {
        label: 'email',
        constraints: [{ operator: 'required' }],
      },
      {
        label: 'address.country',
        constraints: [
          { operator: 'required' },
          { operator: 'contains', values: ['FR', 'BE'] },
        ],
      },
    ] as TConfigurationRuleField[],
  },
};

const mockDomainContact = {
  id: 'contact-123',
  firstName: 'John',
  lastName: 'Doe',
  legalForm: 'individual',
  email: 'john@example.com',
  address: {
    country: 'FR',
    city: 'Paris',
    line1: '1 rue de Paris',
    zip: '75001',
  },
};

describe('ContactEdit Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({
      serviceName: 'example.com',
      holderId: 'contact-123',
    });
    (useGetDomainContact as Mock).mockReturnValue({
      domainContact: mockDomainContact,
      isFetchingDomainContact: false,
    });
    (useGetConfigurationRule as Mock).mockReturnValue({
      rules: mockRules,
      isRulesLoading: false,
    });
    (useUpdateContactMutation as Mock).mockReturnValue({
      updateContact: mockUpdateContact,
      isUpdateContactPending: false,
      updateContactError: null,
    });
  });

  describe('loading state', () => {
    it('should render spinner when fetching domain contact', () => {
      (useGetDomainContact as Mock).mockReturnValue({
        domainContact: null,
        isFetchingDomainContact: true,
      });

      render(<ContactEdit />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render spinner when loading rules', () => {
      (useGetConfigurationRule as Mock).mockReturnValue({
        rules: null,
        isRulesLoading: true,
      });

      render(<ContactEdit />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render nothing when domainContact is null', () => {
      (useGetDomainContact as Mock).mockReturnValue({
        domainContact: null,
        isFetchingDomainContact: false,
      });

      const { container } = render(<ContactEdit />);
      expect(container.querySelector('form')).not.toBeInTheDocument();
    });

    it('should render nothing when rules is null', () => {
      (useGetConfigurationRule as Mock).mockReturnValue({
        rules: null,
        isRulesLoading: false,
      });

      const { container } = render(<ContactEdit />);
      expect(container.querySelector('form')).not.toBeInTheDocument();
    });
  });

  describe('form rendering', () => {
    it('should render page title', () => {
      render(<ContactEdit />);
      expect(
        screen.getByText('domain_tab_CONTACT_edit_title'),
      ).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<ContactEdit />);
      expect(
        screen.getByText('domain_tab_CONTACT_edit_holder_description'),
      ).toBeInTheDocument();
    });

    it('should render form fields for each rule', () => {
      render(<ContactEdit />);
      expect(screen.getByTestId('form-field-firstName')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-lastName')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ContactEdit />);
      expect(
        screen.getByText('domain_tab_CONTACT_edit_form_submit_btn'),
      ).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(<ContactEdit />);
      expect(
        screen.getByText('domain_tab_CONTACT_edit_form_cancel_btn'),
      ).toBeInTheDocument();
    });
  });

  describe('readonly info message', () => {
    it('should render change holder link when there are readonly fields', () => {
      const rulesWithReadonly = {
        ...mockRules,
        fields: {
          and: [
            ...mockRules.fields.and,
            {
              label: 'organisationName',
              constraints: [
                { operator: 'required' },
                { operator: 'readonly' },
              ],
            },
          ],
        },
      };

      (useGetConfigurationRule as Mock).mockReturnValue({
        rules: rulesWithReadonly,
        isRulesLoading: false,
      });

      render(<ContactEdit />);
      expect(
        screen.getByText('domain_tab_CONTACT_edit_form_change_holder'),
      ).toBeInTheDocument();
    });
  });

  describe('hooks usage', () => {
    it('should call useGetDomainContact with holderId', () => {
      render(<ContactEdit />);
      expect(useGetDomainContact).toHaveBeenCalledWith('contact-123', {
        enabled: true,
      });
    });

    it('should call useGetConfigurationRule with update action', () => {
      render(<ContactEdit />);
      expect(useGetConfigurationRule).toHaveBeenCalledWith(
        'update',
        'example.com',
        { enabled: true },
      );
    });

    it('should call useUpdateContactMutation with correct params', () => {
      render(<ContactEdit />);
      expect(useUpdateContactMutation).toHaveBeenCalledWith(
        'contact-123',
        'example.com',
      );
    });
  });

  describe('form validation (invalidFields)', () => {
    const getSubmitButton = () =>
      screen
        .getByText('domain_tab_CONTACT_edit_form_submit_btn')
        .closest('button');

    it('should enable submit when all required non-readonly fields have values', () => {
      // mockDomainContact provides values for all required fields in mockRules.
      // Clicking a field change button sets isDirty = true.
      render(<ContactEdit />);

      fireEvent.click(screen.getByTestId('change-firstName'));

      expect(getSubmitButton()).not.toBeDisabled();
    });

    it('should disable submit when a required non-readonly field is empty', () => {
      // lastName is in FORCED_FIELDS (always required). Override it to be empty.
      (useGetDomainContact as Mock).mockReturnValue({
        domainContact: { ...mockDomainContact, lastName: '' },
        isFetchingDomainContact: false,
      });

      render(<ContactEdit />);

      fireEvent.click(screen.getByTestId('change-firstName'));

      expect(getSubmitButton()).toBeDisabled();
    });

    it('should not count a readonly field as invalid even when its value is empty', () => {
      // organisationName is required + readonly, but not present in the contact.
      // The READONLY fix must exclude it from invalidFields so the form stays valid.
      const rulesWithReadonlyRequired = {
        ...mockRules,
        fields: {
          and: [
            ...mockRules.fields.and,
            {
              label: 'organisationName',
              constraints: [
                { operator: 'required' },
                { operator: 'readonly' },
              ],
            } as TConfigurationRuleField,
          ],
        },
      };

      (useGetConfigurationRule as Mock).mockReturnValue({
        rules: rulesWithReadonlyRequired,
        isRulesLoading: false,
      });

      render(<ContactEdit />);

      // organisationName is not in mockDomainContact → formValues.organisationName is empty.
      // Despite being required, it is readonly → must NOT appear in invalidFields.
      fireEvent.click(screen.getByTestId('change-firstName'));

      expect(getSubmitButton()).not.toBeDisabled();
    });
  });
});
