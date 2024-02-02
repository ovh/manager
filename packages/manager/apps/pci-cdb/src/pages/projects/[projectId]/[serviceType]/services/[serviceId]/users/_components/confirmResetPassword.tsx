import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { GenericUser } from '@/data/cdb/users';

interface ConfirmResetPasswordProps {
  onResetPasswordClicked: (user: GenericUser) => void;
  user: GenericUser;
}

const ConfirmResetPassword = ({
  user,
  onResetPasswordClicked,
}: ConfirmResetPasswordProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Reset password</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to reset the password for the user{' '}
          {user.username} ? This cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => onResetPasswordClicked(user)}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default ConfirmResetPassword;
