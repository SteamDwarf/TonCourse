message RecieveJettons {
    sender: Address;
    amount: Int;
}

message(0xf8a7ea5) Transfer {
    query_id: Int as uint64;
    amount: Int as coins;
    reciever: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Cell?;
}

message(0x7362d09c) TransferNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forward_payload: Cell?;
}

message(0x178d4519) InternalTransfer {
    query_id: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_address: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Cell?;

}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x595f07bc) Burn {
    query_id: Int as uint64;
    amount: Int as coins;
    response_destination: Address;
    custom_payload: Cell?;
}

message(0x7bdd97de) BurnNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    response_destination: Address;
}

message ChangeContent {
    jetton_content: Cell;
}

message Buy {
    query_id: Int as uint64;
    amount: Int;
}