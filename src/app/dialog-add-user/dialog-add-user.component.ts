import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  brithDate:any;
  loading:boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>){
  }

  unsubUsers = onSnapshot(this.getUsersRef(), (list) => {
    list.forEach(element => {
      console.log('collection ', element.data());
    });
  });

  saveUser(){
    this.loading = true;
    this.user.brithDate = this.brithDate.getTime();
    this.addUser(this.user.toJSON())
    this.user = new User();
    document.getElementById('progressbar')?.classList.add('d-none');
  }

  async addUser(item: {}) {
    await addDoc(this.getUsersRef(), item).catch(
      (err) => { alert("Something didn't work here. Please try again later or contact your administrator. ") }
    ).then(
      (docRef) => {
        this.loading = false;
        this.dialogRef.close();
      }
    )
  }

  ngOnDestroy() {
  }

  getUsersRef() {
    return collection(this.firestore, 'users')
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
  
}
