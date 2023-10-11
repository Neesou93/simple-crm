import { Component, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  firestore: Firestore = inject(Firestore);
  events: any = [];
  sortedList:any;
  unSubEvents;

  constructor() {
    this.unSubEvents = this.subEventsList();
  }

  subEventsList(){
    return onSnapshot(this.getEventsRef(), (list) => {
      this.events = [];
      list.forEach((element) => {
        let data = element.data()
        let dateClear = new Date(data['date']).toLocaleDateString(
          'de-DE'
        );
        console.log(dateClear);
        
        
        this.events.push(this.setEventObject(element.data(), element.id, dateClear));
      });
      this.sortedList = this.sortByKey(this.events, 'date');
      console.log(this.sortedList);
    });}

    getEventsRef() {
      return collection(this.firestore, 'events');
    }

    setEventObject(obj: any, id: any, dateClear:any) {
      return {
        id: id,
        title: obj.title || '',
        date: obj.date || '',
        time: obj.time || '',
        location: obj.location || '',
        street: obj.street || '',        
        description: obj.description || '',
        dateClear: dateClear || '',
      };
    }

  openDialog() { }

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
}
