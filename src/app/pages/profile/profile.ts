import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { Field, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Supabase } from '../../services/supabase';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

export type ProfileData = {
  // email: string;
  username: string;
  password: string;
};

const initialState: ProfileData = {
  // email: '',
  username: '',
  password: '',
};

@Component({
  selector: 'app-profile',
  imports: [
    Field,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSnackBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private supabase = inject(Supabase);
  private snackBar = inject(MatSnackBar);

  readonly profileModel = linkedSignal<ProfileData>(() => ({
    ...initialState,
    username: this.supabase.profile()?.username ?? '',
  }));
  readonly profileForm = form(this.profileModel, (schemaPath) => {
    // required(schemaPath.email, { message: 'E-mail is verplicht' });
    // email(schemaPath.email, { message: 'Vul een geldig e-mailadres in' });
    required(schemaPath.username, { message: 'Gebruikersnaam is verplicht' });
    minLength(schemaPath.username, 2, { message: 'Minimaal 2 karakters' });
    maxLength(schemaPath.username, 50, { message: 'Maximum 50 karakters' });
  });

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    submit(this.profileForm, async () => {
      const { error } = await this.supabase.updateUser(this.profileModel());

      if (error) {
        console.error(error);

        if (error.code === 'weak_password') {
          return [
            {
              kind: 'server',
              field: this.profileForm.password,
              message: 'Minimaal 6 karakters',
            },
          ];
        } else if (error.code === 'same_password') {
          return [
            {
              kind: 'server',
              field: this.profileForm.password,
              message: 'Dit is je huidige wachtwoord?',
            },
          ];
        }

        this.snackBar.open(`Er ging iets mis! ${error.message}`);

        return undefined;
      }

      this.snackBar.open('Opgeslagen!');

      return undefined;
    });
  }
}
