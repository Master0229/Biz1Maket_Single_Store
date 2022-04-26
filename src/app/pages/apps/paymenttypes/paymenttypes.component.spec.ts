import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenttypesComponent } from './paymenttypes.component';

describe('PaymenttypesComponent', () => {
  let component: PaymenttypesComponent;
  let fixture: ComponentFixture<PaymenttypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymenttypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymenttypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
