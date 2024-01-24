import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GenericUser } from '@/data/cdb/users';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ConfirmDeleteUser from './confirmDeleteUser';
import ConfirmResetPassword from './confirmResetPassword';

interface UserActionsProps {
  user: GenericUser;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  lang?: string;
}
type ActionConfirmContent = 'delete' | 'reset-password';

const UserActions = ({
  user,
  onDeleteClicked,
  onResetPasswordClicked,
}: UserActionsProps) => {
  const [confirmContent, setConfirmContent] = useState<ActionConfirmContent>(
    'delete',
  );
  return (
    <div className="w-full text-right pr-2">
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                toast.error('Edition not implemented yet', {
                  dismissible: true,
                });
              }}
            >
              Edit
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onClick={() => setConfirmContent('reset-password')}
              >
                Reset the password
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onClick={() => setConfirmContent('delete')}>
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {confirmContent === 'delete' && (
          <ConfirmDeleteUser user={user} onDeleteClicked={onDeleteClicked} />
        )}
        {confirmContent === 'reset-password' && (
          <ConfirmResetPassword
            user={user}
            onResetPasswordClicked={onResetPasswordClicked}
          />
        )}
      </AlertDialog>
    </div>
  );
};

export default UserActions;
