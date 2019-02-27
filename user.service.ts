import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, MenuFood } from '@/_models';
import { FireBaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private http: HttpClient,
        private fireBaseService: FireBaseService
        ) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getDrinksMenu() {
        //return this.http.get<any[]>(`/DrinksMenu`);
        return this.fireBaseService.getDrinksMenu();
    }

    getFoodsMenu() {
        //return this.http.get<any[]>(`/FoodsMenu`);
        return this.fireBaseService.getFoodsMenu();
    }

    getById($key: number) {
        return this.http.get(`/users/${$key}`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    registerMenuFood(menuFood: MenuFood) {
        //return this.http.post(`/users/registerMenuFood`, menuFood);
        return this.fireBaseService.saveMenu(menuFood);
    }

    update(user: User) {
        return this.http.put(`/users/${user.$key}`, user);
    }

    delete($key: string) {
        return this.http.delete(`/users/${$key}`);
    }
}
