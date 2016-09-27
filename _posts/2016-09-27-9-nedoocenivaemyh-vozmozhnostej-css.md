---
title: "9 недооцениваемых возможностей CSS"
layout: post
categories: [development]
tags: [css, translation, medium]
date: 2016-09-27 20:01:04 +0300
prism: yes
description: "9 возможностей CSS разной степени  полезности и очевидности, которые стоит использовать чаще"
original: "https://medium.com/@iamjordanlittle/9-underutilized-features-in-css-90ced6ddbfe7"
original_title: "9 Underutilized Features in CSS"
original_author: "Джордан Литтл"
thumbnail: "noimage"
---

CSS с нами уже давно — некоторые знакомы с ним еще с 1994 года, и за это время он стал стандартом для оформления сайтов. Новые спецификации (такие как модуль [CSS4](https://www.w3.org/TR/selectors4/)) продолжают добавлять крутые возможности типа анимации, теней, трансформаций; вводить новые единицы измерения и селекторы. Это все замечательно, но сегодня мы обсудим другие свойства.

Постоянное развитие мира CSS иногда соблазняет окунуться в новые спецификации в поисках идей для дизайна, но при этому существует множество уже достаточно старых и зачастую упускаемых из виду возможностей CSS, предлагающих очень полезный функционал. Рассмотрим некоторые из них.

## 1. Функция CSS `calc()`

[W3c](https://www.w3.org/TR/css3-values/#calc-notation) • [CanIuse](http://caniuse.com/#feat=calc)

Функция `calc()` используется чаще, чем остальные возможности из списка, но о ней надо упомянуть. Если вы никогда не использовали ее, думайте о ней как о возможности задать  элементу определенную ширину, а затем вычесть из этой ширины какое-то количество пикселей.

```css
.box {
  width: calc( 100% - 20px );
}
```

Эта функция может напоминать возможности препроцессоров типа Sass, но она полностью нативна и использует выведенный браузером размер элемента, прежде чем заниматься своими расчетами.

Элемент  `.box` будет занимать 100% доступной ширины за вычетом 20 пикселей. Это можно использовать для многих целей, например, для размещения элементов фиксированной ширины рядом с элементами переменной ширины.

[Use Cases For Css Calc ](http://vincentp.me/blog/use-cases-for-calc) ([перевод](http://css-live.ru/articles/kogda-byvaet-nuzhen-calc.html))

## 2. Медиа-запрос `pointer`

[W3c](https://www.w3.org/TR/mediaqueries-4/#pointer) • [CanIuse](http://caniuse.com/#feat=css-media-interaction)

Хотя поддержка этого свойства пока оставляет желать лучшего (примерно 70%), медиа-запрос `pointer` может быть крайне полезен. Большинство медиа-запросов основываются на простой метрике: ширине окна браузера. Но есть случаи, когда нам надо спросить браузер: "использует пользователь мышь или касания" и в соответствии с этим настроить размер кнопок.

```css
@media( pointer: coarse) { }
```

**Значения `pointer`:**

none
: Основной механизм ввода устройства не предусматривает наличие указателя.

coarse
: Основной механизм ввода устройства включает указатель ограниченной точности. Сюда относятся сенсорные экраны и сенсоры обнаружения движения (типа Kinect для Xbox)

fine
: Основной механизм ввода устройства включает точный указатель. Это мышь, тачпад или стилус.

Поддержка `pointer` пока далека от идеала, но постепенно улучшается. В Webkit, Blink и Edge  она есть, но Gecko/Firefox [пока не спешит](https://bugzilla.mozilla.org/show_bug.cgi?id=1035774).

[Using pointer-events with Media Queries](https://davidwalsh.name/pointer-events-media-queries) ([перевод](http://frontender.info/pointer-events-media-queries/))

## 3. Переменная `currentColor` 

[W3c](https://www.w3.org/TR/css3-color/#currentcolor) • [CanIuse](http://caniuse.com/#feat=currentcolor)

Представленная в CSS3 переменная `currentColor` является нативной переменной CSS и представляет текущее значение `color` элемента.

```css
.card {
    color: #333333;
}

.card--error {
    color: #ff0000;
}

    .card__guts {
        border-top-color: currentColor;
    }
```

[ Extending the Color Cascade with the CSS currentColor Variable, Sara Soueidan](http://blogs.adobe.com/dreamweaver/2015/02/extending-the-color-cascade-with-the-css-currentcolor-variable.html) ([перевод](http://getinstance.info/articles/css/extending-the-color-cascade-with-the-css-currentcolor-variable/))

## 4. Псевдоклассы  `:valid`, `:invalid` и `:empty` 

[W3C](https://www.w3.org/TR/selectors4/#valid-pseudo)([2](https://www.w3.org/TR/css3-selectors/#empty-pseudo)) • [CanIuse](http://caniuse.com/#feat=form-validation)

Псевдоклассы `:valid` и `:invalid` используются для оформления валидированных полей ввода формы. В HTML5 большинство новых форм могут быть валидными или невалидными в соответствии с их типом. Например, поле ввода типа “email”, заполненное неправильно, получает псевдокласс `:invalid` при помощи нативных средств браузера.

```css
input:valid { color: green; }
input:invalid { color: red; }
```

Псевдокласс `:empty` применяется к элементам, не содержащим контента. Поэтому вместо того, чтобы оборачивать `<h1>{name}</h1>` условными тегами в шаблоне, вы можете оставить все как есть и спрятать пустой тег с помощью CSS.

```css
h1:empty { display: none; }
```

## 5. Счетчики на основе CSS

[W3C](https://www.w3.org/TR/css-lists-3/#counter-properties) • [CanIuse](http://caniuse.com/#feat=css-counters)

Вам нужен упорядоченный список, но вас не устраивают возможности элемента `<ol>`, а  применять JavaScript вы не хотите? Не беспокойтесь, в старом добром CSS есть счетчики:

```css
.shelf { counter-reset: books; }

    .shelf__book { counter-increment: books; }

        .shelf__book::before {
            content: "Book " counter(books) " of 10.";
        }
```

Да, иногда CSS выглядит забавно и это один из тех случаев — для конкатенации нам не надо никаких символов, хватает простого пробела.

[Fun Times with CSS Counters](http://codersblock.com/blog/fun-times-with-css-counters) ([перевод](http://forwebdev.ru/css/css-counters/))

## 6. Предсказуемые таблицы с `table-layout:fixed`

[W3C](https://www.w3.org/TR/CSS2/tables.html#fixed-table-layout) • [CanIuse](http://caniuse.com/#feat=css-table)

По умолчанию таблицы уделяют много внимания содержимому своих ячеек при определении их ширины. Добавление правила `table-layout:fixed`  делает поведение таблиц более управляемым.

```css
.grid {
    table-layout: fixed;
}
```

[Fixed Table Layouts, CSS-Tricks](https://css-tricks.com/fixing-tables-long-strings/) ([перевод](https://habrahabr.ru/post/244207/))

## 7. Индикация состояния полей формы с помощью соседнего селектора

[W3C](https://www.w3.org/TR/CSS21/selector.html#adjacent-selectors) • [CanIuse](http://caniuse.com/#feat=css-sel2)

Селектор соседнего элемента это классика CSS. В каждом введении для начинающих есть упоминание о нем, но он до сих пор используется недостаточно. С помощью этого селектора можно делать кнопки, учитывающие состояние или валидацию форм без использования JavaScript.

```css
[type="checkbox"] + label {
    font-weight:normal;
}

    [type="checkbox"]:checked + label {
        font-weight:bold;
    }

[required]:valid + span { color: green; }
[required]:invalid + span { color: red; }
```

## 8. Математический селектор `nth-child()` 

[W3C](https://www.w3.org/TR/css3-selectors/#nth-child-pseudo) • [CanIuse](http://caniuse.com/#feat=css-sel3)

Селекторы на основе  Nth-child отлично подходят для удаления рамки у последнего элемента в списки или выделения четных и нечетных рядов в таблице, но это только вершина айсберга в использовании этого крайне полезного селектора.

Немного используя  базовую математику вы можете выбрать, например, "каждый четвертый элемент, начиная с первого".

```css
.book:nth-child(4n+1) { color: red; }
```

Или "каждый третий элемент, начиная со второго"

```css
.book:nth-child(3n-1) { color: blue; }
```

[nth-test.com](http://nth-test.com/)

[How nth-child works, CSS-Tricks](https://css-tricks.com/how-nth-child-works/)([перевод](http://web-standards.ru/articles/nth-child/))

## 9. Анимация элементов с помощью `animation-fill-mode`

[W3C](https://www.w3.org/TR/css3-animations/#animation-fill-mode-property) • [CanIuse](http://caniuse.com/#feat=css-animation)

Часто при работе с анимациями, элементу нужно "запомнить" свои стили в конце анимации и не сбрасывать их до дефолтного, доанимационного состояния. Когда вы хотите, чтобы ваша анимация после окончания работы прикрепляла стили своего итогового состояния к элементу, используйте `animation-fill-mode`.

```css
@keyframes slideIn {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
}

.slideIn {
    animation-name: slideIn;
    animation-duration: .25s;
    animation-fill-mode: forwards;
}
```

[animation-fill-mode, webref.ru](https://webref.ru/css/animation-fill-mode)

## Заключение

Пока команды разработчиков браузеров стремятся сделать веб похожим на приложения, наш инструментарий будет становиться все более нативным, комплексным и интересным. Новые возможности анонсируются каждый день и на горизонте всегда появляется какая-нибудь удивительная функциональность.

Но ориентируясь на новейшие вещи не стоит забывать то, что уже доступно — так вы можете найти то, что нужно именно вам.

