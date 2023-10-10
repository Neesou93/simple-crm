import { Component, inject } from '@angular/core';
import { DialogAddCustomerComponent } from '../dialog-add-customer/dialog-add-customer.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Customer } from 'src/models/customer.class';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent {
  firestore: Firestore = inject(Firestore);
  customer = new Customer();
  customers:any = [];
  sortedName: boolean = true;
  sortedEmail: boolean = false;
  sortedPhone: boolean = false;
  sortedBranche: boolean = false;
  sortedList: any;
  userName:string = '';
  unSubCustomers

  constructor(public dialog: MatDialog) {
    this.unSubCustomers = this.subCustomerList();
  }

  openDialog() {
    this.dialog.open(DialogAddCustomerComponent);
  }
  async addCustomer(item: {}) {
    await addDoc(this.getCustomerRef(), item)
      .catch((err) => {
        console.log(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  ngOnDestroy() {}

  getCustomerRef() {
    return collection(this.firestore, 'customers');
  }

  subCustomerList() {
    return onSnapshot(this.getCustomerRef(), (list) => {
      this.customers = [];
      list.forEach((element) => {
        let userID = element.data();
        let userID_1 = userID['customer_manager']
        let subuserName = this.subUser(userID_1)
        console.log(this.userName);
        this.customers.push(this.setCustomerObject(element.data(), element.id, this.userName));
      });
      this.sortedList = this.sortByKey(this.customers, 'name');
      console.log(this.sortedList);
    });
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  setCustomerObject(obj: any, id: any, name:any) {
    return {
      id: id,
      name: obj.name || '',
      email: obj.email || '',
      street: obj.street || '',
      zipCode: obj.zipCode || '',
      city: obj.city || '',
      phone: obj.phone || '',
      branche: obj.branche || '',
      customer_manager: obj.customer_manager || '',
      customer_name: name,
      profit_per_year: obj.profit_per_year || 0,
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
  subUser(docID:string) {
    return onSnapshot(this.getSingleDocRef('users', docID), (list) => {
      let user = list.data()
      this.userName = user? user['firstName'] + ' ' + user['lastName'] : ''
      console.log('User: ', list.data());
      console.log('Username: ', this.userName);
      
    });
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  setUsersObject(obj: any, id: any) {
    return {
      id: id,
      name: obj.firstName + ' ' + obj.lastName || '',
    };
  }

  sortByKey(array: any, key: string) {
    return array.sort(function (a: any, b: any) {
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

  sortBy(key: string) {}
}
