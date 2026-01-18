import { NgOptimizedImage } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chapter-completed',
  imports: [NgOptimizedImage],
  templateUrl: './chapter-completed.html',
  styleUrl: './chapter-completed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterCompleted implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private timeout?: number;

  ngAfterViewInit(): void {
    this.timeout = setTimeout(() => {
      this.router.navigateByUrl('/avontuur');
    }, 5100);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
