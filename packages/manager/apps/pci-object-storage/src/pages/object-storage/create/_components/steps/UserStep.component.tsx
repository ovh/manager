import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
  Dialog,
  DialogTrigger,
} from '@datatr-ux/uxlib';
import { ChevronsUpDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserSecretKey from '@/pages/object-storage/users/show-secret/UserSecretKey.component';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';
import AddUserForm from '@/pages/object-storage/users/create/AddUserForm.component';

interface UserStepProps {
  value?: number;
  onChange?: (newValue: number) => void;
  users: UserWithS3Credentials[];
}
const UserStep = React.forwardRef<HTMLButtonElement, UserStepProps>(
  ({ value, onChange, users }, ref) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const [open, setOpen] = useState(false);
    const currentUser = users.find((u) => u.id === value);
    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              role="combobox"
              aria-expanded={open}
              className="text-text border border-input bg-background h-10 w-full rounded-md px-3 py-2 text-sm justify-between hover:bg-background active:bg-background"
            >
              {value ? (
                <div className="flex gap-2 items-center">
                  <span>{currentUser.description}</span>
                </div>
              ) : (
                t('userInputPlaceholder')
              )}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
            <Command>
              <CommandInput placeholder={t('userSearchPlaceholder')} />
              <CommandList>
                <CommandEmpty>{t('userSearchPlaceholder')}</CommandEmpty>
                <CommandGroup>
                  {users.map((u) => (
                    <CommandItem
                      key={u.username}
                      value={`${u.username}-${u.description}`}
                      onSelect={(newValue) => {
                        const newUser = users.find(
                          (us) =>
                            `${us.username}-${us.description}` === newValue,
                        );
                        if (newUser.id !== value) {
                          onChange?.(newUser.id);
                        }
                        setOpen(false);
                      }}
                      className="flex gap-2 justify-between"
                    >
                      <span>{u.description}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="mt-4 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={'xs'} mode={'outline'}>
                {t('userCreateButton')}
              </Button>
            </DialogTrigger>
            <AddUserForm onClose={(user) => onChange(user.id)} />
          </Dialog>
          {currentUser && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size={'xs'} mode={'outline'}>
                  {t('userShowCredentialsButton')}
                </Button>
              </DialogTrigger>
              <UserSecretKey user={currentUser} />
            </Dialog>
          )}
        </div>
      </div>
    );
  },
);

UserStep.displayName = 'UserStep';
export default UserStep;
