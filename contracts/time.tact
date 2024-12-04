import "@stdlib/deploy";

contract Time with Deployable {
    deployTime: Int as uint32;

    init() {
        self.deployTime = now();
    }

    receive("wait 10s") {
        require(now() - self.deployTime > 10000, "Wait 10s");
    }
}
