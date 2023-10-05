import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss']
})
export class DialogEditAddressComponent {

  user: any;
  loading: boolean = false;
  userData: any;

  ngOnInit() {
    console.log(this.user)
    this.userData = this.toJSON(this.user[0])
    console.log(this.userData);

  }

  toJSON(data: any) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      brithDate: data.brithDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city
    }
  }

  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>) { }

  saveUser() { }
}
