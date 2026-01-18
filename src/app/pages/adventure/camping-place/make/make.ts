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

Sub CampingPlaatsen()

End Sub`);
  readonly question1Tips = signal<string[]>([]);
  readonly question1ShowTips = signal(false);
  readonly question1Solution = `Option Explicit
   Option Base 1

   Sub CampingPLaatsen()

      Const AANTAL_PLAATSEN As Integer = 10
      Dim boolBezet(AANTAL_PLAATSEN) As Boolean
      Dim intI As Integer
      Dim intVrij As Integer
      Dim intAntwoord As Integer

      For intI = 1 To AANTAL_PLAATSEN
          intAntwoord = CInt(InputBox("Is plaats " & intI & " bezet? (1 = ja, 0 = nee)"))
          If intAntwoord = 1 Then
             boolBezet(intI) = True
          Else
             boolBezet(intI) = False
          End If
          Next intI

      intVrij = ZoekEersteVrijePlaats(boolBezet, AANTAL_PLAATSEN)

      If intVrij = 0 Then
         MsgBox "De camping is volledig volzet."
      Else
        Call ReserveerPlaats(boolBezet, intVrij)
         MsgBox "Gereserveerd: plaats " & intVrij
      End If

  End Sub

  Function ZoekEersteVrijePlaats(ByRef boolBezet() As Boolean, ByVal intAantal As Integer) As Integer

    Dim intI As Integer
    Dim intResultaat As Integer

    intResultaat = 0
    intI = 1

    Do While intI <= intAantal
      If boolBezet(intI) = False And intResultaat = 0 Then
         intResultaat = intI
      End If
          intI = intI + 1
    Loop

    ZoekEersteVrijePlaats = intResultaat

  End Function

  Sub ReserveerPlaats(ByRef boolBezet() As Boolean, ByVal intPlaats As Integer)
      boolBezet(intPlaats) = True
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
            Schrijf een programma CampingPlaatsen die:
            Een boolean-array boolBezet() van 10 elementen aanmaakt.
            Via InputBox per plaats vraagt of deze bezet is
            Met een functie de eerste vrije plaats zoekt
            Met een subroutine die plaats reserveert
            In een MsgBox toont:
            welke plaats gereserveerd werd
            of dat de camping volledig volzet is
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
