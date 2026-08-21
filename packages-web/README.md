# STYNX Web Packages

`packages-web/` contains the Angular 20/21 and TypeScript client package family for STYNX applications. The suite is layered: `@aarusso-nyx/stynx-sdk` owns framework-agnostic HTTP, auth, tenant, and generated API access; `@aarusso-nyx/stynx-angular` adapts that foundation to Angular providers and interceptors; feature packages add auth, tenancy, i18n, UI, storage, trash, sessions, profile, IAM, audit, and Flow screens.

Supported frontend runtime matrix for this release line:

| Surface                     | Supported versions              |
| --------------------------- | ------------------------------- |
| Angular consumer peer range | `>=20.3.0 <22`                  |
| Angular package build line  | `21.2.15`                       |
| `ng-packagr`                | `21.2.3`                        |
| Angular TypeScript          | `5.9.3`                         |
| Node / pnpm                 | Node `>=24 <25`, pnpm `>=9 <10` |

`pnpm check:engines` enforces this matrix across package manifests.

## Install Matrix

| App need                                                               | Install                                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| Typed STYNX HTTP client without Angular                                | `pnpm add @aarusso-nyx/stynx-sdk`                                |
| Angular core providers, request IDs, auth/tenant/error interceptors    | `pnpm add @aarusso-nyx/stynx-angular @aarusso-nyx/stynx-angular-tenancy` |
| OIDC login, STYNX session exchange, permission guards                  | `pnpm add @aarusso-nyx/stynx-angular-auth`                       |
| Runtime catalogs, locale switching, translate and intl pipes           | `pnpm add @aarusso-nyx/stynx-angular-i18n`                       |
| Shared banners, tables, pagination, toast, icons, empty/loading states | `pnpm add @aarusso-nyx/stynx-angular-ui`                         |
| Document upload/download and multipart upload execution                | `pnpm add @aarusso-nyx/stynx-angular-storage`                    |
| Soft-delete review, restore, and hard-delete UI                        | `pnpm add @aarusso-nyx/stynx-angular-trash`                      |
| Active session display/revocation UI                                   | `pnpm add @aarusso-nyx/stynx-angular-sessions`                   |
| Profile, preferences, security, and hosted-auth action screens         | `pnpm add @aarusso-nyx/stynx-angular-profile`                    |
| IAM user, role, group, membership, and permission screens              | `pnpm add @aarusso-nyx/stynx-angular-iam`                        |
| Audit log, event detail, entity history, and hash integrity screens    | `pnpm add @aarusso-nyx/stynx-angular-audit`                      |
| Flow design, runtime, task, waiver, fill, and analytics screens        | `pnpm add @aarusso-nyx/stynx-angular-flow`                       |

## Architecture

```mermaid
graph LR
  sdk --> angular
  angular-tenancy --> angular
  sdk --> angular-auth
  angular --> angular-auth
  angular-i18n --> angular-auth
  angular --> angular-ui
  angular-i18n --> angular-ui
  angular --> angular-storage
  angular-i18n --> angular-storage
  angular-ui --> angular-storage
  sdk --> angular-trash
  angular-auth --> angular-trash
  angular-i18n --> angular-trash
  angular-ui --> angular-trash
  angular --> angular-sessions
  angular-auth --> angular-sessions
  angular-i18n --> angular-sessions
  angular-ui --> angular-sessions
  sdk --> angular-profile
  angular --> angular-profile
  angular-auth --> angular-profile
  angular-i18n --> angular-profile
  angular-storage --> angular-profile
  angular-ui --> angular-profile
  sdk --> angular-iam
  angular --> angular-iam
  angular-auth --> angular-iam
  angular-i18n --> angular-iam
  angular-ui --> angular-iam
  sdk --> angular-audit
  angular --> angular-audit
  angular-auth --> angular-audit
  angular-i18n --> angular-audit
  angular-ui --> angular-audit
  sdk --> angular-flow
  angular-auth --> angular-flow
  angular-i18n --> angular-flow
  angular-storage --> angular-flow
  angular-ui --> angular-flow
```

## Five-Minute Quickstart

The FE-H starter contract is `tools/create-stynx-app`. From the repository root:

```bash
node tools/create-stynx-app/bin.mjs my-stynx-app
cd my-stynx-app
pnpm start
```

The generated app should bootstrap `provideStynxDefaults(...)`, then pass supported feature provider bundles such as auth and i18n through that core helper. Other feature providers can sit beside it in the same `providers` array.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStynxDefaults } from '@aarusso-nyx/stynx-angular';
import { provideStynxAuth } from '@aarusso-nyx/stynx-angular-auth';
import { StynxI18nModule } from '@aarusso-nyx/stynx-angular-i18n';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStynxDefaults({
      angular: {
        apiBaseUrl: '/api',
        sessionMode: 'bearer',
      },
      auth: provideStynxAuth(authOptions),
      i18n: importProvidersFrom(StynxI18nModule.forRoot(i18nOptions)),
    }),
  ],
});
```

Use [`reference/web`](../reference/web/README.md) as the full showcase and each package README for package-specific install, peer dependencies, snippets, and public surface notes.

## Package Index

- [`@aarusso-nyx/stynx-sdk`](sdk/README.md)
- [`@aarusso-nyx/stynx-angular`](angular/README.md)
- [`@aarusso-nyx/stynx-angular-auth`](angular-auth/README.md)
- [`@aarusso-nyx/stynx-angular-tenancy`](angular-tenancy/README.md)
- [`@aarusso-nyx/stynx-angular-i18n`](angular-i18n/README.md)
- [`@aarusso-nyx/stynx-angular-ui`](angular-ui/README.md)
- [`@aarusso-nyx/stynx-angular-storage`](angular-storage/README.md)
- [`@aarusso-nyx/stynx-angular-trash`](angular-trash/README.md)
- [`@aarusso-nyx/stynx-angular-sessions`](angular-sessions/README.md)
- [`@aarusso-nyx/stynx-angular-profile`](angular-profile/README.md)
- [`@aarusso-nyx/stynx-angular-iam`](angular-iam/README.md)
- [`@aarusso-nyx/stynx-angular-audit`](angular-audit/README.md)
- [`@aarusso-nyx/stynx-angular-flow`](angular-flow/README.md)
