import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsScaleHelpComponent } from './ratings-scale-help.component';

describe('RatingsScaleHelpComponent', () => {
  let component: RatingsScaleHelpComponent;
  let fixture: ComponentFixture<RatingsScaleHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsScaleHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsScaleHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
