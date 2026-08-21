import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Permission, PermissionGuard, StynxAuthGuard } from '@aarusso-nyx/stynx-auth';
import { Audit, RateLimit } from '@aarusso-nyx/stynx-backend';
import { Idempotent } from '@aarusso-nyx/stynx-idempotency';
import { FlowRuntimeService } from '../flow-runtime.service';
import type { DispatchFlowEffectsDto } from '../types';

@Controller('/flow/effects')
@UseGuards(StynxAuthGuard, PermissionGuard)
export class FlowEffectsController {
  constructor(private readonly runtime: FlowRuntimeService) {}

  @Permission('flow:admin:*')
  @Audit({ action: 'flow.effect.dispatch', entity: 'flow.events' })
  @Idempotent('Idempotency-Key')
  @RateLimit({ bucket: 'tenant', scope: 'flow.effect.dispatch' })
  @Post('/dispatch')
  dispatch(@Body() input: DispatchFlowEffectsDto) {
    return this.runtime.dispatchPendingEffects(input);
  }
}
