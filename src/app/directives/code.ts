import { AfterViewInit, Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import vbnet from 'highlight.js/lib/languages/vbnet';

hljs.registerLanguage('vbnet', vbnet);

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'code',
})
export class Code implements AfterViewInit {
  private readonly elementRef = inject(ElementRef, { host: true, self: true });

  readonly language = input.required<'vbnet'>();

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.classList.add(`language-${this.language()}`);
    this.highlight();
  }

  @HostListener('blur')
  highlight(): void {
    this.elementRef.nativeElement.removeAttribute('data-highlighted');
    hljs.highlightElement(this.elementRef.nativeElement);
  }
}
