# @ovh-ux/backup-licenses

Shared onboarding module for the Backup Licenses (Veeam Enterprise) product.

Exposes `BackupLicensesRoutes`, meant to be mounted by thin consumer apps (e.g. `hpc-backup-licenses`, and later
a Bare Metal equivalent), the same way `@ovh-ux/backup-agent` is consumed by `hpc-backup-agent-iaas` and
`bmc-backup-agent-baremetal`.

See `spec/BKP-1206-onboarding-page.md` in `packages/manager/apps/hpc-backup-licenses` for the ticket context,
content decisions and outstanding TODOs (order funnel route, dashboard route, final icon).
