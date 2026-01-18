import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-heatwave',
  imports: [RouterOutlet],
  templateUrl: './heatwave.html',
  styleUrl: './heatwave.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Heatwave {}
