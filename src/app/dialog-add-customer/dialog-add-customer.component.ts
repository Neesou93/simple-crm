import { Component, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/models/customer.class';

@Component({
  selector: 'app-dialog-add-customer',
  templateUrl: './dialog-add-customer.component.html',
  styleUrls: ['./dialog-add-customer.component.scss'],
})
export class DialogAddCustomerComponent {
  firestore: Firestore = inject(Firestore);
  customer = new Customer();
  userList: any = [];
  brancheIfAny: string = '';
  loading: boolean = false;
  unsubUsersList;
  customerList: any;
  unsubUser: any;
  customerListEmp: Array<string> = [];

  branche = [
    'IT',
    'Customer-Service',
    'Sales',
    'Travel',
    'Security',
    'Production',
    'Sonstige',
  ];

  constructor(public dialogRef: MatDialogRef<DialogAddCustomerComponent>) {
    this.unsubUsersList = this.subUsersList();
  }

  unsubUsers = onSnapshot(this.getCustomerRef(), (list) => {
    list.forEach((element) => {
      console.log('collection ', element.data());
    });
  });

  saveUser() {
    this.loading = true;
    this.addUser(this.customer.toJSON());
  }

  async addUser(item: {}) {
    await addDoc(this.getCustomerRef(), item)
      .catch((err) => {
        alert(
          "Something didn't work here. Please try again later or contact your administrator. "
        );
      })
      .then((docRef: any) => {
        console.log('Then erreicht.');

        this.getManagedCustomersFromUser(docRef);
      });
  }

  ngOnDestroy() {}

  getCustomerRef() {
    return collection(this.firestore, 'customers');
  }
  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  setUsersObject(obj: any, id: any) {
    return {
      id: id,
      name: obj.firstName + ' ' + obj.lastName || '',
    };
  }

  subUsersList() {
    return onSnapshot(this.getUsersRef(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        this.userList.push(this.setUsersObject(element.data(), element.id));
      });
      console.log('Userlist: ', this.userList);
    });
  }

  async getManagedCustomersFromUser(id: any) {
    console.log('start GetManaged...');

    let customerListEmp: Array<string> = [];
    if (this.customer.customer_manager) {
      console.log('userID ', this.customer.customer_manager);
      this.unsubUser = await this.subUser()
        .then(() => {
          setTimeout(() => {
            let RefID = id.id;
            console.log(RefID);
            this.customerListEmp.push(RefID);
            this.customerList = this.customerListEmp;
            console.log('ListRef', this.customerListEmp);
            console.log('customerliste1.1 ', this.customerList);
            console.log('customerliste2.1 ', id.id);
            this.updateUserFDB(this.customerList);
          }, 500);
        })
        .then(() => {
          this.loading = false;
          this.dialogRef.close();
        });
    } else {
    }
    this.unsubUser();
    return;
  }

  async subUser() {
    return onSnapshot(
      this.getSingleDocRef('users', this.customer.customer_manager),
      (list) => {
        console.log('list: ', list);
        let data: any = list.data();
        let customers = data['customers'];
        if (customers) {
          customers.forEach((element: any) => {
            console.log('element in Fun ', element);
            this.customerListEmp.push(element);
          });
        }
      }
    );
  }
  async updateUserFDB(item: any) {
    await updateDoc(
      this.getSingleDocRef('users', this.customer.customer_manager),
      this.toJSON(item)
    )
      .catch((err) => {
        console.error(err);
      })
      .then(() => {});
  }

  toJSON(data: any) {
    return {
      customers: data || [],
    };
  }
}
