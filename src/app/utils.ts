import { isDevMode } from '@angular/core';
import { Bus } from './interfaces';

export function isBusValidated(bus: Bus, date: Date = new Date()) {
  return isDevMode() || (!bus.invalidate_time || bus.invalidate_time < date);
}
