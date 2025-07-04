/** Reids user  definition */
export interface User {
  /** Categories of the user. */
  categories: string[];
  /** Channels of the user. */
  channels: string[];
  /** Commands of the user. */
  commands: string[];
  /** Keys of the user. */
  keys: string[];
  /** Name of the user. */
  name: string;
}
