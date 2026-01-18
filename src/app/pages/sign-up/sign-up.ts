import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { Field, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { Supabase } from '../../services/supabase';
import { MatButton } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLinkWithHref } from '@angular/router';

export type SignUpData = {
  username: string;
  password: string;
};

const signUpInitialState: SignUpData = {
  username: '',
  password: '',
};

@Component({
  selector: 'app-sign-up',
  imports: [
    Field,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSnackBarModule,
    RouterLinkWithHref,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private supabase = inject(Supabase);

  readonly username = input<string | undefined>(undefined, { alias: 'gebruikersnaam' });
  readonly redirectTo = input<string | undefined>(undefined, { alias: 'enDanNaar' });
  readonly signUpModel = linkedSignal<SignUpData>(() => ({
    ...signUpInitialState,
    username: this.username() ?? signUpInitialState.username,
  }));
  readonly signUpForm = form(this.signUpModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Gebruikersnaam is verplicht' });
    minLength(schemaPath.username, 2, { message: 'Minimaal 2 karakters' });
    maxLength(schemaPath.username, 50, { message: 'Maximum 50 karakters' });
    required(schemaPath.password, { message: 'Wachtwoord is verplicht' });
    minLength(schemaPath.password, 6, { message: 'Minimaal 6 karakters' });
  });

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    submit(this.signUpForm, async () => {
      const { error } = await this.supabase.signUp(this.signUpModel().username, this.signUpModel().password);

      if (error) {
        console.error(error);

        if (error.code === 'user_already_exists') {
          return [
            {
              field: this.signUpForm.username,
              kind: 'server',
              message: 'Gebruikersnaam is al geregistreerd',
            },
          ];
        }

        this.snackBar.open(`Er ging iets mis! ${error.message}`);

        return undefined;
      }

      this.router.navigateByUrl(this.redirectTo() ?? '');

      return undefined;
    });
  }
}
