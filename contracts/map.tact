import "@stdlib/deploy";

message Replace {
    newMap: map<Int, Int>;
}

contract Map with Deployable {
    //map<K, V>
    //K - Int, Address
    //V - Int, Bool, Cell, Address, Struct, Message
    intMap: map<Int, Int>;

    receive("set") {
        self.intMap.set(0, 123);
    }

    receive("delete") {
        self.intMap.set(0, null);
    }
    
    receive(msg: Replace) {
        self.intMap = msg.newMap;
    }

    receive("clear") {
        self.intMap = emptyMap();
    }

    get fun value(key: Int): Int? {
        return self.intMap.get(key);
    }
}
