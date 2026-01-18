import { ChangeDetectionStrategy, Component, effect, input, linkedSignal, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-feedback-button',
  imports: [MatButton, MatIcon],
  templateUrl: './feedback-button.html',
  styleUrl: './feedback-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackButton {
  readonly correct = input.required<boolean>();
  readonly feedback = input.required<boolean>();
  readonly showFeedback = linkedSignal(() => this.feedback());
  readonly feedbackShown = output();

  constructor() {
    effect(() => {
      const showFeedback = this.showFeedback();

      if (showFeedback) {
        this.feedbackShown.emit();
      }
    });
  }
}
