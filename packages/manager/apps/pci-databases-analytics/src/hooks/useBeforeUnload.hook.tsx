import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function useBeforeUnload({ onUnload }: { onUnload: () => void }) {
  const [enabled, setEnabled] = useState(true);
  // control the loading indicator in the top of the app
  const { setLoading } = useLoadingIndicatorContext();
  // block the navigation inside the router app
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname,
  );
  // remove loading indicator if navigation is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setLoading(false);
    }
  }, [blocker.state]);

  // handle navigator navigation (tab closing, window closing, manual url change)
  useEffect(() => {
    async function beforeUnload(e: BeforeUnloadEvent) {
      // avoid navigation on modern browsers
      e.preventDefault();
      // deprecated, but needed for older navigators
      const confirmationMessage = 'You have unsaved changes. Continue?';
      e.returnValue = confirmationMessage;
      // execute the post tracking
      onUnload();
      return confirmationMessage;
    }
    window.addEventListener('beforeunload', beforeUnload);
    // remove the listener on cleanup
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [onUnload]);

  const BeforeUnloadDialog = (
    <>
      {blocker.state === 'blocked' && enabled && (
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you really want to leave the page?</DialogTitle>
              <DialogDescription>Your selection will be lost</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose onClick={() => blocker.reset()}>No</DialogClose>
              <Button
                onClick={() => {
                  onUnload();
                  setLoading(true);
                  blocker.proceed();
                }}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
  return {
    BeforeUnloadDialog,
    enabled,
    setEnabled,
  };
}
