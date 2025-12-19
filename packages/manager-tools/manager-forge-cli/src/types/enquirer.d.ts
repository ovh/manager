declare module 'enquirer' {
  export interface Choice<Value extends string = string> {
    name: string;
    value: Value;
    short?: string;
  }

  export interface BasePromptOptions<
    TKey extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > {
    /** Key name of this prompt in the resulting answers */
    name: TKey;
    /** The displayed question message */
    message?: string;
    /**
     * Optional validation function.
     * Receives the current value and the collected answers so far.
     */
    validate?: (value: unknown, state: Partial<TAnswers>) => boolean | string;
    /**
     * Optional initial/default value.
     * Receives the current value (if any) and the previous answers so far.
     */
    initial?: (value: unknown, state: Partial<TAnswers>) => unknown;
    /** Whether to skip this prompt dynamically */
    skip?: (state: Partial<TAnswers>) => boolean | Promise<boolean>;
    /** Normalizes / post-processes the output of the prompt */
    result?: (value: unknown, state: Partial<TAnswers>) => unknown;
  }

  export interface InputPromptOptions<
    TKey extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > extends BasePromptOptions<TKey, TAnswers> {
    type: 'input';
  }

  export interface ConfirmPromptOptions<
    TKey extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > extends BasePromptOptions<TKey, TAnswers> {
    type: 'confirm';
  }

  export interface SelectPromptOptions<
    TKey extends string = string,
    TValue extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > extends BasePromptOptions<TKey, TAnswers> {
    type: 'select';
    choices: Choice<TValue>[] | ((state: Partial<TAnswers>) => Choice<TValue>[]);
  }

  export interface MultiselectPromptOptions<
    TKey extends string = string,
    TValue extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > extends BasePromptOptions<TKey, TAnswers> {
    type: 'multiselect';
    choices: Choice<TValue>[] | ((state: Partial<TAnswers>) => Choice<TValue>[]);
  }

  export interface AutocompletePromptOptions<
    TKey extends string = string,
    TValue extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > extends BasePromptOptions<TKey, TAnswers> {
    type: 'autocomplete';
    choices: Choice<TValue>[] | ((state: Partial<TAnswers>) => Choice<TValue>[]);
    limit?: number;
  }

  export type PromptOptions<
    TKey extends string = string,
    TAnswers extends Record<string, unknown> = Record<string, unknown>,
  > =
    | InputPromptOptions<TKey, TAnswers>
    | ConfirmPromptOptions<TKey, TAnswers>
    | SelectPromptOptions<TKey, string, TAnswers>
    | MultiselectPromptOptions<TKey, string, TAnswers>
    | AutocompletePromptOptions<TKey, string, TAnswers>;

  /** Main prompt function. */
  export function prompt<TAnswers extends Record<string, unknown>>(
    questions:
      | PromptOptions<keyof TAnswers & string, TAnswers>[]
      | PromptOptions<keyof TAnswers & string, TAnswers>,
  ): Promise<TAnswers>;

  /** Default export for ESM interop. */
  const Enquirer: { prompt: typeof prompt };
  export default Enquirer;
}
