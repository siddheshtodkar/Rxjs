import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom, from, fromEvent, Observable, of } from 'rxjs';
import { CustomObserver } from './custom-observer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor() {

    // convert normal array to observables
    const users = [
      { id: 1, name: "john" },
      { id: 2, name: "Doe" }
    ]

    const usersOf$ = of(users)
    usersOf$.subscribe(user => {
      console.log(user)
    })

    const usersFrom$ = from(users)
    usersFrom$.subscribe(user => {
      console.log(user)
    })


    // convert promise to observables
    const messagePromise = new Promise((resolve, reject) => {
      // resolve('promise resolved')
      reject('promise rejected')
    })

    const messagePromiseOf$ = of(messagePromise)
    messagePromiseOf$.subscribe(messagePromise => {
      console.log(messagePromise)
    })

    const messagePromiseFrom$ = from(messagePromise)
    // method1
    messagePromiseFrom$.subscribe((messagePromise) => {
      console.log(messagePromise)
    }, err => {
      console.log(err)
    }, () => console.log('completed'))

    // method2
    messagePromiseFrom$.subscribe({
      next: (message) => {
        console.log(message)
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completed')
      }
    })


    // event observables
    fromEvent(document, 'click').subscribe(event => {
      console.log(event)
    })


    // observables to promise
    // usersFrom$.toPromise().
    firstValueFrom(usersFrom$).then(user => {
      console.log(user)
    })


    // custom observable
    const customeUser$ = new Observable((observer) => {
      // similar to of()
      observer.next(users)

      // similar to from()
      users.forEach(user => {
        observer.next(user)
      })

      observer.error('new error')
      observer.complete()
    })
    customeUser$.subscribe({
      next: (message) => {
        console.log(message)
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completed')
      }
    })
    // using custom subscriber
    customeUser$.subscribe(new CustomObserver())
  }
}
