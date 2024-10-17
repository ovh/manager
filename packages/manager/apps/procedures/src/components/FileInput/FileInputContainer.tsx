import React, {
  FunctionComponent,
  UIEvent,
  SyntheticEvent,
  createContext,
} from 'react';
import { FileInputList } from './FileInputList';
import { FileInput } from './FileInput';
import { FileInputTooltip } from './FileInputTooltip';

export type FileWithError = File & {
  errors: string[];
};

type Event = {
  files: FileWithError[];
  e: UIEvent | SyntheticEvent;
};

export type FileInputEventHandler = (e: Event) => void | undefined;

export type FileInputProps = {
  id?: string;
  onChange?: FileInputEventHandler;
  multiple?: boolean;
  value?: FileWithError[];
  accept: string;
  maxSize: number;
  maxFiles: number;
  children: React.ReactNode;
  className?: string;
  disabled: boolean;
};

export const FileInputContext = createContext<FileInputProps | undefined>(
  undefined,
);

const Container: FunctionComponent<FileInputProps> = (props) => {
  return (
    <FileInputContext.Provider value={props}>
      <div className={props.className}>{props.children}</div>
    </FileInputContext.Provider>
  );
};

export const FileInputContainer = Object.assign(Container, {
  FileInput,
  FileList: FileInputList,
  FileTooltip: FileInputTooltip,
});
