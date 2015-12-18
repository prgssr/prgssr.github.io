---
layout: post
title: "Техники работы с DOM: родительские, дочерние и соседние элементы"
categories: [development]
tags: [javascript, dom, translation, sitepoint]
date: 2015-12-17 20:02:18
description: "Луис Лазарис о нативных методах работы с DOM"
prism: yes
original: "http://www.sitepoint.com/dom-tips-techniques-parent-child-siblings/"
original_title: "DOM Tips and Techniques: Parent, Child, and Siblings"
original_author: "Луис Лазарис"
scripts: codepen
thumbnail: "/images/javascript.png"
---

Сложные и тяжелые веб-приложения стали обычными в наши дни. Кроссбраузерные и простые в использовании библиотеки типа jQuery с их широким функционалом могут сильно помочь в манипулировании DOM на лету. Поэтому неудивительно, что многие разработчики использую подобные библиотеки чаще, чем работают с нативным DOM API, с [которым было немало проблем](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o/edit). И хотя различия в браузерах по-прежнему остаются проблемой, DOM находится сейчас в лучшей форме, чем [5-6 лет назад](http://ejohn.org/blog/the-dom-is-a-mess/), когда jQuery набирал популярность.

В этой статье я продемонстрирую возможности DOM по манипулированию HTML, сфокусировавшись на отношения родительских, дочерних и соседних элементов. В заключении я дам данные о поддержке этих возможностей в браузерах, но учитывайте, что библиотека типа  jQuery по-прежнему остается хорошей опцией в силу наличия багов и непоследовательностей в реализации нативного функционала.

## Подсчет дочерних узлов

Для демонстрации я буду использовать следующую разметку HTML, в течение статьи мы ее несколько раз изменим:

```markup
<body>
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
</body>
```

Если я хочу подсчитать, сколько элементов внутри `<ul>`, я могу сделать это двумя способами.

```javascript
var myList = document.getElementById('myList');

console.log(myList.children.length); // 6
console.log(myList.childElementCount); // 6
```

<p data-height="368" data-theme-id="0" data-slug-hash="XmOvbK" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/XmOvbK/'>Counting Child Elements: children & childElementCount</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Как видите, результаты одинаковые, хотя техники используются разные. В первом случае я использую свойство `children`. Это свойство только для чтения, оно возвращает коллекцию элементов HTML, находящихся внутри запрашиваемого элемента; для подсчета их количества я использую свойство `length` этой коллекции.

Во втором примере я использую метод `childElementCount`, который мне кажется более аккуратным и потенциально более поддерживаемым способом (подробнее обсудим это позже, я не думаю, что у вас возникнут проблемы с пониманием того, что он делает).

Я мог бы попытаться использовать `childNodes.length` (вместо `children.length`), но посмотрите на результат:

```javascript
var myList = document.getElementById('myList');
console.log(myList.childNodes.length); // 13
```

<p data-height="368" data-theme-id="0" data-slug-hash="gaqVad" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/gaqVad/'>Counting Child Nodes with childNodes.length</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Он возвращает 13, потому что `childNodes` это коллекция всех узлов, включая пробелы --- учитывайте это, если вам важна разница между  дочерними узлами и дочерними узлами-элементами.

## Проверка существования дочерних узлов

Для проверки наличия у элемента дочерних узлов я могу использовать метод `hasChildNodes()`. Метод возвращает логическое значение, сообщающие об их наличии или отсутствии:

```javascript
var myList = document.getElementById('myList');
console.log(myList.hasChildNodes()); // true
```

<p data-height="368" data-theme-id="0" data-slug-hash="WQPVrq" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/WQPVrq/'>hasChildNodes()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Я знаю, что в моем списке есть дочерние узлы, но я могу изменить HTML так, чтобы их не было; теперь разметка выглядит так:

```markup
<body>
  <ul id="myList">
  </ul>  
</body>
```

И вот результат нового запуска `hasChildNodes()`:

```javascript
console.log(myList.hasChildNodes()); // true
```

<p data-height="368" data-theme-id="0" data-slug-hash="GpzVZX" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/GpzVZX/'>hasChildNodes() on empty element with white space</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Метод по прежнему возвращает `true`. Хотя список не содержит никаких элементов, в нем есть пробел, являющийся валидным типом узла. Данный метод учитывает все узлы, не только узлы-элементы. Чтобы `hasChildNodes()` вернул `false` нам надо еще раз изменить разметку:

```markup
<body>
  <ul id="myList"></ul>  
</body>
```

И теперь в консоль выводится ожидаемый результат:

```javascript
console.log(myList.hasChildNodes()); // false
```

<p data-height="368" data-theme-id="0" data-slug-hash="qOgeNX" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/qOgeNX/'>hasChildNodes() on empty element with no white space</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Конечно, если я знаю, что могу столкнуться с пробелом, то сначала я проверю существование дочерних узлов, затем с помощью свойства [ nodeType](https://developer.mozilla.org/en/docs/Web/API/Node/nodeType) определяю, есть ли среди них узлы-элементы.

## Добавление и удаление дочерних элементов

Есть техника, которые можно использовать  для добавления и удаления элементов из DOM. Наиболее известная из них основана на сочетании методов `createElement()` и `appendChild()`.

```javascript
var myEl = document.createElement('div');
document.body.appendChild(myEl);
```

В данном случае я создаю `<div>` с помощью метода `createElement()` и затем добавляю его к `body`. Очень просто и вы наверняка использовали эту технику раньше.

Но вместо вставки специально создаваемого элемента, я также могу использовать `appendChild()`  и просто переместить существующий элемент. Предположим, у нас следующая разметка:

```markup
<div id="c">
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
  <p>Example text</p>
</div>
```

Я могу изменить место расположения списка с помощью следующего кода:

```javascript
var myList = document.getElementById('myList'),
    container = document.getElementById('c');

container.appendChild(myList);
```

Итоговый DOM будет выглядеть следующим образом:

```markup
<div id="c">
  <p>Example text</p>
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
</div>
```

<p data-height="368" data-theme-id="0" data-slug-hash="LpqwRO" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/LpqwRO/'>Using appendChild() to change an element's location</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Обратите внимание, что весь список был удален со своего места (над параграфом) и затем  вставлен после него перед закрывающим `body`. И хотя обычно метод `appendChild()` используется для добавления элементов созданных с помощью `createElement()`, он также может использоваться для перемещения существующих элементов.

Я также могу полностью удалить дочерний элемент из DOM с помощью `removeChild()`. Вот как удаляется наш список из предыдущего примера:

```javascript
var myList = document.getElementById('myList'),
    container = document.getElementById('c');

container.removeChild(myList);
```

<p data-height="368" data-theme-id="0" data-slug-hash="MaLNbK" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/MaLNbK/'>Using removeChild()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Теперь элемент удален. Метод `removeChild()` возвращает удаленный элемент и я могу его сохранить на случай, если он потребуется мне позже.

```javascript
var myOldChild = document.body.removeChild(myList);
document.body.appendChild(myOldChild);
```

<p data-height="368" data-theme-id="0" data-slug-hash="JYxgEy" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/JYxgEy/'>Using removeChild() to move an element</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Таке существует метод `ChildNode.remove()`, относительно недавно добавленный в спецификацию:

```javascript
var myList = document.getElementById('myList');
myList.remove();
```

<p data-height="368" data-theme-id="0" data-slug-hash="pjGMeJ" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/pjGMeJ/'>Using childNode.remove()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Этот метод не возвращает удаленный объект и не работает в IE (только в Edge). И оба метода удаляют текстовые узлы точно так же, как и узлы-элементы.

## Замена дочерних элементов

Я могу заменить существующий дочерний элемент новым, независимо от того, существует ли этот новый элемент или я создал его с нуля. Вот разметка:

```markup
<p id="par">Example Text</p>
```
И JavaScript:

```javascript
var myPar = document.getElementById('par'),
    myDiv = document.createElement('div');

myDiv.className = 'example';
myDiv.appendChild(document.createTextNode('New element text'));
document.body.replaceChild(myDiv, myPar);
```

<p data-height="368" data-theme-id="0" data-slug-hash="PPVMpV" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/PPVMpV/'>Using replaceChild()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Здесь я создал элемент, добавил текстовый узел с помощью `createTextNode()` и вставил его на страницу на место параграфа. Теперь на месте первоначального параграфа следующий HTML:

```markup
<div class="example">New element text</div>
```

Как видите, метод `replaceChild()` принимает два аргумента: новый элемент и заменяемый им старый элемент.

Я также могу использовать это метод для перемещения существующего элемента. Взгляните на следующий HTML:

```markup
<p id="par1">Example text 1</p>
<p id="par2">Example text 2</p>
<p id="par3">Example text 3</p>
```

Я могу заменить третий параграф первым параграфом с помощью следующего кода:

```javascript
var myPar1 = document.getElementById('par1'),
    myPar3 = document.getElementById('par3');

document.body.replaceChild(myPar1, myPar3);
```

Теперь сгенерированный DOM выглядит так:

```markup
<p id="par2">Example text 2</p>
<p id="par1">Example text 1</p>
```

<p data-height="368" data-theme-id="0" data-slug-hash="RWvXVY" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/RWvXVY/'>Using replaceChild() to swap one element for another</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


## Выборка конкретных дочерних элементов

Существует несколько разных способов выбора конкретного элемента. Как показано ранее, я могу начать с использования коллекции `children` или свойства `childNodes`. Но взглянем на другие варианты:

Свойства  `firstElementChild` и `lastElementChild` делают именно то, чего от них можно ожидать по их названию: выбирают первый и последний дочерние элементы. Вернемся к нашей разметке:

```markup
<body>
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
</body>
```

Я могу выбрать первый и последний элементы с помощью этих свойств:

```javascript
var myList = document.getElementById('myList');
console.log(myList.firstElementChild.innerHTML); // "Example one"
console.log(myList.lastElementChild.innerHTML); // "Example six"
```

<p data-height="368" data-theme-id="0" data-slug-hash="PPVMjV" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/PPVMjV/'>Using firstElementChild and lastElementChild</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Я также могу использовать свойства `previousElementSibling` и `nextElementSibling`, если я хочу выбрать дочерние элементы, отличные от первого или последнего. Это делается сочетанием свойств  `firstElementChild` и `lastElementChild`:

```javascript
var myList = document.getElementById('myList');
console.log(myList.firstElementChild.nextElementSibling.innerHTML); // "Example two"
console.log(myList.lastElementChild.previousElementSibling.innerHTML); // "Example five"
```
<p data-height="368" data-theme-id="0" data-slug-hash="gaqVxq" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/gaqVxq/'>Using nextElementSibling and previousElementSibling</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Также есть сходные свойства` firstChild`, `lastChild`, `previousSibling`, и `nextSibling`, но они учитывают все типы узлов, а не только  элементы. Как правило, свойства, учитывающие только узлы-элементы полезнее тех, которые выбирают все узлы.


## Вставка контента в DOM

Я уже рассматривал способы вставки элементов в DOM. Давайте перейдем к похожей теме и  взглянем на новые возможности по вставке контента.

Во-первых, есть простой метод `insertBefore()`, он во многом похож на `replaceChild()`, принимает два аргумента и при этом работает как с новыми элементами, так и с существующими. Вот разметка:

```markup
<div id="c">
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
  <p id="par">Example Paragraph</p>
</div>
```

Обратите внимание на параграф, я собираюсь сначала убрать его, а затем вставить перед списком, все одним махом:

```javascript
var myList = document.getElementById('myList'),
    container = document.getElementBy('c'),
    myPar = document.getElementById('par');

container.insertBefore(myPar, myList);
```

<p data-height="368" data-theme-id="0" data-slug-hash="VvgoMd" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/VvgoMd/'>Using insertBefore()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

В полученном HTML параграф будет перед списком и это еще один способ перенести элемент.

```markup
<div id="c">
  <p id="par">Example Paragraph</p>
  <ul id="myList">
    <li>Example one</li>
    <li>Example two</li>
    <li>Example three</li>
    <li>Example four</li>
    <li>Example five</li>
    <li>Example Six</li>
  </ul>
</div>
```

Как и `replaceChild()`, `insertBefore()` принимает два аргумента: добавляемый элемент и элемент, перед которым мы хотим его вставить.

Этот метод прост. Попробуем теперь более мощный способ вставки: метод `insertAdjacentHTML()`.

```javascript
var myEl = document.getElementById('el');
myEl.insertAdjacentHTML('beforebegin', '<p>New element</p>');
```

Этот код вставит определенную строку контента перед целевым элементом (в данном случае перед списком). Второй аргумент это строка с HTML, которую вы хотите вставить (это может быть и простой текст). Первый  аргумент, это строка с одним из четырех возможных значений:

* `beforebegin` – Вставляет строку перед указанным элементом.
* `afterbegin` – Вставляет строку внутри указанного  элемента перед первым дочерним элементом.
* `beforeend` – Вставляет строку  внутри указанного  элемента после последнего дочернего элемента
* `afterend` – Вставляет строку  после указанного элемента


Чтобы было проще понять, как работает каждое из этих значений, взгляните на комментарии в сниппете разметки. Подразумевая, что `#el` div это целевой элемент, каждый комментарий показывает, где будет находится вставленный HTML.

```markup
<!-- beforebegin -->
<div id="el">
  <!-- afterbegin -->
  <p>Some example text</p>
  <!-- beforeend -->
</div>
<!-- afterend -->
```

Этот пример делает понятным, что делает каждое из этих значений.

<p data-height="368" data-theme-id="0" data-slug-hash="Vvgord" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/Vvgord/'>Using insertAdjacentHTML()</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

## Поддержка в браузерах

При обсуждении любых веб-технологий, их поддержка в браузерах всегда является важным фактором. Чтобы не ходить по граблям, ниже приводится список, что и как поддерживается:

Следующие возможности поддерживаются везде, включая старые версии IE:


* [childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)
* [hasChildNodes()](https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes)
* [appendChild()](https://developer.mozilla.org/en/docs/Web/API/Node/appendChild)
* [removeChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
* [replaceChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild)
* [createTextNode()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode)
* [previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling)
* [nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)
* [insertBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)
* [insertAdjacentHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)


Эти возможности поддерживаются в IE9+ и других современных браузерах:

* [children](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children)
* [childElementCount](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount)
* [firstElementChild](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild)
* [lastElementChild](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild)
* [previousElementSibling](https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling)
* [nextElementSibling](https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling)


И остается метод [Node.remove()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove), который, как уже упоминалось, поддерживается Microsoft только начиная с браузера Edge.

В общем и целом, поддержка этих возможностей в браузерах превосходна. Конечно, остаются баги и проблемы с совместимостью, поэтому не забудьте тщательно протестировать все, если вы используете эти методы и свойства.

## Заключение

В идеале, возможностей языка JavaScript и DOM API должно хватать для того, чтобы все делалось просто и кроссбраузерно. В итоге, мы к этому обязательно придем, но пока эти проблемы  будут продолжать решаться с помощью  инструментов типа jQuery.

 