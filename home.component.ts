import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, OrderItems, MenuFood } from '@/_models';
import { AlertService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    menuFoods: MenuFood[] = [];
    menuDrinks: MenuFood[] = [];
    orderItems: OrderItems[] = [];
    today : number = Date.now();
    totOrders : number = 0;
    submitted: boolean = false;
    loading: boolean = false;

    constructor(
        private authenticationService: AuthenticationService,
        private formbuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAllMenu();
        this.registerForm = this.formbuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser($key: string) {
        this.userService.delete($key).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    }

    addToOrder(item: OrderItems, qty: number) {
        let flag = 0;
        // setting list orederItems to variable
        let ois = this.orderItems;
        // Search order
        if (ois.length > 0) {
            for (var i = 0; i < ois.length; i++) {
                if (item.$key === ois[i].$key && item.category === ois[i].category) {
                    item.qty += qty;
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                item.qty = 1;
                this.orderItems.push(item);
            }
        } else {
            item.qty = qty;
            this.orderItems.push(item);
        }
    }

    removeOneEntity(item: OrderItems) {
        // setting list orederItems to variable
        let ois = this.orderItems;
        for (var i = 0; i < ois.length; i++) {
            if (item.$key === ois[i].$key) {
                item.qty -= 1;
                if (item.qty === 0) {
                    ois.splice(i, 1);
                }
            }
        }
    }

    removeItem(item: OrderItems) {
        // setting list orederItems to variable
        let ois = this.orderItems;
        for (var i = 0; i <ois.length; i++) {
            if (item.$key ===ois[i].$key) {
               ois.splice(i, 1);
            }
        }
    }

    clearOrder() {
        this.orderItems = [];
    }

    checkout(){
        
    }

    getTotalMoney() {
        let tot = 0;
        // initial variable to easy coding
        let oI = this.orderItems;
        for (var i = 0; i < oI.length; i++) {
            tot += (oI[i].price * oI[i].qty)
        }
        return tot;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        console.log(this.menuFoods);
        this.loading = true;
        this.userService.registerMenuFood(this.registerForm.value)
            // .pipe(first())
            // .subscribe(
            //     data => {
            //         this.alertService.success('Registration successful', true);
            //         this.loading = false;
            //         this.loadAllMenu();
            //     },
            //     error => {
            //         this.alertService.error(error);
            //         this.loading = false;
            //     });
        this.loading = false;
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    private loadAllMenu() {
        // Get Drinks Menu
        this.userService.getDrinksMenu().snapshotChanges().subscribe(item => {
            item.forEach(element => {
                let y = element.payload.toJSON();
                y["$key"] = element.key;
                this.menuDrinks.push(y as MenuFood);
            })
        });

        // Get Foods Menu
        this.userService.getFoodsMenu().snapshotChanges().subscribe(item => {
            item.forEach(element => {
                let y = element.payload.toJSON();
                y["$key"] = element.key;
                this.menuFoods.push(y as MenuFood);
            })
        });
    }
}
