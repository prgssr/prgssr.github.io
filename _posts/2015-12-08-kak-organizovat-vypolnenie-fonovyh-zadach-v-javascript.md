---
layout: post
title: "Как организовать выполнение фоновых задач в JavaScript"
categories: [development]
tags: [javascript, translation, sitepoint]
date: 2015-12-08 21:19:46
description: "Новейшие веб-технологии в статье Крейга Баклера - браузерный эльф и экспериментальный API requestIdleCallback"
prism: yes
original: "http://www.sitepoint.com/how-to-schedule-background-tasks-in-javascript/"
original_title: "How to Schedule Background Tasks in JavaScript"
original_author: "Крейг Баклер"
thumbnail: "noimage"
---

Даже если вы забудете все  о JavaScript, не забывайте главное — он блокирует.

Представьте чудесного эльфа, выполняющего всю работу в вашем браузере. Он все делает сам: выводит HTML, откликается на команды в меню, рисует, обрабатывает клики мыши или выполняет функции JavaScript. Как и все мы, эльф может делать только одну вещь одновременно. Если передать ему много задач, они добавятся в его большой список запланированного и он будет выполнять их поочередно.

Выполнение всех задач останавливаются, когда эльф видит тег `script` или запускает функцию JavaScript. Код JavaScript  скачивается (когда это требуется) и начинает выполняться, откладывая обработку рендеринга и других событий. Это важно, так как скрипт может сделать все: загрузить еще код, удалить любой элемент DOM, переадресовать на другой URL и т.д. И даже если бы в нашем браузере работал не один, а много эльфов, им все равно приходилось бы останавливать свою работу, пока эльф, ответственный за JavaScript не доделает свою. Потому что JavaScript блокирует. Именно поэтому при долгом выполнении скриптов, браузеры перестают реагировать на что-то другое.

Очень часто JavaScript приходиться запускать максимально рано, чтобы инициализировать виджеты и обработчики событий. Однако есть и менее важные фоновые задачи, не связанные напрямую  с взаимодействием с пользователями, например:

* запись данных аналитики;
* отправка данных в социальные сети (или добавление 57 кнопок "share");
* предзагрузка контента;
* пред-обработка или пререндеринг HTML.

Они не критичны по времени, но чтобы страница не теряла отзывчивость, они не должны выполняться в момент, когда пользователь прокручивает страницу или иначе взаимодействует с ее содержимым.

Один из вариантов решения проблемы это [ Web Workers](http://www.sitepoint.com/javascript-threading-html5-web-workers/), которые могут выполнять код одновременно в разных потоках. Это отличный вариант для предзагрузки и обработки, но при этом у вас нет прямого доступа или возможности обновлять DOM. Вы можете избежать использования этих возможностей в своих скриптах, но вы не можете гарантировать, что они не задействованы в скриптах от третьих сторон вроде Google Analytics.

Другая возможность это использование `setTimeout` или `setTimeout(doSomething,1);`. Браузер выполнит функцию `doSomething()` после того, как остальные немедленно исполняемые задачи будут выполнены. В сущности, этот способ просто откладывает задачу в конец списка. К сожалению, функция будет вызываться независимо от обработки данных по мере поступления.

##  API `requestIdleCallback`

[requestIdleCallback](http://www.w3.org/TR/requestidlecallback/) ("ленивый" обратный вызов) это новый API, созданный  для планирования несущественных фоновых задач, в те моменты, когда браузер свободен. Он напоминает метод [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), вызывающий функцию для обновления анимации перед следующей отрисовкой. Вы можете узнать больше о `requestAnimationFrame` из статьи [Simple Animations Using requestAnimationFrame](http://www.sitepoint.com/simple-animations-using-requestanimationframe/).

Мы можем определить наличие поддержки `requestIdleCallback` следующим образом:

```javascript
if ('requestIdleCallback' in window) {
  // requestIdleCallback supported
  requestIdleCallback(backgroundTask);
}
else {
  // no support - do something else
  setTimeout(backgroundTask1, 1);
  setTimeout(backgroundTask2, 1);
  setTimeout(backgroundTask3, 1);
}
```

Вы также можете задать таймаут (в миллисекундах) в виде опции объекта с параметрами.

```javascript
requestIdleCallback(backgroundTask, { timeout: 3000; });
```

Это обеспечит вызов вашей функции через три секунды, независимо от нахождения браузера в режиме ожидания.

API `requestIdleCallback` вызывает вашу  функцию однажды и передает объект `deadline` со следующими свойствами:

* `didTimeout` — логическое значение: `true`, если добавлен таймаут.
* `timeRemaining()` — функция, возвращающая количества миллисекунд, оставшихся до выполнения задачи.

`timeRemaining()` выделит не более 50 миллисекунд для выполнения вашей задачи. Выполнение задачи не остановится после превышения этого лимита, но предпочтительнее будет, если вы опять вызовете  `requestIdleCallback`  для продолжения выполнения задачи.

Создадим простой пример, выполняющий несколько задач по порядку. Все задачи сохранены в массиве как ссылки на функции:

```javascript
// array of functions to run
var task = [
	background1,
	background2,
	background3
];

if ('requestIdleCallback' in window) {
  // requestIdleCallback supported
  requestIdleCallback(backgroundTask);
}
else {
  // no support - run all tasks soon
  while (task.length) {
  	setTimeout(task.shift(), 1);
  }
}

// requestIdleCallback callback function
function backgroundTask(deadline) {

  // run next task if possible
  while (deadline.timeRemaining() > 0 && task.length > 0) {
  	task.shift()();
  }

  // schedule further tasks if necessary
  if (task.length > 0) {
    requestIdleCallback(backgroundTask);
  }
}
```

## Что нельзя сделать с `requestIdleCallback`?

Как заметил [по этому вопросу в своем блоге](https://developers.google.com/web/updates/2015/08/using-requestidlecallback?hl=en) Пол Льюис, работа в `requestIdleCallback` должна выполняться небольшими порциями. Это не подходит для задач с непредсказуемым временем выполнения (таких как манипуляция DOM, которые лучше выполнять с помощью `requestAnimationFrame`). Также вам следует быть осторожными с промисами, так как  функции обратного вызова в них исполняются немедленно после выполнения "ленивого обратного вызова" даже если времени уже не осталось.

## Поддержка `requestIdleCallback` в браузерах

`requestIdleCallback` это экспериментальная возможность и ее спецификация продолжает разрабатываться, поэтому не удивляйтесь, если вы столкнетесь с изменениями этого API. Поддержка реализована в Chrome 47,  реализация в Opera также будет сделана в ближайшее время. Microsoft и Mozilla уже изучают такую возможность и это звучит обнадеживающе; только Apple, как всегда, хранит молчание.

Пол Льюис (уже упоминавшийся в статье) создал простой [шим requestIdleCallback](https://gist.github.com/paullewis/55efe5d6f05434a96c36). Он имплементирует API, но это не полифилл, так как  у него нет эмуляции выявления у браузера "ленивого" режима — в браузерах, не поддерживающих этот API он использует `setTimeout`, как это было в нашем примере.

Несмотря на ограниченную поддержку на данный момент, `requestIdleCallback` может быть интересным способом улучшения производительности.

##### Дополнительные материалы:

* [Черновик спецификации](https://w3c.github.io/requestidlecallback/)
* Статья Пола Льюиса [Using requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback?hl=en)

