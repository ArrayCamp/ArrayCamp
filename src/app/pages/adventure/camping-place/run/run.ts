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
    { index: 0, text: 'Option Explicit', dragDisabled: true },
    { index: 1, text: 'Option Base 1', dragDisabled: true },
    { index: 2, empty: true },
    // TODO: Re-order indexes drag and drop doesn't work now
    { index: 3, text: 'Sub CampingPlaatsen()', dragDisabled: true },
    { index: 4, text: 'Const AANTAL_PLAATSEN As Integer = 10', indent: 4 },
    { index: 5, text: 'Dim boolBezet(AANTAL_PLAATSEN) As Boolean', indent: 4, valid: [4, 5, 6] },
    { index: 6, text: 'Dim intI As Integer', indent: 4, valid: [4, 5, 6, 16, 17] },
    { index: 7, text: 'Dim intVrij As Integer', indent: 4, valid: [3, 4, 5, 6] },
    { index: 8, text: 'intI = 1', indent: 4, valid: [7, 18, 19] },
    { index: 9, text: 'Do While intI <= AANTAL_PLAATSEN', indent: 4 },
    { index: 10, text: 'boolBezet(intI) = InputBox("Is plaats " & intI & " bezet? (1 = ja, 0 = nee)")', indent: 8 },
    { index: 11, text: 'intI = intI + 1', indent: 8, valid: [10, 24] },
    { index: 12, text: 'Loop', indent: 4, valid: [11, 25] },
    { index: 13, text: 'intVrij = ZoekEersteVrijePlaats(boolBezet, AANTAL_PLAATSEN)', indent: 4 },
    { index: 14, text: 'MsgBox (intVrij)', indent: 4 },
    { index: 15, text: 'End Sub', dragDisabled: true },
    { empty: true },
    {
      index: 16,
      text: 'Function ZoekEersteVrijePlaats(ByRef boolBezet() As Boolean, ByVal intAantal As Integer) As Integer',
      dragDisabled: true,
    },
    { index: 17, text: 'Dim intI As Integer', indent: 4, valid: [4, 5, 6, 16, 17] },
    { index: 18, text: 'Dim intResultaat As Integer', indent: 4, valid: [16, 17] },
    { index: 19, text: 'intResultaat = 0', indent: 4, valid: [18, 19] },
    { index: 20, text: 'intI = 1', indent: 4, valid: [7, 18, 19] },
    { index: 21, text: 'Do While intI <= intAantal', indent: 4 },
    { index: 22, text: 'If boolBezet(intI) = False And intResultaat = 0 Then', indent: 8 },
    { index: 23, text: 'intResultaat = intI', indent: 12 },
    { index: 24, text: 'End If', indent: 8 },
    { index: 25, text: 'intI = intI + 1', indent: 8, valid: [10, 24] },
    { index: 26, text: 'Loop', indent: 4, valid: [11, 25] },
    { index: 27, text: 'ZoekEersteVrijePlaats = intResultaat', indent: 4 },
    { index: 28, text: 'End Function', dragDisabled: true },
  ];

  readonly question1Answer = signal<CodeLine[]>([
    ...this.question1Solution.slice(0, 4),
    ...shuffle(this.question1Solution.slice(4, 15)),
    ...this.question1Solution.slice(15, 18),
    ...shuffle(this.question1Solution.slice(18, 28)),
    this.question1Solution[29],
  ]);

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
