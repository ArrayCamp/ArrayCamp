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
    { empty: true },
    { index: 2, text: 'Sub CampingPlaatsen()' },
    { index: 3, text: 'Const AANTAL_PLAATSEN As Integer = 10', indent: 4 },
    { index: 4, text: 'Dim boolBezet(AANTAL_PLAATSEN) As Boolean', indent: 4 },
    { index: 5, text: 'Dim intI As Integer', indent: 4 },
    { index: 6, text: 'Dim intVrij As Integer', indent: 4 },
    { index: 7, text: 'intI = 1', indent: 4 },
    { index: 8, text: 'Do While intI <= AANTAL_PLAATSEN', indent: 4 },
    { index: 9, text: 'If CInt(InputBox("Is plaats " & intI & " bezet? (1 = ja, 0 = nee)")) = 1 Then', indent: 8 },
    { index: 10, text: 'boolBezet(intI) = True', indent: 12 },
    { index: 11, text: 'Else', indent: 8 },
    { index: 12, text: 'boolBezet(intI) = False', indent: 12 },
    { index: 13, text: 'End If', indent: 8 },
    { index: 14, text: 'intI = intI + 1', indent: 8 },
    { index: 15, text: 'Loop', indent: 4 },
    { index: 16, text: 'intVrij = ZoekEersteVrijePlaats(boolBezet, AANTAL_PLAATSEN)', indent: 4 },
    { index: 17, text: 'Call ReserveerPlaats boolBezet(intVrij), intVrij', indent: 4 },
    { index: 18, text: 'End Sub' },
    { empty: true },
    {
      index: 19,
      text: 'Function ZoekEersteVrijePlaats(ByRef boolBezet() As Boolean, ByVal intAantal As Integer) As Integer',
    },
    { index: 20, text: 'Dim intI As Integer', indent: 4 },
    { index: 21, text: 'Dim intResultaat As Integer', indent: 4 },
    { index: 22, text: 'intResultaat = 0', indent: 4 },
    { index: 23, text: 'intI = 1', indent: 4 },
    { index: 24, text: 'Do While intI <= intAantal', indent: 4 },
    { index: 25, text: 'If boolBezet(intI) = False And intResultaat = 0 Then', indent: 8 },
    { index: 26, text: 'intResultaat = intI', indent: 12 },
    { index: 27, text: 'End If', indent: 8 },
    { index: 28, text: 'intI = intI + 1', indent: 8 },
    { index: 29, text: 'Loop', indent: 4 },
    { index: 30, text: 'ZoekEersteVrijePlaats = intResultaat', indent: 4 },
    { index: 31, text: 'End Function' },
    { empty: true },
    { index: 32, text: 'Sub ReserveerPlaats(ByRef boolBezet() As Boolean, ByVal intPlaats As Integer)' },
    { index: 33, text: 'boolBezet(intPlaats) = True', indent: 4 },
    { index: 34, text: 'End Sub' },
  ];

  readonly question1Answer = model.required<number[]>();
  readonly question1Checked = signal(false);
  readonly question1Correct = signal(false);
  readonly question1Solution = [17];
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
