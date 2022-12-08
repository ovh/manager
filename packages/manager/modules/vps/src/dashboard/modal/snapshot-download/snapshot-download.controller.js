import 'moment';

export default class SnapshotDownloadController {
  /* @ngInject */
  constructor($translate, atInternet, VpsService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.VpsService = VpsService;
  }

  $onInit() {
    this.size = null;
    this.creationDate = moment(this.tabSummary.snapshot.creationDate).format(
      'LLL',
    );
    this.linkExpirationDate = this.getLinkExpirationDate();
    this.downloadLink = null;
    this.downloadLinkCurlCommand = null;
    this.isLoading = false;
    this.notificationMessage = null;
    this.errorMessage = null;
    this.curlDocumentationLink = 'https://curl.se/docs/manual.html';
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::dashboard::snapshot-download::${hit}`,
      type: 'navigation',
    });
  }

  async generateSnapshotDownloadLink() {
    this.errorMessage = null;
    this.isLoading = true;
    this.VpsService.getSnapshotUrl(this.serviceName)
      .then((data) => {
        this.isLoading = false;
        this.downloadLink = data.url;
        this.size = SnapshotDownloadController.convertSize(data.size);
        this.downloadLinkCurlCommand = `curl "${data.url}" --output ${this.serviceName}-snapshot.bin --fail`;
      })
      .catch((error) => {
        this.isLoading = false;
        switch (error.status) {
          case 404:
            this.errorMessage = `Error ${error.status}:  ${error.statusText}`;
            break;
          case 403:
            this.errorMessage = `Error ${error.status}:  ${error.message}`;
            break;
          case 500:
            this.errorMessage = `Error ${error.status}:  ${error.statusText}`;
            break;
          case 503:
            this.errorMessage = `Error ${error.status}:  ${error.statusText}`;
            break;
          default:
            this.errorMessage = `Error ${error.status}:  ${error.message}`;
        }
      });
  }

  isDownloadLinkAvailable() {
    return !!this.downloadLink;
  }

  static convertSize(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  getLinkExpirationDate() {
    if (this.downloadLink) {
      const params = new Proxy(new URLSearchParams(this.downloadLink), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      return moment.unix(params.temp_url_expires).format('LLL');
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(status) {
    switch (status) {
      case 'loading':
        this.notificationMessage =
          'vps_dashboard_snapshot_download_modal_snapshot_loading_message';
        break;
      case 'success':
        this.notificationMessage =
          'vps_dashboard_snapshot_download_modal_snapshot_curl_success';
        break;
      default:
        this.notificationMessage = null;
    }
    return this.notificationMessage;
  }

  dismissModal() {
    return this.goBack();
  }
}
