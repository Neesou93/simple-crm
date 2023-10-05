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
  users: any = [];
  unSubUsers;



  constructor(public dialog: MatDialog) {
    this.unSubUsers = this.subUsersList();
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
    this.unSubUsers();
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent)
  }

  getUsersRef() {
    return collection(this.firestore, 'users')
  }

  subUsersList(){
    return onSnapshot(this.getUsersRef(), (list) => {
      this.users = []
      list.forEach(element => {
        this.users.push(this.setUsersObject(element.data(),element.id));
      });      
    });
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  setUsersObject(obj:any, id:any) {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      brithDate: obj.brithDate || '',
      street: obj.street || '',
      zipCode: obj.zipCode || '',
      city: obj.city || ''
    }
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
