import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent {
  firestore: Firestore = inject(Firestore);
  user = new User();
  brithDate:any;

  constructor(){
  }

  unsubUsers = onSnapshot(this.getUsersRef(), (list) => {
    list.forEach(element => {
      console.log('collection ', element.data());
    });
  });

  saveUser(){
    document.getElementById('progressbar')?.classList.remove('d-none');
    this.user.brithDate = this.brithDate.getTime();
    console.log(this.user)
    this.addUser(this.user.toJSON())
    this.user = new User();
    document.getElementById('progressbar')?.classList.add('d-none');
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

  getUsersRef() {
    return collection(this.firestore, 'users')
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
  
}
