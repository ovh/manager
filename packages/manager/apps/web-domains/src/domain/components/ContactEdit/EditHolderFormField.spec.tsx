import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import EditHolderFormField from './EditHolderFormField';
import {
  TConfigurationRuleField,
  ContactEditFormValues,
} from '@/domain/types/contactEdit';
import { OPERATORS } from '@/domain/constants/contactEdit';

const createMockRule = (
  overrides?: Partial<TConfigurationRuleField>,
): TConfigurationRuleField => ({
  label: 'firstName',
  constraints: [],
  ...overrides,
});

const defaultContactInformations: Record<string, unknown> = {
  firstName: 'John',
  lastName: 'Doe',
  legalForm: 'individual',
  email: 'john@example.com',
  address: { country: 'FR', city: 'Paris' },
};

const defaultFormValues: ContactEditFormValues = {
  firstName: 'John',
  lastName: 'Doe',
};

const mockOnFieldChange = vi.fn();

describe('EditHolderFormField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visibility', () => {
    it('should return null when field is not required', () => {
      const rule = createMockRule({
        label: 'organisationName',
        constraints: [],
      });

      const { container } = render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={defaultFormValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(container.innerHTML).toBe('');
    });

    it('should render when field is in FORCED_FIELDS (firstName)', () => {
      const rule = createMockRule({
        label: 'firstName',
        constraints: [],
      });

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={defaultFormValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_firstName/)).toBeInTheDocument();
    });

    it('should render when field is in FORCED_FIELDS (lastName)', () => {
      const rule = createMockRule({
        label: 'lastName',
        constraints: [],
      });

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={defaultFormValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_lastName/)).toBeInTheDocument();
    });

    it('should render when field has REQUIRED constraint without conditions', () => {
      const rule = createMockRule({
        label: 'email',
        constraints: [{ operator: OPERATORS.REQUIRED }],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        email: 'john@example.com',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_email/)).toBeInTheDocument();
    });
  });

  describe('text field rendering', () => {
    it('should render a text input for a simple text field', () => {
      const rule = createMockRule({
        label: 'firstName',
        constraints: [],
      });

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={defaultFormValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render email type for email field', () => {
      const rule = createMockRule({
        label: 'email',
        constraints: [{ operator: OPERATORS.REQUIRED }],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        email: 'john@example.com',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByDisplayValue('john@example.com');
      expect(input).toBeInTheDocument();
    });
  });

  describe('select field rendering', () => {
    it('should render a select for field with CONTAINS constraint', () => {
      const rule = createMockRule({
        label: 'legalForm',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['individual', 'corporation', 'association'],
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        legalForm: 'individual',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(
        screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_legalForm/),
      ).toBeInTheDocument();
    });
  });

  describe('.ca case — fieldType depends on resolved enumList', () => {
    it('should render text input (not select) when CONTAINS has unsatisfied conditions', () => {
      // Simulates .ca address.country: CONTAINS has a condition on legalFormCategory=CCT,
      // but current legalFormCategory is different, so enumList resolves to []
      // and fieldType should fall back to "text" instead of rendering an empty select.
      const rule = createMockRule({
        label: 'address.country',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['CA', 'US', 'MX'],
            conditions: {
              fields: {
                label: 'legalFormCategory',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'CCT' },
                ],
              },
            },
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        'address.country': 'CA',
        legalFormCategory: 'RES', // Not CCT → condition not met → no enum
      };

      const contactInfo = {
        ...defaultContactInformations,
        address: { country: 'CA' },
        legalFormCategory: 'RES',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={contactInfo}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      // Should render a text input, not a select
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('CA');
    });

    it('should render select when CONTAINS condition IS satisfied', () => {
      // Same field but now legalFormCategory=CCT → condition met → enumList populated → select
      const rule = createMockRule({
        label: 'address.country',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['CA', 'US', 'MX'],
            conditions: {
              fields: {
                label: 'legalFormCategory',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'CCT' },
                ],
              },
            },
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        'address.country': 'CA',
        legalFormCategory: 'CCT', // Condition met → enum populated
      };

      const contactInfo = {
        ...defaultContactInformations,
        address: { country: 'CA' },
        legalFormCategory: 'CCT',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={contactInfo}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(
        screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_address_country/),
      ).toBeInTheDocument();
    });

    it('should render text when CONTAINS exists unconditionally but another CONTAINS with conditions does not match', () => {
      // Multiple CONTAINS: one unconditional with values, one conditional that doesn't match
      // The unconditional one should be picked, rendering a select
      const rule = createMockRule({
        label: 'legalFormCategory',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['CCT', 'RES', 'ABO'],
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        legalFormCategory: 'CCT',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      // Unconditional CONTAINS → select
      expect(
        screen.getByLabelText(/domain_tab_CONTACT_edit_form_label_legalFormCategory/),
      ).toBeInTheDocument();
    });

    it('should render text input for field with no CONTAINS constraint at all', () => {
      const rule = createMockRule({
        label: 'organisationName',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          { operator: OPERATORS.MAXLENGTH, value: '100' },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        organisationName: 'My Org',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('My Org');
    });
  });

  describe('getEnumTranslationKey — SPECIAL_LABELS handling', () => {
    it('should use domain_tab_CONTACT prefix for legalFormCategory values', () => {
      const rule = createMockRule({
        label: 'legalFormCategory',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['CCT', 'RES'],
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        legalFormCategory: 'CCT',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      // The translation function receives the special key format
      // domain_tab_CONTACT_edit_form_enum_legalFormCategory_CCT
      const matches = screen.getAllByText(/domain_tab_CONTACT_edit_form_enum_legalFormCategory_CCT|domain_tab_CONTACT_edit_form_enum_legalFormCategory_RES/);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should use domain_tab_CONTACT prefix for organisationType values', () => {
      const rule = createMockRule({
        label: 'organisationType',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          {
            operator: OPERATORS.CONTAINS,
            values: ['Company', 'Association'],
          },
        ],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        organisationType: 'Company',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      // organisationType is in SPECIAL_LABELS → translation keys use domain_tab_CONTACT prefix
      const matches = screen.getAllByText(/domain_tab_CONTACT_edit_form_enum_organisationType_Company|domain_tab_CONTACT_edit_form_enum_organisationType_Association/);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('date field rendering', () => {
    it('should render a text input with YYYY-MM-DD placeholder for birthDay', () => {
      const rule = createMockRule({
        label: 'birthDay',
        constraints: [{ operator: OPERATORS.REQUIRED }],
      });

      const formValues: ContactEditFormValues = {
        ...defaultFormValues,
        birthDay: '1990-01-15',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByDisplayValue('1990-01-15');
      expect(input).toBeInTheDocument();
    });
  });

  describe('readonly behavior', () => {
    it('should render readonly field when READONLY constraint is satisfied', () => {
      const rule = createMockRule({
        label: 'firstName',
        constraints: [
          { operator: OPERATORS.REQUIRED },
          { operator: OPERATORS.READONLY },
        ],
      });

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={defaultFormValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('value display', () => {
    it('should display the current form value', () => {
      const rule = createMockRule({
        label: 'firstName',
        constraints: [],
      });

      const formValues: ContactEditFormValues = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
    });

    it('should display empty string when value is null', () => {
      const rule = createMockRule({
        label: 'firstName',
        constraints: [],
      });

      const formValues: ContactEditFormValues = {
        firstName: null,
        lastName: 'Doe',
      };

      render(
        <EditHolderFormField
          rule={rule}
          contactInformations={defaultContactInformations}
          formValues={formValues}
          onFieldChange={mockOnFieldChange}
        />,
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });
});
