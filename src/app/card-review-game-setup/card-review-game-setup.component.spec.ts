import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReviewGameSetupComponent } from './card-review-game-setup.component';

describe('CardReviewGameSetupComponent', () => {
  let component: CardReviewGameSetupComponent;
  let fixture: ComponentFixture<CardReviewGameSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardReviewGameSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReviewGameSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
