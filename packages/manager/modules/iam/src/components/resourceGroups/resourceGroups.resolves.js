import { alertResolve, goToResolve } from '@iam/resolves';
import cursorDatagridResolves from '../cursorDatagrid/cursorDatagrid.resolves';

export default [...cursorDatagridResolves, alertResolve, goToResolve];
