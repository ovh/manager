export default function registerFragment(fragmentId) {
  if (!/^[\w-]+$/.test(fragmentId) || fragmentId === 'application') {
    return Promise.reject(new Error(`invalid fragment id '${fragmentId}'`));
  }
  return new Promise((resolve, reject) => {
    window.ovhMicroFrontend.onFragmentLoaded({
      id: fragmentId,
      resolve,
      reject,
    });
  });
}
