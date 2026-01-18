import { ChangeDetectionStrategy, Component, computed, model, signal, WritableSignal } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
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
import { NgClass } from '@angular/common';

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
    MatRadioButton,
    MatRadioGroup,
    NgClass,
  ],
  templateUrl: './predict.html',
  styleUrl: './predict.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Predict extends Exercise {
  protected override totalQuestions = 3;

  readonly question1Checked = signal(false);
  readonly question1Correct = signal(false);
  readonly question1Solution = ['2', '4', '6', '8', '1', '2', '3', '4'];
  readonly question1Elements = signal(shuffle(this.question1Solution));
  readonly question1Value1 = signal<string[]>([]);
  readonly question1Value1Correct = signal(false);
  readonly question1Value2 = signal<string[]>([]);
  readonly question1Value2Correct = signal(false);
  readonly question1Value3 = signal<string[]>([]);
  readonly question1Value3Correct = signal(false);
  readonly question1Value4 = signal<string[]>([]);
  readonly question1Value4Correct = signal(false);
  readonly question1Index1 = signal<string[]>([]);
  readonly question1Index1Correct = signal(false);
  readonly question1Index2 = signal<string[]>([]);
  readonly question1Index2Correct = signal(false);
  readonly question1Index3 = signal<string[]>([]);
  readonly question1Index3Correct = signal(false);
  readonly question1Index4 = signal<string[]>([]);
  readonly question1Index4Correct = signal(false);
  readonly question1DropListMapping = new Map<string, WritableSignal<string[]>>([
    ['question-1-elements', this.question1Elements],
    ['question-1-value-1', this.question1Value1],
    ['question-1-value-2', this.question1Value2],
    ['question-1-value-3', this.question1Value3],
    ['question-1-value-4', this.question1Value4],
    ['question-1-index-1', this.question1Index1],
    ['question-1-index-2', this.question1Index2],
    ['question-1-index-3', this.question1Index3],
    ['question-1-index-4', this.question1Index4],
  ]);
  readonly question1DropListIds = Array.from(this.question1DropListMapping.keys());

  readonly question2Answer = model('');
  readonly question2Answers = signal(shuffle(['2', '4', '6', '8']));
  readonly question2Checked = signal(false);
  readonly question2Correct = signal(false);
  readonly question2Solution = '6';
  readonly question2ShowFeedback = signal(false);

  readonly question3Answer = model('');
  readonly question3Answers = signal(
    shuffle([
      'De array start bij index 0',
      'Elke array-waarde wordt bepaald door de lus',
      'De messagebox toont automatisch de hoogste waarde',
      'De array bevat maar 3 elementen',
    ]),
  );
  readonly question3Checked = signal(false);
  readonly question3Correct = signal(false);
  readonly question3Solution = 'Elke array-waarde wordt bepaald door de lus';
  readonly question3ShowFeedback = signal(false);

  readonly isCheckDisabled = computed(() => {
    switch (this.question()) {
      case 2:
        return !this.question2Answer();
      case 3:
        return !this.question3Answer();
    }

    return false;
  });

  override check(): void {
    if (this.question() === 1) {
      this.question1Value1Correct.set(this.question1Value1()[0] === this.question1Solution[0]);
      this.question1Value2Correct.set(this.question1Value2()[0] === this.question1Solution[1]);
      this.question1Value3Correct.set(this.question1Value3()[0] === this.question1Solution[2]);
      this.question1Value4Correct.set(this.question1Value4()[0] === this.question1Solution[3]);
      this.question1Index1Correct.set(this.question1Index1()[0] === this.question1Solution[4]);
      this.question1Index2Correct.set(this.question1Index2()[0] === this.question1Solution[5]);
      this.question1Index3Correct.set(this.question1Index3()[0] === this.question1Solution[6]);
      this.question1Index4Correct.set(this.question1Index4()[0] === this.question1Solution[7]);
      this.question1Correct.set(
        this.question1Value1Correct() &&
          this.question1Value2Correct() &&
          this.question1Value3Correct() &&
          this.question1Value4Correct() &&
          this.question1Index1Correct() &&
          this.question1Index2Correct() &&
          this.question1Index3Correct() &&
          this.question1Index4Correct(),
      );
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
            this.question1Elements.set([]);
            this.question1Value1.set([this.question1Solution[0]]);
            this.question1Value2.set([this.question1Solution[1]]);
            this.question1Value3.set([this.question1Solution[2]]);
            this.question1Value4.set([this.question1Solution[3]]);
            this.question1Index1.set([this.question1Solution[4]]);
            this.question1Index2.set([this.question1Solution[5]]);
            this.question1Index3.set([this.question1Solution[6]]);
            this.question1Index4.set([this.question1Solution[7]]);
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

    if (this.question() === 3) {
      this.question3Correct.set(this.question3Answer() === this.question3Solution);
      this.question3Checked.set(true);

      if (!this.question3Correct()) {
        const incorrectBottomSheetRef = this.bottomSheet.open(IncorrectBottomSheet, {
          data: {
            seeAnswer: true,
          },
        });

        incorrectBottomSheetRef.afterDismissed().subscribe((result) => {
          if (result === 'see-answer') {
            this.continueWithoutStar.set(true);
            this.question3Answer.set(this.question3Solution);
            this.question3Correct.set(true);
            this.question3ShowFeedback.set(true);
            this.checked.set(true);
            this.scrollToBottom();
          }
        });

        return;
      }
    }

    super.check();
  }

  question1ElementDropped(event: CdkDragDrop<string[]>): void {
    const fromDropList = this.question1DropListMapping.get(event.previousContainer.id);
    const toDropList = this.question1DropListMapping.get(event.container.id);

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
