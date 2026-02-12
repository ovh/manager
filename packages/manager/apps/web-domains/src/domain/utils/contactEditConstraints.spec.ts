import { describe, expect, it } from 'vitest';
import {
  getDescendantProp,
  fieldCurrentValue,
  checkConstraint,
  isConstraintSatisfied,
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
});
