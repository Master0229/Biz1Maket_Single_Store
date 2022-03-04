import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcreditdetailsComponent } from './editcreditdetails.component';

describe('EditcreditdetailsComponent', () => {
  let component: EditcreditdetailsComponent;
  let fixture: ComponentFixture<EditcreditdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcreditdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcreditdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
