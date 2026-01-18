import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-camping-place',
  imports: [RouterOutlet],
  templateUrl: './camping-place.html',
  styleUrl: './camping-place.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampingPlace {}
