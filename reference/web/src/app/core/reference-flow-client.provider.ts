import { inject } from '@angular/core';
import type { EnvironmentProviders, Provider } from '@angular/core';
import { TenantContextService } from '@aarusso-nyx/stynx-angular';
import { StynxSessionService } from '@aarusso-nyx/stynx-angular-auth';
import { STYNX_FLOW_CLIENT } from '@aarusso-nyx/stynx-angular-flow';
import { provideStynxIam } from '@aarusso-nyx/stynx-angular-iam';
import { StynxSdkClient } from '@aarusso-nyx/stynx-sdk';
import { environment } from '../../environments/environment';

function createReferenceSdkClient(session: StynxSessionService, tenantContext: TenantContextService): StynxSdkClient {
  return new StynxSdkClient({
    baseUrl: environment.apiBaseUrl,
    fetchFn: (url, init) => fetch(url, init as RequestInit),
    authProvider: session,
    tenantProvider: {
      getTenantId: () => tenantContext.tenantId(),
    },
  });
}

export function provideReferenceFlowClient(): Provider {
  return {
    provide: STYNX_FLOW_CLIENT,
    deps: [StynxSessionService, TenantContextService],
    useFactory: createReferenceSdkClient,
  };
}

export function provideReferenceIamClient(): EnvironmentProviders {
  return provideStynxIam({
    clientFactory: () => createReferenceSdkClient(
      inject(StynxSessionService),
      inject(TenantContextService),
    ),
  });
}
