import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncSubject, BehaviorSubject, combineLatest, concatMap, delay, exhaustMap, filter, firstValueFrom, from, fromEvent, map, mergeMap, Observable, of, ReplaySubject, startWith, Subject, switchMap, tap } from 'rxjs';
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
      resolve('promise resolved')
      reject('promise rejected')
    })
    const messagePromiseOf$ = of(messagePromise)
    messagePromiseOf$.subscribe(messagePromise => {
      console.log(messagePromise)
    })

    const messagePromiseFrom$ = from(messagePromise)
    // method1
    messagePromiseFrom$.subscribe(messagePromise => {
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

    this.subject()
    this.operators()
  }


  subject() {
    // AsyncSubject - only executes when complete is called and uses latest value
    // nothing happens on next and subscribe 
    console.log('AsyncSubject')
    const asyncSubject$ = new AsyncSubject();
    asyncSubject$.subscribe(console.log);
    asyncSubject$.next(123); //nothing logged
    asyncSubject$.subscribe(console.log);
    asyncSubject$.next(456); //nothing logged
    asyncSubject$.complete(); //456, 456 logged by both subscribers


    // BehaviorSubject - emits latest value to all subscribers (initial value mandatory)
    // subscribers executed on both next and subscribe
    console.log('BehaviorSubject')
    const behaviorSubject$ = new BehaviorSubject(123)
    behaviorSubject$.subscribe(console.log); // output: 123
    behaviorSubject$.next(456); // output: 456 
    behaviorSubject$.subscribe(console.log); // output: 456, 456
    behaviorSubject$.next(789); // output 789, 789


    // ReplaySubject - emits previous n values to all subscribers
    // subscribers executed only once on next and n times on subscriber
    console.log('ReplaySubject')
    const replaySubject$ = new ReplaySubject(3)
    replaySubject$.next(1);
    replaySubject$.next(2);
    replaySubject$.subscribe(console.log); // OUTPUT => 1,2
    replaySubject$.next(3); // OUTPUT => 3
    replaySubject$.next(4); // OUTPUT => 4
    replaySubject$.subscribe(console.log); // OUTPUT => 2,3,4 (log of last 3 values from new subscriber)
    replaySubject$.next(5); // OUTPUT => 5,5 (log from both subscribers)


    // Subject - emits latest value to all subscribers
    // subcribers executed on next and nothing happens on subscribe 
    const subject$ = new Subject();
    console.log('Subject')
    subject$.next(1);
    subject$.subscribe(console.log)
    subject$.next(2); // OUTPUT => 2
    subject$.subscribe(console.log);
    subject$.next(3); // OUTPUT => 3, 3 (logged from both subscribers)
  }

  async operators() {
    const example$ = from([1, 2, 3, 4, 5])
    const firstExample$ = new Observable<number>((Observer) => {
      setTimeout(() => { Observer.next(1) }, 100)
      setTimeout(() => { Observer.next(2) }, 200)
      setTimeout(() => { Observer.next(3) }, 300)
      setTimeout(() => { Observer.next(4) }, 400)
      setTimeout(() => { Observer.next(5) }, 500)
    })
    const secondExample$ = new Observable<number>((Observer) => {
      setTimeout(() => { Observer.next(6) }, 100)
      setTimeout(() => { Observer.next(7) }, 200)
      setTimeout(() => { Observer.next(8) }, 300)
      setTimeout(() => { Observer.next(9) }, 400)
    })
    console.log('Operators Example')
    example$.subscribe(console.log)
    // map
    console.log('Map')
    example$.pipe(map(value => value * 10)).subscribe(console.log)
    // filter
    console.log('Filter')
    example$.pipe(filter(value => value <= 3)).subscribe(console.log)
    // tap
    console.log('Tap')
    example$.pipe(tap(console.log)).subscribe(console.log)
    // startWith
    console.log('startWIth')
    example$.pipe(startWith(0)).subscribe(console.log)
    // combineLatest
    combineLatest([firstExample$, secondExample$]).pipe(
      map(([first, second]) => ({ first, second }))
    ).subscribe(x => console.log('combineLatest ', x))
    // switchMap
    firstExample$.pipe(switchMap(value => secondExample$.pipe(map(value2 => value * value2)))).subscribe(x => console.log('switchMap', x))
    // mergeMap
    firstExample$.pipe(mergeMap(value => secondExample$.pipe(map(value2 => value * value2)))).subscribe(x => console.log('mergeMap', x))
    // concatMap
    firstExample$.pipe(concatMap(value => secondExample$.pipe(map(value2 => value * value2)))).subscribe(x => console.log('concatMap', x))
    // exhaustMap
    firstExample$.pipe(exhaustMap(value => secondExample$.pipe(map(value2 => value * value2)))).subscribe(x => console.log('exhaustMap', x))
  }
}