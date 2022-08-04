import React, { useState } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export type SearchInputProps = {
  onSubmit: (search: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  onSubmit,
  placeholder,
}: SearchInputProps): JSX.Element {
  const [value, setValue] = useState('');
  return (
    <InputGroup w="auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(value);
          setValue('');
        }}
      >
        <Input
          value={value}
          placeholder={placeholder || 'Search'}
          onChange={(event) => setValue(event.target.value)}
        />
        <InputRightElement
          children={
            <IconButton
              type="submit"
              variant="ghost"
              icon={<SearchIcon />}
              aria-label="Search"
            />
          }
        />
      </form>
    </InputGroup>
  );
}
