import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@ovh-ux/manager-themes';

export type SearchInputProps = {
  onSubmit: (search: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  onSubmit,
  placeholder,
}: SearchInputProps): JSX.Element {
  const { t } = useTranslation('searchInput');
  const [value, setValue] = useState('');
  return (
    <InputGroup w="auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (value) {
            onSubmit(value);
            setValue('');
          }
        }}
      >
        <Input
          value={value}
          placeholder={placeholder || t('search')}
          onChange={(event) => setValue(event.target.value)}
        />
        <InputRightElement
          children={
            <IconButton
              type="submit"
              variant="ghost"
              icon={<SearchIcon />}
              aria-label={t('search')}
            />
          }
        />
      </form>
    </InputGroup>
  );
}
