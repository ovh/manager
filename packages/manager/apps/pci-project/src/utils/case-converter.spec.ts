import { describe, it, expect } from 'vitest';
import { camelToSnakeCase } from './case-converter';

describe('camelToSnakeCase', () => {
  it('should convert simple camelCase to snake_case', () => {
    expect(camelToSnakeCase('firstName')).toBe('first_name');
    expect(camelToSnakeCase('lastName')).toBe('last_name');
    expect(camelToSnakeCase('myVariable')).toBe('my_variable');
  });

  it('should convert complex camelCase to snake_case', () => {
    expect(camelToSnakeCase('myVariableName')).toBe('my_variable_name');
    expect(camelToSnakeCase('thisIsAVeryLongVariableName')).toBe(
      'this_is_a_very_long_variable_name',
    );
    expect(camelToSnakeCase('someMethodWithManyWords')).toBe(
      'some_method_with_many_words',
    );
  });

  it('should handle single words without uppercase letters', () => {
    expect(camelToSnakeCase('hello')).toBe('hello');
    expect(camelToSnakeCase('world')).toBe('world');
    expect(camelToSnakeCase('test')).toBe('test');
  });

  it('should handle empty string', () => {
    expect(camelToSnakeCase('')).toBe('');
  });

  it('should handle strings with consecutive uppercase letters', () => {
    expect(camelToSnakeCase('ID')).toBe('_i_d');
    expect(camelToSnakeCase('XMLParser')).toBe('_x_m_l_parser');
    expect(camelToSnakeCase('HTTPSConnection')).toBe('_h_t_t_p_s_connection');
  });

  it('should handle strings starting with uppercase letters', () => {
    expect(camelToSnakeCase('FirstName')).toBe('_first_name');
    expect(camelToSnakeCase('LastName')).toBe('_last_name');
    expect(camelToSnakeCase('MyClass')).toBe('_my_class');
  });

  it('should handle mixed case scenarios', () => {
    expect(camelToSnakeCase('parseHTMLDocument')).toBe(
      'parse_h_t_m_l_document',
    );
    expect(camelToSnakeCase('getJSONData')).toBe('get_j_s_o_n_data');
    expect(camelToSnakeCase('validateXMLInput')).toBe('validate_x_m_l_input');
  });

  it('should handle single uppercase letter', () => {
    expect(camelToSnakeCase('A')).toBe('_a');
    expect(camelToSnakeCase('B')).toBe('_b');
  });

  it('should handle strings with numbers', () => {
    expect(camelToSnakeCase('version2')).toBe('version2');
    expect(camelToSnakeCase('myVariable2')).toBe('my_variable2');
    expect(camelToSnakeCase('test123Value')).toBe('test123_value');
  });

  it('should handle strings with underscores already present', () => {
    expect(camelToSnakeCase('my_variableName')).toBe('my_variable_name');
    expect(camelToSnakeCase('test_valueWithCamel')).toBe(
      'test_value_with_camel',
    );
  });

  it('should handle edge cases with special characters', () => {
    expect(camelToSnakeCase('myVariable-name')).toBe('my_variable-name');
    expect(camelToSnakeCase('test.propertyName')).toBe('test.property_name');
  });

  it('should be consistent with the documented examples', () => {
    expect(camelToSnakeCase('myVariableName')).toBe('my_variable_name');
    expect(camelToSnakeCase('firstName')).toBe('first_name');
    expect(camelToSnakeCase('ID')).toBe('_i_d');
  });
});
