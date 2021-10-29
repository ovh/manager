import { HTTP_PROTOCOLS, MAX_URL_ENTRIES, REGEX } from './edit-urls.constants';

export default class HostingCdnSharedEditUrlsController {
  $onInit() {
    this.MAX_URL_ENTRIES = MAX_URL_ENTRIES;
    this.TRACKING = {
      CONFIRM: 'edit_urls_confirm',
      CANCEL: 'edit_urls_cancel',
    };

    this.editUrlsModel = {
      protocol: {
        selected: HTTP_PROTOCOLS.HTTP,
        list: [HTTP_PROTOCOLS.HTTP, HTTP_PROTOCOLS.HTTPS],
      },
      newUrl: {
        url: '',
        urlLabelId: 'url',
        validityInvalidFormatKey: 'invalidInputFormat',
        validityLimitReachedKey: 'limitUrlReached',
      },
      preloadedUrls: {
        selected: null,
        list: [],
      },
    };
  }

  onAddUrlClick(form) {
    const { config } = this.model.options.cache.prewarm.api;
    const { newUrl } = this.editUrlsModel;

    // Reset errors form
    [
      newUrl.validityInvalidFormatKey,
      newUrl.validityLimitReachedKey,
    ].forEach((validityKey) =>
      form[newUrl.urlLabelId].$setValidity(validityKey, true),
    );

    // Add new URL entry
    if (newUrl.url.match(REGEX.URL)) {
      config.resources.push(newUrl.url);
      config.resources = Array.from(new Set(config.resources));
      this.editUrlsModel.newUrl.url = '';

      return;
    }

    // Limit reached
    if (config.resources.length > MAX_URL_ENTRIES) {
      form[newUrl.urlLabelId].$setValidity(
        newUrl.validityInvalidFormatKey,
        false,
      );

      return;
    }

    // Display invalid url format
    form[newUrl.urlLabelId].$setValidity(
      newUrl.validityInvalidFormatKey,
      false,
    );
  }

  onRemoveUrlClick() {
    const { selected, list } = this.editUrlsModel.preloadedUrls;

    const urlIndexes = [];
    list.forEach((url, index) => {
      selected.forEach((selectedUrl) => {
        if (selectedUrl === url) urlIndexes.push(index);
      });
    });

    urlIndexes.forEach((indexUrlToRemove) => list.splice(indexUrlToRemove, 1));
  }

  onEditUrlsCancelOrConfirm(trackingActionName) {
    this.trackClick(`prewarm::${trackingActionName}`);

    return this.goBack();
  }
}
