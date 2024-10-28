import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorepageComponent } from './explorepage.component';

describe('ExplorepageComponent', () => {
  let component: ExplorepageComponent;
  let fixture: ComponentFixture<ExplorepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
