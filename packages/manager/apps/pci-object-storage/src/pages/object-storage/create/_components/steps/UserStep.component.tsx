
import { UserWithS3Credentials } from "@/data/hooks/user/useGetUsersWithS3Credentials.hook";
import AddUserForm from "@/pages/object-storage/users/create/AddUserForm.component";
import CreateUser from "@/pages/object-storage/users/create/Create.modal";
import UserSecretKey from "@/pages/object-storage/users/show-secret/UserSecretKey.component";

import user from "@/types/User";
import { RadioGroup, RadioGroupItem, Label, Popover, PopoverTrigger, Button, PopoverContent, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Command, Dialog, DialogTrigger, Badge } from "@datatr-ux/uxlib";
import { ChevronsUpDownIcon } from "lucide-react";
import React, { useState } from "react";

interface UserStepProps {
  value?: number;
  onChange?: (newValue: number) => void;
  users: UserWithS3Credentials[]
}
const UserStep = React.forwardRef<HTMLButtonElement, UserStepProps>(
  ({ value, onChange, users }, ref) => {
    const [open, setOpen] = useState(false);

    const currentUser = users.find(u => u.id === value);
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
              {value
                ?
                <div className="flex gap-2 items-center">
                    <span>{`${currentUser.username} - ${currentUser.description}`}</span>
                </div>
                : "Select a user..."}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
            <Command>
              <CommandInput placeholder="Search user..." />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users.map((u) => (
                    <CommandItem
                      key={u.username}
                      value={`${u.username}-${u.description}`}
                      onSelect={(newValue) => {
                        const newUser = users.find(u => `${u.username}-${u.description}` === newValue);
                        if (newUser.id !== value) {
                          onChange?.(newUser.id)
                        }
                        setOpen(false)
                      }}
                      className="flex gap-2 justify-between"
                    >
                      <span>{`${u.username} - ${u.description}`}</span>
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
              <Button size={'xs'} mode={'outline'}>Créer un nouvel utilisateur</Button>
            </DialogTrigger>
            <AddUserForm onClose={(user) => onChange(user.id)}/>
          </Dialog>
          {currentUser && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size={'xs'} mode={'outline'}>Voir les credentials</Button>
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