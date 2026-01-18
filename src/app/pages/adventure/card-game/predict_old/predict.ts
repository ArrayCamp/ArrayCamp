import { ChangeDetectionStrategy, Component, computed, model, signal, WritableSignal } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChip } from '@angular/material/chips';
import { Code } from '../../../../directives/code';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { shuffle } from 'lodash';
import { Exercise } from '../../../../components/adventure/exercise';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { FeedbackButton } from '../../../../components/adventure/feedback-button/feedback-button';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';

@Component({
  selector: 'app-predict',
  imports: [
    Code,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ExerciseFooter,
    ExerciseHeader,
    FeedbackButton,
    FormsModule,
    MatBottomSheetModule,
    MatChip,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl: './predict.html',
  styleUrl: './predict.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Predict extends Exercise {
  protected override totalQuestions = 3;

  readonly question1Answer = model('');
  readonly question1Answers = signal(shuffle(['2', '4', '6', '8']));
  readonly question1Checked = signal(false);
  readonly question1Correct = signal(false);
  readonly question1Solution = '6';
  readonly question1ShowFeedback = signal(false);

  readonly question2Answer = model('');
  readonly question2Answers = signal(
    shuffle([
      'De array start bij index 0',
      'Elke array-waarde wordt bepaald door de lus',
      'De messagebox toont automatisch de hoogste waarde',
      'De array bevat maar 3 elementen',
    ]),
  );
  readonly question2Checked = signal(false);
  readonly question2Correct = signal(false);
  readonly question2Solution = 'Elke array-waarde wordt bepaald door de lus';
  readonly question2ShowFeedback = signal(false);

  readonly question3Elements = signal(shuffle(['2', '4', '6', '8', '1', '2', '3', '4']));
  readonly question3Value1 = signal<string[]>([]);
  readonly question3Value2 = signal<string[]>([]);
  readonly question3Value3 = signal<string[]>([]);
  readonly question3Value4 = signal<string[]>([]);
  readonly question3Index1 = signal<string[]>([]);
  readonly question3Index2 = signal<string[]>([]);
  readonly question3Index3 = signal<string[]>([]);
  readonly question3Index4 = signal<string[]>([]);
  readonly question3DropListMapping = new Map<string, WritableSignal<string[]>>([
    ['question-3-elements', this.question3Elements],
    ['question-3-value-1', this.question3Value1],
    ['question-3-value-2', this.question3Value2],
    ['question-3-value-3', this.question3Value3],
    ['question-3-value-4', this.question3Value4],
    ['question-3-index-1', this.question3Index1],
    ['question-3-index-2', this.question3Index2],
    ['question-3-index-3', this.question3Index3],
    ['question-3-index-4', this.question3Index4],
  ]);

  readonly isCheckDisabled = computed(() => {
    switch (this.question()) {
      case 1:
        return !this.question1Answer();
      case 2:
        return !this.question2Answer();
      case 3:
        return this.question3Elements().length > 0;
    }

    return true;
  });

  override check(): void {
    if (this.question() === 1) {
      this.question1Correct.set(this.question1Answer() === this.question1Solution);
      this.question1Checked.set(true);

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

    if (this.question() === 2) {
      this.question2Correct.set(this.question2Answer() === this.question2Solution);
      this.question2Checked.set(true);

      if (!this.question2Correct()) {
        const incorrectBottomSheetRef = this.bottomSheet.open(IncorrectBottomSheet, {
          data: {
            seeAnswer: true,
          },
        });

        incorrectBottomSheetRef.afterDismissed().subscribe((result) => {
          if (result === 'see-answer') {
            this.continueWithoutStar.set(true);
            this.question2Answer.set(this.question2Solution);
            this.question2Correct.set(true);
            this.question2ShowFeedback.set(true);
            this.checked.set(true);
            this.scrollToBottom();
          }
        });

        return;
      }
    }

    if (
      this.question() === 3 &&
      (this.question3Value1()[0] !== '2' ||
        this.question3Value2()[0] !== '4' ||
        this.question3Value3()[0] !== '6' ||
        this.question3Value4()[0] !== '8' ||
        this.question3Index1()[0] !== '1' ||
        this.question3Index2()[0] !== '2' ||
        this.question3Index3()[0] !== '3' ||
        this.question3Index4()[0] !== '4')
    ) {
      const incorrectBottomSheetRef = this.bottomSheet.open(IncorrectBottomSheet, {
        data: {
          seeAnswer: true,
        },
      });

      incorrectBottomSheetRef.afterDismissed().subscribe((result) => {
        if (result === 'see-answer') {
          this.continueWithoutStar.set(true);
          this.question3Elements.set([]);
          this.question3Value1.set(['2']);
          this.question3Value2.set(['4']);
          this.question3Value3.set(['6']);
          this.question3Value3.set(['8']);
          this.question3Index1.set(['1']);
          this.question3Index2.set(['2']);
          this.question3Index3.set(['3']);
          this.question3Index4.set(['4']);
          this.checked.set(true);
          this.scrollToBottom();
        }
      });

      return;
    }

    super.check();
  }

  question3ElementDropped(event: CdkDragDrop<string[]>): void {
    const fromDropList = this.question3DropListMapping.get(event.previousContainer.id);
    const toDropList = this.question3DropListMapping.get(event.container.id);

    if (!fromDropList || !toDropList) {
      console.warn('Unknown drop container');
      return;
    }

    if (event.previousContainer === event.container) {
      const updated = [...event.container.data];
      moveItemInArray(updated, event.previousIndex, event.currentIndex);
      toDropList.set(updated);
    } else {
      const from = [...event.previousContainer.data];
      const to = [...event.container.data];

      transferArrayItem(from, to, event.previousIndex, event.currentIndex);

      fromDropList.set(from);
      toDropList.set(to);
    }
  }
}
