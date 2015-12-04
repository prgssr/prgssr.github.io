---
layout: post
title:  "12 малоизвестных фактов о CSS - продолжение"
date:   2015-07-15 17:20:00
categories: development
description: "12 фактов о малоизвестных свойствах и особенностях свойств CSS - outline-offset, table-layout, border-radius, font-weight и т.д. Перевод статьи Sitepoint."
tags: css translation sitepoint
original: "http://www.sitepoint.com/12-little-known-css-facts-the-sequel/"
original_author: "Луис Лазарис"
original_title: "12 Little-Known CSS Facts (The Sequel)"
scripts: codepen
prism: yes
thumbnail: "/images/development/1436312214border-radius-slash.png"
---

Год назад я опубликовал статью [12 малоизвестных фактов о CSS](http://www.sitepoint.com/12-little-known-css-facts/) и она стала одно из самых популярных на сайте. За прошедшее с тех пор время я собрал еще некоторое количество советов и интересностей о CSS для нового поста. Мы же все знаем, что у каждого успешного фильма должно быть продолжение, не так ли?

Итак, давайте сразу перейдем к дюжине этого года.

## 1. Свойство `border-radius` может использовать синтаксис со слэшами

Я уже писал об этом [4 года назад](http://www.sitepoint.com/setting-css3-border-radius-with-slash-syntax/), но я думаю, что многие начинающие и даже некоторые опытные разработчики не знают существовании этой возможности.

Верьте или нет, но следующий код для `border-radius`  валиден:

```css
.box {
  border-radius: 35px 25px 30px 20px / 35px 25px 15px 30px;
}
```

Это может смутить, если вы не сталкивались с этим раньше, но вот объяснение из спецификации:

>Если значения заданы до и после слэша, то значения до слэша задают горизонтальный радиус, а значения после слэша --- вертикальный. Если слэш отсутствует, скругление сверху и снизу будет равным.

В спецификации это поясняется следующим изображением:

![border-radius](/images/development/1436312214border-radius-slash.png){: itemprop="image"}

Два значения `border-top-left-radius: 55pt 25pt` задают кривизну угла.

Использование слэша позволяет вам создавать несимметричное округление углов. Если вы хотите увидеть подробное описание этого, прочитайте мою статью по ссылке выше или посмотрите на [интерактивную демонстрацию от Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/Tools/Border-radius_generator).

Большинство генераторов `border-radius` не позволяют задавать эти опциональные значения, генератор от MDN является исключением.

## 2. Свойство `font-weight` принимает относительные ключевые слова

Обычно при задании свойства `font-weight` используются значения `normal` или `bold`. Также можно задать целое значение с шагом в сотню: `100`, `200`, и т.д., до `900`.

Однако о двух доступных значениях часто забывают --- `bolder` и `lighter`.

В соответствии со спецификацией, эти ключевые слова задают большую или меньшую ширину текста относительно унаследованного значения. Они становятся актуальными, когда вы используете шрифт различной жирности, больше  стандартного `bold ` и меньше чем обычный текст.

В посотенных значениях `bold` эквивалентен `700`, а `normal` --- `400`. Поэтому если у вас есть самый тонкий шрифт `300`, то `lighter` будет задавать его относительно унаследованного дефолтного `400`; при отсутствии более тонких шрифтов, чем нормальный, `lighter` не будет иметь эффекта.

<p data-height="568" data-theme-id="0" data-slug-hash="domZLx" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/domZLx/'>Using bolder/lighter Keywords with font-weight</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


В этом примере я использовал шрифт [Exo 2](https://www.google.com/fonts/specimen/Exo+2), в котором доступно 18 различных стилей. В моем демо использованные стили без наклона, которых достаточно для каждого из посотенных значений.

Отметьте, что демо включает 12 вложенных блочных элементов с различными значениями `font-weight`, включая “bolder” и “lighter”, поэтому вы можете заметить, как они влияют на жирность текста в различных контекстах наследования. Ниже показан CSS из этого примера. Обратите внимание на комментарии в коде и помните, что каждый блок находится внутри предыдущего:

```css
.box {
  font-weight: 100;
}

.box-2 {
  font-weight: bolder; /* maps to 400 */
}

.box-3 {
  font-weight: bolder; /* maps to 700 */
}

.box-4 {
  font-weight: 400;
}

.box-5 {
  font-weight: bolder; /* maps to 700 */
}

.box-6 {
  font-weight: bolder; /* maps to 900 */
}

.box-7 {
  font-weight: 700;
}

.box-8 {
  font-weight: bolder; /* maps to 900 */
}

.box-9 {
  font-weight: bolder; /* maps to 900 */
}

.box-10 {
  font-weight: lighter; /* maps to 700 */
}

.box-11 {
  font-weight: lighter; /* maps to 400 */
}

.box-12 {
  font-weight: lighter; /* maps to 100 */
}
```

В данном случае ключевые слова “bolder” и “lighter” привязываются только к значениям `100`, `400`, `700` и `900`. При наличии  9 различных вариантов эти ключевые слова никогда не привязываются к значениям `200`, `300`, `500`, `600` и `800`.

Это происходит потому, что вы сообщаете браузеру о необходимости выбрать следующий шрифт из списка, считающийся "жирным" или "легким". Выбирается не следущий самый жирный или самый легкий, а шрифт "жирный" или "легкий" относительно унаследованного. Если самый легкий шрифт начинается с `300` (как в случае с [Open Sans](https://www.google.com/fonts/specimen/Open+Sans) ), а унаследованное значение равно `400`, тогда "lighter" будет соответствовать `300`.

Это может запутать по началу, поэтому советую поэкспериментировать с [демонстрацией](http://codepen.io/SitePoint/embed/domZLx?user=SitePoint&default-tab=result&slug-hash=domZLx&theme-id=6441&height=504#result-box), чтобы разобраться.

## 3. Существует свойство `outline-offset`

Свойство `outline` известно в первую очередь тем, что помогает при отладке ([оно не влияет на поток страницы](http://www.impressivewebs.com/css-things-that-dont-occupy-space/)). В спецификации, однако, также добавлено свойство `outline-offset`, которое делает именно то, что предполагает его название --- задает отступ обводки от элемента.

<p data-height="468" data-theme-id="0" data-slug-hash="VLXyZw" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/VLXyZw/'>The outline-offset property</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


В этом демо при сдвиге слайдера влево или вправо вы изменяете отступ обводки. В этом примере отступ изменяется от `0px` до `30px`, но в вашем CSS таких ограничений нет. Учтите, что несмотря на то, что свойство `outline` предполагает короткую запись, ее формат не предусматривает указания `outline-offset`, поэтому вам всегда надо задавать это свойство отдельно.

Единственный серьезный недостаток этого свойства связан с тем, что оно не поддерживается в  Internet Explorer (даже в 11).

## 4. Существует свойство `table-layout`

Возможно, вы подумаете: "Старые новости, бро. Я знаю о свойстве `display: table` и использую его для вертикального центрирования". Но это не то, что я имею в виду. Это же свойство `table-layout`, а не значение свойства `display`.

Свойство `table-layout` это не самая простая вещь в CSS для объяснения, поэтому сначала заглянем в спецификацию:

>С этим (быстрым) алгоритмом, горизонтальный макет таблицы не зависит от содержимого ячеек, а только от заданных размеров ширины таблицы, ее колонок, границ и отступов между ячейками.

Это первый случай со спецификацией W3C, когда ее сложно понять, лол.

Ну, а если серьезно, то в понимании спецификации нам как всегда поможет пример. В следующем демо таблице задано свойство `table-layout: fixed`, нажатием на кнопку вы можете включать и выключать его.

<p data-height="468" data-theme-id="0" data-slug-hash="vORpYN" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/vORpYN/'>Using the table-layout property</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


В этом примере вы можете видеть преимущества использования `table-layout: fixed` в сравнении с дефолтным `auto`. Это не всегда будет лучшим выбором и не всегда бывает необходимо, но об этом свойстве надо помнить при работе с таблицами, в ячейках которых имеется различный по размеру контент.

Крис Койер [описал это свойство](https://css-tricks.com/fixing-tables-long-strings/) в прошлом году, так что если вы хотите узнать больше об этом свойстве, его статья это лучший выбор.

## 5. Свойство `vertical-align` работает в ячейках таблицы иначе, чем в остальных элементах.

Если вы делаете сайты с середины нулевых или раньше, то вы успели сверстать немало HTML-писем, а значит, вы сталкивались со свойством `vertical-align`, заменившим старый [атрибут valign](http://www.w3.org/TR/html401/struct/tables.html#adef-valign), ныне запрещенный в спецификации.

Но `vertical-align` в CSS не аналогичен `valign`. Кроме таблиц. Это несколько странно, но в этом больше смысла, чем если бы свойство не работало в таблицах совсем.

Так в чем отличия при применении этого свойства к обычным элементам и ячейкам таблицы?

При применении к обычным элементам свойство `vertical-align` следует основным правилам:

* Оно работает только со строчными или строчно-блочными элементами.
* Оно не влияет на контент элемента, а изменяет выравнивание самого элемента относительно других строчных или строчно-блочных элементов.
* Оно подвержено влиянию настроек шрифта типа ` line-heigh` и размеров смежных строчных и строчно-блочных элементов.

Вот демо:

<p data-height="368" data-theme-id="0" data-slug-hash="zGWpxy" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/zGWpxy/'>Using the vertical-align property on inline elements</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Свойство `vertical-align` задано элементу `input`. Нажимая на одну из кнопок, вы изменяете значение этого свойство на указанное на кнопке. Заметьте, что каждое значение изменяет вертикальное положение `input`.

В целом это демо совершенно базовое, для более серьезного погружения в тему рекомендую [пост Christopher Aue 2014 года](http://christopheraue.net/2014/03/05/vertical-align/).

Однако с таблицами свойство `vertical-align` работает иначе. В этом случае свойство применяется к одной или более ячеек таблицы и содержимое ячеек таблицы реагирует на выбранное выравнивание.

<p data-height="268" data-theme-id="0" data-slug-hash="KpoZdo" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/KpoZdo/'>Using vertical-align on table cells</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Как показано в демо, только 4 значения этого свойства работают с ячейками таблицы и несмотря на то, что при значении `baseline` есть влияние на соседние ячейки, основной эффект распространяется на содержимое ячейке, к которой применено свойство `vertical-align`.

## 6. Псевдоэлемент `::first-letter` умнее, чем вы думаете

Псевдоэлемент `::first-letter` позволяет вам стилизовать первый символ элемента, в частности применять эффект [буквицы](https://ru.wikipedia.org/wiki/%D0%91%D1%83%D0%BA%D0%B2%D0%B8%D1%86%D0%B0), распространенный в печати.

Хорошо то, что в браузерах есть достойный уровень определения "первой буквы" элемента. Я впервые узнал об этом из [твита Мэтта Эндрюса](https://twitter.com/andrewsmatt/status/497704502167076864), но ему это показалось недостатком имплементации. Вот пример этого в демо на Codepen:

<p data-height="268" data-theme-id="0" data-slug-hash="KpoZjE" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/KpoZjE/'>Testing ::first-letter</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Как видите, некоторые специальные символы выделяются как вместе с первым символом как его часть. И, что хорошо, "большая четверка браузеров" здесь работает одинаково, это корректное поведение. Было бы немного странно, если бы открытая скобка обрабатывалась как "первая буква", ведь это скорее "первый символ", для чего можно создать специальный псевдо-класс.

## 7. Вы можете использовать недопустимые символы в качестве разделителей классов

Эта концепция обсуждалась в [Беном Эверардом](http://beneverard.co.uk/blog/using-slashes-within-the-html-class-attribute/) и я считаю, что ее стоит развить.

Пост Бена был посвящен использованию слэша (“/”) для разделения классов HTML на группы, чтобы упростить чтение или сканирование кода. Как он указывает, несмотря на то, что неэкранированный слэш является недопустимым символом, браузеры просто игнорируют его, не выдавая ошибок.

Предположим  у вас есть HTML по типу:

```markup
<div class="col col-4 col-8 c-list bx bx--rounded bx--transparent">
```

Со слэшами он будет выглядеть так:

```markup
<div class="col col-4 col-8 / c-list / bx bx--rounded bx--transparent">
```

Вы можете использовать не только слэши, но и другие символы:

```markup
<div class="col col-4 col-8 ** c-list ** bx bx--rounded bx--transparent">

<div class="col col-4 col-8 || c-list || bx bx--rounded bx--transparent">

<div class="col col-4 col-8 && c-list && bx bx--rounded bx--transparent">
```

Все эти варианты прекрасно работают, вы можете это протестировать в демо:

<p data-height="268" data-theme-id="0" data-slug-hash="NqYyNe" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/NqYyNe/'>Illegal Characters as HTML Class Delimiters</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Конечно, эти разделители не могут использоваться в ваших таблицах стилей как классы (именно по этому я и называю их "недопустимыми"). Поэтому следующий код будет нерабочим и не будет применять стиль:

```css
./ {
  color: blue;
}
```

Если вы хотите использовать эти символы в классах HTML с целью дальнейшего применения к ним стилей, вам нужно [экранировать их с помощью этого инструмента](https://mothereff.in/css-escapes). Поэтому пример выше будет работать, если ваш CSS будет выглядеть так:

```css
.\/ {
  color: blue;
}
```

И если идти дальше, то надо заметить, что символы Юникода не надо экранировать, поэтому вы можете делать даже такие безумные вещи:

```markup
<div class="♥ ★"></div>
```

И писать такой CSS:

```css
.♥ {
  color: hotpink;
}

.★ {
  color: yellow;
}
```

Вы можете коды символов Юникода, например, следующий пример эквивалентен предыдущему:

```css
.\2665 {
  color: hotpink;
}

.\2605 {
  color: yellow;
}
```

## 8. Повторам анимации можно задавать дробные значения

При написании анимаций CSS с кадрами вы можете использовать свойство `animation-iteration-count ` для определения количества проигрываний анимации:

```css
.example {
  animation-iteration-count: 3;
}
```

Целое число в данном примере указывает на количество повторов анимации --- 3 раза. Но мы также можем передавать дробные значения:

```css
.example {
  animation-iteration-count: .5;
}
```

В данном случае анимация займет половину времени (остановится на середине первой итерации). Взглянем на демо пример, анимирующий два мяча на странице. У верхнего количество повторов равно "1", у нижнего “.5″.

<p data-height="268" data-theme-id="0" data-slug-hash="VLXQmM" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/VLXQmM/'>Using Fractional Iteration Count with Linear Timing Function</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


В данном случае длительность итерации не зависит от анимируемого свойства и его значения. Другими словами, если вы анимируете что-либо на 100px, середина не обязательно будет на 50px. Например, в предыдущем примере шар остановился на середине потому, что ему было задан линейное сглаживание (`linear`).

А вот та же анимация, но с другим сглаживанием:

<p data-height="268" data-theme-id="0" data-slug-hash="PqRxov" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/PqRxov/'>PqRxov</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Заметьте, что нижний мяч по прежнему останавливается на середине --- но из-за изменения функции сглаживания эта середина не связана с половиной анимируемого свойства.

Если вы знакомы с функциями сглаживания тайминга, то вы понимаете, что при сглаживании тайминга`ease-in-out` мяч будет там же где он находится при линейном сглаживании. Поэкспериментируйте со значениями, чтобы лучше понять функции сглаживания.

## 9. Краткая запись анимации может не работать из-за названия анимации

Эта проблема была обнаружена разработчиками случайно и предупреждение о ней уже есть в спецификации. Предположим у вас есть следующий код для анимации:

```css
@keyframes reverse {
  from {
    left: 0;
  }

  to {
    left: 300px;
  }
}

.example {
  animation: reverse 2s 1s;
}
```

Для анимации используется название `reverse`. На первый взгляд ничего страшного, но обратите внимание, как будет работать этот код в живую:

<p data-height="268" data-theme-id="0" data-slug-hash="OVvayK" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/OVvayK/'>An animation called "reverse" won't work in shorthand</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Эта анимация не работает из-за того, что это одно из ключевых слов для свойства `animation-direction`. И то же самое будет при совпадении названия анимации с любым из ключевых слов, используемых в краткой записи. При отдельной записи свойств эта проблема не возникает.

В список названий анимаций, ломающих краткую запись входят все [ключевые слова для функций тайминга](http://dev.w3.org/csswg/css-transitions-1/#single-transition-timing-function), такие как `infinite`, `alternate`, `running`, `paused` и т.д.

## 10.Вы можете выбирать диапазон элементов

Я не знаю, кто первый применил это, но я об этом узнал из [этого демо](http://bittersmann.de/samples/08-15) [Гуннара Биттерсмана](https://twitter.com/g16n). Предположим, у вас есть упорядоченный список из 20 элементов и вы хотите выбрать элементы с 7 по 14. Это можно сделать с помощью одного селектора:

```css
ol li:nth-child(n+7):nth-child(-n+14) {
  background: lightpink;
}
```

<p data-height="268" data-theme-id="0" data-slug-hash="wamQGv" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/wamQGv/'>Selecting Ranges of Elements with CSS</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


Этот код использует цепь структурированных селекторов псевдокласса. Хотя само по себе это выражение может выглядеть запутанным, выделяемый диапазон в нем достаточно понятен.

А теперь объясним, что происходит: в первой части цепи выражение выбирает "7-ой элемент и все элементы после него". Во второй части --- "14-ый элемент и все перед ним". Но так как селекторы связаны, каждый из них лимитирован выборкой соседа. Поэтому вторая часть не позволяет первой выбрать элементы после 14-го, а первая не позволяет второй выбрать элементы до 7-го.

Для более детального рассмотрения вопросов совмещения селекторов и выражений прочитайте вот [этот старый пост](http://www.impressivewebs.com/css3-pseudo-class-expressions/).

## 11. Псевдо-элементы могут быть у незакрываемых (void) элементов

Возможно, вы также как и я когда-либо пытались применить псевдо-элемент к полю ввода формы или изображению. Это не работает, потому что псевдо-элементы не работают с замещаемыми элементами. Я думаю, что многие разработчики предполагают что это относится и к остальным элементам, не имеющим закрывающих тегов.

Вы можете применять псевдо-элементы к [некоторым незакрываемым элементам](http://www.w3.org/TR/html5/syntax.html#void-elements), в которых нет замещаемых элементов. Это, например, элемент `hr` как на демо:

<p data-height="268" data-theme-id="0" data-slug-hash="ZGxmpK" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/ZGxmpK/'>Pseudo-elements on a Horizontal Rule (hr element)</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Цветная область в этом примере это горизонтальная линия (элемент `hr` ) и к нему применены псевдо-элементы `::before` и `::after`. Что интересно, с незамещаемым элементом `br` этот трюк не срабатывает.

Вы также можете добавлять псевдо-элементы к мета-тегам и элементам `link`, при достаточном безумии вы можете сделать их блочными элементами, как на демо ниже.

<p data-height="268" data-theme-id="0" data-slug-hash="KporNg" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/KporNg/'>Adding pseudo-elements to meta tags and link (stylesheet) elements</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


## 12. Некоторые значения атрибутов чувствительны к регистру при использовании в селекторах CSS

Наконец, самое неясное. Представим следующий HTML:

```markup
<div class="box"></div>
<input type="email">
```

Вы можете стилизовать оба элемента, использовав селектор атрибута:

```css
div[class="box"] {
  color: blue;
}

input[type="email"] {
  border: solid 1px red;
}
```

Метод работает. А как насчет этого?

```css
div[class="BOX"] {
  color: blue;
}

input[type="EMAIL"] {
  border: solid 1px red;
}
```

Оба значения атрибутов указаны заглавными буквами. И в нашем случае элемент `.box` их не воспримет, потому как атрибут класс чувствителен к регистру. А поле email будет стилизовано, так как атрибут `type` к регистру не чувствителен. В этом нет ничего сверхважного, но, возможно, что вы не замечали этого раньше.
