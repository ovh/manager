import '@testing-library/jest-dom';
import { PointerEvent } from './helpers/pointerEvent';

// use a custom pointerEvent as jest does not implement it.
// it is requiered for DropdownMenus
// source: https://github.com/radix-ui/primitives/issues/856#issuecomment-928704064
window.PointerEvent = PointerEvent as any;
