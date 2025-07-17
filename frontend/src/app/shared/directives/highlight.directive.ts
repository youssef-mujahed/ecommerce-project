import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string = '';
  @Input() highlightColor: string = 'yellow';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.highlight();
  }

  private highlight(): void {
    if (!this.appHighlight) return;

    const text = this.el.nativeElement.textContent;
    const regex = new RegExp(`(${this.appHighlight})`, 'gi');
    const highlightedText = text.replace(regex, `<mark style="background-color: ${this.highlightColor}">$1</mark>`);
    
    this.el.nativeElement.innerHTML = highlightedText;
  }
} 