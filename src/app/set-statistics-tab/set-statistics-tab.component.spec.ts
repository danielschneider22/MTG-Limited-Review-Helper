import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStatisticsTabComponent } from './set-statistics-tab.component';

describe('SetStatisticsTabComponent', () => {
  let component: SetStatisticsTabComponent;
  let fixture: ComponentFixture<SetStatisticsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetStatisticsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetStatisticsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
