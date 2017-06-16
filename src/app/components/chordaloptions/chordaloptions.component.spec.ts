import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordaloptionsComponent } from './chordaloptions.component';

describe('ChordaloptionsComponent', () => {
  let component: ChordaloptionsComponent;
  let fixture: ComponentFixture<ChordaloptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChordaloptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordaloptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
