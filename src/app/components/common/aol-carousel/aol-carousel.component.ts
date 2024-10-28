import { Component, OnInit } from '@angular/core';

import {
  ContentChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { CarouselItemDirective } from '../../../directives/carousal-item-directive';


@Component({
  selector: 'aol-carousel',
  exportAs: 'aol-carousel',
  templateUrl: './aol-carousel.component.html',
  styleUrls: ['./aol-carousel.component.css']
})

export class AolCarouselComponent implements AfterViewInit, OnDestroy {

  @ContentChildren(CarouselItemDirective)
  items: QueryList<CarouselItemDirective> | any;
  activeIndex = 0;
  interval = 3000;
  intervalHolder: any;
  isAutoPlaying = true;

  nextSlide() {
    // if( this.activeIndex + 1 === this.items.length ) return;
    // debugger;
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }

  prevSlide() {
    //  if( this.activeIndex === 0 ) return;
    // debugger;
    this.activeIndex =
      (this.activeIndex - 1 + this.items.length) % this.items.length;
  }

  setNextActive() {
    if (this.activeIndex === this.items.length) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = (this.activeIndex + 1) % this.items.length;
    }
  }

  play() {
    this.intervalHolder = setInterval(
      () => this.setNextActive(),
      this.interval
    );
  }

  onMouseLeave() {
    if (this.isAutoPlaying) {
      this.play();
    }
  }

  pause() {
    clearInterval(this.intervalHolder);
  }

  ngAfterViewInit() {
    this.play();
  }
  ngOnDestroy() {
    this.isAutoPlaying = false;
    clearInterval(this.intervalHolder);
  }
}
