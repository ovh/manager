import { describe, expect, it } from 'vitest';
import {
  GENERAL_KEY,
  PROFILE_KEY,
  CONTACT_KEY,
  OTHER_KEY,
  SECTIONS,
  FORCED_FIELDS,
  FIELD_NAME_LIST,
  OPERATORS,
  CONTACT_MANAGEMENT_EDIT_TRACKING,
} from './contactEdit';

describe('contactEdit constants', () => {
  describe('Section keys', () => {
    it('should have correct key values', () => {
      expect(GENERAL_KEY).toBe('general');
      expect(PROFILE_KEY).toBe('profile');
      expect(CONTACT_KEY).toBe('contact');
      expect(OTHER_KEY).toBe('other');
    });
  });

  describe('SECTIONS', () => {
    it('should have general, profile, and contact sections', () => {
      expect(SECTIONS).toHaveProperty(GENERAL_KEY);
      expect(SECTIONS).toHaveProperty(PROFILE_KEY);
      expect(SECTIONS).toHaveProperty(CONTACT_KEY);
    });

    it('should not have an "other" section (other is computed dynamically)', () => {
      expect(SECTIONS).not.toHaveProperty(OTHER_KEY);
    });

    it('should include legalForm in general section', () => {
      expect(SECTIONS[GENERAL_KEY]).toContain('legalForm');
    });

    it('should include organisationName in general section', () => {
      expect(SECTIONS[GENERAL_KEY]).toContain('organisationName');
    });

    it('should include vat in general section', () => {
      expect(SECTIONS[GENERAL_KEY]).toContain('vat');
    });

    it('should include firstName and lastName in profile section', () => {
      expect(SECTIONS[PROFILE_KEY]).toContain('firstName');
      expect(SECTIONS[PROFILE_KEY]).toContain('lastName');
    });

    it('should include gender and nationality in profile section', () => {
      expect(SECTIONS[PROFILE_KEY]).toContain('gender');
      expect(SECTIONS[PROFILE_KEY]).toContain('nationality');
    });

    it('should include birthDay in profile section', () => {
      expect(SECTIONS[PROFILE_KEY]).toContain('birthDay');
    });

    it('should include address.country in contact section', () => {
      expect(SECTIONS[CONTACT_KEY]).toContain('address.country');
    });

    it('should include email and phone in contact section', () => {
      expect(SECTIONS[CONTACT_KEY]).toContain('email');
      expect(SECTIONS[CONTACT_KEY]).toContain('phone');
    });

    it('should include address fields in contact section', () => {
      expect(SECTIONS[CONTACT_KEY]).toContain('address.line1');
      expect(SECTIONS[CONTACT_KEY]).toContain('address.city');
      expect(SECTIONS[CONTACT_KEY]).toContain('address.zip');
    });
  });

  describe('FORCED_FIELDS', () => {
    it('should contain firstName and lastName', () => {
      expect(FORCED_FIELDS).toHaveProperty('firstName', 'firstName');
      expect(FORCED_FIELDS).toHaveProperty('lastName', 'lastName');
    });

    it('should have exactly 2 forced fields', () => {
      expect(Object.keys(FORCED_FIELDS)).toHaveLength(2);
    });
  });

  describe('FIELD_NAME_LIST', () => {
    it('should map legalform to legalForm', () => {
      expect(FIELD_NAME_LIST.legalform).toBe('legalForm');
    });

    it('should map addressCountry and country to address.country', () => {
      expect(FIELD_NAME_LIST.addressCountry).toBe('address.country');
      expect(FIELD_NAME_LIST.country).toBe('address.country');
    });

    it('should map nested address fields correctly', () => {
      expect(FIELD_NAME_LIST.province).toBe('address.province');
      expect(FIELD_NAME_LIST.zip).toBe('address.zip');
      expect(FIELD_NAME_LIST.city).toBe('address.city');
      expect(FIELD_NAME_LIST.line1).toBe('address.line1');
      expect(FIELD_NAME_LIST.line2).toBe('address.line2');
      expect(FIELD_NAME_LIST.line3).toBe('address.line3');
      expect(FIELD_NAME_LIST.otherDetails).toBe('address.otherDetails');
    });

    it('should map simple fields to their own name', () => {
      expect(FIELD_NAME_LIST.firstName).toBe('firstName');
      expect(FIELD_NAME_LIST.lastName).toBe('lastName');
      expect(FIELD_NAME_LIST.email).toBe('email');
      expect(FIELD_NAME_LIST.phone).toBe('phone');
      expect(FIELD_NAME_LIST.gender).toBe('gender');
    });
  });

  describe('OPERATORS', () => {
    it('should have all expected operators', () => {
      expect(OPERATORS.BETWEEN).toBe('between');
      expect(OPERATORS.CONTAINS).toBe('contains');
      expect(OPERATORS.EMPTY).toBe('empty');
      expect(OPERATORS.EQ).toBe('eq');
      expect(OPERATORS.GT).toBe('gt');
      expect(OPERATORS.GTE).toBe('gte');
      expect(OPERATORS.LT).toBe('lt');
      expect(OPERATORS.LTE).toBe('lte');
      expect(OPERATORS.MATCH).toBe('match');
      expect(OPERATORS.MAXLENGTH).toBe('maxlength');
      expect(OPERATORS.MINLENGTH).toBe('minlength');
      expect(OPERATORS.NE).toBe('ne');
      expect(OPERATORS.NOTCONTAINS).toBe('notcontains');
      expect(OPERATORS.NOTEMPTY).toBe('notempty');
      expect(OPERATORS.READONLY).toBe('readonly');
      expect(OPERATORS.REQUIRED).toBe('required');
      expect(OPERATORS.SHOULDBETRUE).toBe('shouldbetrue');
    });

    it('should have exactly 17 operators', () => {
      expect(Object.keys(OPERATORS)).toHaveLength(17);
    });
  });

  describe('CONTACT_MANAGEMENT_EDIT_TRACKING', () => {
    it('should have SUBMIT tracking with action type', () => {
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.SUBMIT.actionType).toBe('action');
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.SUBMIT.actions).toEqual([
        'edit_holder-contact_confirm',
      ]);
    });

    it('should have CANCEL tracking with navigation type', () => {
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.CANCEL.actionType).toBe('navigation');
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.CANCEL.actions).toEqual([
        'edit_holder-contact_cancel',
      ]);
    });

    it('should have LINK tracking with navigation type', () => {
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.LINK.actionType).toBe('navigation');
      expect(CONTACT_MANAGEMENT_EDIT_TRACKING.LINK.actions).toEqual([
        'edit_holder_next',
      ]);
    });
  });
});
