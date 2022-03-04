import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintbilltypesComponent } from './maintbilltypes.component';

describe('MaintbilltypesComponent', () => {
  let component: MaintbilltypesComponent;
  let fixture: ComponentFixture<MaintbilltypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintbilltypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintbilltypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
