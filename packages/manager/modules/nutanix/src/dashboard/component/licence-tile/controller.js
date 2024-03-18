import NutanixLicences from './licences.class';

export default class NutanixLicenceTileCtrl {
  $onInit() {
    const { features } = this.license;
    const licenseFeatures = Array.isArray(features) ? features : [];
    this.licenses = new NutanixLicences(licenseFeatures);
    this.title = this.isLegacyPack
      ? 'nutanix_cluster_licence_title'
      : 'nutanix_cluster_cloud_licence_title';
  }
}
