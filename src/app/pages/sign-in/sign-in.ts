import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { Field, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
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

// export type SignInWithOtpData = {
//   email: string;
// };

// const signInWithOtpInitialState: SignInWithOtpData = {
//   email: '',
// };

export type SignInData = {
  username: string;
  password: string;
};

const signInInitialState: SignInData = {
  username: '',
  password: '',
};

@Component({
  selector: 'app-sign-in',
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
    MatInput,
    MatLabel,
    MatSnackBarModule,
    RouterLinkWithHref,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private supabase = inject(Supabase);

  readonly username = input<string | undefined>(undefined, { alias: 'gebruikersnaam' });
  readonly redirectTo = input<string | undefined>(undefined, { alias: 'enDanNaar' });
  // readonly signInWithOtpModel = signal<SignInWithOtpData>(signInWithOtpInitialState);
  // readonly signInWithOtpForm = form(this.signInWithOtpModel, (schemaPath) => {
  //   required(schemaPath.email, { message: 'E-mail is verplicht' });
  //   email(schemaPath.email, { message: 'Vul een geldig e-mailadres in' });
  // });
  readonly signInModel = linkedSignal<SignInData>(() => ({
    ...signInInitialState,
    username: this.username() ?? signInInitialState.username,
  }));
  readonly signInForm = form(this.signInModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Gebruikersnaam is verplicht' });
    minLength(schemaPath.username, 2, { message: 'Minimaal 2 karakters' });
    maxLength(schemaPath.username, 50, { message: 'Maximum 50 karakters' });
    required(schemaPath.password, { message: 'Wachtwoord is verplicht' });
    minLength(schemaPath.password, 6, { message: 'Minimaal 6 karakters' });
  });

  // onSubmit(event: SubmitEvent): void {
  //   event.preventDefault();

  //   submit(this.signInWithOtpForm, async () => {
  //     const { error } = await this.supabase.signInWithOtp(this.signInWithOtpModel().email, this.redirectTo());

  //     if (error) {
  //       console.error(error);
  //       this.snackBar.open(`Er ging iets mis! ${error.message}`);
  //       return;
  //     }

  //     this.snackBar.open('E-mail verzonden!');
  //     this.signInWithOtpForm().reset(signInWithOtpInitialState);
  //   });
  // }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    submit(this.signInForm, async () => {
      const { error } = await this.supabase.signIn(this.signInModel().username, this.signInModel().password);

      if (error) {
        console.error(error);

        if (error.code === 'invalid_credentials') {
          this.snackBar.open(`Ongeldige inloggegevens!`);

          return [
            {
              kind: 'server',
              message: 'Ongeldige inloggegevens',
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
