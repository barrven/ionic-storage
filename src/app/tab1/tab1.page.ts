import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  users: User[];
  id:number;
  name:string;


  constructor() {
    this.readUsers();
  }

  saveUser(){
    const user = new User(this.id, this.name);
    //stringify is just used to convert the number to a string
    if (this.name != "" && this.name != null && this.id != null){
      this.setObject(JSON.stringify(user.id), user);
      this.id = null;
      this.name = '';
    }
    else{
      alert("Name and ID cannot be empty");
    }
  }

  //in order to save the object to storage
  async setObject(key:string, value:any){
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });

    this.readUsers(); //refresh the displayed users after adding a new one
  }

  // pull some data from storage. read all the users from storage
  async readUsers() {
    //clear the user array
    this.users = [];
    //get all the keys
    const { keys } = await Storage.keys();
    keys.forEach(this.getUser, this); //pass "this" as second parameter so it does not lose context

  }

  async getUser(key){
    //get keys one by one and pull information from the storage
    const item = await Storage.get({key: key});
    let user = JSON.parse(item.value);
    this.users.push(user);
  }

  async clear(){
    await Storage.clear(); //Removes all data stored in storage
    this.users = [];
    this.id = null;
    this.name = '';
  }

  async deleteUser(index: number){
    let user = this.users[index];
    await Storage.remove({ key: JSON.stringify(user.id) });
    this.readUsers();
  }


}


//export the data model for the application
export class User {
  id: number;
  name: string;

  constructor(id:number, name:string){
    this.id = id;
    this.name = name;
  }
}