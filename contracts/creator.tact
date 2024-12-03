import "@stdlib/deploy";

message CreateStore {
    id: Int as uint32;
}

contract Store with Deployable {
    id: Int as uint32;

    init(id: Int) {
        self.id = id;
    }

    get fun getMyAddress(): Address {
        return myAddress();
    }

    get fun id(): Int {
        return self.id;
    }
}

contract Creator with Deployable {
    receive(msg: CreateStore) {
        let storeInitData = initOf Store(msg.id);
        let address = contractAddress(storeInitData);

        send(SendParameters{
            to: address, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            code: storeInitData.code,
            data: storeInitData.data,
            body: Deploy{queryId: 0}.toCell()
        })
    }
}
