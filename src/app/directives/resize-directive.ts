import { Directive, ElementRef, inject, effect } from '@angular/core';

@Directive({
  selector: '[appResizeDirective]',
  standalone: true,
  host: {
    'style': 'overflow-y: hidden !important; resize: none !important; display: block;'
  }
})
export class ResizeDirective {
  private element = inject(ElementRef<HTMLTextAreaElement>).nativeElement;

  constructor() {
    this.element.addEventListener('input', () => this.resize());
    
    effect(() => {
     
      this.resize();
    });
  }

  private resize(): void {
    this.element.style.height = 'auto';
    this.element.style.height = `${this.element.scrollHeight}px`;
  }
}