import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercise-header',
  imports: [MatIcon, MatIconButton, MatProgressBar, RouterLink],
  templateUrl: './exercise-header.html',
  styleUrl: './exercise-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseHeader {
  readonly exerciseId = input.required<string>();
  readonly progress = input.required<number>();
}
