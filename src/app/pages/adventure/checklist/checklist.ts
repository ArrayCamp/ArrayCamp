import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-checklist',
  imports: [RouterOutlet],
  templateUrl: './checklist.html',
  styleUrl: './checklist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checklist {}
