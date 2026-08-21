import { InjectionToken } from '@angular/core';
import type { StynxSdkClient } from '@aarusso-nyx/stynx-sdk';

export const STYNX_PROFILE_CLIENT = new InjectionToken<StynxSdkClient>('STYNX_PROFILE_CLIENT');
