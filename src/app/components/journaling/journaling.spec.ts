import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Journaling } from './journaling';

describe('Journaling', () => {
  let component: Journaling;
  let fixture: ComponentFixture<Journaling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Journaling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Journaling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
