import { Component, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user = new User();
  customersData: any = [];
  customerList: Array<string> = [];
  unsubCustomersList: any;
  firestore: Firestore = inject(Firestore);
  userData: any = [];
  userID: any = '';
  unsubSingel: any;
  birthDate: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.userID = paramMap.get('id');
    });
    this.unsubSingel = this.subUserData();
  }

  subUserData() {
    return onSnapshot(this.getSingleDocRef('users', this.userID), (list) => {
      this.userData = [];
      this.userData.push(this.setUsersObject(list.data(), list.id));
      console.log(this.userData[0].birthDate);
      this.birthDate = new Date(this.userData[0].birthDate).toLocaleDateString(
        'de-DE'
      );
      this.user = this.userData;
      this.customerList = this.userData[0].customers;
      console.log(this.customerList);
      this.customersData = [];
      this.customerList.forEach((element) => {
        this.subCustomerData(element);
      });
    });
  }

  subCustomerData(customerID: string) {
    return onSnapshot(this.getSingleDocRef('customers', customerID), (list) => {
      this.customersData.push(this.setCustomerObject(list.data()));
      console.log('Daten: ', this.customersData);
    });
  }

  setUsersObject(obj: any, id: any) {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      birthDate: obj.birthDate || '',
      street: obj.street || '',
      zipCode: obj.zipCode || '',
      city: obj.city || '',
      phone: obj.phone || '',
      department: obj.department || '',
      customers: obj.customers || [],
    };
  }

  setCustomerObject(obj: any) {
    return {
      name: obj.name || '',
      email: obj.email || '',
      street: obj.street || '',
      zipCode: obj.zipCode || '',
      city: obj.city || '',
      phone: obj.phone || '',
      customer_manager: obj.customer_manager || '',
      branche: obj.branche || '',
      profit_per_year: obj.profit_per_year || 0,
    };
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  editAdressDialog() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = this.userData;
  }
  editUserDialog() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = this.userData;
  }

  getCustomersRef() {
    return collection(this.firestore, 'customers');
  }
}
