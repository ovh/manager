import React, {
  FunctionComponent,
  UIEvent,
  SyntheticEvent,
  createContext,
} from 'react';
import { FileInputList } from './FileInputList';
import { FileInputErrorMessage } from './FileInputErrorMessage';
import { FileInput } from './FileInput';

type Event = {
  files: File[];
  e: UIEvent | SyntheticEvent;
};

export type EventHandler = (e: Event) => void | undefined;

export type FileInputProps = {
  id?: string;
  onChange?: EventHandler;
  multiple?: boolean;
  value?: File[];
  accept: string;
  maxSize: number;
  maxFiles: number;
  children: React.ReactNode;
  className?: string;
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
  FileError: FileInputErrorMessage,
});
