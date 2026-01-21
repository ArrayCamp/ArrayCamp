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

Sub Sport()

End Sub`);
  readonly question1Tips = signal<string[]>([]);
  readonly question1ShowTips = signal(false);
  readonly question1Solution = `Option Explicit
Option Base 1

Sub Sport()
    Const AANTAL As Integer = 3
    Dim strSport(AANTAL) As String
    Dim sngCalPerMin(AANTAL) As Single
    Dim intI As Integer
    Dim intKeuze As Integer
    Dim sngMinuten As Single

    intI = 1
    Do
        strSport(intI) = InputBox("Geef de naam van sport " & intI & ":")
        sngCalPerMin(intI) = CSng(InputBox( _
            "Hoeveel kcal per minuut verbrand je met " & strSport(intI) & "?"))
        intI = intI + 1
    Loop Until intI > AANTAL

    intKeuze = CInt(InputBox( _
        "Welke sport kies je?" & vbNewLine & _
        "1: " & strSport(1) & vbNewLine & _
        "2: " & strSport(2) & vbNewLine & _
        "3: " & strSport(3)))

    sngMinuten = 500 / sngCalPerMin(intKeuze)

    MsgBox "Je moet " & CStr(sngMinuten) & _
           " minuten " & strSport(intKeuze) & _
           " doen om 500 kcal te halen."

End Sub
`;

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
        Schrijf nu zelf een programma met de titel Sport dat twee arrays van 3 elementen (index 1 t.e.m. 3) 
        aanmaakt waarvan 1 dat kommagetallen kan opslaan. Het programma vraagt met behulp van een Do...Loop Until-lus via een
        InputBox eerst de naam van elke sport en daarna hoeveel kiloCalorieën per minuut je met die sport verbrandt, 
        waarbij het nummer van de sport telkens vermeld wordt in de vraag. Vervolgens laat het programma de gebruiker 
        via een InputBox kiezen welke sport hij of zij doet (keuze 1 t.e.m. 3). 
        Daarna bereken je hoeveel minuten nodig zijn om 500 kcal te verbranden met de gekozen sport. 
        Toon tot slot het resultaat met één MsgBox in het 
        formaat: “Je moet X minuten gekozensport doen om 500 kcal te halen.”.
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
