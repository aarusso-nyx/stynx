import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Permission, PermissionGuard, StynxAuthGuard } from '@aarusso-nyx/stynx-auth';
import { Audit, RateLimit } from '@aarusso-nyx/stynx-backend';
import { Idempotent } from '@aarusso-nyx/stynx-idempotency';
import { FlowRuntimeService } from '../flow-runtime.service';
import type { FlowSignalDto } from '../types';

@Controller('/flow/signal')
@UseGuards(StynxAuthGuard, PermissionGuard)
export class FlowSignalController {
  constructor(private readonly runtime: FlowRuntimeService) {}

  @Permission('flow:read:runtime')
  @Audit({ action: 'flow.signal', entity: 'flow.runs' })
  @Idempotent('Idempotency-Key')
  @RateLimit({ bucket: 'tenant', scope: 'flow.signal' })
  @Post()
  signal(@Body() input: FlowSignalDto) {
    return this.runtime.signal(input);
  }
}
