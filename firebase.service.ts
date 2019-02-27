import { Injectable } from '@angular/core';
import { AngularFireList , AngularFireObject, AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { Observable, of, throwError, from } from 'rxjs';

import { MenuFood, User } from '@/_models'

@Injectable({ providedIn: 'root' })
export class FireBaseService {

  private usersPath: string = '/users';
  private menuFoodsPath: string = '/menuFoods';
  private menuDrinksPath: string = '/menuDrinks';
  private orderItlemsPath: string = '/orderItems';

  // List Result
  public resultDbMenuFoods: AngularFireList<MenuFood> = null; //  list of objects
  public resultDbMenuDrinks: AngularFireList<MenuFood> = null; //  list of objects
  public resultDbListUser: AngularFireList<User> = null; //  list of objects


  constructor(private db: AngularFireDatabase) { 
    this.resultDbMenuDrinks = db.list(this.menuDrinksPath);
    this.resultDbMenuFoods = db.list(this.menuFoodsPath);
    this.resultDbListUser = db.list(this.usersPath);
  }

  getDrinksMenu(): AngularFireList<MenuFood>{
    return this.resultDbMenuDrinks;
  }

  getFoodsMenu(): AngularFireList<MenuFood>{
    return this.resultDbMenuFoods;
  }

  getUser(): AngularFireList<User>{
    // Object Result
    let resultDbListUser: AngularFireList<User> = null; //  list of objects

    resultDbListUser = this.db.list(this.usersPath);

    return resultDbListUser;
  }

  saveMenu(newMenu: MenuFood) {
    if (newMenu.category == 'Drinks') {
        this.resultDbMenuDrinks.push(newMenu);   

    } else if (newMenu.category == 'Foods') {
        this.resultDbMenuFoods.push(newMenu);
    }
  }

  saveUser(newUser: User) {

    newUser.token = "fake-jwt-token";

    this.resultDbListUser.push(newUser);

    // this.resultDbListUser.snapshotChanges().subscribe(users => {
    //     let isExist = users.filter(user => {
    //       let u = user.payload.toJSON() as User;
    //       if (newUser.username === u.username) {
    //         return throwError({ error: { message: 'Tên đăng nhập đã tồn tại !' } });
    //       } else {
            
    //         return of({status : "OK"});
    //       }
    //     }).length;
    // });
  }
}
