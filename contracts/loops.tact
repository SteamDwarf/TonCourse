import "@stdlib/deploy";

contract Loops with Deployable {
    receive("repeat") {
        let sum = 0;

        repeat(10) {
            sum += 10;
        }
    }

    receive("while") {
        let i = 0;

        while(i < 10) {
            i += 1;
        }
    }

    receive() {
        let i = 0;
        
        do {
            i += i
        } until (i < 10);
    }
}
