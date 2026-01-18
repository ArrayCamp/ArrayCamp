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
    { index: 2, text: 'Sub KampeerBoodschappen()' },
    { index: 3, text: 'Const AANTAL As Integer = 3', indent: 4 },
    { index: 4, text: 'Dim strBoodschappen(AANTAL) As String', indent: 4 },
    { index: 5, text: 'Dim strTekst As String', indent: 4 },
    { index: 6, text: 'Dim intI As Integer', indent: 4 },
    { index: 7, text: 'strBoodschappen(1) = "Tent"', indent: 4 },
    { index: 8, text: 'strBoodschappen(2) = "Slaapzak"', indent: 4 },
    { index: 9, text: 'strBoodschappen(3) = "Zwemkledij"', indent: 4 },
    { index: 10, text: 'strTekst = "Boodschappenlijstje:" & vbNewLine', indent: 4 },
    { index: 11, text: 'For intI = 1 To AANTAL - 1', indent: 4 },
    { index: 12, text: 'strTekst = strTekst & "- " & strBoodschappen(intI) & vbNewLine', indent: 8 },
    { index: 13, text: 'Next intI', indent: 4 },
    { index: 14, text: 'MsgBox (strTekst)', indent: 4 },
    { index: 15, text: 'End Sub' },
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
