/** AI Solutions Label Object */
export interface Label {
  /** Name of the label to update/add */
  name: string;
  /** Value of the label to update/add, is there is no value the label is deleted */
  value?: string;
}
