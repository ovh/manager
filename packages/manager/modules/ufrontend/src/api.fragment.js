export default function registerFragment(fragmentId, fragmentCallback) {
  window.ovhMicroFrontend.onFragmentLoaded({
    id: fragmentId,
    callback: fragmentCallback,
  });
}
