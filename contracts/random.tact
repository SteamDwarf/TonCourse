import "@stdlib/deploy";

contract Random with Deployable {
    get fun rand(): Int {
        return randomInt();
    }

    get fun randBetween(from: Int, to: Int): Int {
        return random(from, to);
    }
}
