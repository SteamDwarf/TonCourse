import "@stdlib/deploy";

struct OptStruct {
    addr: Address?;
}

contract Optionals with Deployable {
    num: Int?;
    optStruct: OptStruct?;

    init(a: Int?) {
        self.num = a;
    }

    get fun address(): Address? {
        if(self.optStruct != null && (self.optStruct!!).addr != null) {
            return self.optStruct!!.addr!!;
        }
        return null;
    }
}
