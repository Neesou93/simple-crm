import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit{
  user = new User();
  firestore: Firestore = inject(Firestore);
  userData: any = [];
  userID: any = '';
  unsubSingel:any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog){
  }

  ngOnInit(){
    this.route.paramMap.subscribe( paramMap => {
      this.userID = paramMap.get('id');
      console.log(this.userID);
    });

    this.unsubSingel = this.subUserData();
    this.user = this.userData;
  }

  subUserData(){
    return onSnapshot(this.getSingleDocRef('users', this.userID), (list) => {
      this.userData = []
        this.userData.push(this.setUsersObject(list.data(),list.id));  
        console.log(this.userData);    
    });
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


  getSingleDocRef(colID: string, docID: string) {
    return doc(collection(this.firestore, colID), docID);
  }

  editAdressDialog(){
    this.dialog.open(DialogEditAddressComponent);
    
  }
  editUserDialog(){
    console.log(this.user);
    
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = this.userData;
  }
    
}
