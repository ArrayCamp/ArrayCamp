import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { MatButton, MatFabButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { AdventureService } from '../adventure/adventure.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFabButton,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly adventureService = inject(AdventureService);
  private readonly dialog = inject(MatDialog);
  private readonly supabase = inject(Supabase);

  readonly last = this.adventureService.last;
  readonly primmDialogRef = signal<MatDialogRef<TemplateRef<unknown>> | undefined>(undefined);
  readonly primmDialogTemplate = viewChild.required('primmTemplate', { read: TemplateRef<unknown> });
  readonly showIntroVideo = signal(false);
  readonly stars = this.adventureService.stars;
  readonly user = this.supabase.user;

  openPrimmDialog(): void {
    this.primmDialogRef.set(this.dialog.open(this.primmDialogTemplate()));
  }
}
