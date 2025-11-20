import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@datatr-ux/uxlib';
import { Search, Folder } from 'lucide-react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useClickOutside } from '@/hooks/useClickOutside';
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
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useClickOutside(searchRef, handleClickOutside);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onSearchChange(value);
    setSearchOpen(true);
  };

  const handleSearchFocus = () => {
    if (deferredSearchQuery && deferredSearchQuery.length > 0) {
      setSearchOpen(true);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex">
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          placeholder={placeholder}
          className="max-w-full sm:max-w-72 rounded-r-none focus-visible:ring-transparent focus-visible:bg-primary-50 h-10"
        />
        <Button className="rounded-l-none h-10">
          <Search />
        </Button>
      </div>
      {searchOpen && deferredSearchQuery && deferredSearchQuery.length > 0 && (
        <div className="absolute z-50 w-[400px] mt-1 p-0 bg-white border rounded-md shadow-md">
          <Command>
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
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
