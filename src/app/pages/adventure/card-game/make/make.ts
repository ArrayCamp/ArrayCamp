/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Exercise } from '../../../../components/adventure/exercise';
import { Code } from '../../../../directives/code';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-make',
  imports: [Code, ExerciseFooter, ExerciseHeader, MatBottomSheetModule, MatButton, MatIcon],
  templateUrl: './make.html',
  styleUrl: './make.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Make extends Exercise {
  protected override totalQuestions = 1;
  readonly question1Answer = signal(`Option Explicit
Option Base 1

Sub Kaartspel()

End Sub`);
  readonly question1Tips = signal<string[]>([]);
  readonly question1ShowTips = signal(false);
  readonly question1Solution = `Option Explicit
Option Base 1

Sub Kaartspel()

    Const AANTAL_SPELERS As Integer = 5
    Dim intWins(AANTAL_SPELERS) As Integer
    Dim intI As Integer
    Dim intMax As Integer

    For intI = 1 To AANTAL_SPELERS
        intWins(intI) = CInt(InputBox("Geef het aantal wins van speler " & intI & ":"))
    Next intI

    intMax = intWins(1)

    For intI = 2 To AANTAL_SPELERS
        If intWins(intI) > intMax Then
            intMax = intWins(intI)
        End If
    Next intI

    MsgBox "Hoogste UNO-score is: " & intMax


End Sub`;

  readonly isCheckDisabled = computed(() => {
    switch (this.question()) {
      case 1:
        return !this.question1Answer() || this.checking();
    }

    return false;
  });

  override async check(): Promise<void> {
    if (this.question() === 1) {
      this.checking.set(true);

      try {
        this.abortController.set(new AbortController());

        const { data: response, error } = await this.adventureService.validateCodeUsingAI({
          abortSignal: this.abortController()?.signal,
          question: `
          Je speelt UNO met 5 spelers. Van elke speler wordt het aantal gewonnen spelletjes bijgehouden.
          Schrijf een macro met titel Kaartspel die:
          - een array gebruikt om de gewonnen spelletjes van 5 spelers op te slaan
          - via een For-lus voor elke speler met een InputBox vraagt hoeveel wins de speler heeft
          - het hoogste aantal wins bepaalt, waarbij je start met het eerste element van de array
          -via een MsgBox volgende boodschap toont:

          Hoogste UNO-score is: X

          `,
          exampleSolutions: this.question1Solution,
          answer: this.question1Answer(),
        });

        if (error || !response) {
          if (error && error.context.name === 'AbortError') {
            return;
          }

          console.error(error);
          this.snackBar.open(`Er ging iets mis! ${error}`);

          return;
        }

        if (response.tips?.length > 0) {
          this.question1Tips.set(response.tips);
          this.scrollToBottom();
        }

        if (!response.isCorrect) {
          this.bottomSheet.open(IncorrectBottomSheet, {
            data: {
              message: response.feedback,
            },
          });

          return;
        }
      } catch (error) {
        console.error(error);
        this.snackBar.open(`Er ging iets mis! ${error}`);
      } finally {
        this.checking.set(false);
        this.abortController.set(undefined);
      }
    }

    super.check();
  }
}
