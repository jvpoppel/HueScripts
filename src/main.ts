import { Light } from './model/light';

$(() => {
    alert("Test");
    new Main();
})

export class Main {
    constructor() {
        alert("Test 2");

        let light = new Light(2);
        alert("Light: " + light.getID());
    }
}