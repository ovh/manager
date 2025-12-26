import { describe, expect, it } from 'vitest';

import { replaceAll } from '../string';

describe('string utils', () => {
  describe('replaceAll', () => {
    it('should replace all occurrences of a single key', () => {
      const str = 'Hello {name}, welcome!';
      const obj = { '{name}': 'John' };
      expect(replaceAll(str, obj)).toBe('Hello John, welcome!');
    });

    it('should replace multiple occurrences of the same key', () => {
      const str = '{greeting} {name}, {greeting} again!';
      const obj = { '{greeting}': 'Hello', '{name}': 'John' };
      expect(replaceAll(str, obj)).toBe('Hello John, Hello again!');
    });

    it('should replace multiple different keys', () => {
      const str = '{greeting} {name}, you are {age} years old';
      const obj = { '{greeting}': 'Hello', '{name}': 'John', '{age}': '30' };
      expect(replaceAll(str, obj)).toBe('Hello John, you are 30 years old');
    });

    it('should handle empty string', () => {
      const str = '';
      const obj = { '{name}': 'John' };
      expect(replaceAll(str, obj)).toBe('');
    });

    it('should handle empty object', () => {
      const str = 'Hello {name}';
      const obj = {};
      expect(replaceAll(str, obj)).toBe('Hello {name}');
    });

    it('should handle null or undefined string', () => {
      expect(replaceAll(null as unknown as string, { '{name}': 'John' })).toBe(null);
      expect(replaceAll(undefined as unknown as string, { '{name}': 'John' })).toBe(undefined);
    });

    it('should escape special regex characters in keys', () => {
      const str = 'Price: $10.50';
      const obj = { '$10.50': '€9.50' };
      expect(replaceAll(str, obj)).toBe('Price: €9.50');
    });

    it('should handle regex special characters like parentheses', () => {
      const str = 'Function (test) called';
      const obj = { '(test)': 'example' };
      expect(replaceAll(str, obj)).toBe('Function example called');
    });

    it('should handle regex special characters like brackets', () => {
      const str = 'Array [item] value';
      const obj = { '[item]': 'element' };
      expect(replaceAll(str, obj)).toBe('Array element value');
    });

    it('should handle regex special characters like dots and plus', () => {
      const str = 'Version 1.0+ released';
      const obj = { '1.0+': '2.0' };
      expect(replaceAll(str, obj)).toBe('Version 2.0 released');
    });

    it('should handle regex special characters like asterisk and question mark', () => {
      const str = 'Pattern *? matched';
      const obj = { '*?': 'wildcard' };
      expect(replaceAll(str, obj)).toBe('Pattern wildcard matched');
    });

    it('should handle regex special characters like caret and dollar', () => {
      const str = 'Start ^ and end $';
      const obj = { '^': 'begin', $: 'finish' };
      expect(replaceAll(str, obj)).toBe('Start begin and end finish');
    });

    it('should handle regex special characters like pipe and backslash', () => {
      const str = 'Option A | Option B';
      const obj = { '|': 'or' };
      expect(replaceAll(str, obj)).toBe('Option A or Option B');
    });

    it('should handle curly braces in keys', () => {
      const str = 'Template {variable} here';
      const obj = { '{variable}': 'value' };
      expect(replaceAll(str, obj)).toBe('Template value here');
    });

    it('should replace keys that appear at the start of string', () => {
      const str = '{start} middle end';
      const obj = { '{start}': 'Beginning' };
      expect(replaceAll(str, obj)).toBe('Beginning middle end');
    });

    it('should replace keys that appear at the end of string', () => {
      const str = 'start middle {end}';
      const obj = { '{end}': 'Finish' };
      expect(replaceAll(str, obj)).toBe('start middle Finish');
    });

    it('should handle keys that do not exist in string', () => {
      const str = 'Hello world';
      const obj = { '{name}': 'John' };
      expect(replaceAll(str, obj)).toBe('Hello world');
    });

    it('should handle multiple replacements with overlapping patterns', () => {
      const str = '{a}{b}{a}';
      const obj = { '{a}': '1', '{b}': '2' };
      expect(replaceAll(str, obj)).toBe('121');
    });

    it('should handle special characters in replacement values', () => {
      const str = 'Replace {key}';
      const obj = { '{key}': '$100.50' };
      expect(replaceAll(str, obj)).toBe('Replace $100.50');
    });

    it('should handle unicode characters', () => {
      const str = 'Hello {name}';
      const obj = { '{name}': 'José' };
      expect(replaceAll(str, obj)).toBe('Hello José');
    });

    it('should handle newlines and special whitespace', () => {
      const str = 'Line1\nLine2';
      const obj = { '\n': ' ' };
      expect(replaceAll(str, obj)).toBe('Line1 Line2');
    });

    it('should handle case-sensitive replacements', () => {
      const str = 'Hello {Name} and {name}';
      const obj = { '{name}': 'john', '{Name}': 'John' };
      expect(replaceAll(str, obj)).toBe('Hello John and john');
    });
  });
});
