---
title: "Введение в Web MIDI"
layout: post
categories: [development]
tags: [midi, javascript, translation, tutsplus]
prism: yes
date: 2016-05-11 22:32:50 +0300
description: "Web MIDI API — новая игрушка, доступная в Chrome и Opera. Короткая статья-введение в сабж с tutsplus.com."
original: "http://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220"
original_title: "Introduction to Web MIDI"
original_author: "Стюарт Мемо"
thumbnail: "noimage"
---

"Статья о MIDI в вебе? В 2016? Смешно, да."

Нет. Это не то, что вы думаете. Для тех, кто помнит интернет 90х, одной фразы "MIDI в вебе" достаточно, чтобы вспомнить унылое лофайное проигрывание "The Final Countdown" при посещении гостевых книг особо одаренных веб-мастеров. Однако в 2016 году MIDI в вебе, а точнее [Web MIDI API](http://www.w3.org/TR/webmidi/) имеет большой потенциал.

[MIDI](https://en.wikipedia.org/wiki/MIDI) стандарт отвечает за цифровой интерфейс музыкальных инструментов. Это протокол, который позволяет электронным музыкальным инструментам, компьютерам и прочим устройствам общаться друг с другом. Он работает посылая небольшие сообщения от устройства к устройству, передавая сообщения типа "нажата клавиша с нотой 12" или "клавишу с нотой 62 отпустили" в коротком цифровом формате.

Web MIDI API использует этот протокол и позволяет вам взять инструмент с MIDI, например, MIDI-клавиатуру, подсоединить к компьютеру и пересылать информацию с нее в браузер.

На данный момент  [Web MIDI API поддерживается только в Chrome and Opera](http://caniuse.com/#search=web%20midi), но вы можете наблюдать за [продвижением работы по добавлению его в Firefox в соответствующем треде на сайте](https://bugzilla.mozilla.org/show_bug.cgi?id=836897).


Но зачем подключать MIDI-клавиатуру к браузеру? Начнем с того, что для большинства музыкантов QWERTY-клавиатура не является полноценной заменой. А в реальности  спектр музыкального оборудования, поддерживающего MIDI очень широк. Подключая MIDI-инструменты к браузеру и используя Web Audio API, мы можем создавать музыкальные инструменты прямо в вебе.

Хотите пианино? Просто подсоедините MIDI-клавиатуру и перейдите на страницу, использующую эти технологии для воспроизведения звука пианино. Нужен другой звук? Просто перейдите на другой сайт.

Итак, мы поняли, зачем нужен этот API, теперь будем разбираться, как он работает.

## Доступ к MIDI-устройству

Сначала нам надо проверить наличие поддержки Web MIDI API в браузере. Это делается проверкой наличия метода `navigator.requestMIDIAccess`, он реализован только в браузерах с поддержкой Web MIDI API.

```javascript
if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI!');
}
```

Теперь, когда мы убедились, что метод существует, вызовем его для доступа к любому MIDI-входу в браузере.

```javascript
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}
```

`navigator.requestMIDIAccess()` возвращает промис, это означает, что мы можем вызвать нужную функцию как в случае успешного соединения, так и в случае неудачи. Пока мы напишем две простые функции, просто выводящие в консоль результат подключения.

```javascript
function success (midi) {
    console.log('Got midi!', midi);
}
 
function failure () {
    console.error('No access to your midi devices.')
}
```

Как видите, функция для успешного подключения принимает MIDI-параметр в виде объекта `MIDIAccess`. Этот объект является ключом к получению MIDI-данных. Сам по себе он предоставляет интерфейс для доступа к любым подключенным MIDI-устройствам. У меня подключена только MIDI-клавиатура, поэтому если я выведу в консоль `midi.inputs.size`, значение будет "1".

Чтобы получать MIDI-данные с нашего устройства, нам надо создать переменную и задать ей значение `midi.inputs.values()`, примерно так:

```javascript
var inputs = midi.inputs.values();
```

Важно понимать, что значение, присвоенное `inputs` является [итератором](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Iterators_and_Generators). Итератор это объект, который умеет обращаться к своим свойствам по одному и при этом отслеживает текущую позицию в последовательности итерации. Он предоставляет метод `next()`, позволяющий вам получить следующий элемент в последовательности. Также в нем есть свойство `done`, позволяющее нам узнать, когда мы прошли итерацией через все свойства объекта. Это значит, что мы можем писать циклы, типа этого:

```javascript
for (var input = inputs.next();
     input && !input.done;
     input = inputs.next()) {
    // each time there is a midi message call the onMIDIMessage function
    input.value.onmidimessage = onMIDIMessage;
}
```

Краткое содержание цикла:

1. Создана переменная `input`, ей присвоен следующий MIDI-вход. Так как мы не проводили итерацию по входам, это будет первый из доступных MIDI-входов.
2. Если у нас есть MIDI-вход и значение `done` не равно `true`, мы запускаем цикл.
3. Присваиваем `input` следующий MIDI-вход в нашем объекте-итераторе.

Вы также заметите, что внутри этого цикла мы присваиваем функцию обработчику событий MIDI-входа `onmidimessage`. Эта функция будет вызываться при каждом приеме MIDI-данных устройства, занимающего этот вход. Создадим эту функцию:

```javascript
function onMIDIMessage (message) {
    console.log(message.data);
}
```
 
## Декодирование MIDI-данных

Из всего содержимого MIDI-сообщения нам прежде всего интересны его данные — какой тип MIDI-событий передается, какая клавиша нажата?

Если вы  подключите MIDI-клавиатуру и проверите выложенный в статье код, вы увидите, что при нажатии клавиши браузер вывод в консоль лог, примерно такой — `[144, 61, 95]`. После того как вы отпустите клавишу, также выведется лог — `[128, 61, 0]`.

Этот массив и есть данные. Первый его элемент это тип MIDI-события. MIDI-сообщения могут содержать небольшое количество событий и каждому типу события соответствует определенный номер. В нашем случае число 144 это сообщение `noteOn`, то есть нажатие клавиши, а  128 — `noteOff`, передающее, что клавиша отпущена. Полный список доступных типов событий есть в [спецификации MIDI](http://www.midi.org/techspecs/midimessages.php).

Второй элемент массива это данные о нажатой/отпущенной клавиши. Всего для нот есть  128 номеров, этого достаточно для всех октав. В нашем случае нажата клавиша 61, по [таблице номеров нот мы видим](http://www.midimountain.com/midi/midi_note_numbers.html), что это C#.

Третий и последний элемент это скорость нажатия клавиш (velocity). Он может использоваться, например, для имитации пианино, клавиши которого могут нажиматься мягко или с силой.

Теперь, когда мы знаем, какая клавиша нажата или отпущена, попробуем эти сведения конвертировать во что-то полезное. Привяжем  Web MIDI API к Web Audio API. Если вы не знакомы с Web Audio API, вам стоит прочитать [несколько статей о нем](http://code.tutsplus.com/series/the-web-audio-api--cms-817).

## Создание инструмента в браузере

Сделаем из нашего браузера небольшой синтезатор. Мы создадим осциллятор, генерирующий частоту нажатой клавиши, для этого нам надо конвертировать номер ноты в частоту. [Алгоритм для этого нашелся в Википедии](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard), вот как выглядит его реализация в JavaScript;

```javascript
function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}
```

Просто отдаем ноту и получаем частоту. Используем это в функции `onMIDIMessage`:

```javascript
function onMIDIMessage (message) {
    var frequency = midiNoteToFrequency(message.data[1]);
}
```

Теперь мы хотим, чтобы нота с этой частотой проигрывалась при поступлении MIDI-сообщения с событием `noteOn`:

```javascript
if (message.data[0] === 144 && message.data[2] > 0) {
    playNote(frequency);
}
```

Первую часть этого условия понять легко — мы проверяем, что получили сообщение с номером 144, то есть `noteOn`.

Но что у нас во второй части? Некоторые устройства вместо отправки сообщения `noteOff` передают `noteOn` со скоростью нажатия 0, поэтому мы проверяем, что значение скорости нажатия больше нуля.

Теперь у нас есть обработчик событий `noteOn`, напишем аналогичный для `noteOff`. Это сообщение с номером 128, но с учетом того, что мы выяснили, нам надо реагировать не только на него, но и на сообщения с нулевой скоростью нажатия.

```javascript
if (message.data[0] === 128 || message.data[2] === 0) {
    stopNote(frequency);
}
```

Теперь нам надо написать функции  `startNote` и `stopNote`. Здесь уже работает Web Audio API, рассмотрение которого находится за пределами этой статьи, но если вы знакомы с ним, итоговый код будет вам понятен.

Если нет, еще раз советую прочитать [серию статей о Web Audio API](http://code.tutsplus.com/series/the-web-audio-api--cms-817), включая [статью о создании синтезатора](http://code.tutsplus.com/tutorials/the-web-audio-api-make-your-own-web-synthesizer--cms-23887). Код в этой статье похож на то, что получилось у нас сейчас.

```javascript
var context = new AudioContext(),
    oscillators = {};
 
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}
 
function success (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator
 
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}
 
function failure () {
    console.error('No access to your midi devices.')
}
 
function onMIDIMessage (message) {
    var frequency = midiNoteToFrequency(message.data[1]);
 
    if (message.data[0] === 144 && message.data[2] > 0) {
        playNote(frequency);
    }
 
    if (message.data[0] === 128 || message.data[2] === 0) {
        stopNote(frequency);
    }
}
 
function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}
 
function playNote (frequency) {
    oscillators[frequency] = context.createOscillator();
    oscillators[frequency].frequency.value = frequency;
    oscillators[frequency].connect(context.destination);
    oscillators[frequency].start(context.currentTime);
}
 
function stopNote (frequency) {
    oscillators[frequency].stop(context.currentTime);
    oscillators[frequency].disconnect();
}
```

## Что дальше?

Запомните, что `noteOn` и `noteOff` это лишь два из доступных типов сообщений и MIDI-клавиатура это лишь одно из очень разнообразных MIDI-устройств. И вы не обязаны использовать их для музыки. Может, мы еще дождемся HTML5 игр с управлением от [MIDI-трубы](https://www.amazon.co.uk/Yamaha-EZ-TP-MIDI-Trumpet/dp/B000E5YP0M/278-8684564-7116806?ie=UTF8&*Version*=1&*entries*=0).

##### Дополнительные материалы

* [Серия подробных статей о MIDI](http://www.muzoborudovanie.ru/articles/midi/midi1.php);
* [Спецификация Web MIDI API](https://www.w3.org/TR/webmidi/);
* [Making Music in the Browser – Web MIDI API](https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/);
* [Web MIDI: Music and Show Control in the Browser](http://tangiblejs.com/posts/web-midi-music-and-show-control-in-the-browser).