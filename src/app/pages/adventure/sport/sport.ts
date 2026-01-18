import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sport',
  imports: [RouterOutlet],
  templateUrl: './sport.html',
  styleUrl: './sport.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sport {}
