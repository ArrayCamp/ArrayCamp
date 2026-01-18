import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { Exercise } from '../../../../components/adventure/exercise';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { CodeLine } from '../../../../types/code-line';
import { NgClass } from '@angular/common';
import { Code } from '../../../../directives/code';
import { FormsModule } from '@angular/forms';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { FeedbackButton } from '../../../../components/adventure/feedback-button/feedback-button';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';

@Component({
  selector: 'app-investigate',
  imports: [
    Code,
    ExerciseFooter,
    ExerciseHeader,
    FeedbackButton,
    FormsModule,
    MatListOption,
    MatSelectionList,
    NgClass,
  ],
  templateUrl: './investigate.html',
  styleUrl: './investigate.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Investigate extends Exercise {
  protected override totalQuestions = 1;

  readonly question1: CodeLine[] = [
    { index: 0, text: 'Option Explicit' },
    { index: 1, text: 'Option Base 1' },
    { index: 2, text: 'Sub Hittegolf()' },
    { index: 3, text: 'Const AANTAL As Integer = 5', indent: 4 },
    { index: 4, text: 'Dim intTemp(AANTAL) As Integer', indent: 4 },
    { index: 5, text: 'Dim intI As Integer', indent: 4 },
    { index: 6, text: 'Dim intWarm As Integer', indent: 4 },
    { index: 7, text: 'Dim intIn As Integer', indent: 4 },
    { index: 8, text: 'intI = 1', indent: 4 },
    { index: 9, text: 'Do While intI <= AANTAL', indent: 4 },
    {
      index: 10,
      text: 'intIn = CInt(InputBox("Geef temperatuur voor dag " & CStr(intI) & " (tussen -10 en 50):"))',
      indent: 8,
    },
    { index: 11, text: 'If intIn < -10 Or intIn > 50 Then', indent: 8 },
    { index: 12, text: 'intTemp(intI) = intIn', indent: 12 },
    { index: 13, text: 'intI = intI + 1', indent: 12 },
    { index: 14, text: 'End If', indent: 8 },
    { index: 15, text: 'Loop', indent: 4 },
    { index: 16, text: 'intWarm = 0', indent: 4 },
    { index: 17, text: 'intI = 1', indent: 4 },
    { index: 18, text: 'Do While intI <= AANTAL', indent: 4 },
    { index: 19, text: 'If intTemp(intI) > 25 Then', indent: 8 },
    { index: 20, text: 'intWarm = intWarm + 1', indent: 12 },
    { index: 21, text: 'End If', indent: 8 },
    { index: 22, text: 'intI = intI + 1', indent: 8 },
    { index: 23, text: 'Loop', indent: 4 },
    { index: 24, text: 'MsgBox(CStr(intWarm))', indent: 4 },
    { index: 25, text: 'End Sub' },
  ];
  readonly question1Answer = model.required<number[]>();
  readonly question1Checked = signal(false);
  readonly question1Correct = signal(false);
  readonly question1Solution = [11];
  readonly question1ShowFeedback = signal(false);

  readonly isCheckDisabled = computed(() => {
    switch (this.question()) {
      case 1:
        return !this.question1Answer();
    }

    return false;
  });

  override check(): void {
    if (this.question() === 1) {
      this.question1Checked.set(true);
      this.question1Correct.set(
        JSON.stringify(this.question1Answer().sort()) === JSON.stringify(this.question1Solution.sort()),
      );

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
