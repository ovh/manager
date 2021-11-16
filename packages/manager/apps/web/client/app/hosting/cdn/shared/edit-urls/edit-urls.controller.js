import { HTTP_PROTOCOLS, MAX_URL_ENTRIES } from './edit-urls.constants';

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
        resource: '',
      },
      preloadedUrls: {
        selected: [],
        list: this.model.options.cache.prewarm.api.config.resources.slice(),
      },
    };
  }

  buildPrewarmUrl() {
    const { protocol, newUrl } = this.editUrlsModel;

    return `${protocol.selected.toLowerCase()}://${this.domainName}/${
      newUrl.resource
    }`;
  }

  onAddUrlClick() {
    const { preloadedUrls } = this.editUrlsModel;

    preloadedUrls.list.push(this.buildPrewarmUrl());
    preloadedUrls.list = Array.from(new Set(preloadedUrls.list));
    this.editUrlsModel.newUrl.resource = '';
  }

  onRemoveUrlClick() {
    const { preloadedUrls } = this.editUrlsModel;
    const urlIndexes = [];

    preloadedUrls.list.forEach((url, index) => {
      preloadedUrls.selected.forEach((selectedUrl) => {
        if (selectedUrl === url) urlIndexes.push(index);
      });
    });

    urlIndexes
      .reverse()
      .forEach((indexUrlToRemove) =>
        preloadedUrls.list.splice(indexUrlToRemove, 1),
      );
  }

  onEditUrlsConfirm() {
    this.trackClick(`prewarm::${this.TRACKING.CONFIRM}`);

    const { config } = this.model.options.cache.prewarm.api;
    const { preloadedUrls } = this.editUrlsModel;

    config.resources = preloadedUrls.list;

    return this.goBack();
  }

  onEditUrlsCancel() {
    this.trackClick(`prewarm::${this.TRACKING.CANCEL}`);

    return this.goBack();
  }
}
