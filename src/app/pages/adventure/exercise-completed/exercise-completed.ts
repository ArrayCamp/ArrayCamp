import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AdventureService } from '../adventure.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-exercise-completed',
  imports: [MatIcon],
  templateUrl: './exercise-completed.html',
  styleUrl: './exercise-completed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseCompleted implements AfterViewInit, OnDestroy {
  private readonly adventureService = inject(AdventureService);
  private readonly chapter = computed(() => this.routeData()?.['chapter'] as string | undefined);
  private readonly chapterProgress = computed(() => {
    const chapter = this.chapter();

    if (!chapter) {
      return 0;
    }

    return this.adventureService.progressPercentageByChapter()[chapter];
  });
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal<Data>(this.route.data);
  private readonly router = inject(Router);
  private timeout?: number;

  ngAfterViewInit(): void {
    const chapterProgress = this.chapterProgress();

    this.timeout = setTimeout(() => {
      if (chapterProgress === 100) {
        this.router.navigate(['../../voltooid'], { relativeTo: this.route });
      } else {
        this.router.navigateByUrl('/avontuur');
      }
    }, 3100);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
