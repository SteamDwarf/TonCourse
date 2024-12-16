import "@stdlib/deploy";
import "./nft_item.tact";
import "./nftMessages.tact";

struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

contract NftCollection with Deployable {
    owner_address: Address;
    next_item_index: Int as uint256;
    collection_content: Cell;

    init(owner: Address, content: Cell) {
        self.next_item_index = 0;
        self.owner_address = owner;
        self.collection_content = content;
    }

    receive(msg: NftDeploy) {
        require(sender() == self.owner_address, "No permission");
        require(msg.index <= self.next_item_index, "Invalid index");

        let initState: StateInit = initOf NftItem(msg.index, myAddress());
        let nftAddress = contractAddress(initState);

        send(SendParameters{
            to: nftAddress, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            data: initState.data,
            code: initState.code,
            body: msg.toCell()
        });

        if(msg.index == self.next_item_index) {
            self.next_item_index += 1;
        }
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: self.collection_content,
            owner_address: self.owner_address
        }
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let initState = initOf NftItem(index, myAddress());
        return contractAddress(initState);
    }

    get fun get_nft_content(index: Int, individual_content: Cell): Cell {
        return individual_content;
    }
}
