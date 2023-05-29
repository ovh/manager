import { alertResolve, goToResolve } from '../../resolves';
import cursorDatagridResolves from '../cursorDatagrid/cursorDatagrid.resolves';

export default [...cursorDatagridResolves, alertResolve, goToResolve];
