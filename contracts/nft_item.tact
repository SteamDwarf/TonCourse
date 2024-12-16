import "@stdlib/deploy";
import "./nftMessages.tact";

struct NftData {
    init: Bool?;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

contract NftItem with Deployable {
    init: Bool = false;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;

    init(index: Int, collection: Address) {
        self.index = index;
        self.collection_address = collection;
        self.owner_address = collection;
        self.individual_content = emptyCell();
    }

    receive(msg: Transfer) {
        let ctx = context();

        require(sender() == self.owner_address, "No permission");
        /* let requiredValue = ton("0.02") + ton("0.05") + msg.forward_amount;
        require(ctx.value >= requiredValue, "Not enoght coins"); */
        let prev_owner = self.owner_address;

        self.owner_address = msg.new_owner;

        if(msg.forward_amount > 0) {
            send(SendParameters{
                to: msg.new_owner, 
                value: msg.forward_amount,
                body: OwnershipAssigned{
                    query_id: msg.query_id,
                    prev_owner: prev_owner,
                    forward_payload: msg.forward_payload
                }.toCell()
            })
        }

        send(SendParameters{
            to: msg.response_destination, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Excesses{
                query_id: msg.query_id
            }.toCell()
        })
    }

    receive(msg: GetStaticData) {
        send(SendParameters{
            to: sender(), 
            value: SendRemainingValue,
            body: ReportStaticData{
                query_id: msg.query_id,
                index: self.index,
                collection: self.collection_address
            }.toCell()
        })
    }

    receive(msg: NftDeploy) {
        require(sender() == self.collection_address, "No permission");

        self.init = true;
        self.owner_address = msg.owner;
        self.individual_content = msg.content;

        send(SendParameters{
            to: msg.response_address, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Excesses{
                query_id: msg.query_id
            }.toCell()
        })
    }

    get fun get_nft_data(): NftData {
        return NftData{
            init: self.init,
            index: self.index,
            collection_address: self.collection_address,
            owner_address: self.owner_address,
            individual_content: self.individual_content
        }
    }
}
