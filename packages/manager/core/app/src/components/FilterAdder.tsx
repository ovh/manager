import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
  Select,
  VStack,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { FilterComparator } from '@/api/filters';

interface Filterable {
  key: string;
  label: string;
  comparators: FilterComparator[];
}

export type FilterAdderProps = {
  filterables: Filterable[];
  onAdd: (
    filterable: Filterable,
    value: string,
    comparator: FilterComparator,
  ) => void;
};

export default function FilterAdder({
  filterables,
  onAdd,
}: FilterAdderProps): JSX.Element {
  if (!filterables?.length) {
    return <Button disabled>Filter</Button>;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState(filterables[0]);
  const [comparator, setComparator] = useState<FilterComparator>();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setComparator(filter.comparators[0]);
  }, [filter]);

  return (
    <Popover isOpen={isOpen} placement="auto">
      <PopoverTrigger>
        <Button
          rightIcon={isOpen ? <SmallCloseIcon /> : undefined}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onAdd(filter, value, comparator);
                setValue('');
                setIsOpen(false);
              }}
            >
              <VStack>
                <FormControl>
                  <FormLabel>Column</FormLabel>
                  <Select
                    value={filter.key}
                    onChange={(e) =>
                      setFilter(
                        filterables.find((f) => f.key === e.target.value),
                      )
                    }
                  >
                    {filterables.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    value={comparator}
                    onChange={(e) =>
                      setComparator(e.target.value as FilterComparator)
                    }
                  >
                    {filter.comparators.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Value</FormLabel>
                  <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  width={{ base: '100%' }}
                  disabled={value === ''}
                  onClick={() => {}}
                >
                  Add
                </Button>
              </VStack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
