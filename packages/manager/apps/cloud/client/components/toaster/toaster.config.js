angular.module('managerApp').config((ToastProvider) => {
  ToastProvider.setExtraClasses(
    'messenger-fixed messenger-on-bottom messenger-on-right',
  );
  ToastProvider.setTheme('air');
});
