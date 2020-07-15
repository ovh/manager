export default function registerFragment(fragmentId) {
  return new Promise((resolve) => {
    window.ovhMicroFrontend.onFragmentLoaded({
      id: fragmentId,
      callback: resolve,
    });
  });
}
