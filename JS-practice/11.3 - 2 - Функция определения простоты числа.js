/* Задание 2

Напишите функцию, которая принимает на входе любое число (но не больше 1 000), определяет, является ли оно простым, и выводит, простое число или нет. Если введено больше 1000, то выводится сообщение, что данные неверны. Обратите внимание на числа 0 и 1.

*/

// Функция определения простоты числа
function simple(x) {
	let _true = 'Число ' + x + ' простое', _false = 'Число ' + x + ' не простое', _wrong = 'Число ' + x + ' вне диапазона 1-1000', _one = 'Число 1 — не является ни простым, ни составным числом, так как у него только один делитель — 1';
	if (x < 1 || x > 1000) return _wrong;
    let i = 3; // Старт для перебора. Для 1 и 2 предопределённые значения
    if (x == 1) { // 1 - не простое и не составное
        return _one;
    };
    if (x == 2) { // 2 - первое простое число
        return _true;
    };
    if (x % 2 == 0) {
        return _false;
    }
    while (i * i <= x) {
        if (x % i == 0) {
            return _false;
        } else (i++);
    };
    return _true;
};

// Пример работы функции simple(x)
console.log(simple(0));
console.log(simple(1));
console.log(simple(15));
console.log(simple(1001));
console.log(simple(53));
console.log(simple(555));
console.log(simple(371));
console.log(simple(1113));
console.log(simple(240));
console.log(simple(113));
console.log(simple(833));