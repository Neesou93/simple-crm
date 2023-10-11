import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-customer-headerinfo',
  templateUrl: './dialog-edit-customer-headerinfo.component.html',
  styleUrls: ['./dialog-edit-customer-headerinfo.component.scss']
})
export class DialogEditCustomerHeaderinfoComponent {
  firestore: Firestore = inject(Firestore);
  customer: any;
  customerData: any;
  loading: boolean = false;
  brancheIfAny: string = '';
  userList: any = [];
  oldManager: string = '';
  unsubUsersList;
  oldManagerCustomerList: Array<string> = [];
  newManagerCustomerList: Array<string> = [];

  branche = [
    'IT',
    'Customer-Service',
    'Sales',
    'Travel',
    'Security',
    'Production',
    'Sonstige',
  ];

  constructor(public dialogRef: MatDialogRef<DialogEditCustomerHeaderinfoComponent>) {
    this.unsubUsersList = this.subUsersList();
  }

  ngOnInit() {
    this.customerData = this.toJSON(this.customer[0]);
    if (!(this.branche.indexOf(this.customerData.branche) > -1)) {
      this.branche.push(this.customerData.branche)
    }
    this.oldManager = this.customerData.customer_manager;
    console.log('Old Manager: ', this.oldManager);

    console.log('Customer in Edit: ', this.customerData);
  }

  toJSON(data: any) {
    return {
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      street: data.street || '',
      zipCode: data.zipCode || '',
      city: data.city || '',
      phone: data.phone || '',
      branche: data.branche || '',
      customer_manager: data.customer_manager || '',
      profit_per_year: data.profit_per_year || 0,
    };
  }

  async saveUser() {
    this.loading = true;
    if (this.customerData.branche === 'Sonstige' && !(this.brancheIfAny == '')) {
      this.customerData.branche = this.brancheIfAny
    }
    if (!(this.oldManager == this.customerData.customer_manager)) {
      alert('Manager have changed');
      this.getNewManagerCustomerList();
      this.getOldManagerCustomerlist();
      this.updateManagerLists()
      await this.updateListsInFBD(this.oldManager, this.managerListToJSON(this.oldManagerCustomerList))
      await this.updateListsInFBD(this.customerData.customer_manager, this.managerListToJSON(this.newManagerCustomerList))
    }
    this.updateUserFDB(this.customerData);
  }

  async updateUserFDB(item: any) {
    await updateDoc(this.getSingleDocRef('customers', this.customerData.id), item)
      .catch((err) => {
        console.error(err);
      }).then(() => {
        this.loading = false;
        this.dialogRef.close();
      });
  }

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
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
  setUsersObject(obj: any, id: any) {
    return {
      id: id,
      name: obj.firstName + ' ' + obj.lastName || '',
      customers: obj.customers || [],
    };
  }
  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getOldManagerCustomerlist() {
    this.userList.forEach((element: any) => {
      let list = element.customers
      if (element.id == this.oldManager) {
        this.oldManagerCustomerList = element.customers;
        console.log('OldCustomerList of User: ', element.id, ' loadet: ', this.oldManagerCustomerList)
      }
    });
  }

  getNewManagerCustomerList() {
    this.userList.forEach((element: any) => {
      let list = element.customers
      if (this.customerData.customer_manager == element.id) {
        this.newManagerCustomerList = element.customers;
        console.log('NewCustomerList of User: ', element.id, ' loadet: ', this.newManagerCustomerList)
      }
    });
  }

  updateManagerLists() {
    // Update old Manager
    let indexByOld = this.oldManagerCustomerList.indexOf(this.customerData.id);
    this.oldManagerCustomerList.splice(indexByOld, 1);
    console.log('Updated Old ManagerList: ', this.oldManagerCustomerList);
    
    this.newManagerCustomerList.push(this.customerData.id);
    console.log('Updated New ManagerList: ', this.newManagerCustomerList);
  }

  async updateListsInFBD(userID:string, item:any){
    await updateDoc(this.getSingleDocRef('users', userID), item)
      .catch((err) => {
        console.error(err);
      }).then(() => {
        this.loading = false;
        this.dialogRef.close();
      });
  }

  managerListToJSON(data:any){
    return {
      customers: data,
    }
  }


}
