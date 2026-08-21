import type { AuthVerificationResult, Principal, PrincipalMapper } from '@aarusso-nyx/stynx-contracts';

export class DefaultPrincipalMapper implements PrincipalMapper {
  map(result: AuthVerificationResult): Principal {
    return result.principal;
  }
}
