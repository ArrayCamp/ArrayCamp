import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatList, MatListItem, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../services/supabase';
import { MatIcon } from '@angular/material/icon';

export type Fruit = {
  name: string;
};

@Component({
  selector: 'app-dev',
  imports: [
    CdkDrag,
    CdkDropList,
    FormsModule,
    MatChip,
    MatChipSet,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatListOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelectionList,
  ],
  templateUrl: './dev.html',
  styleUrl: './dev.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dev {
  private readonly supabase = inject(Supabase);

  readonly items = signal(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
  readonly seasons = signal(['Winter', 'Lente', 'Zomer', 'Herfst']);
  readonly favoriteSeason = model('');
  readonly fruit = signal<Fruit[]>([
    { name: 'Appel' },
    { name: 'Banaan' },
    { name: 'Aardbei' },
    { name: 'Appelsien' },
    { name: 'Kiwi' },
    { name: 'Kers' },
  ]);
  readonly code = signal<string[]>([
    'Sub KampeerBoodschappenFout()',
    'Const AANTAL As Integer = 3',
    'Dim strBoodschappen(AANTAL) As String',
    'Dim intI As Integer',
    'Dim strTekst As String',
    '',
    'strBoodschappen(1) = "Tent"',
    'strBoodschappen(2) = "Slaapzak"',
    'strBoodschappen(3) = "Zwemshort"',
    '',
    'strTekst = "Boodschappenlijstje:" & vbNewLine',
    '',
    'For intI = 1 To AANTAL - 1',
    '    strTekst = strTekst & "- " & strBoodschappen(intI) & vbNewLine',
    'Next intI',
    '',
    'MsgBox strTekst',
    'End Sub',
  ]);

  dropItem(event: CdkDragDrop<string[]>): void {
    this.items.update((items) => {
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      return items;
    });
  }

  dropFruit(event: CdkDragDrop<string[]>): void {
    this.fruit.update((fruit) => {
      moveItemInArray(fruit, event.previousIndex, event.currentIndex);
      return fruit;
    });
  }
}
