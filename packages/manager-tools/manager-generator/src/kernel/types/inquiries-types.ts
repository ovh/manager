import { Question } from 'inquirer';
import type * as inquirer from 'inquirer';

import { GeneratorAnswers } from '../../playbook/types/playbook-types';

/**
 * Base type for a strongly-typed Inquirer.js question.
 * @template T - The answers object shape that the question is targeting.
 */
export interface BaseQ<T> extends Omit<Question, 'name' | 'default' | 'validate' | 'when'> {
  /** The key of the answer in {@link T} that this question will populate. */
  name: keyof T & string;
  /**
   * Optional conditional function that determines if this question should be asked.
   * @param answers - Current collected answers.
   * @returns Boolean or a Promise resolving to a boolean indicating whether to show the question.
   */
  when?: (answers: T) => boolean | Promise<boolean>;
}

/**
 * Inquirer.js "input" question type.
 * @template T - The answers object shape.
 */
export interface InputQ<T> extends BaseQ<T> {
  type: 'input';
  /** Default string value or a function returning it. */
  default?: string | ((answers: T) => string);
  /**
   * Validation function for the answer.
   * @param value - User input.
   * @param answers - Current collected answers.
   * @returns True if valid, or a string error message.
   */
  validate?: (value: string, answers?: T) => true | string | Promise<true | string>;
}

/**
 * Inquirer.js "list" or "rawlist" question type.
 * @template T - The answers object shape.
 */
export interface ListQ<T> extends BaseQ<T> {
  type: 'list' | 'rawlist';
  /** Choices as an array or a function returning them. */
  choices:
    | Array<string | { name: string; value: string }>
    | ((answers: T) => Array<string | { name: string; value: string }>);
  /** Default choice value. */
  default?: string | ((answers: T) => string);
  /** Validation function for the selected value. */
  validate?: (value: string, answers?: T) => true | string | Promise<true | string>;
}

/**
 * Inquirer.js "autocomplete" question type (from inquirer-autocomplete-prompt).
 * @template T - The answers object shape.
 */
export interface AutocompleteQuestion<T> extends BaseQ<T> {
  type: 'autocomplete';
  /**
   * Function to dynamically provide autocomplete suggestions.
   * @param answers - Current collected answers or unknown.
   * @param input - Current input string.
   * @returns A Promise resolving to an array of choices.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  source: (answers: T | unknown, input?: string) => Promise<Array<{ name: string; value: string }>>;
}

/**
 * Inquirer.js "confirm" question type.
 * @template T - The answers object shape.
 */
export interface ConfirmQ<T> extends BaseQ<T> {
  type: 'confirm';
  /** Default boolean value. */
  default?: boolean | ((answers: T) => boolean);
}

/**
 * Inquirer.js "checkbox" question type (multi-select).
 * @template T - The answers object shape.
 */
export interface CheckboxQ<T> extends BaseQ<T> {
  type: 'checkbox';
  /** Choices as an array or a function returning them. */
  choices:
    | Array<string | { name: string; value: string }>
    | ((answers: T) => Array<string | { name: string; value: string }>);
  /** Default selected values. */
  default?: string[] | ((answers: T) => string[]);
  /** Validation function for the selected values array. */
  validate?: (value: string[], answers?: T) => true | string | Promise<true | string>;
}

/** The minimal operation shape we render in list choices. */
export type OperationItem = { apiPath: string; functionName: string };

/** Minimal method-group shape returned by getApiTemplateData. */
export type MethodGroup = {
  [method: string]: { operationList?: OperationItem[] } | undefined;
  get?: { operationList?: OperationItem[] };
};

/** Selected API paths split by version. */
export type VersionSplit = { v2: string[]; v6: string[] };

/** Safe, minimal choice union for our prompts without DistinctChoice. */
/** TS-safe choice union (no DistinctChoice, no Separator). */
export type PromptChoice =
  | { name: string; value: string } // normal selectable entry
  | { name: string; disabled: true } // visual header / separator
  | string; // simple string choice (fallback)

/** Questions array type without importing QuestionCollection / DistinctChoice. */
export type Questions = Array<inquirer.DistinctQuestion<Partial<GeneratorAnswers>>>;
