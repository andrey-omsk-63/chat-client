Запуск актуальной демо-версии чата системы:

Для запуска необходимо, чтобы был установлен Node.js.

Установщик доступной версии можно найти здесь: 
https://www.npackd.org/p/org.nodejs.NodeJS64/20.11.1

Когда Node.js установлен, командная строка Node.js будет доступна через командную строку операционной системы. Просто введите node и нажмите клавишу Enter, чтобы запустить Node.js command prompt. Таких окон нужно отрыть два – одно для локального сервера, другое для клиентской части чата системы.

В первом рабочем окне Node.js command prompt необходимо встать в директорию содержащую локальный сервер командой:

cd <путь к директории>

например:

cd D:

cd D:\АСДУ\ASDU-Chat\Demo\server

Перед первым запуском локального сервера нужно ввести команду:

npm install

в результате в директории проекта будет создана папка node_modules.
Для запуска локального сервера нужно ввести команду:

npm run dev

Во втором рабочем окне Node.js command prompt необходимо встать в директорию содержащую клиентскую часть чата системы командой:

cd <путь к директории>

например:

cd D:

cd D:\АСДУ\ASDU-Chat\Demo\client

Перед первым запуском локального сервера нужно ввести команду:

npm install

в результате в директории проекта будет создана папка node_modules. 
Для запуска локального сервера нужно ввести команду:

npm start

Клиентская часть готова к запуску, появляется окно ввода имени пользователя системы АСУДД, нужно ввести одно из имён:

User, TechAutomatic, andrey_omsk, RegAdmin, MMMM, Viewer, Rura, eam32, Alex_A, Moscow, Admin

Клиентская часть запущена, инструкция по работе в чате системы находится в документе "Арм Системный чат.docx"

Приятного просмотра!
