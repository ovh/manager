import 'whatwg-fetch';
import semverReverseCompare from 'semver/functions/rcompare';
import semverMaxSatisfaying from 'semver/ranges/max-satisfying';

class OvhFragment extends HTMLElement {
  constructor() {
    super();
    this.scriptElement = null;
  }

  /** Returns the fragment unique identifier */
  get id() {
    return this.getAttribute('fragment-id');
  }

  /** Returns the fragment version (semver format) */
  get version() {
    return this.getAttribute('fragment-version');
  }

  connectedCallback() {
    // Note from mozilla documentation :
    // connectedCallback may be called once your element is no longer connected,
    // use Node.isConnected to make sure.
    if (this.isConnected) {
      // load the fragment manisfest
      fetch(`/manager/fragments/${this.id}/manifest.json`)
        .then((response) => response.json())
        .catch(() => {
          throw new Error(
            `Unable to fetch manifest '/manager/fragments/${this.id}/manifest.json'`,
          );
        })
        // find matching version
        .then(
          ({ versions }) =>
            semverMaxSatisfaying(versions, this.version) || // satisfying version ...
            versions.sort(semverReverseCompare)[0], // or latest
        )
        // dynamically load fragment
        .then((version) => {
          if (!version) {
            throw new Error(
              `No version found for fragment '${this.id}@${this.version}'`,
            );
          }
          this.scriptElement = document.createElement('script');
          this.scriptElement.src = `/manager/fragments/${this.id}/${version}/index.js`;
          this.scriptElement.onerror = () => {
            throw new Error(
              `Unable to fetch script '/manager/fragments/${this.id}/${version}/index.js'`,
            );
          };
          document.querySelector('head').appendChild(this.scriptElement);
          window.ovhMicroFrontend.onFragmentRegister(this);
        });
    }
  }

  disconnectedCallback() {
    if (!this.isConnected) {
      window.ovhMicroFrontend.onFragmentUnloaded(this.id);
      if (this.scriptElement) {
        this.scriptElement.remove();
        this.scriptElement = null;
      }
    }
  }
}

export default OvhFragment;
