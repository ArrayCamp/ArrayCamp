import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Investigate } from './investigate';

describe('Investigate', () => {
  let component: Investigate;
  let fixture: ComponentFixture<Investigate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Investigate],
    }).compileComponents();

    fixture = TestBed.createComponent(Investigate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
