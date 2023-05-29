import { alertResolve, goToResolve, advancedModeResolve } from '../../resolves';
import cursorDatagridResolves from '../cursorDatagrid/cursorDatagrid.resolves';

export default [
  ...cursorDatagridResolves,
  alertResolve,
  goToResolve,
  advancedModeResolve,
];
