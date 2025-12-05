import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { Search, Folder } from 'lucide-react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import FileIcon from '@/components/file-icon/FileIcon.component';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  deferredSearchQuery: string;
  filteredObjects: StorageObject[];
  placeholder?: string;
}

const SearchBar = ({
  searchQuery,
  onSearchChange,
  deferredSearchQuery,
  filteredObjects,
  placeholder = 'Search...',
}: SearchBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setSearchOpen(value.length > 0);
  };

  const showResults =
    searchOpen && deferredSearchQuery && deferredSearchQuery.length > 0;

  return (
    <Popover open={showResults} onOpenChange={setSearchOpen}>
      <Command className="rounded-lg border-none shadow-none">
        <div className="flex pl-4">
          <PopoverTrigger asChild className="cursor-pointer">
            <div className="flex items-stretch border rounded-md overflow-hidden [&>div]:border-none [&>div>svg]:hidden">
              <CommandInput
                value={searchQuery}
                onValueChange={handleSearchChange}
                placeholder={placeholder}
              />
              <Button className="rounded-l-none rounded-r-[5px] h-auto">
                <Search />
              </Button>
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-[400px] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <CommandList>
            {filteredObjects.length === 0 && (
              <CommandEmpty>No results.</CommandEmpty>
            )}
            {filteredObjects.length > 0 && (
              <CommandGroup>
                {filteredObjects.map((item) => {
                  const isFolder = item.key?.endsWith('/');
                  return (
                    <CommandItem
                      key={`${item.key}-${item.versionId || 'latest'}`}
                      value={item.key}
                      onSelect={() => {
                        navigate(
                          `./object?objectKey=${encodeURIComponent(
                            item.key || '',
                          )}`,
                        );
                        setSearchOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {isFolder ? (
                        <Folder className="mr-2 h-4 w-4" />
                      ) : (
                        <FileIcon
                          fileName={item.key || ''}
                          className="mr-2 h-4 w-4 flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">
                          {String(item.key || '')
                            .split('/')
                            .pop()}
                        </span>
                        <span className="text-xs opacity-60 truncate">
                          {item.key}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
};

export default SearchBar;
