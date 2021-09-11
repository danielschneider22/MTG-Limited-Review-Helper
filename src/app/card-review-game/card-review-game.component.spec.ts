import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReviewGameComponent } from './card-review-game.component';

describe('CardReviewGameComponent', () => {
  let component: CardReviewGameComponent;
  let fixture: ComponentFixture<CardReviewGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardReviewGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReviewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
