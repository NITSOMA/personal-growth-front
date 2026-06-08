import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { profileguardGuard } from './profileguard-guard';

describe('profileguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => profileguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
