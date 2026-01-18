import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorrectBottomSheet } from './incorrect-bottom-sheet';

describe('IncorrectBottomSheet', () => {
  let component: IncorrectBottomSheet;
  let fixture: ComponentFixture<IncorrectBottomSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncorrectBottomSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(IncorrectBottomSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
