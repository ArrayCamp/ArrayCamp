import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Make } from './make';

describe('Make', () => {
  let component: Make;
  let fixture: ComponentFixture<Make>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Make],
    }).compileComponents();

    fixture = TestBed.createComponent(Make);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
