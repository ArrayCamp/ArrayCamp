import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-card-game',
  imports: [RouterOutlet],
  templateUrl: './card-game.html',
  styleUrl: './card-game.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGame {}
