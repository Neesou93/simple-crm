import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCustomerAddressComponent } from './dialog-edit-customer-address.component';

describe('DialogEditCustomerAddressComponent', () => {
  let component: DialogEditCustomerAddressComponent;
  let fixture: ComponentFixture<DialogEditCustomerAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditCustomerAddressComponent]
    });
    fixture = TestBed.createComponent(DialogEditCustomerAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
