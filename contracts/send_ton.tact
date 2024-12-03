import "@stdlib/deploy";

message GetTons {
    amount: Int as coins;
}

contract SendTon with Deployable {
    owner: Address;
    minCoinAmoint: Int;

    init() {
        self.owner = sender();
        self.minCoinAmoint = ton("0.01");
    }

    fun onlyOwner() {
        require(sender() == self.owner, "Only owner can get money from this contract");
    }

    fun enoughCoins(amount: Int) {
        require(myBalance() >= amount, "Not enought coins");
    }

    receive() {

    }

    receive("withdraw all") {
        self.onlyOwner();
        send(SendParameters{
            to: self.owner, 
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        })
    }

    receive("withdraw safe") {
        self.onlyOwner();
        send(SendParameters{
            to: self.owner, 
            value: myBalance() - context().value - self.minCoinAmoint,
            mode: SendRemainingValue + SendIgnoreErrors
        })
    }

    receive(msg: GetTons) {
        self.onlyOwner();
        self.enoughCoins(msg.amount);

        send(SendParameters{
            to: self.owner, 
            value: msg.amount,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: true
        })
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}
