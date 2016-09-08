---
title: Способы смены порядка вывода элементов с помощью CSS
layout: post
categories: [development]
tags: [css, translation, tutsplus]
date: 2016-09-04 14:59:28 +0300
prism: yes
description: "Джордж Марцукос о способах реверсирования порядка вывода элементов с помощью CSS"
original: "http://webdesign.tutsplus.com/tutorials/a-few-different-css-methods-for-column-ordering--cms-27079"
original_title: "A Few Different CSS Methods for Changing Display Order"
original_author: "George Martsoukos"
thumbnail: "/images/development/css/Layout_Small_Screens.png"
scripts: codepen
---

В этой статье мы рассмотрим несколько различных методов CSS для переупорядочения вывода элементов HTML.

## Цель

Наша раскладка очень простая. В частности, на маленьких экранах (меньше 600px) она будет выглядеть так:

![Раскладка на маленьких экранах - 4 кнопки выведены в один столбик](/images/development/css/Layout_Small_Screens.png)

На средних экранах и больше (от 600px) кнопки будут выстраиваться в ряд:

![Раскладка на больших экранах - 4 кнопки выведены в ряд](/images/development/css/Layout_Small_Screens-1.png)

Наша главная задача — поменять порядок кнопок на обратный.

### Разметка

Разметка будет самая простая: просто элемент `div`, содержащий четыре кнопки:

```html
<div class="boxes">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
  <button>Button 4</button>
</div>
```

### Стили

На маленьком экране у всех кнопок будут одинаковые стили:

```css
.boxes button {
  display: block;
  width: 100%;
  padding: 15px;
  border: none;
  margin-bottom: 5px;
  box-sizing: border-box;
  font-size: 1rem;
  text-align: center;
  text-decoration: none;
  background: gold;
  color: #000;
}
 
.boxes button:nth-of-type(even) {
  background: #e6c200;
}
```

На больших экранах мы зададим `width: 25%`, остальные стили будут определяться методом CSS, который мы будем применять для задания обратного порядка кнопок.

```css
@media screen and (min-width: 600px) {
  /* we skip this property in flexbox and grid methods */
  width: 25%;
   
 /* more stuff here */
}
```

Наконец, у нас будут стили для состояния `focus` наших кнопок:

```css
.boxes button:focus {
  outline: none;
  color: #fff;
  background: firebrick;
}
```

Таким образом, если мы будем использовать для навигации клавишу Tab, наши кнопки при фокусировке станут темно-красными.

![Стили для фокусировки](/images/development/css/Layout_Small_Screens-2.png)

## Методы упорядочивания колонок

Теперь мы готовы проверить различные подходы CSS для  вывода кнопок в реверсивном порядке при превышении  областью видимости ширины в 599px.

### Метод №1: плавающие блоки

Можно просто добавить блокам  `float: right`, вот полные стили:

```css
@media screen and (min-width: 600px) {
  .boxes button {
    float: right;
    width: 25%;
  }
}
```

И демо с Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="JRPaXV" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/JRPaXV/">Using Floats for Reverse Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Метод №2: позиционирование

Альтернативным вариантом будет задание позиции элементам, относительной или абсолютной.

По первому варианту (с относительным позиционированием) мы зададим кнопкам, плывущим влево свойство `position: relative` и затем расставим их с помощью свойство `left`.

Вот CSS:

```css
@media screen and (min-width: 600px) {
  .boxes button {
    position: relative;
    float: left;
    width: 25%;
   }
  
  .boxes button:nth-of-type(1) {
    left: 75%;
  }
 
  .boxes button:nth-of-type(2) {
    left: 25%;
  }
 
  .boxes button:nth-of-type(3) {
    left: -25%;
  }
 
  .boxes button:nth-of-type(4) {
    left: -75%;
  }
}
```

Демо с Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="mAbGOP" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/mAbGOP/">Using Positioning (relative) for Reverse Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Вторым вариантом (с использованием абсолютного позиционирования) мы зададим нашим кнопкам `position: absolute`, а с помощью свойства `left` разместим их более точно.

Соответствующий CSS:

