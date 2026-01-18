import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Exercise } from '../../../../components/adventure/exercise';
import { NgClass } from '@angular/common';
import { MatList, MatListItem } from '@angular/material/list';
import { shuffle } from 'lodash';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { IncorrectBottomSheet } from '../../../../components/adventure/incorrect-bottom-sheet/incorrect-bottom-sheet';
import { Code } from '../../../../directives/code';
import { CodeLine } from '../../../../types/code-line';
import { ExerciseHeader } from '../../../../components/adventure/exercise-header/exercise-header';
import { ExerciseFooter } from '../../../../components/adventure/exercise-footer/exercise-footer';

@Component({
  selector: 'app-run',
  imports: [CdkDrag, CdkDropList, Code, ExerciseFooter, ExerciseHeader, MatList, MatListItem, NgClass],
  templateUrl: './run.html',
  styleUrl: './run.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Run extends Exercise {
  protected override totalQuestions = 1;

  readonly question1Solution: CodeLine[] = [
    { index: 0, text: 'Option Explicit' },
    { index: 1, text: 'Option Base 1' },
    { index: 2, text: 'Sub KampeerBoodschappen()' },
    { index: 3, text: 'Const AANTAL As Integer = 3', indent: 4 },
    { index: 4, text: 'Dim strBoodschappen(AANTAL) As String', indent: 4, valid: [4, 5, 6] },
    { index: 5, text: 'Dim strTekst As String', indent: 4, valid: [4, 5, 6] },
    { index: 6, text: 'Dim intI As Integer', indent: 4, valid: [4, 5, 6] },
    { index: 7, text: 'strBoodschappen(1) = "Tent"', indent: 4 },
    { index: 8, text: 'strBoodschappen(2) = "Slaapzak"', indent: 4 },
    { index: 9, text: 'strBoodschappen(3) = "Zwemkledij"', indent: 4 },
    { index: 10, text: 'strTekst = "Boodschappenlijstje:" & vbNewLine', indent: 4 },
    { index: 11, text: 'For intI = 1 To AANTAL', indent: 4 },
    { index: 12, text: 'strTekst = strTekst & "- " & strBoodschappen(intI) & vbNewLine', indent: 8 },
    { index: 13, text: 'Next intI', indent: 4 },
    { index: 14, text: 'MsgBox (strTekst)', indent: 4 },
    { index: 15, text: 'End Sub' },
  ];
  readonly question1Answer = signal<CodeLine[]>(shuffle(this.question1Solution));

  override check(): void {
    if (this.question() === 1) {
      // Set correct property on each answer
      this.question1Answer.update((answer) => {
        answer.forEach((answerLine, answerLineIndex) => {
          answerLine.correct =
            (answerLine.valid && answerLine.valid.includes(answerLineIndex)) || answerLine.index === answerLineIndex;
        });

        return answer;
      });

      // Show incorrect bottom sheet when not all lines are correct
      if (
        !this.question1Answer().every((answerLine, answerLineIndex) => {
          return (
            (answerLine.valid && answerLine.valid.includes(answerLineIndex)) || answerLine.index === answerLineIndex
          );
        })
      ) {
        this.bottomSheet.open(IncorrectBottomSheet, {
          data: {
            // TODO: Better message
            message: 'Dat is niet juist. De codeblokken die wel al juist staan, zijn gemarkeerd.',
          },
        });

        return;
      }
    }

    super.check();
  }

  question1LineDropped(event: CdkDragDrop<CodeLine[]>): void {
    this.question1Answer.update((lines) => {
      moveItemInArray(lines, event.previousIndex, event.currentIndex);
      return lines;
    });
  }
}
