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

Sub Hittegolf()

End Sub`);
  readonly question1Tips = signal<string[]>([]);
  readonly question1ShowTips = signal(false);
  readonly question1Solution = `Option Explicit
Option Base 1

Sub Hittegolf()

    Const AANTAL As Integer = 5
    Dim intTemp(AANTAL) As Integer
    Dim intDag As Integer
    Dim intInvoer As Integer
    Dim intDagenBoven25 As Integer
    Dim intDagenBoven30 As Integer

    intDag = 1

    Do While intDag <= AANTAL

        intInvoer = CInt(InputBox("Geef dagmaximum voor dag " & CStr(intDag) & " (tussen -10 en 50 °C):"))

        If intInvoer >= -10 And intInvoer <= 50 Then
            intTemp(intDag) = intInvoer
            intDag = intDag + 1
        End If

    Loop

    For intDag = 1 To AANTAL
        If intTemp(intDag) > 25 Then
            intDagenBoven25 = intDagenBoven25 + 1
        End If
        If intTemp(intDag) > 30 Then
            intDagenBoven30 = intDagenBoven30 + 1
        End If
    Next intDag

    If intDagenBoven25 = AANTAL And intDagenBoven30 >= 3 Then
        MsgBox "Hittegolf gedetecteerd!"
    Else
        MsgBox "Geen hittegolf."
    End If

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
            Schrijf een subroutine Hittegolf die:

            Een array met 5 dagmaxima gebruikt (Const AANTAL = 5).
            Met een Do While-lus elke dagtemperatuur via InputBox vraagt.
            De input eerst controleert: enkel waarden tussen -10 en 50 zijn geldig (anders opnieuw vragen, niet doorschuiven).
            Controleert of er ergens in de 5 dagen een periode is met:
            alle 5 dagen > 25°C
            en binnen die 5 dagen minstens 3 dagen > 30°C
            Toon in een MsgBox:
            “Hittegolf gedetecteerd!” of
            “Geen hittegolf.”
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
