import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcreditrepayComponent } from './editcreditrepay.component';

describe('EditcreditrepayComponent', () => {
  let component: EditcreditrepayComponent;
  let fixture: ComponentFixture<EditcreditrepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcreditrepayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcreditrepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
