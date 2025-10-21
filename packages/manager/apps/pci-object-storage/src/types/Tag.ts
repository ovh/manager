export type Tag = {
  key: string;
  value: string;
};

export type TagMap = Record<number, Tag>;

export const emptyTag: Tag = { key: '', value: '' };

export type TagError = {
  key?: string;
  value?: string;
};

export type TagValidationErrors = Record<number, TagError>;
