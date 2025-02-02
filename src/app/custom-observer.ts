import { Observer } from "rxjs";

export class CustomObserver implements Observer<number> {
    next(data: any) {
        console.log(data)
    }
    error(msg: string) {
        console.log(msg)
    }
    complete() {
        console.log('completed')
    }
}