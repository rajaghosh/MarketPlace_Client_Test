import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCardDetailsComponent } from './update-card-details.component';

describe('UpdateCardDetailsComponent', () => {
  let component: UpdateCardDetailsComponent;
  let fixture: ComponentFixture<UpdateCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
