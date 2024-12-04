import "@stdlib/deploy";

//Функцию можно объявлять вне контракта
fun sum(a: Int, b: Int): Int {
    return a + b;
}

//Можно расширять уже имеющиеся типы данных с помощью ключевого слова extends
extends fun mul(self: Int, b: Int): Int {
    return self * b;
}

//Также можно тип данных расширять с возможностью мутации данных
extends mutates fun add(self: Int, b: Int) {
    self += b;
}

contract Functions with Deployable {
    num: Int = 1;

    receive("mul") {
        self.num = self.num.mul(5);
    }   

    receive("add") {
        self.num.add(5);
    }
}
