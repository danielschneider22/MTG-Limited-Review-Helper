import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourLimitedSetReviewsComponent } from './your-limited-set-reviews.component';

describe('YourLimitedSetReviewsComponent', () => {
  let component: YourLimitedSetReviewsComponent;
  let fixture: ComponentFixture<YourLimitedSetReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourLimitedSetReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourLimitedSetReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
