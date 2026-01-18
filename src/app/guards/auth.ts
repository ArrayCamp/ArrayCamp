import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';
import { Supabase } from '../services/supabase';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const supabase = inject(Supabase);
  const router = inject(Router);

  return supabase.isAuthenticated().then((isAuthenticated) => {
    if (isAuthenticated) {
      return true;
    }

    return new RedirectCommand(
      router.createUrlTree(['aanmelden'], {
        queryParams: {
          enDanNaar: state.url,
        },
      }),
    );
  });
};
