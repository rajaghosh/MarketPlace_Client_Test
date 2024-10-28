import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AolCarouselComponent } from './aol-carousel.component';

describe('AolCarouselComponent', () => {
  let component: AolCarouselComponent;
  let fixture: ComponentFixture<AolCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AolCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AolCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
