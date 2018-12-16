import { TestBed } from '@angular/core/testing';

import { StarredBusesService } from './starred-buses.service';

describe('StarredBusesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarredBusesService = TestBed.get(StarredBusesService);
    expect(service).toBeTruthy();
  });
});
