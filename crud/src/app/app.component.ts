import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { element } from 'protractor';
import { all } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  Group: FormGroup
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  flag = false;
  index: number;
  form;
  name: any[] = []
  cities = [];
  object = [];
  posts: any[] = [];
  _id;
  viewdata: any = [];


  apiUrl = "http://localhost:2000";


  constructor(fb: FormBuilder, public http: HttpClient) {
    this.Group = fb.group({
      name: ['', Validators.required],
      createdate: ['', Validators.required],
      updatedate: ['', Validators.required],
      keys: ['', Validators.required]
    })
    this.getData();
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: all,
      allowSearchFilter: true
    };
  }

  clear() {
    this.selectedItems=null;
  }

  view(list) {
    list = { key: list }
    this.http.post(this.apiUrl + '/users/', list).subscribe((data) => {
      console.log(data);
      this.viewdata = data;
    })
    this.getData();
  }

  getData() {
    this.http.get(this.apiUrl + '/getInfo/').subscribe(
      data => {
        console.log("result:", data);
        this.object = data['data'] as Array<any>;
        this.object.forEach((element, index) => {
          this.cities.push({ item_id: element._id, item_text: element.name }, )
        });
        console.log(this.cities)
      });
  }

  save() {
    var gform = this.Group.value
    gform.cities = this.selectedItems
    console.log("gform", gform);
    this.http.post(this.apiUrl + '/userdata/', gform).subscribe(
      (data) => {
        //console.log("abc:", data);
      })
    this.Group.reset();
    this.getData();
  }

  delete(_id) {
    console.log('delete');
    var index = this.object.indexOf(_id, 1);
    // if(index > -1){
    //   this.object.slice(index,1)
    // }
    this.http.get(this.apiUrl + '/delete/' + _id).subscribe((res) => {
      this.getData();
    })
  }

  edit(name, keys, id) {
    this.flag = true;
    // this.index = this.name.indexOf(e);
    this.Group.controls.name.setValue(name)
    this.Group.controls.keys.setValue(keys)
    this._id = id;
    this.getData();
  }

  update() {
    var name = this.Group.controls.name.value;
    var keys = this.Group.controls.keys.value;
    var obj = { 'name': name, 'keys': keys };
    this.http.put(this.apiUrl + '/updateData/' + this._id, obj).subscribe((res) => {
      console.log("update:", res);
      this.getData();
    })
    this.object[this.index] = obj;
    this.Group.reset();
  }
}
