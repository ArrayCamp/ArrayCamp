import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseFooter } from './exercise-footer';

describe('ExerciseFooter', () => {
  let component: ExerciseFooter;
  let fixture: ComponentFixture<ExerciseFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
