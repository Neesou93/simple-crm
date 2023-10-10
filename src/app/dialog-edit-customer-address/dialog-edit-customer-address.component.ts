import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-customer-address',
  templateUrl: './dialog-edit-customer-address.component.html',
  styleUrls: ['./dialog-edit-customer-address.component.scss']
})
export class DialogEditCustomerAddressComponent {
  firestore: Firestore = inject(Firestore);
  customer: any;
  customerData: any;
  loading:boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogEditCustomerAddressComponent>) {}

  ngOnInit() {
    this.customerData = this.toJSON(this.customer[0]);
    console.log('Customer in Edit: ', this.customerData);
  }

  toJSON(data: any) {
    return {
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      street: data.street || '',
      zipCode: data.zipCode || '',
      city: data.city || '',
      phone: data.phone || '',
      branche: data.branche || '',
      customer_manager: data.customer_manager || '',
      profit_per_year: data.profit_per_year || 0,
    };
  }

  saveUser() {
    this.loading = true;
    this.updateUserFDB(this.customerData);
  }

  async updateUserFDB(item: any) {
    await updateDoc(this.getSingleDocRef('customers', this.customerData.id), item)
    .catch((err) => {console.error(err);
    }).then(() =>{
      this.loading = false;
      this.dialogRef.close();
    });
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
}
