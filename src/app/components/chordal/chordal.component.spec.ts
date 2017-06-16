import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordalComponent } from './chordal.component';

describe('ChordalComponent', () => {
  let component: ChordalComponent;
  let fixture: ComponentFixture<ChordalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChordalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
