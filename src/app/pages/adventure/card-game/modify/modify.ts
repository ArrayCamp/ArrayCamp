import { ChangeDetectionStrategy, Component, model, OnInit, signal } from '@angular/core';
import { Exercise } from '../../../../components/adventure/exercise';
import { FormsModule } from '@angular/forms';
import { Code } from '../../../../directives/code';
import { MatFormField, MatInput } from '@angular/material/input';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { FeedbackButton } from '../../../../components/adventure/feedback-button/feedback-button';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';

@Component({
  selector: 'app-modify',
  imports: [Code, ExerciseFooter, ExerciseHeader, FeedbackButton, FormsModule, MatFormField, MatInput],
  templateUrl: './modify.html',
  styleUrl: './modify.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modify extends Exercise implements OnInit {
  protected override totalQuestions = 1;

  readonly question1Answer = model<string>();
  readonly question1Checked = signal(false);
  readonly question1Correct = signal(false);
  readonly question1Solution = 'intMax = intAantalKaarten(1)';
  readonly question1ShowFeedback = signal(false);

  ngOnInit(): void {
    this.question1Answer.set('intMax = 1');
  }

  override check(): void {
    if (this.question() === 1) {
      this.question1Checked.set(true);
      this.question1Correct.set(this.question1Answer()?.trim() === this.question1Solution);

      if (!this.question1Correct()) {
        const incorrectBottomSheetRef = this.bottomSheet.open(IncorrectBottomSheet, {
          data: {
            seeAnswer: true,
          },
        });

        incorrectBottomSheetRef.afterDismissed().subscribe((result) => {
          if (result === 'see-answer') {
            this.continueWithoutStar.set(true);
            this.question1Answer.set(this.question1Solution);
            this.question1Correct.set(true);
            this.question1ShowFeedback.set(true);
            this.checked.set(true);
            this.scrollToBottom();
          }
        });

        return;
      }
    }

    super.check();
  }
}
