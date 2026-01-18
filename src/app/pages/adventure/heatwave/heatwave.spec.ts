import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Heatwave } from './heatwave';

describe('Heatwave', () => {
  let component: Heatwave;
  let fixture: ComponentFixture<Heatwave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heatwave],
    }).compileComponents();

    fixture = TestBed.createComponent(Heatwave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
