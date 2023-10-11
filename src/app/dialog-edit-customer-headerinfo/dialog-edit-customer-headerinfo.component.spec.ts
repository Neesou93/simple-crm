import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCustomerHeaderinfoComponent } from './dialog-edit-customer-headerinfo.component';

describe('DialogEditCustomerHeaderinfoComponent', () => {
  let component: DialogEditCustomerHeaderinfoComponent;
  let fixture: ComponentFixture<DialogEditCustomerHeaderinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditCustomerHeaderinfoComponent]
    });
    fixture = TestBed.createComponent(DialogEditCustomerHeaderinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
