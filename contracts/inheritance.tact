import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";

//DEPLOYABLE
/* message Deploy {
    queryId: Int as uint64;
}

message DeployOk {
    queryId: Int as uint64;
}

trait Deployable {
    receive(msg: Deploy) {
        self.reply(DeployOk{queryId: msg.queryId}.toCell());
    }
} */

//OWNABLE
/* trait Ownable {
    owner: Address;

    fun requireOwner() {
        nativeThrowUnless(132, sender() == self.owner);
    }

    get fun owner(): Address {
        return self.owner;
    }
} */

//OWNABLETRANSFERABLE 
/* trait OwnableTransferable with Ownable {
    owner: Address;

    receive(msg: ChangeOwner) {
        // Check if the sender is the owner
        self.requireOwner();

        // Update owner
        self.owner = msg.newOwner;

        // Reply result
        self.reply(ChangeOwnerOk{ queryId: msg.queryId, newOwner: msg.newOwner }.toCell());
    }
} */

//STOPPABLE
/* trait Stoppable with Ownable {
    stopped: Bool;
    owner: Address;

    fun requireNotStopped() {
        require(!self.stopped, "Contract stopped");
    }

    fun requireStopped() {
        require(self.stopped, "Contract not stopped");
    }

    receive("Stop") {
        self.requireOwner();
        self.requireNotStopped();
        self.stopped = true;
        self.reply("Stopped".asComment());
    }

    get fun stopped(): Bool {
        return self.stopped;
    }
}

trait Resumable with Stoppable {
    stopped: Bool;
    owner: Address;

    receive("Resume") {
        self.requireOwner();
        self.requireStopped();
        self.stopped = false;
        self.reply("Resumed".asComment());
    }
} */

trait Trackable with Ownable {
    messagesCount: Int;
    owner: Address;
    virtual const ENABLE_RESET: Bool = true;
    abstract const ENABLE_FILTER: Bool;

    fun recieveMessage() {
        if(self.filterMessage()) {
            self.messagesCount += 1;
        }
    }

    virtual fun filterMessage(): Bool {
        if(sender() == self.owner) {
            return false;
        }
        return true;
    }

    get fun messagesCount(): Int {
        return self.messagesCount;
    }

}

contract Inheritance with Deployable, Trackable {
    messagesCount: Int as uint32;
    owner: Address;

    override const ENABLE_FILTER: Bool = true;
    override const ENABLE_RESET: Bool = false;

    init() {
        self.owner = sender();
        self.messagesCount = 0;
    }

    receive() {
        self.recieveMessage();
    }

    override fun filterMessage(): Bool {
        return true;
    }
    // Empty init() function is present by default in all Tact contracts
    // since v1.3.0, so the following may be omitted:
    //
    // init() {}
}
