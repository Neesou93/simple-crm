import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss'],
})
export class DialogEditAddressComponent {
  firestore: Firestore = inject(Firestore);
  user: any;
  loading: boolean = false;
  userData: any;

  ngOnInit() {
    this.userData = this.toJSON(this.user[0]);
  }

  toJSON(data: any) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city,
      id: data.id,
    };
  }

  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>) {}

  saveUser() {
    this.loading = true;
    this.updateUserFDB(this.userData);
  }

  async updateUserFDB(item: any) {
    await updateDoc(this.getSingleDocRef('users', this.userData.id), item)
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
