import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  departments = ['Developer','Human-Resorces','Sales','Consultond']
  user: any;
  loading: boolean = false;
  userData: any;
  birthDate: any;

  ngOnInit() {
    this.userData = this.toJSON(this.user[0])
    this.birthDate = new Date(this.userData.birthDate);
  }

  toJSON(data: any) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city,
      id: data.id,
      phone: data.phone,
      department: data.department,
    }
  }

  constructor(public dialogRef: MatDialogRef<DialogEditUserComponent>) { }

  saveUser() {
    this.loading = true;
    this.userData.birthDate = this.birthDate.getTime()
    this.updateUserFDB(this.userData);
    
   }

  async updateUserFDB(item:any){    
    await updateDoc(this.getSingleDocRef('users',this.userData.id), item)
    .catch((err) => {console.error(err);
    }).then(() => {
      this.loading = false;
      this.dialogRef.close();
    });}

  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }
}
