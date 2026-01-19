/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Exercise } from '../../../../components/adventure/exercise';
import { Code } from '../../../../directives/code';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NgOptimizedImage } from '@angular/common';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-make',
  imports: [Code, ExerciseFooter, ExerciseHeader, MatBottomSheetModule, MatButton, MatIcon, NgOptimizedImage],
  templateUrl: './make.html',
  styleUrl: './make.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Make extends Exercise {
  protected override totalQuestions = 1;
  readonly question1Answer = signal(`Option Explicit
Option Base 1

Sub Checklist()

End Sub`);
  readonly question1Tips = signal<string[]>([]);
  readonly question1ShowTips = signal(false);
  readonly question1Solution = `Option Explicit
Option Base 1

Sub Checklist()

    Const AANTAL = 3
    Dim strArray(AANTAL) As String
    Dim intI As Integer
    Dim strTekst As String
    Dim intOpslag As Integer

    strTekst = "Checklist: " & vbNewLine

    For intI = 1 To AANTAL
        strArray(intI) = InputBox("Geef input")
        strTekst = strTekst & "- " & strArray(intI)
        If intI < AANTAL Then
            strTekst = strTekst & vbNewLine
        End If
    Next intI

    MsgBox (strTekst)

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
          Schrijf nu zelf een programma met de naam Checklist dat een string-array van 3 elementen (index 1 t.e.m. 3)
          aanmaakt en de nodige hulpvariabelen declareert. Het programma vraagt 3 keer via een InputBox welk kampeeritem je
          wil toevoegen, waarbij het nummer van het item in de vraag vermeld wordt (bv. “Geef item 1 in:”). Elke ingegeven
          tekst wordt in een For-lus opgeslagen in de array. Binnen dezelfde lus bouw je één tekst op in het formaat:
          “Checklist:” gevolgd door telkens - item op een nieuwe regel. Toon het volledige lijstje met één MsgBox, zoals in
          het voorbeeld:
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
