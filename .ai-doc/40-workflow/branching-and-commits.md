---
title: GitHub Branching and Commits
owner: docs-team
last_update: 2025-10-13
tags: [github, workflow, branching, commits, ovhcloud, manager]
ai: true
---

# GitHub Branching and Commits

## 🧭 Purpose

Defines how to branch, commit, and maintain clean history across the **OVHcloud Manager** repository.  
This ensures predictable release cycles, simplified reviews, and atomic contributions that can be tracked and automated.

---

## 🗂️ Repository Setup

The main repository is hosted on GitHub:  

```bash
git clone git@github.com:ovh/manager.git
```

> ℹ️ You must be part of the **OVH organization** on GitHub to push branches.  
> Follow internal onboarding documentation if access is missing.

---

## 🌳 Branching Strategy

### Main Branches

| Branch | Description |
|--------|--------------|
| `master` | Always represents the latest deployed version. |
| `develop` | Contains the latest validated code for the next release. Developers must branch from this branch. |

### Supporting Branches

Temporary branches used for collaboration and removed after merge.

| Type | Purpose | Typical Lifetime |
|------|----------|------------------|
| `project/` | Long-term branch for a full product or refactor project. | Several months |
| `feat/` | New feature branch. | Few weeks |
| `fix/` | Bugfix branch. | Few weeks |

---

## 🧩 Project Branch Workflow

Used for new µApps, revamps, or long-lived features requiring team collaboration.

```bash
git checkout -b project/project-name develop
git push origin project/project-name
```

Then, each contributor works on dedicated feature branches:

```bash
git checkout -b feat/feature-a project/project-name
```

To keep the branch up to date with `develop`:

```bash
git fetch --all -p
git checkout develop && git pull
git checkout project/project-name && git pull
git checkout -b sync/develop-in-project-name project/project-name
git rebase -i develop
```

> 💡 You can use fixup commits to correct previous validated commits. See [Fixup section](#-use-of-git-fixup).

---

## ⚙️ Feature and Bugfix Branches

| Case | Branch Name | Target | Example |
|------|--------------|--------|----------|
| Enhancement on existing product | `feat/MANAGER-xxxxx` | `develop` | `feat/add-info-banner-dashboard` |
| Bug fixing on existing product | `fix/MANAGER-xxxxx` | `develop` | `fix/display-icons-on-order-dropdown` |
| Incremental change on project | `feat/MANAGER-xxxxx` | `project/project-name` | `feat/add-product-dashboard` |
| Bugfix on project | `fix/MANAGER-xxxxx` | `project/project-name` | `fix/display-product-sidebar` |

Creation workflow:

```bash
git fetch --all -p
git checkout develop && git pull
git checkout -b feat/MANAGER-xxxxx develop
```

---

## 🧱 Technical Branches

| Type | Branch Prefix | Example |
|------|----------------|----------|
| Release | `release/` | `release/components-wxx` |
| Build | `build/` | `build/vite-build` |
| CI/CD | `ci/` | `ci/ad-github-workflow` |
| Documentation | `docs/` | `docs/update-maintainers` |
| Refactor | `refactor/` | `refactor/replace-chakraui-with-ods` |
| Tests | `test/` | `test/add-unit-tests-catalog-app` |

---

## 🧩 Commit Rules

### Good Commit Qualities

- **Atomic:** one logical change per commit.  
- **Well-formatted:** follows commit message convention.  
- **Independent:** each commit works standalone.  
- **Granular:** fine-grained without being trivial.

### Example Series

```text
feat(container): add entry in sidebar
feat(appName): init µApp
feat(appName): add onboarding page
fix(appName): redirect to onboarding when no VCD
feat(appName): implement tracking
```

---

## 🧰 Commit Formatting

Automatic helper:

```bash
yarn commit
```

Use flags to include details:

- `--description` → adds body  
- `--breaking` → adds breaking change section  

Manual syntax example:

```text
type(scope): title

ref: MANAGER-xxxxx

Signed-off-by: Full Name <email@ovhcloud.com>
```

> Subject (type + scope + title) ≤ 72 chars  
> Each body line ≤ 100 chars  

### Allowed Commit Types

```
build, chore, ci, docs, feat, fix, perf,
refactor, revert, style, test, sync, release
```

### Scope Examples

```
hub, pci, pci.instance, server, carbon-calculator,
octavia, advices, *
```

---

## 🧩 Use of Git Fixup

Used on project branches to correct validated commits **before** merge into `develop`.

```bash
git log --oneline
git commit --fixup=<commit-hash>
git rebase -i --autosquash HEAD~X
git push origin my-feature-branch --force-with-lease
```

✅ **Good use:** fix QA or review changes.  
🚫 **Bad use:** never fix commits already merged to `develop` or `master`.

---

## 🔁 Merge Strategies

### Project Releases

| Condition | Strategy |
|------------|-----------|
| All commits are clean (“quality commits”) | **Create a merge commit** |
| Commits need cleanup | **Squash & Merge** into temporary branch → rebase → merge to master |
| After QA validation | **Rebase & Merge** to master |

### BAU (Weekly) Releases

| PR Quality | Strategy |
|-------------|-----------|
| ≤ 3 quality commits | Rebase & Merge |
| > 3 quality commits | Merge Commit |
| Translation commits | Squash before merge |

---

## 🧠 Key Notes

- Always prefer **1 commit per JIRA ticket or functionality**.  
- Fix review or QA feedback with `--amend` instead of new commits.  
- Badly formatted commits may be squashed at merge discretion.

---

## 🔗 References

- [GitHub Review and Improvement](./review-and-improvement.md)
- Official Git Workflow Documentation (internal link: OVH-TOOLS-PAGES-MANAGER/technical-documentation/manager/github-branching-and-commits/)
- [Conventional Commits](https://www.conventionalcommits.org/)
