import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditreceiveComponent } from './editreceive.component';

describe('EditreceiveComponent', () => {
  let component: EditreceiveComponent;
  let fixture: ComponentFixture<EditreceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditreceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditreceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
