import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterCompleted } from './chapter-completed';

describe('ChapterCompleted', () => {
  let component: ChapterCompleted;
  let fixture: ComponentFixture<ChapterCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterCompleted],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterCompleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
