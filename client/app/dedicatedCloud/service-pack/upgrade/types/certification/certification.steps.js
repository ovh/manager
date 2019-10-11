import selection from '../../steps/selection';
import configureAccess from '../../steps/configure-access';
import configureUsers from '../../steps/configure-users';
import placeOrder from '../../steps/place-order';
import validation from '../../steps/validation';

export default [
  selection,
  configureAccess,
  configureUsers,
  placeOrder,
  validation,
];
