import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampingPlace } from './camping-place';

describe('CampingPlace', () => {
  let component: CampingPlace;
  let fixture: ComponentFixture<CampingPlace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampingPlace],
    }).compileComponents();

    fixture = TestBed.createComponent(CampingPlace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
