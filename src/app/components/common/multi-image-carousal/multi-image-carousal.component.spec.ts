import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiImageCarousalComponent } from './multi-image-carousal.component';

describe('MultiImageCarousalComponent', () => {
  let component: MultiImageCarousalComponent;
  let fixture: ComponentFixture<MultiImageCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiImageCarousalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiImageCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
