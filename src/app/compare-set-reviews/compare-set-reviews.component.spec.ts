import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSetReviewsComponent } from './compare-set-reviews.component';

describe('CompareSetReviewsComponent', () => {
  let component: CompareSetReviewsComponent;
  let fixture: ComponentFixture<CompareSetReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareSetReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareSetReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
