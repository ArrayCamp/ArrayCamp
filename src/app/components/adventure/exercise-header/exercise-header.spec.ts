import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseHeader } from './exercise-header';

describe('ExerciseHeader', () => {
  let component: ExerciseHeader;
  let fixture: ComponentFixture<ExerciseHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
