import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdventureService } from './adventure.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-adventure',
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatIcon,
    MatListItem,
    MatNavList,
    MatTooltip,
    NgClass,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './adventure.html',
  styleUrl: './adventure.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Adventure implements AfterViewInit {
  private readonly adventureService = inject(AdventureService);
  private readonly drawerContentElement = viewChild('content', { read: ElementRef<HTMLElement> });
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly fragment = toSignal(this.route.fragment);
  readonly progress = this.adventureService.progress;
  readonly filterGrayscaleByChapter = this.adventureService.filterGrayscaleByChapter;

  ngAfterViewInit(): void {
    effect(
      () => {
        const fragment = this.fragment();

        if (!fragment) {
          const targetFragment = this.adventureService.last() ?? 'checklist';

          this.router
            .navigate([], {
              fragment: targetFragment,
              replaceUrl: true,
              queryParamsHandling: 'preserve',
            })
            .then(() => this.scrollDrawerToFragment(targetFragment));
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  private scrollDrawerToFragment(fragment: string | null): void {
    const drawerContentElement = this.drawerContentElement();

    if (!drawerContentElement) {
      return;
    }

    if (!fragment) {
      drawerContentElement.nativeElement.scrollTo(0, 0);
      return;
    }

    const section = drawerContentElement.nativeElement.querySelector('#' + fragment);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
