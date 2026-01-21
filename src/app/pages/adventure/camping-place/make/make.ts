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
          Schrijf nu zelf een programma met de naam CampingPlaatsen dat een boolean-array van 10 elementen 
          (index 1 t.e.m. 10) aanmaakt om per campingplaats bij te houden of die bezet is, 
          en de nodige hulpvariabelen declareert. Het programma vraagt met behulp van een for-lus via een InputBox 
          voor elke plaats of deze bezet is (1 = ja, 0 = nee), waarbij het nummer van de plaats in de vraag vermeld wordt, 
          en slaat dit telkens op in de array boolBezet. Daarna geef je deze array door aan een functie die de eerste vrije 
          campingplaats opzoekt met een Do While..Loop en het nummer van die plaats teruggeeft (of 0 als er geen vrije plaats is). Daarna keer je terug 
          naar het hoofdprogramma. Als er geen vrije plaats is, toon je met één MsgBox: “De camping is volledig volzet.”. 
          Als er wel een vrije plaats is, roep je een subroutine op die deze plaats reserveert 
          (door de juiste waarde in de array aan te passen) en toon je daarna met één MsgBox: “Gereserveerd: plaats X”.
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
