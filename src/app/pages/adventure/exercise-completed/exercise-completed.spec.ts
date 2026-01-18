import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCompleted } from './exercise-completed';

describe('ExerciseCompleted', () => {
  let component: ExerciseCompleted;
  let fixture: ComponentFixture<ExerciseCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCompleted],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCompleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
