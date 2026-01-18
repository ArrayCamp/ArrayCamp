import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-incorrect-bottom-sheet',
  imports: [MatButton, MatIcon],
  templateUrl: './incorrect-bottom-sheet.html',
  styleUrl: './incorrect-bottom-sheet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncorrectBottomSheet {
  private readonly bottomSheetRef = inject<MatBottomSheetRef<IncorrectBottomSheet>>(MatBottomSheetRef);

  readonly data = inject<{ message?: string; seeAnswer: boolean }>(MAT_BOTTOM_SHEET_DATA, { optional: true });
  readonly seeAnswer = signal(false);

  tryAgain(): void {
    this.bottomSheetRef.dismiss();
  }

  seeAnswerConfirm(): void {
    this.bottomSheetRef.dismiss('see-answer');
  }
}
