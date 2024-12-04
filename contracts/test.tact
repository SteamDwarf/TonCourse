import "@stdlib/deploy";

contract Test with Deployable {
    id: Int as uint32;

    init(id: Int) {
        self.id = id;
    }

    receive("connect") {
        self.reply("Connected".asComment());
    }
}
