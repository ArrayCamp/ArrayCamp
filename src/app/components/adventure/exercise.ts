import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { indexToLetter } from '../../helpers/string';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FeedbackButton } from './feedback-button/feedback-button';
import { ActivatedRoute, Router } from '@angular/router';
import { AdventureService } from '../../pages/adventure/adventure.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive()
export abstract class Exercise implements OnDestroy {
  protected readonly abortController = signal<AbortController | undefined>(undefined);
  protected readonly adventureService = inject(AdventureService);
  protected readonly bottomSheet = inject(MatBottomSheet);
  protected readonly checked = signal(false);
  protected readonly checking = signal(false);
  protected readonly continueWithoutStar = signal(false);
  protected readonly correct = signal(false);
  protected readonly exerciseId = computed(() => this.routeData()?.['exerciseId']);
  protected readonly progress = computed(() => ((this.question() - 1) / this.totalQuestions) * 100);
  protected readonly question = signal(1);
  protected readonly route = inject(ActivatedRoute);
  protected readonly routeData = toSignal(this.route.data);
  protected readonly router = inject(Router);
  protected readonly snackBar = inject(MatSnackBar);
  protected abstract readonly totalQuestions: number;

  readonly feedbackButtons = viewChildren(FeedbackButton);
  readonly questionsElement = viewChild.required('questions', { read: ElementRef<HTMLElement> });

  constructor() {
    effect(() => {
      if (this.question() > this.totalQuestions) {
        this.adventureService.addStar(untracked(() => this.exerciseId())).then(() => {
          setTimeout(() => {
            this.router.navigate(['../voltooid'], { relativeTo: this.route });
          }, 500);
        });
      }
    });

    effect(() => {
      for (const feedbackButton of this.feedbackButtons()) {
        feedbackButton.feedbackShown.subscribe(() => this.scrollToBottom());
      }
    });
  }

  allowSingleItemDrop = (drag: CdkDrag<unknown>, drop: CdkDropList<string[]>): boolean => {
    return drop.data.length === 0;
  };

  check(): void {
    this.checked.set(true);
    this.correct.set(true);

    this.scrollToBottom();
  }

  continue(): void {
    if (this.continueWithoutStar()) {
      this.router.navigate(['/avontuur'], { fragment: this.exerciseId() });
      return;
    }

    // Reset checked
    this.checked.set(false);

    // Reset valid
    this.correct.set(false);

    // Next question
    this.question.set(this.question() + 1);

    this.scrollToBottom();
  }

  indexToLetter = indexToLetter;

  scrollToBottom(): void {
    setTimeout(() => {
      this.questionsElement().nativeElement.scrollTo({
        top: this.questionsElement().nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    });
  }

  tabTo4Spaces(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Remove selected content (if any)
    range.deleteContents();

    // Insert 4 spaces
    const textNode = document.createTextNode('    ');
    range.insertNode(textNode);

    // Move cursor after inserted spaces
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  ngOnDestroy(): void {
    this.abortController()?.abort();
  }
}
