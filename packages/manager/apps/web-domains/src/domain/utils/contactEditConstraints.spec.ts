import { describe, expect, it } from 'vitest';
import {
  getDescendantProp,
  fieldCurrentValue,
  checkConstraint,
  isConstraintSatisfied,
  findMatchingConstraint,
} from './contactEditConstraints';
import {
  TConfigurationRuleConstraint,
  ContactEditFormValues,
} from '@/domain/types/contactEdit';
import { OPERATORS } from '@/domain/constants/contactEdit';

describe('contactEditConstraints utilities', () => {
  describe('getDescendantProp', () => {
    it('should return a top-level property', () => {
      const obj = { firstName: 'John' };
      expect(getDescendantProp(obj, 'firstName')).toBe('John');
    });

    it('should return a nested property using dot notation', () => {
      const obj = { address: { city: 'Paris', country: 'FR' } };
      expect(getDescendantProp(obj, 'address.city')).toBe('Paris');
      expect(getDescendantProp(obj, 'address.country')).toBe('FR');
    });

    it('should return undefined for a non-existent property', () => {
      const obj = { firstName: 'John' };
      expect(getDescendantProp(obj, 'lastName')).toBeUndefined();
    });

    it('should return undefined for a non-existent nested property', () => {
      const obj = { address: { city: 'Paris' } };
      expect(getDescendantProp(obj, 'address.zip')).toBeUndefined();
    });

    it('should handle null intermediate values gracefully', () => {
      const obj = { address: null } as unknown as Record<string, unknown>;
      expect(getDescendantProp(obj, 'address.city')).toBeNull();
    });

    it('should handle undefined intermediate values gracefully', () => {
      const obj = {} as Record<string, unknown>;
      expect(getDescendantProp(obj, 'address.city')).toBeUndefined();
    });

    it('should return the whole object if desc is a single key pointing to an object', () => {
      const obj = { address: { city: 'Paris' } };
      expect(getDescendantProp(obj, 'address')).toEqual({ city: 'Paris' });
    });
  });

  describe('fieldCurrentValue', () => {
    const contactInformations: Record<string, unknown> = {
      firstName: 'John',
      lastName: 'Doe',
      address: { city: 'Paris', country: 'FR' },
    };

    it('should return value from formValues when present', () => {
      const formValues: ContactEditFormValues = { firstName: 'Jane' };
      expect(
        fieldCurrentValue('firstName', formValues, contactInformations, 'firstName'),
      ).toBe('Jane');
    });

    it('should fall back to contactInformations when formValues value is null', () => {
      const formValues: ContactEditFormValues = { firstName: null };
      expect(
        fieldCurrentValue('firstName', formValues, contactInformations, 'firstName'),
      ).toBe('John');
    });

    it('should extract key from TTranslatedEnum object', () => {
      const formValues: ContactEditFormValues = {
        legalForm: { key: 'individual', translated: 'Particulier' },
      };
      expect(
        fieldCurrentValue('legalForm', formValues, contactInformations, 'legalForm'),
      ).toBe('individual');
    });

    it('should handle Date values by returning ISO date string', () => {
      const date = new Date('2000-01-15T00:00:00.000Z');
      const formValues: ContactEditFormValues = { birthDay: date };
      expect(
        fieldCurrentValue('birthDay', formValues, contactInformations, 'birthDay'),
      ).toBe('2000-01-15');
    });

    it('should return empty string when neither formValues nor contactInformations have the field', () => {
      const formValues: ContactEditFormValues = {};
      expect(
        fieldCurrentValue('unknownField', formValues, contactInformations, 'unknownField'),
      ).toBe('');
    });
  });

  describe('checkConstraint', () => {
    const contactInformations: Record<string, unknown> = {
      legalForm: 'individual',
      address: { country: 'FR' },
    };

    it('should return true when EQ constraint matches with value', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.EQ,
        value: 'individual',
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(true);
    });

    it('should return false when EQ constraint does not match', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.EQ,
        value: 'corporation',
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(false);
    });

    it('should return true when EQ constraint matches with values array', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.EQ,
        values: ['individual', 'corporation'],
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(true);
    });

    it('should return false when EQ constraint does not match values array', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.EQ,
        values: ['corporation', 'association'],
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(false);
    });

    it('should return true when NE constraint does not match value (not equal)', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.NE,
        value: 'corporation',
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(true);
    });

    it('should return false when NE constraint matches value', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.NE,
        value: 'individual',
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(false);
    });

    it('should return true when CONTAINS constraint matches with values array', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.CONTAINS,
        values: ['FR', 'BE', 'DE'],
      };
      const formValues: ContactEditFormValues = { 'address.country': 'FR' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'address.country'),
      ).toBe(true);
    });

    it('should return false when CONTAINS constraint does not match values array', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.CONTAINS,
        values: ['BE', 'DE'],
      };
      const formValues: ContactEditFormValues = { 'address.country': 'FR' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'address.country'),
      ).toBe(false);
    });

    it('should return true when CONTAINS constraint matches substring', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.CONTAINS,
        value: 'indiv',
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'legalForm'),
      ).toBe(true);
    });

    it('should return true when NOTCONTAINS constraint does not match', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.NOTCONTAINS,
        values: ['BE', 'DE'],
      };
      const formValues: ContactEditFormValues = { 'address.country': 'FR' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'address.country'),
      ).toBe(true);
    });

    it('should return false when NOTCONTAINS constraint matches', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.NOTCONTAINS,
        values: ['FR', 'DE'],
      };
      const formValues: ContactEditFormValues = { 'address.country': 'FR' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'address.country'),
      ).toBe(false);
    });

    it('should return true when no EQ/NE/CONTAINS/NOTCONTAINS/EMPTY/NOTEMPTY operators', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
      };
      const formValues: ContactEditFormValues = {};
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(true);
    });

    describe('EMPTY operator', () => {
      it('should return true when field value is empty', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.EMPTY,
        };
        const formValues: ContactEditFormValues = { vat: '' };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(true);
      });

      it('should return true when field value is null', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.EMPTY,
        };
        const formValues: ContactEditFormValues = { vat: null };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(true);
      });

      it('should return false when field has a value', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.EMPTY,
        };
        const formValues: ContactEditFormValues = { vat: 'FR12345678' };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(false);
      });
    });

    describe('NOTEMPTY operator', () => {
      it('should return true when field has a value', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.NOTEMPTY,
        };
        const formValues: ContactEditFormValues = { vat: 'FR12345678' };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(true);
      });

      it('should return false when field value is empty', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.NOTEMPTY,
        };
        const formValues: ContactEditFormValues = { vat: '' };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(false);
      });

      it('should return false when field value is null', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.NOTEMPTY,
        };
        const formValues: ContactEditFormValues = { vat: null };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'vat'),
        ).toBe(false);
      });
    });

    describe('foo.ie case: companyNationalIdentificationNumber + vat with EMPTY AND', () => {
      it('should require companyNationalId when legalForm != individual AND vat is empty', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'vat',
                  constraints: [
                    { operator: OPERATORS.EMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'corporation',
          vat: '',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'companyNationalIdentificationNumber'),
        ).toBe(true);
      });

      it('should NOT require companyNationalId when legalForm != individual AND vat is filled', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'vat',
                  constraints: [
                    { operator: OPERATORS.EMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'corporation',
          vat: 'IE1234567X',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'companyNationalIdentificationNumber'),
        ).toBe(false);
      });

      it('should NOT require companyNationalId when legalForm = individual', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'vat',
                  constraints: [
                    { operator: OPERATORS.EMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'individual',
          vat: '',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'companyNationalIdentificationNumber'),
        ).toBe(false);
      });
    });

    it('should handle constraint with conditions.fields', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
            ],
          },
        },
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(true);
    });

    it('should return false when conditions.fields constraint is not satisfied', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'corporation' },
            ],
          },
        },
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        checkConstraint(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(false);
    });

    describe('conditions.fields.and (API AND pattern)', () => {
      it('should return true for nationalIdentificationNumber when legalForm=individual AND nationality=FI', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'FI' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'individual',
          nationality: 'FI',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'nationalIdentificationNumber'),
        ).toBe(true);
      });

      it('should return false for nationalIdentificationNumber when nationality is NOT FI', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'FI' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'individual',
          nationality: 'FR',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'nationalIdentificationNumber'),
        ).toBe(false);
      });

      it('should return false for nationalIdentificationNumber when legalForm is NOT individual', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'FI' },
                    { operator: OPERATORS.NOTEMPTY },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'corporation',
          nationality: 'FI',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'nationalIdentificationNumber'),
        ).toBe(false);
      });

      it('should return true for birthDay when legalForm=individual AND nationality!=FI', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'FI' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'individual',
          nationality: 'FR',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'birthDay'),
        ).toBe(true);
      });

      it('should return false for birthDay when nationality=FI (Finnish)', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'FI' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'individual',
          nationality: 'FI',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'birthDay'),
        ).toBe(false);
      });

      it('should return false for birthDay when legalForm is NOT individual', () => {
        const constraint: TConfigurationRuleConstraint = {
          operator: OPERATORS.REQUIRED,
          conditions: {
            fields: {
              and: [
                {
                  label: 'legalForm',
                  constraints: [
                    { operator: OPERATORS.EQ, value: 'individual' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
                {
                  label: 'nationality',
                  constraints: [
                    { operator: OPERATORS.NE, value: 'FI' },
                    { operator: OPERATORS.REQUIRED },
                  ],
                },
              ],
              constraints: [],
            },
          },
        };
        const formValues: ContactEditFormValues = {
          legalForm: 'corporation',
          nationality: 'FR',
        };
        expect(
          checkConstraint(constraint, formValues, contactInformations, 'birthDay'),
        ).toBe(false);
      });
    });
  });

  describe('isConstraintSatisfied', () => {
    const contactInformations: Record<string, unknown> = {
      legalForm: 'individual',
    };

    it('should return true when constraint has no conditions', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
      };
      expect(
        isConstraintSatisfied(constraint, {}, contactInformations, 'firstName'),
      ).toBe(true);
    });

    it('should return true when all AND conditions are satisfied', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
        conditions: {
          and: [
            {
              fields: {
                operator: OPERATORS.EQ,
                value: 'individual',
                conditions: {
                  fields: {
                    label: 'legalForm',
                    constraints: [
                      { operator: OPERATORS.EQ, value: 'individual' },
                    ],
                  },
                },
              },
            },
          ],
          fields: {
            label: 'legalForm',
            constraints: [{ operator: OPERATORS.EQ, value: 'individual' }],
          },
        },
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        isConstraintSatisfied(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(true);
    });

    it('should return false when one AND condition is not satisfied', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
        conditions: {
          and: [
            {
              fields: {
                operator: OPERATORS.EQ,
                value: 'corporation',
                conditions: {
                  fields: {
                    label: 'legalForm',
                    constraints: [
                      { operator: OPERATORS.EQ, value: 'corporation' },
                    ],
                  },
                },
              },
            },
          ],
          fields: {
            label: 'legalForm',
            constraints: [{ operator: OPERATORS.EQ, value: 'individual' }],
          },
        },
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        isConstraintSatisfied(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(false);
    });

    it('should delegate to checkConstraint when conditions exist without AND', () => {
      const constraint: TConfigurationRuleConstraint = {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [{ operator: OPERATORS.EQ, value: 'individual' }],
          },
        },
      };
      const formValues: ContactEditFormValues = { legalForm: 'individual' };
      expect(
        isConstraintSatisfied(constraint, formValues, contactInformations, 'firstName'),
      ).toBe(true);
    });
  });

  describe('.be domain — readonly constraints (real API shape)', () => {
    // These tests use the exact constraint shapes returned by the API for .be domains.
    // The readonly constraint for firstName uses conditions.and with two items:
    //   1. legalForm must be "individual"
    //   2. firstName must already have a value (required = non-empty)

    const firstNameReadonlyConstraint: TConfigurationRuleConstraint = {
      operator: OPERATORS.READONLY,
      conditions: {
        and: [
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'legalForm',
              constraints: [
                { operator: OPERATORS.EQ, value: 'individual' },
                { operator: OPERATORS.REQUIRED },
              ],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'firstName',
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        ],
        fields: {
          label: 'legalForm',
          constraints: [{ operator: OPERATORS.EQ, value: 'individual' }],
        },
      },
    };

    const lastNameReadonlyConstraint: TConfigurationRuleConstraint = {
      operator: OPERATORS.READONLY,
      conditions: {
        and: [
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'legalForm',
              constraints: [
                { operator: OPERATORS.EQ, value: 'individual' },
                { operator: OPERATORS.REQUIRED },
              ],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'lastName',
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        ],
        fields: {
          label: 'legalForm',
          constraints: [{ operator: OPERATORS.EQ, value: 'individual' }],
        },
      },
    };

    // The email constraint from .be API has NO readonly operator — only required + a
    // condition block without operator (which must NOT be treated as readonly).
    const emailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'email',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      },
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    it('firstName should be readonly for individual with existing value', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'individual',
        firstName: 'Jean',
      };
      const contactInfo = { legalForm: 'individual', firstName: 'Jean' };
      expect(
        isConstraintSatisfied(firstNameReadonlyConstraint, formValues, contactInfo, 'firstName'),
      ).toBe(true);
    });

    it('firstName should NOT be readonly for corporation', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'corporation',
        firstName: 'Jean',
      };
      const contactInfo = { legalForm: 'corporation', firstName: 'Jean' };
      expect(
        isConstraintSatisfied(firstNameReadonlyConstraint, formValues, contactInfo, 'firstName'),
      ).toBe(false);
    });

    it('firstName should NOT be readonly for individual when firstName is empty', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'individual',
        firstName: '',
      };
      const contactInfo: Record<string, unknown> = { legalForm: 'individual' };
      expect(
        isConstraintSatisfied(firstNameReadonlyConstraint, formValues, contactInfo, 'firstName'),
      ).toBe(false);
    });

    it('lastName should be readonly for individual with existing value', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'individual',
        lastName: 'Dupont',
      };
      const contactInfo = { legalForm: 'individual', lastName: 'Dupont' };
      expect(
        isConstraintSatisfied(lastNameReadonlyConstraint, formValues, contactInfo, 'lastName'),
      ).toBe(true);
    });

    it('lastName should NOT be readonly for corporation', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'corporation',
        lastName: 'Dupont',
      };
      const contactInfo = { legalForm: 'corporation', lastName: 'Dupont' };
      expect(
        isConstraintSatisfied(lastNameReadonlyConstraint, formValues, contactInfo, 'lastName'),
      ).toBe(false);
    });

    it('email should NOT have a readonly constraint (findMatchingConstraint returns undefined)', () => {
      const formValues: ContactEditFormValues = {
        legalForm: 'individual',
        email: 'test@ovh.com',
      };
      const contactInfo = { legalForm: 'individual', email: 'test@ovh.com' };
      expect(
        findMatchingConstraint(emailConstraints, OPERATORS.READONLY, formValues, contactInfo, 'email'),
      ).toBeUndefined();
    });

    it('findMatchingConstraint should find readonly for firstName (individual + existing)', () => {
      const constraints: TConfigurationRuleConstraint[] = [
        { operator: OPERATORS.REQUIRED },
        firstNameReadonlyConstraint,
        { operator: OPERATORS.MAXLENGTH, value: '255' },
      ];
      const formValues: ContactEditFormValues = {
        legalForm: 'individual',
        firstName: 'Jean',
      };
      const contactInfo = { legalForm: 'individual', firstName: 'Jean' };
      expect(
        findMatchingConstraint(constraints, OPERATORS.READONLY, formValues, contactInfo, 'firstName'),
      ).toBeDefined();
    });

    it('findMatchingConstraint should NOT find readonly for firstName (corporation)', () => {
      const constraints: TConfigurationRuleConstraint[] = [
        { operator: OPERATORS.REQUIRED },
        firstNameReadonlyConstraint,
        { operator: OPERATORS.MAXLENGTH, value: '255' },
      ];
      const formValues: ContactEditFormValues = {
        legalForm: 'corporation',
        firstName: 'Jean',
      };
      const contactInfo = { legalForm: 'corporation', firstName: 'Jean' };
      expect(
        findMatchingConstraint(constraints, OPERATORS.READONLY, formValues, contactInfo, 'firstName'),
      ).toBeUndefined();
    });
  });

  describe('.fr domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .fr OWNER_CONTACT configurationRules API response.

    // --- firstName: required(condition: legalForm != corporation), readonly(condition: AND), maxlength ---
    const firstNameRequiredCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.REQUIRED,
      conditions: {
        fields: {
          label: 'legalForm',
          constraints: [
            { operator: OPERATORS.NE, value: 'corporation' },
            { operator: OPERATORS.REQUIRED },
          ],
        },
      },
    } as TConfigurationRuleConstraint;

    const firstNameReadonlyCondition = {
      operator: OPERATORS.READONLY,
      conditions: {
        and: [
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'legalForm',
              constraints: [
                { operator: OPERATORS.EQ, value: 'individual' },
                { operator: OPERATORS.REQUIRED },
              ],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'firstName',
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        ],
        constraints: [],
      },
    } as unknown as TConfigurationRuleConstraint;

    const firstNameAllConstraints: TConfigurationRuleConstraint[] = [
      firstNameRequiredCondition,
      firstNameReadonlyCondition,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required(condition: legalForm != corporation), readonly(condition: AND), maxlength ---
    const lastNameRequiredCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.REQUIRED,
      conditions: {
        fields: {
          label: 'legalForm',
          constraints: [
            { operator: OPERATORS.NE, value: 'corporation' },
            { operator: OPERATORS.REQUIRED },
          ],
        },
      },
    } as TConfigurationRuleConstraint;

    const lastNameReadonlyCondition = {
      operator: OPERATORS.READONLY,
      conditions: {
        and: [
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'legalForm',
              constraints: [
                { operator: OPERATORS.EQ, value: 'individual' },
                { operator: OPERATORS.REQUIRED },
              ],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
          {
            label: 'OWNER_CONTACT',
            type: 'contact',
            fields: {
              label: 'lastName',
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        ],
        constraints: [],
      },
    } as unknown as TConfigurationRuleConstraint;

    const lastNameAllConstraints: TConfigurationRuleConstraint[] = [
      lastNameRequiredCondition,
      lastNameReadonlyCondition,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- legalForm: contains, required, readonly(condition: value in list), maxlength ---
    const legalFormReadonlyCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.READONLY,
      conditions: {
        fields: {
          label: 'legalForm',
          constraints: [
            { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
            { operator: OPERATORS.REQUIRED },
          ],
        },
      },
    } as TConfigurationRuleConstraint;

    const legalFormAllConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
      { operator: OPERATORS.REQUIRED },
      legalFormReadonlyCondition,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(condition: legalForm != individual), readonly(condition: has value), maxlength ---
    const orgNameRequiredCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.REQUIRED,
      conditions: {
        fields: {
          label: 'legalForm',
          constraints: [
            { operator: OPERATORS.NE, value: 'individual' },
            { operator: OPERATORS.REQUIRED },
          ],
        },
      },
    } as TConfigurationRuleConstraint;

    const orgNameReadonlyCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.READONLY,
      conditions: {
        fields: {
          label: 'organisationName',
          constraints: [{ operator: OPERATORS.REQUIRED }],
        },
      },
    } as TConfigurationRuleConstraint;

    const orgNameAllConstraints: TConfigurationRuleConstraint[] = [
      orgNameRequiredCondition,
      orgNameReadonlyCondition,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), maxlength ---
    const emailAllConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- address.zip: required(condition: country NOT IN exclusion list), maxlength ---
    const zipRequiredCondition: TConfigurationRuleConstraint = {
      operator: OPERATORS.REQUIRED,
      conditions: {
        fields: {
          label: 'address.country',
          constraints: [
            { operator: OPERATORS.NOTCONTAINS, values: ['IE', 'AZ', 'DJ', 'LA', 'CI', 'AN', 'HK', 'BO', 'PA', 'HN', 'NI', 'SV', 'CO'] },
            { operator: OPERATORS.REQUIRED },
          ],
        },
      },
    } as TConfigurationRuleConstraint;

    const zipAllConstraints: TConfigurationRuleConstraint[] = [
      zipRequiredCondition,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- address.country: contains (EU list), required, maxlength ---
    const countryContainsConstraint: TConfigurationRuleConstraint = {
      operator: OPERATORS.CONTAINS,
      values: ['AT', 'AX', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GF', 'GI', 'GP', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LT', 'LI', 'LU', 'LV', 'MT', 'MQ', 'NC', 'NL', 'NO', 'PF', 'PL', 'PM', 'PT', 'RE', 'RO', 'SE', 'SI', 'SK', 'TF', 'WF', 'YT'],
    };

    const countryAllConstraints: TConfigurationRuleConstraint[] = [
      countryContainsConstraint,
      { operator: OPERATORS.REQUIRED },
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('firstName conditional REQUIRED (legalForm != corporation)', () => {
      it('should be required for individual', () => {
        const formValues: ContactEditFormValues = { legalForm: 'individual' };
        const contactInfo = { legalForm: 'individual' };
        expect(
          findMatchingConstraint(firstNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'firstName'),
        ).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const formValues: ContactEditFormValues = { legalForm: 'corporation' };
        const contactInfo = { legalForm: 'corporation' };
        expect(
          findMatchingConstraint(firstNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'firstName'),
        ).toBeUndefined();
      });

      it('should be required for association', () => {
        const formValues: ContactEditFormValues = { legalForm: 'association' };
        const contactInfo = { legalForm: 'association' };
        expect(
          findMatchingConstraint(firstNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'firstName'),
        ).toBeDefined();
      });
    });

    describe('lastName conditional REQUIRED (legalForm != corporation)', () => {
      it('should be required for individual', () => {
        const formValues: ContactEditFormValues = { legalForm: 'individual' };
        const contactInfo = { legalForm: 'individual' };
        expect(
          findMatchingConstraint(lastNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'lastName'),
        ).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const formValues: ContactEditFormValues = { legalForm: 'corporation' };
        const contactInfo = { legalForm: 'corporation' };
        expect(
          findMatchingConstraint(lastNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'lastName'),
        ).toBeUndefined();
      });
    });

    describe('legalForm readonly (value in contains list)', () => {
      it('should be readonly when legalForm is individual', () => {
        const formValues: ContactEditFormValues = { legalForm: 'individual' };
        const contactInfo = { legalForm: 'individual' };
        expect(
          findMatchingConstraint(legalFormAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'legalForm'),
        ).toBeDefined();
      });

      it('should be readonly when legalForm is corporation', () => {
        const formValues: ContactEditFormValues = { legalForm: 'corporation' };
        const contactInfo = { legalForm: 'corporation' };
        expect(
          findMatchingConstraint(legalFormAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'legalForm'),
        ).toBeDefined();
      });

      it('should be readonly when legalForm is association', () => {
        const formValues: ContactEditFormValues = { legalForm: 'association' };
        const contactInfo = { legalForm: 'association' };
        expect(
          findMatchingConstraint(legalFormAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'legalForm'),
        ).toBeDefined();
      });

      it('should NOT be readonly when legalForm is empty', () => {
        const formValues: ContactEditFormValues = { legalForm: '' };
        const contactInfo: Record<string, unknown> = {};
        expect(
          findMatchingConstraint(legalFormAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'legalForm'),
        ).toBeUndefined();
      });
    });

    describe('organisationName conditional REQUIRED (legalForm != individual)', () => {
      it('should be required for corporation', () => {
        const formValues: ContactEditFormValues = { legalForm: 'corporation' };
        const contactInfo = { legalForm: 'corporation' };
        expect(
          findMatchingConstraint(orgNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'organisationName'),
        ).toBeDefined();
      });

      it('should be required for association', () => {
        const formValues: ContactEditFormValues = { legalForm: 'association' };
        const contactInfo = { legalForm: 'association' };
        expect(
          findMatchingConstraint(orgNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'organisationName'),
        ).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const formValues: ContactEditFormValues = { legalForm: 'individual' };
        const contactInfo = { legalForm: 'individual' };
        expect(
          findMatchingConstraint(orgNameAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'organisationName'),
        ).toBeUndefined();
      });
    });

    describe('organisationName readonly (has existing value)', () => {
      it('should be readonly when organisationName has a value', () => {
        const formValues: ContactEditFormValues = { organisationName: 'ACME Corp' };
        const contactInfo = { organisationName: 'ACME Corp' };
        expect(
          findMatchingConstraint(orgNameAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'organisationName'),
        ).toBeDefined();
      });

      it('should NOT be readonly when organisationName is empty', () => {
        const formValues: ContactEditFormValues = { organisationName: '' };
        const contactInfo: Record<string, unknown> = {};
        expect(
          findMatchingConstraint(orgNameAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'organisationName'),
        ).toBeUndefined();
      });
    });

    describe('email — always required, never readonly', () => {
      it('should always be required', () => {
        const formValues: ContactEditFormValues = { email: 'test@ovh.com' };
        const contactInfo = { email: 'test@ovh.com' };
        expect(
          findMatchingConstraint(emailAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'email'),
        ).toBeDefined();
      });

      it('should NOT have a readonly constraint', () => {
        const formValues: ContactEditFormValues = { email: 'test@ovh.com' };
        const contactInfo = { email: 'test@ovh.com' };
        expect(
          findMatchingConstraint(emailAllConstraints, OPERATORS.READONLY, formValues, contactInfo, 'email'),
        ).toBeUndefined();
      });
    });

    describe('address.zip conditional REQUIRED (country NOTCONTAINS exclusion list)', () => {
      it('should be required when country is BE (not in exclusion list)', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'BE' };
        const contactInfo = { address: { country: 'BE' } };
        expect(
          findMatchingConstraint(zipAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'address.zip'),
        ).toBeDefined();
      });

      it('should be required when country is FR', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'FR' };
        const contactInfo = { address: { country: 'FR' } };
        expect(
          findMatchingConstraint(zipAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'address.zip'),
        ).toBeDefined();
      });

      it('should NOT be required when country is IE (in exclusion list)', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'IE' };
        const contactInfo = { address: { country: 'IE' } };
        expect(
          findMatchingConstraint(zipAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'address.zip'),
        ).toBeUndefined();
      });

      it('should NOT be required when country is HK (in exclusion list)', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'HK' };
        const contactInfo = { address: { country: 'HK' } };
        expect(
          findMatchingConstraint(zipAllConstraints, OPERATORS.REQUIRED, formValues, contactInfo, 'address.zip'),
        ).toBeUndefined();
      });
    });

    describe('address.country CONTAINS (EU/EEA list)', () => {
      it('should find CONTAINS constraint (unconditional)', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'BE' };
        const contactInfo = { address: { country: 'BE' } };
        const match = findMatchingConstraint(countryAllConstraints, OPERATORS.CONTAINS, formValues, contactInfo, 'address.country');
        expect(match).toBeDefined();
        expect(match?.values).toContain('BE');
        expect(match?.values).toContain('FR');
      });

      it('should have values list that includes EU/EEA countries', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'FR' };
        const contactInfo = { address: { country: 'FR' } };
        const match = findMatchingConstraint(countryAllConstraints, OPERATORS.CONTAINS, formValues, contactInfo, 'address.country');
        expect(match?.values).toContain('AT');
        expect(match?.values).toContain('DE');
        expect(match?.values).toContain('IT');
        expect(match?.values).toContain('NL');
      });

      it('should have values list that does NOT include non-EU countries', () => {
        const formValues: ContactEditFormValues = { 'address.country': 'US' };
        const contactInfo = { address: { country: 'US' } };
        const match = findMatchingConstraint(countryAllConstraints, OPERATORS.CONTAINS, formValues, contactInfo, 'address.country');
        // The constraint is found (unconditional), but US is not in the allowed values
        expect(match).toBeDefined();
        expect(match?.values).not.toContain('US');
        expect(match?.values).not.toContain('JP');
      });
    });
  });

  describe('.fi domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .fi OWNER_CONTACT configurationRules API response.
    // Key .fi differences vs .fr/.be:
    //   - firstName/lastName REQUIRED only for individual (eq), NOT for corporation/association
    //   - firstName/lastName have NO READONLY constraint
    //   - legalForm READONLY only for individual
    //   - legalForm conditional CONTAINS restricts to [association, corporation, other] for non-individual
    //   - nationality READONLY when FI, NE condition prevents changing TO FI
    //   - nationalIdentificationNumber REQUIRED when individual + FI nationality (AND)
    //   - birthDay REQUIRED when individual + non-FI nationality (AND)
    //   - companyNationalIdentificationNumber/vat/organisationType REQUIRED for non-individual
    //   - vat/companyNationalIdentificationNumber/nationalIdentificationNumber/birthDay READONLY when have existing value

    // --- firstName: required(condition: legalForm == individual), maxlength ---
    const fiFirstNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required(condition: legalForm == individual), maxlength ---
    const fiLastNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- legalForm: required, contains (all), conditional contains (non-individual only), readonly (individual), maxlength ---
    const fiLegalFormConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
      {
        operator: OPERATORS.CONTAINS,
        values: ['association', 'corporation', 'other'],
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- nationalIdentificationNumber: readonly(notempty), required(AND: individual + FI), maxlength ---
    const fiNatIdConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'nationalIdentificationNumber',
            constraints: [{ operator: OPERATORS.NOTEMPTY }],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            and: [
              {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.NOTEMPTY },
                ],
              },
              {
                label: 'nationality',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'FI' },
                  { operator: OPERATORS.NOTEMPTY },
                ],
              },
            ],
            constraints: [],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- birthDay: readonly(notempty), required(AND: individual + nationality != FI), maxlength ---
    const fiBirthDayConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'birthDay',
            constraints: [{ operator: OPERATORS.NOTEMPTY }],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            and: [
              {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              {
                label: 'nationality',
                constraints: [
                  { operator: OPERATORS.NE, value: 'FI' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
            ],
            constraints: [],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '10' },
    ];

    // --- nationality: contains, ne FI (conditional), readonly (FI), required ---
    const fiNationalityConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.CONTAINS, values: ['AD', 'AE', 'AF', 'FI', 'FR', 'DE', 'US'] },
      {
        operator: OPERATORS.NE,
        value: 'FI',
        conditions: {
          fields: {
            label: 'nationality',
            constraints: [
              { operator: OPERATORS.NE, value: 'FI' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'nationality',
            constraints: [{ operator: OPERATORS.EQ, value: 'FI' }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.REQUIRED },
    ];

    // --- companyNationalIdentificationNumber: readonly(notempty), required(ne individual), maxlength ---
    const fiCompanyNatIdConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'companyNationalIdentificationNumber',
            constraints: [{ operator: OPERATORS.NOTEMPTY }],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- vat: readonly(notempty), required(ne individual), maxlength ---
    const fiVatConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'vat',
            constraints: [{ operator: OPERATORS.NOTEMPTY }],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationType: contains(conditional ne individual), required(ne individual), maxlength ---
    const fiOrgTypeConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.CONTAINS,
        values: ['Company', 'Public_corporation', 'Foundation', 'Political_party', 'Municipality', 'State', 'Association'],
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(ne individual), maxlength ---
    const fiOrgNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), maxlength ---
    const fiEmailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('firstName — required only for individual, never readonly', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'firstName')).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'firstName')).toBeUndefined();
      });

      it('should NOT be required for association', () => {
        const fv: ContactEditFormValues = { legalForm: 'association' };
        expect(findMatchingConstraint(fiFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'association' }, 'firstName')).toBeUndefined();
      });

      it('should have NO readonly constraint', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: 'Matti' };
        expect(findMatchingConstraint(fiFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', firstName: 'Matti' }, 'firstName')).toBeUndefined();
      });
    });

    describe('lastName — required only for individual, never readonly', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'lastName')).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'lastName')).toBeUndefined();
      });

      it('should have NO readonly constraint', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: 'Virtanen' };
        expect(findMatchingConstraint(fiLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', lastName: 'Virtanen' }, 'lastName')).toBeUndefined();
      });
    });

    describe('legalForm — readonly for individual, conditional CONTAINS for non-individual', () => {
      it('should be readonly when legalForm is individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'legalForm')).toBeDefined();
      });

      it('should NOT be readonly when legalForm is corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation' }, 'legalForm')).toBeUndefined();
      });

      it('should find conditional CONTAINS [association,corporation,other] for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        const match = findMatchingConstraint(fiLegalFormConstraints, OPERATORS.CONTAINS, fv, { legalForm: 'corporation' }, 'legalForm');
        // Two CONTAINS exist; the first is unconditional. Both should match for corporation.
        expect(match).toBeDefined();
      });

      it('should find unconditional CONTAINS that includes individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        const match = findMatchingConstraint(fiLegalFormConstraints, OPERATORS.CONTAINS, fv, { legalForm: 'individual' }, 'legalForm');
        expect(match).toBeDefined();
        expect(match?.values).toContain('individual');
      });
    });

    describe('nationalIdentificationNumber — required for individual+FI, readonly when has value', () => {
      it('should be required for individual with FI nationality', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', nationality: 'FI' };
        expect(findMatchingConstraint(fiNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', nationality: 'FI' }, 'nationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be required for individual with FR nationality', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', nationality: 'FR' };
        expect(findMatchingConstraint(fiNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', nationality: 'FR' }, 'nationalIdentificationNumber')).toBeUndefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', nationality: 'FI' };
        expect(findMatchingConstraint(fiNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', nationality: 'FI' }, 'nationalIdentificationNumber')).toBeUndefined();
      });

      it('should be readonly when nationalIdentificationNumber has a value', () => {
        const fv: ContactEditFormValues = { nationalIdentificationNumber: '010180-1234' };
        expect(findMatchingConstraint(fiNatIdConstraints, OPERATORS.READONLY, fv, { nationalIdentificationNumber: '010180-1234' }, 'nationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be readonly when nationalIdentificationNumber is empty', () => {
        const fv: ContactEditFormValues = { nationalIdentificationNumber: '' };
        expect(findMatchingConstraint(fiNatIdConstraints, OPERATORS.READONLY, fv, {}, 'nationalIdentificationNumber')).toBeUndefined();
      });
    });

    describe('birthDay — required for individual+non-FI, readonly when has value', () => {
      it('should be required for individual with FR nationality', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', nationality: 'FR' };
        expect(findMatchingConstraint(fiBirthDayConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', nationality: 'FR' }, 'birthDay')).toBeDefined();
      });

      it('should NOT be required for individual with FI nationality', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', nationality: 'FI' };
        expect(findMatchingConstraint(fiBirthDayConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', nationality: 'FI' }, 'birthDay')).toBeUndefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', nationality: 'FR' };
        expect(findMatchingConstraint(fiBirthDayConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', nationality: 'FR' }, 'birthDay')).toBeUndefined();
      });

      it('should be readonly when birthDay has a value', () => {
        const fv: ContactEditFormValues = { birthDay: '1990-01-15' };
        expect(findMatchingConstraint(fiBirthDayConstraints, OPERATORS.READONLY, fv, { birthDay: '1990-01-15' }, 'birthDay')).toBeDefined();
      });

      it('should NOT be readonly when birthDay is empty', () => {
        const fv: ContactEditFormValues = { birthDay: '' };
        expect(findMatchingConstraint(fiBirthDayConstraints, OPERATORS.READONLY, fv, {}, 'birthDay')).toBeUndefined();
      });
    });

    describe('nationality — readonly when FI, editable otherwise', () => {
      it('should be readonly when nationality is FI', () => {
        const fv: ContactEditFormValues = { nationality: 'FI' };
        expect(findMatchingConstraint(fiNationalityConstraints, OPERATORS.READONLY, fv, { nationality: 'FI' }, 'nationality')).toBeDefined();
      });

      it('should NOT be readonly when nationality is FR', () => {
        const fv: ContactEditFormValues = { nationality: 'FR' };
        expect(findMatchingConstraint(fiNationalityConstraints, OPERATORS.READONLY, fv, { nationality: 'FR' }, 'nationality')).toBeUndefined();
      });
    });

    describe('companyNationalIdentificationNumber — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'companyNationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'companyNationalIdentificationNumber')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { companyNationalIdentificationNumber: 'FI12345678' };
        expect(findMatchingConstraint(fiCompanyNatIdConstraints, OPERATORS.READONLY, fv, { companyNationalIdentificationNumber: 'FI12345678' }, 'companyNationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { companyNationalIdentificationNumber: '' };
        expect(findMatchingConstraint(fiCompanyNatIdConstraints, OPERATORS.READONLY, fv, {}, 'companyNationalIdentificationNumber')).toBeUndefined();
      });
    });

    describe('vat — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'vat')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'vat')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { vat: 'FI12345678' };
        expect(findMatchingConstraint(fiVatConstraints, OPERATORS.READONLY, fv, { vat: 'FI12345678' }, 'vat')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { vat: '' };
        expect(findMatchingConstraint(fiVatConstraints, OPERATORS.READONLY, fv, {}, 'vat')).toBeUndefined();
      });
    });

    describe('organisationType — required and has CONTAINS only for non-individual', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiOrgTypeConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationType')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiOrgTypeConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationType')).toBeUndefined();
      });

      it('should find CONTAINS for corporation (condition met)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        const match = findMatchingConstraint(fiOrgTypeConstraints, OPERATORS.CONTAINS, fv, { legalForm: 'corporation' }, 'organisationType');
        expect(match).toBeDefined();
        expect(match?.values).toContain('Company');
        expect(match?.values).toContain('Association');
      });

      it('should NOT find CONTAINS for individual (condition not met)', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiOrgTypeConstraints, OPERATORS.CONTAINS, fv, { legalForm: 'individual' }, 'organisationType')).toBeUndefined();
      });
    });

    describe('organisationName — required for non-individual, never readonly', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(fiOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(fiOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationName')).toBeUndefined();
      });

      it('should have NO readonly constraint', () => {
        const fv: ContactEditFormValues = { organisationName: 'Nokia Oyj' };
        expect(findMatchingConstraint(fiOrgNameConstraints, OPERATORS.READONLY, fv, { organisationName: 'Nokia Oyj' }, 'organisationName')).toBeUndefined();
      });
    });

    describe('email — always required, never readonly', () => {
      it('should always be required', () => {
        expect(findMatchingConstraint(fiEmailConstraints, OPERATORS.REQUIRED, {}, {}, 'email')).toBeDefined();
      });

      it('should have NO readonly constraint', () => {
        const fv: ContactEditFormValues = { email: 'test@fi.com' };
        expect(findMatchingConstraint(fiEmailConstraints, OPERATORS.READONLY, fv, { email: 'test@fi.com' }, 'email')).toBeUndefined();
      });
    });
  });

  describe('.es domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .es OWNER_CONTACT configurationRules API response.
    // Key .es differences:
    //   - vat REQUIRED with AND (legalForm != individual AND address.country != ES)
    //   - companyNationalIdentificationNumber REQUIRED with AND (legalForm != individual AND address.country == ES)
    //   - nationalIdentificationNumber REQUIRED for individual (simple)
    //   - firstName/lastName REQUIRED for individual (eq), READONLY with AND (individual + has value)
    //   - organisationName REQUIRED for non-individual, READONLY when has value (required condition)

    // --- vat: required(AND: ne individual + country ne ES), maxlength ---
    const esVatConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            and: [
              {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.NE, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              {
                label: 'address.country',
                constraints: [
                  { operator: OPERATORS.NE, value: 'ES' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
            ],
            constraints: [],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- companyNationalIdentificationNumber: required(AND: ne individual + country eq ES), maxlength ---
    const esCompanyNatIdConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            and: [
              {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.NE, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              {
                label: 'address.country',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'ES' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
            ],
            constraints: [],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- nationalIdentificationNumber: required(eq individual), maxlength ---
    const esNatIdConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- firstName: required(eq individual), readonly(AND: individual + has value), maxlength ---
    const esFirstNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'firstName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required(eq individual), readonly(AND: individual + has value), maxlength ---
    const esLastNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.EQ, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'lastName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(ne individual), readonly(has value via required condition), maxlength ---
    const esOrgNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'organisationName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), maxlength ---
    const esEmailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('vat — required for non-individual AND country != ES', () => {
      it('should be required for corporation in FR', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', 'address.country': 'FR' };
        expect(findMatchingConstraint(esVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', address: { country: 'FR' } }, 'vat')).toBeDefined();
      });

      it('should NOT be required for corporation in ES (country condition fails)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', 'address.country': 'ES' };
        expect(findMatchingConstraint(esVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', address: { country: 'ES' } }, 'vat')).toBeUndefined();
      });

      it('should NOT be required for individual in FR', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', 'address.country': 'FR' };
        expect(findMatchingConstraint(esVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', address: { country: 'FR' } }, 'vat')).toBeUndefined();
      });

      it('should NOT be required for individual in ES', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', 'address.country': 'ES' };
        expect(findMatchingConstraint(esVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', address: { country: 'ES' } }, 'vat')).toBeUndefined();
      });

      it('should be required for association in DE', () => {
        const fv: ContactEditFormValues = { legalForm: 'association', 'address.country': 'DE' };
        expect(findMatchingConstraint(esVatConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'association', address: { country: 'DE' } }, 'vat')).toBeDefined();
      });
    });

    describe('companyNationalIdentificationNumber — required for non-individual AND country == ES', () => {
      it('should be required for corporation in ES', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', 'address.country': 'ES' };
        expect(findMatchingConstraint(esCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', address: { country: 'ES' } }, 'companyNationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be required for corporation in FR (country condition fails)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', 'address.country': 'FR' };
        expect(findMatchingConstraint(esCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation', address: { country: 'FR' } }, 'companyNationalIdentificationNumber')).toBeUndefined();
      });

      it('should NOT be required for individual in ES', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', 'address.country': 'ES' };
        expect(findMatchingConstraint(esCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual', address: { country: 'ES' } }, 'companyNationalIdentificationNumber')).toBeUndefined();
      });

      it('should be required for association in ES', () => {
        const fv: ContactEditFormValues = { legalForm: 'association', 'address.country': 'ES' };
        expect(findMatchingConstraint(esCompanyNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'association', address: { country: 'ES' } }, 'companyNationalIdentificationNumber')).toBeDefined();
      });
    });

    describe('nationalIdentificationNumber — required for individual', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(esNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'nationalIdentificationNumber')).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(esNatIdConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'nationalIdentificationNumber')).toBeUndefined();
      });
    });

    describe('firstName — required for individual, readonly for individual with value, editable for corporation', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(esFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'firstName')).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(esFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'firstName')).toBeUndefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: 'Carlos' };
        expect(findMatchingConstraint(esFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', firstName: 'Carlos' }, 'firstName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', firstName: 'Carlos' };
        expect(findMatchingConstraint(esFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', firstName: 'Carlos' }, 'firstName')).toBeUndefined();
      });

      it('should NOT be readonly for individual without value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: '' };
        expect(findMatchingConstraint(esFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'firstName')).toBeUndefined();
      });
    });

    describe('lastName — required for individual, readonly for individual with value, editable for corporation', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(esLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'lastName')).toBeDefined();
      });

      it('should NOT be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(esLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'lastName')).toBeUndefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: 'García' };
        expect(findMatchingConstraint(esLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', lastName: 'García' }, 'lastName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', lastName: 'García' };
        expect(findMatchingConstraint(esLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', lastName: 'García' }, 'lastName')).toBeUndefined();
      });
    });

    describe('organisationName — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(esOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(esOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationName')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { organisationName: 'Telefónica S.A.' };
        expect(findMatchingConstraint(esOrgNameConstraints, OPERATORS.READONLY, fv, { organisationName: 'Telefónica S.A.' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { organisationName: '' };
        expect(findMatchingConstraint(esOrgNameConstraints, OPERATORS.READONLY, fv, {}, 'organisationName')).toBeUndefined();
      });
    });

    describe('email — always required, never readonly', () => {
      it('should always be required', () => {
        expect(findMatchingConstraint(esEmailConstraints, OPERATORS.REQUIRED, {}, {}, 'email')).toBeDefined();
      });

      it('should have NO readonly constraint', () => {
        const fv: ContactEditFormValues = { email: 'test@es.com' };
        expect(findMatchingConstraint(esEmailConstraints, OPERATORS.READONLY, fv, { email: 'test@es.com' }, 'email')).toBeUndefined();
      });
    });
  });

  describe('.pl domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .pl OWNER_CONTACT configurationRules API response.
    // Key .pl differences vs other TLDs:
    //   - firstName/lastName ALWAYS required (unconditional), readonly for individual with value
    //   - email READONLY when has existing value (unlike .fr/.fi/.es where email is always editable)
    //   - phone has minlength(5) + maxlength(17)

    // --- firstName: required (unconditional), readonly(AND: individual + has value), maxlength ---
    const plFirstNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'firstName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required (unconditional), readonly(AND: individual + has value), maxlength ---
    const plLastNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'lastName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), readonly(has value via required condition), maxlength ---
    const plEmailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'email',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- legalForm: contains, required, readonly(value in list), maxlength ---
    const plLegalFormConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(ne individual), readonly(has value), maxlength ---
    const plOrgNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'organisationName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('firstName — always required, readonly for individual with value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(plFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'firstName')).toBeDefined();
      });

      it('should be required for corporation (unconditional)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(plFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'firstName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: 'Marek' };
        expect(findMatchingConstraint(plFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', firstName: 'Marek' }, 'firstName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', firstName: 'Marek' };
        expect(findMatchingConstraint(plFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', firstName: 'Marek' }, 'firstName')).toBeUndefined();
      });

      it('should NOT be readonly for individual without value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: '' };
        expect(findMatchingConstraint(plFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'firstName')).toBeUndefined();
      });
    });

    describe('lastName — always required, readonly for individual with value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(plLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'lastName')).toBeDefined();
      });

      it('should be required for corporation (unconditional)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(plLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'lastName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: 'Kowalski' };
        expect(findMatchingConstraint(plLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', lastName: 'Kowalski' }, 'lastName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', lastName: 'Kowalski' };
        expect(findMatchingConstraint(plLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', lastName: 'Kowalski' }, 'lastName')).toBeUndefined();
      });

      it('should NOT be readonly for individual without value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: '' };
        expect(findMatchingConstraint(plLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'lastName')).toBeUndefined();
      });
    });

    describe('email — always required, READONLY when has existing value', () => {
      it('should always be required', () => {
        expect(findMatchingConstraint(plEmailConstraints, OPERATORS.REQUIRED, {}, {}, 'email')).toBeDefined();
      });

      it('should be readonly when email has existing value', () => {
        const fv: ContactEditFormValues = { email: 'marek@pl.com' };
        expect(findMatchingConstraint(plEmailConstraints, OPERATORS.READONLY, fv, { email: 'marek@pl.com' }, 'email')).toBeDefined();
      });

      it('should NOT be readonly when email is empty', () => {
        const fv: ContactEditFormValues = { email: '' };
        expect(findMatchingConstraint(plEmailConstraints, OPERATORS.READONLY, fv, {}, 'email')).toBeUndefined();
      });
    });

    describe('legalForm — readonly when has valid value', () => {
      it('should be readonly when legalForm is individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(plLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'legalForm')).toBeDefined();
      });

      it('should be readonly when legalForm is corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(plLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation' }, 'legalForm')).toBeDefined();
      });

      it('should NOT be readonly when legalForm is empty', () => {
        const fv: ContactEditFormValues = { legalForm: '' };
        expect(findMatchingConstraint(plLegalFormConstraints, OPERATORS.READONLY, fv, {}, 'legalForm')).toBeUndefined();
      });
    });

    describe('organisationName — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(plOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(plOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationName')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { organisationName: 'KGHM Polska Miedź' };
        expect(findMatchingConstraint(plOrgNameConstraints, OPERATORS.READONLY, fv, { organisationName: 'KGHM Polska Miedź' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { organisationName: '' };
        expect(findMatchingConstraint(plOrgNameConstraints, OPERATORS.READONLY, fv, {}, 'organisationName')).toBeUndefined();
      });
    });
  });

  describe('.cn domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .cn OWNER_CONTACT configurationRules API response.
    // Key .cn differences vs other TLDs:
    //   - firstName/lastName ALWAYS required AND readonly when has value (for ALL legalForms, not just individual)
    //   - email readonly when has value (like .pl)
    //   - No nationalIdentificationNumber, birthDay, nationality, vat, companyNationalIdentificationNumber fields
    //   - Simpler constraints overall — no AND conditions

    // --- firstName: required (unconditional), readonly(has value — all legalForms), maxlength ---
    const cnFirstNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'firstName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required (unconditional), readonly(has value — all legalForms), maxlength ---
    const cnLastNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'lastName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), readonly(has value), maxlength ---
    const cnEmailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'email',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- legalForm: contains, required, readonly(value in list), maxlength ---
    const cnLegalFormConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(ne individual), readonly(has value), maxlength ---
    const cnOrgNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'organisationName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('firstName — always required, readonly for ALL legalForms when has value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(cnFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'firstName')).toBeDefined();
      });

      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(cnFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'firstName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: 'Wei' };
        expect(findMatchingConstraint(cnFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', firstName: 'Wei' }, 'firstName')).toBeDefined();
      });

      it('should be readonly for CORPORATION with existing value (unlike .pl/.be/.es)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', firstName: 'Wei' };
        expect(findMatchingConstraint(cnFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', firstName: 'Wei' }, 'firstName')).toBeDefined();
      });

      it('should NOT be readonly when firstName is empty', () => {
        const fv: ContactEditFormValues = { firstName: '' };
        expect(findMatchingConstraint(cnFirstNameConstraints, OPERATORS.READONLY, fv, {}, 'firstName')).toBeUndefined();
      });
    });

    describe('lastName — always required, readonly for ALL legalForms when has value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(cnLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'lastName')).toBeDefined();
      });

      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(cnLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'lastName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: 'Zhang' };
        expect(findMatchingConstraint(cnLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', lastName: 'Zhang' }, 'lastName')).toBeDefined();
      });

      it('should be readonly for CORPORATION with existing value (unlike .pl/.be/.es)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', lastName: 'Zhang' };
        expect(findMatchingConstraint(cnLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', lastName: 'Zhang' }, 'lastName')).toBeDefined();
      });

      it('should NOT be readonly when lastName is empty', () => {
        const fv: ContactEditFormValues = { lastName: '' };
        expect(findMatchingConstraint(cnLastNameConstraints, OPERATORS.READONLY, fv, {}, 'lastName')).toBeUndefined();
      });
    });

    describe('email — always required, readonly when has value', () => {
      it('should always be required', () => {
        expect(findMatchingConstraint(cnEmailConstraints, OPERATORS.REQUIRED, {}, {}, 'email')).toBeDefined();
      });

      it('should be readonly when email has existing value', () => {
        const fv: ContactEditFormValues = { email: 'wei@cn.com' };
        expect(findMatchingConstraint(cnEmailConstraints, OPERATORS.READONLY, fv, { email: 'wei@cn.com' }, 'email')).toBeDefined();
      });

      it('should NOT be readonly when email is empty', () => {
        const fv: ContactEditFormValues = { email: '' };
        expect(findMatchingConstraint(cnEmailConstraints, OPERATORS.READONLY, fv, {}, 'email')).toBeUndefined();
      });
    });

    describe('legalForm — readonly when has valid value', () => {
      it('should be readonly when legalForm is individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(cnLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'legalForm')).toBeDefined();
      });

      it('should be readonly when legalForm is corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(cnLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation' }, 'legalForm')).toBeDefined();
      });

      it('should NOT be readonly when legalForm is empty', () => {
        const fv: ContactEditFormValues = { legalForm: '' };
        expect(findMatchingConstraint(cnLegalFormConstraints, OPERATORS.READONLY, fv, {}, 'legalForm')).toBeUndefined();
      });
    });

    describe('organisationName — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(cnOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(cnOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationName')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { organisationName: 'Alibaba Group' };
        expect(findMatchingConstraint(cnOrgNameConstraints, OPERATORS.READONLY, fv, { organisationName: 'Alibaba Group' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { organisationName: '' };
        expect(findMatchingConstraint(cnOrgNameConstraints, OPERATORS.READONLY, fv, {}, 'organisationName')).toBeUndefined();
      });
    });
  });

  describe('.com domain — full configurationRules validation (real API shape)', () => {
    // Exact constraint shapes from the .com OWNER_CONTACT configurationRules API response.
    // .com has the same structure as .pl:
    //   - firstName/lastName ALWAYS required (unconditional), readonly for individual with value (AND)
    //   - email readonly when has value
    //   - legalForm readonly when has valid value
    //   - organisationName required for non-individual, readonly when has value
    //   - address.zip required with notcontains exclusion list

    // --- firstName: required (unconditional), readonly(AND: individual + has value), maxlength ---
    const comFirstNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'firstName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- lastName: required (unconditional), readonly(AND: individual + has value), maxlength ---
    const comLastNameConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          and: [
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'legalForm',
                constraints: [
                  { operator: OPERATORS.EQ, value: 'individual' },
                  { operator: OPERATORS.REQUIRED },
                ],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
            {
              label: 'OWNER_CONTACT',
              type: 'contact',
              fields: {
                label: 'lastName',
                constraints: [{ operator: OPERATORS.REQUIRED }],
              },
              constraints: [{ operator: OPERATORS.REQUIRED }],
            },
          ],
          constraints: [],
        },
      } as unknown as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- email: required (unconditional), readonly(has value), maxlength ---
    const comEmailConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'email',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- legalForm: contains, required, readonly(value in list), maxlength ---
    const comLegalFormConstraints: TConfigurationRuleConstraint[] = [
      { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
      { operator: OPERATORS.REQUIRED },
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.CONTAINS, values: ['association', 'corporation', 'individual', 'other'] },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- organisationName: required(ne individual), readonly(has value), maxlength ---
    const comOrgNameConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'legalForm',
            constraints: [
              { operator: OPERATORS.NE, value: 'individual' },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      {
        operator: OPERATORS.READONLY,
        conditions: {
          fields: {
            label: 'organisationName',
            constraints: [{ operator: OPERATORS.REQUIRED }],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    // --- address.zip: required(notcontains exclusion list), maxlength ---
    const comZipConstraints: TConfigurationRuleConstraint[] = [
      {
        operator: OPERATORS.REQUIRED,
        conditions: {
          fields: {
            label: 'address.country',
            constraints: [
              { operator: OPERATORS.NOTCONTAINS, values: ['IE', 'AZ', 'DJ', 'LA', 'CI', 'AN', 'HK', 'BO', 'PA', 'HN', 'NI', 'SV', 'CO'] },
              { operator: OPERATORS.REQUIRED },
            ],
          },
        },
      } as TConfigurationRuleConstraint,
      { operator: OPERATORS.MAXLENGTH, value: '255' },
    ];

    describe('firstName — always required, readonly for individual with value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(comFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'firstName')).toBeDefined();
      });

      it('should be required for corporation (unconditional)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(comFirstNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'firstName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: 'John' };
        expect(findMatchingConstraint(comFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', firstName: 'John' }, 'firstName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', firstName: 'John' };
        expect(findMatchingConstraint(comFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', firstName: 'John' }, 'firstName')).toBeUndefined();
      });

      it('should NOT be readonly for individual without value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', firstName: '' };
        expect(findMatchingConstraint(comFirstNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'firstName')).toBeUndefined();
      });
    });

    describe('lastName — always required, readonly for individual with value', () => {
      it('should be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(comLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'lastName')).toBeDefined();
      });

      it('should be required for corporation (unconditional)', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(comLastNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'lastName')).toBeDefined();
      });

      it('should be readonly for individual with existing value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: 'Smith' };
        expect(findMatchingConstraint(comLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual', lastName: 'Smith' }, 'lastName')).toBeDefined();
      });

      it('should NOT be readonly for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation', lastName: 'Smith' };
        expect(findMatchingConstraint(comLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation', lastName: 'Smith' }, 'lastName')).toBeUndefined();
      });

      it('should NOT be readonly for individual without value', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual', lastName: '' };
        expect(findMatchingConstraint(comLastNameConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'lastName')).toBeUndefined();
      });
    });

    describe('email — always required, readonly when has value', () => {
      it('should always be required', () => {
        expect(findMatchingConstraint(comEmailConstraints, OPERATORS.REQUIRED, {}, {}, 'email')).toBeDefined();
      });

      it('should be readonly when email has existing value', () => {
        const fv: ContactEditFormValues = { email: 'john@example.com' };
        expect(findMatchingConstraint(comEmailConstraints, OPERATORS.READONLY, fv, { email: 'john@example.com' }, 'email')).toBeDefined();
      });

      it('should NOT be readonly when email is empty', () => {
        const fv: ContactEditFormValues = { email: '' };
        expect(findMatchingConstraint(comEmailConstraints, OPERATORS.READONLY, fv, {}, 'email')).toBeUndefined();
      });
    });

    describe('legalForm — readonly when has valid value', () => {
      it('should be readonly when legalForm is individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(comLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'individual' }, 'legalForm')).toBeDefined();
      });

      it('should be readonly when legalForm is corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(comLegalFormConstraints, OPERATORS.READONLY, fv, { legalForm: 'corporation' }, 'legalForm')).toBeDefined();
      });

      it('should NOT be readonly when legalForm is empty', () => {
        const fv: ContactEditFormValues = { legalForm: '' };
        expect(findMatchingConstraint(comLegalFormConstraints, OPERATORS.READONLY, fv, {}, 'legalForm')).toBeUndefined();
      });
    });

    describe('organisationName — required for non-individual, readonly when has value', () => {
      it('should be required for corporation', () => {
        const fv: ContactEditFormValues = { legalForm: 'corporation' };
        expect(findMatchingConstraint(comOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'corporation' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be required for individual', () => {
        const fv: ContactEditFormValues = { legalForm: 'individual' };
        expect(findMatchingConstraint(comOrgNameConstraints, OPERATORS.REQUIRED, fv, { legalForm: 'individual' }, 'organisationName')).toBeUndefined();
      });

      it('should be readonly when has existing value', () => {
        const fv: ContactEditFormValues = { organisationName: 'Acme Inc.' };
        expect(findMatchingConstraint(comOrgNameConstraints, OPERATORS.READONLY, fv, { organisationName: 'Acme Inc.' }, 'organisationName')).toBeDefined();
      });

      it('should NOT be readonly when empty', () => {
        const fv: ContactEditFormValues = { organisationName: '' };
        expect(findMatchingConstraint(comOrgNameConstraints, OPERATORS.READONLY, fv, {}, 'organisationName')).toBeUndefined();
      });
    });

    describe('address.zip — required when country NOT in exclusion list', () => {
      it('should be required when country is FR', () => {
        const fv: ContactEditFormValues = { 'address.country': 'FR' };
        expect(findMatchingConstraint(comZipConstraints, OPERATORS.REQUIRED, fv, { address: { country: 'FR' } }, 'address.zip')).toBeDefined();
      });

      it('should be required when country is US', () => {
        const fv: ContactEditFormValues = { 'address.country': 'US' };
        expect(findMatchingConstraint(comZipConstraints, OPERATORS.REQUIRED, fv, { address: { country: 'US' } }, 'address.zip')).toBeDefined();
      });

      it('should NOT be required when country is IE (in exclusion list)', () => {
        const fv: ContactEditFormValues = { 'address.country': 'IE' };
        expect(findMatchingConstraint(comZipConstraints, OPERATORS.REQUIRED, fv, { address: { country: 'IE' } }, 'address.zip')).toBeUndefined();
      });

      it('should NOT be required when country is HK (in exclusion list)', () => {
        const fv: ContactEditFormValues = { 'address.country': 'HK' };
        expect(findMatchingConstraint(comZipConstraints, OPERATORS.REQUIRED, fv, { address: { country: 'HK' } }, 'address.zip')).toBeUndefined();
      });

      it('should NOT be required when country is CO (in exclusion list)', () => {
        const fv: ContactEditFormValues = { 'address.country': 'CO' };
        expect(findMatchingConstraint(comZipConstraints, OPERATORS.REQUIRED, fv, { address: { country: 'CO' } }, 'address.zip')).toBeUndefined();
      });
    });
  });
});
