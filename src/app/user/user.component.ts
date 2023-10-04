import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from 'src/models/user.class';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  firestore: Firestore = inject(Firestore);
  user: User = new User();


  constructor(public dialog: MatDialog) {
  }

  async addUser(item: {}) {
    await addDoc(this.getUsersRef(), item).catch(
      (err) => { console.log(err) }
    ).then(
      (docRef) => {
        console.log('Document written with ID: ', docRef?.id)
      }
    )
  }

  ngOnDestroy() {
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent)
  }

  getUsersRef() {
    return collection(this.firestore, 'users')
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  returnJSON(data: any) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      brithDate: data.brithDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city
    }
  }
}
