import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<DialogEditUserComponent>) { }

  saveUser() { }
}
