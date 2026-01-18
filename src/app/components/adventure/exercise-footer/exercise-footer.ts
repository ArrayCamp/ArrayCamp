import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-exercise-footer',
  imports: [MatButton, MatIcon, MatProgressSpinner, NgClass],
  templateUrl: './exercise-footer.html',
  styleUrl: './exercise-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFooter {
  readonly check = output();
  readonly checked = input.required<boolean>();
  readonly checking = input.required<boolean>();
  readonly continue = output();
  readonly correct = input.required<boolean>();
  readonly isCheckDisabled = input<boolean>();
}
