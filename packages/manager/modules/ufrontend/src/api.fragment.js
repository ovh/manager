export default function registerFragment(fragmentId) {
  return new Promise((resolve, reject) => {
    window.ovhMicroFrontend.onFragmentLoaded({
      id: fragmentId,
      resolve,
      reject,
    });
  });
}