```css
@media screen and (min-width: 600px) {
  .boxes {
    position: relative;
  }
   
  .boxes button {
    position: absolute;
    width: 25%;
  }
   
  .boxes button:nth-of-type(1) {
    left: 75%;
  }
   
  .boxes button:nth-of-type(2) {
    left: 50%;
  }
   
  .boxes button:nth-of-type(3) {
    left: 25%;
  }
   
  .boxes button:nth-of-type(4) {
    left: 0;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="dpbqNy" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/dpbqNy/">Using Positioning (absolute) for Reverse Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Метод №3: свойство `direction`

Менее очевиден подход на основе свойства `direction` — оно предназначено для смены направления чтения текста. В нашем случае мы задаем `direction: rtl` (справа налево) для элемента-обертки, что позволит сменить направление раскладки.

Примечание: для этого примера мы дадим нашим кнопкам поведение элементов таблицы, чтобы создать горизонтальную раскладку.

Вы можете видеть необходимые стили CSS ниже:

```css
@media screen and (min-width: 600px) {
  .boxes {
    display: table;
    width: 100%;
    direction: rtl;
  }
 
  .boxes button {
    display: table-cell;
    width: 25%;
  }
}
```

Стоит упомянуть, что если по каким-то причинам мы хотим также изменить направление текста в кнопках, мы можем включить специальное правило для того, чтобы направление символов юникода определялось свойством `direction`.

```css
.boxes button {
  unicode-bidi: bidi-override;
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="yaBxbE" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/yaBxbE/">Using `direction` for Reverse Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Метод №4: трансформация

Изящным решением будет оставить кнопкам `float: left;` и затем применить `transform: scaleX(-1)` к ним и их родителю. Задав отрицательные значения мы сделаем так, что трансформируемый элемент не масштабируется, а переворачивается по горизонтальной оси.

Вот CSS:

```css
@media screen and (min-width: 600px) {
  .boxes {
    transform: scaleX(-1);
  }
 
  .boxes button {
    float: left;
    transform: scaleX(-1);
    width: 25%;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="qaWrPW" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/qaWrPW/">Using `transform` (scale) for Reverse Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Мы также можем использовать для создания нужного порядка функцию трансформации `rotate`. Все, что нам надо добавить кнопкам и их родителю свойство `transform: rotateY(180deg)`.

CSS для этого решения:

```css
@media screen and (min-width: 600px) {
  .boxes {
    transform: rotateY(180deg);
  }
   
  .boxes button {
    float: left;
    transform: rotateY(180deg);
    width: 25%;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="yaBxzq" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/yaBxzq/">Using `transform` (rotate) for Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Метод №5: флексбокс

Флексбокс это еще один способ изменения порядка колонок. В нашем примере мы используем два разных свойства флексбокса для создания нашей раскладки.

Первый подход это сделать родительский элемент кнопок флекс-контейнером и затем добавить `flex-direction: row-reverse`, вот так:

```css
@media screen and (min-width: 600px) {
  .boxes {
    display: flex;
    flex-direction: row-reverse;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="GjKXON" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/GjKXON/">Using `flexbox` (flex-direction) for Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>


Второй вариант с флексбоксом состоит в  использовании свойства `order` для определения порядка, в котором кнопки должны выводиться.

```css
@media screen and (min-width: 600px) {
  .boxes {
    display: flex;
  }
   
  .boxes button:nth-of-type(1) {
    order: 4;
  }
 
  .boxes button:nth-of-type(2) {
    order: 3;
  }
 
  .boxes button:nth-of-type(3) {
    order: 2;
  }
 
  .boxes button:nth-of-type(4) {
    order: 1;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="JRPaOg" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/JRPaOg/">Using `flexbox` (order) for Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Метод №6: грид-раскладка

Многообещающим решением для расстановки элементов является раскладка на основе CSS Grid. Несмотря на [крайне ограниченную поддержку в браузерах](http://caniuse.com/#search=css%20grid) на момент написания статьи ее стоит попробовать. Учитывайте, что наш пример будет работать только в Chrome (по умолчанию эта возможность отключена, но ее [легко активировать](https://developers.google.com/web/updates/2014/03/Get-on-the-CSS-Grid?hl=en)).

Не погружаясь глубоко в детали я опишу два способа с использованием CSS Grid.

Первый вариант это задание родительскому элементу кнопок свойства   `display: grid;` и использование свойства `grid-column` для определения порядка вывода кнопок. В дополнение мы обеспечим попадание всех кнопок в один ряд путем прямого указания этого — `grid-row: 1`.


```css
@media screen and (min-width: 600px) {
  .boxes {
    display: grid;
    grid-template-columns: repeat(4, 1fr); 
  }
   
  .boxes button {
    grid-row: 1;
  }
   
  .boxes button:nth-of-type(1) {
    grid-column: 4;
  }
 
  .boxes button:nth-of-type(2) {
    grid-column: 3;
  }
 
  .boxes button:nth-of-type(3) {
    grid-column: 2;
  }
 
  .boxes button:nth-of-type(4) {
    grid-column: 1;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="qaWrxB" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/qaWrxB/">Using CSS `grid` (grid-column) for Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Второй вариант использования CSS Grid похож на второй способ использования флексбокса. Мы зададим контейнеру свойство `display: grid;`, а затем используем свойство `order` для определения порядка вывода кнопок.

```css
@media screen and (min-width: 600px) {
  .boxes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
   
  .boxes button:nth-of-type(1) {
    order: 4;
  }
 
  .boxes button:nth-of-type(2) {
    order: 3;
  }
 
  .boxes button:nth-of-type(3) {
    order: 2;
  }
 
  .boxes button:nth-of-type(4) {
    order: 1;
  }
}
```

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="ZpzrxV" data-default-tab="result" data-user="tutsplus" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/tutsplus/pen/ZpzrxV/">Using CSS `grid` (order) for Column Ordering</a> by Envato Tuts+ (<a href="http://codepen.io/tutsplus">@tutsplus</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Напомню, что для тестирования этого метода, вам надо активировать “Experimental Web Platform features” в Chrome.

## Порядок исходников и визуальный порядок

Как было показано, мы можем использовать различные подходы CSS для смены порядка наших кнопок. Попробуем пройтись [по нашим демо](http://codepen.io/collection/AaeGkp/), используя клавиатуру (кликните на пен и нажмите клавишу Tab) для навигации по кнопкам. Вы заметите, что даже, если кнопка с номером 4 выведена первой, фокус сначала появляется на кнопке с номером 1, так как она расположена первой в DOM. То же случится, если мы протестируем наши демо со скринридером (я проводил тесты с [NVDA](http://www.nvaccess.org/)).

Учитывая эту независимость порядка CSS от порядка DOM, нам надо быть крайне осторожными с частями страниц, порядок которых мы изменяем с помощью CSS. Например, свойство флексбокса `order` это один из наиболее гибких способов для переупорядочения элементов, согласно [спецификации](https://www.w3.org/TR/css-flexbox-1/#order-accessibility):

>Авторы должны использовать [order](https://www.w3.org/TR/css-flexbox-1/#propdef-order) только для визуального, а не логического переупорядочивания контента. Попытка использовать  [order](https://www.w3.org/TR/css-flexbox-1/#propdef-order) для логического порядка не сработает.


То же самое [спецификация](https://www.w3.org/TR/css3-grid-layout/#order-property) говорит о свойстве `order` CSS Grid.

>Также как и с переупорядочиванием флекс-элементов, свойство [order](https://www.w3.org/TR/css-flexbox-1/#propdef-order) может использоваться только, когда визуальный порядок надо рассинхронизировать с порядком зачитывания и навигации — иначе надо менять исходники документа.

Примечание: если вы используете второй способ с флексбоксом в Firefox, то вы заметите, что навигация с клавиатуры работает отлично и фокус на средних экранах появляется сначала на кнопке №4. Такое поведение является [багом](https://bugzilla.mozilla.org/show_bug.cgi?id=812687).

## Заключение

В этой статье мы проверили различные методы CSS для переупорядочивания элементов HTML. Конечно, не все из этих методов универсальны и перед тем, как выбрать нужный вам, вы должны учесть несколько вещей:

* Браузеры, которые вам надо поддерживать. Некоторые из перечисленных подходов не работают в старых версиях  Internet Explorer (т.е. < 10).
* Степень сложности перестановки — это может быть что-то простое, как наш пример или что-то более сложное.

###### Дополнительные материалы

* [HTML Source Order vs CSS Display Order](http://adrianroselli.com/2015/10/html-source-order-vs-css-display-order.html) от Adrian Roselli
* [Flexbox & the keyboard navigation disconnect](http://tink.uk/flexbox-the-keyboard-navigation-disconnect/) от Léonie Watson

