import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInternalOrderComponent } from './edit-internal-order.component';

describe('EditInternalOrderComponent', () => {
  let component: EditInternalOrderComponent;
  let fixture: ComponentFixture<EditInternalOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInternalOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInternalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
