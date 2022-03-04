import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveOrdComponent } from './receive-ord.component';

describe('ReceiveOrdComponent', () => {
  let component: ReceiveOrdComponent;
  let fixture: ComponentFixture<ReceiveOrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveOrdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveOrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
