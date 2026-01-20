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
    { index: 2, text: 'Sub Hittegolf()' },
    { index: 3, text: 'Const AANTAL As Integer = 5', indent: 4 },
    { index: 4, text: 'Dim intTemp(AANTAL) As Integer', indent: 4, valid: [3, 4, 5, 6, 7] },
    { index: 5, text: 'Dim intI As Integer', indent: 4, valid: [3, 4, 5, 6, 7] },
    { index: 6, text: 'Dim intWarm25 As Integer', indent: 4, valid: [3, 4, 5, 6, 7] },
    { index: 7, text: 'Dim intWarm30 As Integer', indent: 4, valid: [3, 4, 5, 6, 7] },
    { index: 8, text: 'For intI = 1 To AANTAL', indent: 4, valid: [8, 9, 11]  },
    { index: 9, text: 'intTemp(intI) = CInt(InputBox("Geef max temperatuur op dag " & CStr(intI)))', indent: 8, valid: [8, 9, 12] },
    { index: 10, text: 'Next intI', indent: 4, valid: [8, 9, 13] },
    { index: 11, text: 'intI = 1', indent: 4, valid: [8, 9, 10,11, 12, 13] },
    { index: 12, text: 'intWarm25 = 0', indent: 4, valid: [8, 9, 10, 11, 12, 13] },
    { index: 13, text: 'intWarm30 = 0', indent: 4, valid: [8, 9, 10, 11, 12, 13] },
    { index: 14, text: 'Do While intI <= AANTAL', indent: 4 },
    { index: 15, text: 'If intTemp(intI) > 25 Then', indent: 8 },
    { index: 16, text: 'intWarm25 = intWarm25 + 1', indent: 12 },
    { index: 17, text: 'End If', indent: 8, valid: [17, 20] },
    { index: 18, text: 'If intTemp(intI) > 30 Then', indent: 8 },
    { index: 19, text: 'intWarm30 = intWarm30 + 1', indent: 12 },
    { index: 20, text: 'End If', indent: 8, valid: [17, 20] },
    { index: 21, text: 'intI = intI + 1', indent: 8 },
    { index: 22, text: 'Loop', indent: 4 },
    {
      index: 23,
      text: 'MsgBox ("Boven 25: " & CStr(intWarm25) & vbNewLine & "Boven 30: " & CStr(intWarm30))',
      indent: 4,
    },
    { index: 24, text: 'End Sub' },
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
