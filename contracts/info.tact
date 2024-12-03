import "@stdlib/deploy";

message Add {
    value: Int as int32;
}

//структура похожа на message, но не имеет id
struct TestStruct {
    name: String;
}

contract Messages with Deployable {
    //Позволяет получать коины без какого либо сообщения
    receive() {

    }

    //Принимает сообщение ввиде простой строки
    receive("test_message") {

    }

    //Отправка данных другому кантракту
    receive("send_parameters") {
        send(SendParameters{
            //Адрес получателя
            to: sender(), 
            //Количество отправляемых TON монеток
            value: 0,
            //Режим отправки сообщения https://docs.tact-lang.org/book/message-mode/
            mode: SendIgnoreErrors,
            //Отскочит ли сообщение при ошибке
            bounce: true,
            //Данные обязательно в формате Cell. Message преобразуем методом toCell, строку asComment
            body: "Hello world".asComment()
            //init: ,
            //code: 
        });

        //Отправка сообщение от которого получили текущее сообщение
        self.reply("Hello world".asComment());
    }

    receive("context") {
        //Отскочило ли сообщение
        context().bounced;
        //Отправитель сообщения
        context().sender;
        //Количество пересылаемых коинов в сообщении
        context().value;
        //Дополнительные сырые данные
        context().raw;
    }

    //Принимает сообщение с аргументами
    receive(msg: Add) {

    }

    //Позволяет принимать любые текстовые сообщение, необработанные выше
    receive(msg: String) {

    }

    //Принимает сообщение любого типа, не обработанного выше
    receive(msg: Slice) {

    }
}
