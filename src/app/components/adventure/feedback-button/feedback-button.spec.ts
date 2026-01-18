import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackButton } from './feedback-button';

describe('FeedbackButton', () => {
  let component: FeedbackButton;
  let fixture: ComponentFixture<FeedbackButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackButton],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
