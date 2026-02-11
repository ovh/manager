import { ReactElement } from 'react';
import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemProps,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { MoreHorizontal } from 'lucide-react';

export interface RowAction {
  id: string;
  icon: ReactElement;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  withSeparator?: boolean;
  variant?: ButtonProps['variant'] & DropdownMenuItemProps['variant'];
  mobileOnly?: boolean;
  hidden?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
  testId?: string;
}

export function RowActions({ actions, testId }: RowActionsProps) {
  return (
    <>
      {/* Desktop actions */}
      <div className="text-right hidden md:flex">
        {actions
          .filter((a) => !a.mobileOnly && !a.hidden)
          .map((a) => (
            <Button
              key={a.id}
              aria-label={a.label}
              title={a.label}
              onClick={a.onClick}
              mode="ghost"
              size="xs"
              className="p-1"
              variant={a.variant}
              disabled={a.disabled}
            >
              {a.icon}
            </Button>
          ))}
      </div>

      {/* Mobile dropdown menu */}
      <div className="text-right block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid={testId}
              variant="menu"
              size="menu"
              className="p-1 size-6"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions
              .filter((a) => !a.hidden)
              .map((a) => (
                <div key={a.id}>
                  {a.withSeparator && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    data-testid={a.id}
                    onClick={a.onClick}
                    variant={a.variant}
                    disabled={a.disabled}
                  >
                    {a.label}
                  </DropdownMenuItem>
                </div>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
