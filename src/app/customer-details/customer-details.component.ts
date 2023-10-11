import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/models/customer.class';
import { DialogEditCustomerComponent } from '../dialog-edit-customer/dialog-edit-customer.component';
import { DialogAddCustomerComponent } from '../dialog-add-customer/dialog-add-customer.component';
import { DialogEditCustomerAddressComponent } from '../dialog-edit-customer-address/dialog-edit-customer-address.component';
import { DialogEditCustomerHeaderinfoComponent } from '../dialog-edit-customer-headerinfo/dialog-edit-customer-headerinfo.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent {
  customer = new Customer();
  userData: any = [];
  userList: string = '';
  unsubCustomersList: any;
  firestore: Firestore = inject(Firestore);
  customerData: any = [];
  customerID: any = '';
  unsubSingel: any;
  managerName: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.customerID = paramMap.get('id');
    });
    this.unsubSingel = this.subCustomerData();
  }

  subCustomerData() {
    return onSnapshot(this.getSingleDocRef('customers', this.customerID), (list) => {
      console.log(list.data());
      
      
      this.customerData = [];
      this.customerData.push(this.setCustomerObject(list.data(), this.customerID));
      this.customer = this.customerData;
      this.userList = this.customerData[0].customer_manager;
      console.log(this.userList);
      
      this.subUserData(this.userList);
      
    });
  }

  subUserData(userID: string) {
    return onSnapshot(this.getSingleDocRef('users', userID), (list) => {
      this.userData = [];
      this.userData.push(this.setUsersObject(list.data(),userID));
      console.log('Daten User: ', this.userData);
      this.managerName = this.userData[0].firstName + ' ' + this.userData[0].lastName
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

  setCustomerObject(obj: any, id:any) {
    return {
      id: id || '',
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
   const dialog = this.dialog.open(DialogEditCustomerAddressComponent);
   dialog.componentInstance.customer = this.customerData;
  }
  editUserDialog() {
   const dialog = this.dialog.open(DialogEditCustomerHeaderinfoComponent);
   dialog.componentInstance.customer = this.customerData;
  }

  editProfitDialog() {
    console.log('Button klappt');
    
    const dialog = this.dialog.open(DialogEditCustomerComponent);
    dialog.componentInstance.customer = this.customerData;
  }

  getCustomersRef() {
    return collection(this.firestore, 'customers');
  }
}
