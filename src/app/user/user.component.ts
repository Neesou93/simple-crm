import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from 'src/models/user.class';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  firestore: Firestore = inject(Firestore);
  user: User = new User();
  users: any = [];
  unSubUsers;
  sortedList: any;
  sortedName:boolean = true;
  sortedEmail:boolean = false;
  sortedCity:boolean = false;
  sortedStatus:boolean = false;
  sortedPhone:boolean = false;
  sortedDepartment:boolean = false;

  constructor(public dialog: MatDialog) {
    this.unSubUsers = this.subUsersList();
  }

  async addUser(item: {}) {
    await addDoc(this.getUsersRef(), item)
      .catch((err) => {
        console.log(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  ngOnDestroy() {
    this.unSubUsers();
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  subUsersList() {
    return onSnapshot(this.getUsersRef(), (list) => {
      this.users = [];
      list.forEach((element) => {
        this.users.push(this.setUsersObject(element.data(), element.id));
      });
      this.sortedList = this.sortByKey(this.users,'firstName')
    });
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  setUsersObject(obj: any, id: any) {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      brithDate: obj.brithDate || '',
      street: obj.street || '',
      zipCode: obj.zipCode || '',
      city: obj.city || '',
      phone: obj.phone || '',
      department: obj.department || '',
      
    };
  }

  returnJSON(data: any) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      brithDate: data.brithDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city,
      phone: data.phone,
      department: data.department,
    };
  }

  sortByKey(array:any, key:string) {
    return array.sort(function(a:any, b:any) {
      var valueA = a[key].toUpperCase();
      var valueB = b[key].toUpperCase();
      
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    });
  }
  
  sortBy(key:string){
    if(key == 'lastName'){
      this.sortedName = true;
      this.sortedCity = false;
      this.sortedEmail = false;
    }
    else if(key == 'city'){
      this.sortedName = false;
      this.sortedCity = true;
      this.sortedEmail = false;
    }
    else if(key == 'email'){
      this.sortedName = false;
      this.sortedCity = false;
      this.sortedEmail = true;
    }
    else{
        this.sortedName = false;
        this.sortedCity = false;
        this.sortedEmail = false;
      
    }
    this.sortedList = this.sortByKey(this.users,key)
  }
}
