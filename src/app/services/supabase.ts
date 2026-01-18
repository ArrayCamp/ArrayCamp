import { computed, inject, Injectable, resource } from '@angular/core';
import { Router } from '@angular/router';
import { kebabCase } from 'lodash';
import {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  UserResponse,
} from '@supabase/supabase-js';

import { ProfileData } from '../pages/profile/profile';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private readonly router = inject(Router);
  private readonly supabase = createClient(
    'https://dmfshwxwhqlnuujmpngc.supabase.co',
    'sb_publishable_BgFET4QvPHYDYMgIThsmvA_qJepysjm',
  );

  readonly profileResource = resource({
    defaultValue: JSON.parse(localStorage.getItem('profile') ?? 'null'),
    params: () => ({
      userId: this.userResource.value()?.data.user?.id,
    }),
    loader: async ({ params }) => {
      if (!params.userId) {
        return Promise.resolve(undefined);
      }

      const profile = await this.supabase.from('profiles').select('*').eq('id', params.userId).single();

      localStorage.setItem('profile', JSON.stringify(profile));

      return profile;
    },
  });

  readonly profile = computed(() => this.profileResource.value()?.data);

  readonly userResource = resource({
    defaultValue: JSON.parse(localStorage.getItem('user') ?? 'null'),
    loader: async () => {
      const user = await this.supabase.auth.getUser();

      localStorage.setItem('user', JSON.stringify(user));

      return user;
    },
  });

  readonly user = computed(() => {
    const user = this.userResource.value()?.data.user;

    if (!user) {
      return undefined;
    }

    return { data: user, profile: this.profile() };
  });

  constructor() {
    this.supabase.auth.onAuthStateChange((event) => {
      this.userResource.reload();

      if (event === 'SIGNED_OUT') {
        this.router.navigateByUrl('');
      }
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();

    return !!data.session?.access_token;
  }

  signUp(username: string, password: string): Promise<AuthResponse> {
    return this.supabase.auth.signUp({
      email: `tine.vervloet+arraycamp-${kebabCase(username)}@thomasmore.be`,
      password,
      options: {
        data: {
          username,
        },
      },
    });
  }

  signIn(username: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.supabase.auth.signInWithPassword({
      email: `tine.vervloet+arraycamp-${kebabCase(username)}@thomasmore.be`,
      password,
    });
  }

  signInWithOtp(email: string, redirectTo?: string): Promise<AuthOtpResponse> {
    if (redirectTo && !redirectTo.startsWith('http')) {
      redirectTo = `${location.origin}${!redirectTo.startsWith('/') ? '/' : ''}${redirectTo}`;
    }

    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
  }

  signOut(): Promise<{
    error: AuthError | null;
  }> {
    return this.supabase.auth.signOut();
  }

  // updateUser({ email, username }: ProfileData): Promise<UserResponse> {
  //   return this.supabase.auth.updateUser({ email, data: { username } });
  // }

  updateUser({ username, password }: ProfileData): Promise<UserResponse> {
    return this.supabase.auth.updateUser({
      email: `tine.vervloet+arraycamp-${kebabCase(username)}@thomasmore.be`,
      password: password !== '' ? password : undefined,
      data: {
        username,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  updateProfile({ adventure }: { adventure: unknown }) {
    return this.supabase.from('profiles').update({ adventure }).eq('id', this.user()?.data.id).select();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  openAICompletion<T>({
    abortSignal,
    prompt,
    systemPrompt,
  }: {
    abortSignal?: AbortSignal;
    prompt: string;
    systemPrompt?: string;
  }) {
    return this.supabase.functions.invoke<T>('openai-completion', {
      body: {
        prompt,
        systemPrompt,
      },
      signal: abortSignal,
    });
  }
}
