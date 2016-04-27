---
title: "Плиточная раскладка на чистом CSS"
layout: post
categories: [development]
tags: [css, translation, medium]
date: 2016-04-27 21:15:44 +0300
prism: yes
description: "Джей Томпкинс о создании плиточной раскладки средствами чистого CSS"
original: "https://medium.com/@_jh3y/how-to-pure-css-masonry-layouts-a8ede07ba31a#.6p2sw1teb"
original_title: "HOW TO: Pure CSS masonry layouts"
original_author: "Jhey Tompkins"
thumbnail: "/images/development/flex/1_TfCvIdT79TwK8zcCeG-qSQ.png"
---

Плиточная раскладка является одной из самых популярных. Не знаете, что это такое? Вспомните о Pinterest, Windows’ Metro и т.д. Если  объяснять это на словах, то представьте сумасшедший эффект соединения блоков разных размеров в эстетически упорядоченном, часто шахматном порядке.

![Образец плиточной раскладки](/images/development/flex/1_TfCvIdT79TwK8zcCeG-qSQ.png){: itemprop="image"}

Плиточная раскладка не является чем-то новым. Так почему мы говорим о ней сейчас? Ведь есть же отличные решения для получения эффекта плиточной раскладки? Есть. Но можем ли мы продвинуть решение на чистом CSS чуть дальше? Можем ли мы использовать флексбокс для достижения требуемого эффекта?

Это мы и рассмотрим, но если вам лень читать весь текст, можете ограничиться изучением кода на [github](https://github.com/jh3y/driveway) и [jsbin](https://jsbin.com/loronibali/2/edit?output).

## Простейшая плитка

Начнем с базовой раскладки. Представьте примерно такую структуру DOM для нашей раскладки:

```markup
<div class="masonry-layout">
  <div class="masonry-layout__panel">
    <div class="masonry-layout__panel-content">
      <-- CONTENT HERE -->
    </div>
  </div>
  <div class="masonry-layout__panel">
    <div class="masonry-layout__panel-content">
      <-- CONTENT HERE -->
    </div>
  </div>
  <div class="masonry-layout__panel">
    <div class="masonry-layout__panel-content">
      <-- CONTENT HERE -->
    </div>
  </div>

  <-- FOLLOWING CONTENT PANELS -->

</div>
```

Мы хотим добавить колонки к нашему контенту. Сможем ли мы добиться хотя бы простого эффекта плиточной раскладки  на основе нашей структуры DOM с минимальными усилиями, используя только колонки CSS3 или флексбокс?

### Что такое многоколоночная раскладка и флексбокс?

Свойства для многоколоночной раскладки и флексбокс были представлены в спецификации CSS3 и предназначены для раскладки содержимого, это очевидно из их названий. Многоколоночная раскладка дает вам возможность упорядочивать содержимое по колонкам без лишней нагрузки. Флексбокс дает гибкие блоки, которые могут сжиматься, расти и перемещаться в соответствии с вашими пожеланиями. Я не буду рассматривать их детально в этой статье, поэтому рекомендую самостоятельно ознакомиться с этими технологиями, прежде чем читать дальше.

### Пробуем многоколоночную раскладку

В CSS для многоколоночных макетов есть свойства `column-count` и `column-gap`. Это позволяет сравнительно легко сделать базовую плиточную раскладку. Учтите, что в раскладке **важно** использовать свойство `break-inside` на блоках с контентом. Это помешает разбитию и распределению содержимого блоков между колонками. CSS для этой стартовой точки будет следующий:

```css
.masonry-layout {
  column-count: 3;
  column-gap: 0;
}
.masonry-layout__panel {
  break-inside: avoid;
  padding: 5px;
}
.masonry-layout__panel-content {
  padding: 10px;
  border-radius: 10px;
}
```

В действии на это можно посмотреть [здесь](https://jsbin.com/rezufoxima/2/edit?css,output). Это неплохое начало, которое показывает, что свойства для многоколоночной разметки могут сделать для нас самую тяжелую работу.

### Пробуем флексбокс

Можем ли мы добиться того же результата с помощью флексбокса? Это не настолько просто, как в случае с многоколоночной раскладкой. Я столкнулся с проблемами, когда решал ту же задачу с флексбоксом.

С первой попытки я собирался имитировать колоночную раскладку при помощи `flex-direction: column`. Проблема с использованием значения `column` заключается в том, что вам надо задать высоту раскладки, перед тем как оборачивать столбцы. Но это неидеальный вариант, так как любое переполнение ведет к горизонтальному скроллингу. Так что вы или смиритесь со скроллингом, или у вас должна быть возможность регулировать высоту раскладки,  в таком случае вы сможете красиво все располагать. Если вы работаете с динамическим содержимым, размер которого варьируется, вам придется постоянно заниматься выравниванием при его добавлении. Это явно не соответствует смыслу флексбокса.

Рассмотрим следующий пример:

```css
.masonry-layout {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 10px;
  height: 100vw;
}
.masonry-layout__panel {
  display: flex;
  flex: 1 1 auto;
  width: 33.3%;
  margin-bottom: 10px;
  border-radius: 10px;
}
```

Этот код дает [следующий результат](https://jsbin.com/qacawerica/2/edit?html,css,output). Обратите внимание на горизонтальный скроллинг, который нам совершенно не нужен.

Другой подход это использование `flex-direction: row`. Он также не совсем работает. Вы можете задать количество колонок, ограничивая ширину элементов в раскладке, но обертывание приведет к появлению ненужного пустого пространства или к необходимости выравнивания ширины всех элементов на основе `align-items`. Ни тот, ни другой результат нельзя назвать желательным. Вы можете оценить результат использования `flex-direction: row` с `align-items: flex-start` [здесь](https://jsbin.com/yofikeveba/2/edit?css,output).

Если вы готовы сильнее контролировать разметку и ее структуру, вы можете добиться желаемого эффекта с флексбоксом. Рассмотрим следующую структуру:

```markup
<div class="masonry-layout">
  <div class="masonry-layout__column">
    <div class="masonry-layout__panel></div>
    <div class="masonry-layout__panel></div>
  </div>
  <div class="masonry-layout__column">
    <div class="masonry-layout__panel></div>
    <div class="masonry-layout__panel></div>
  </div>
</div>
```

Добавление колонок в раскладку дает вам дополнительный контроль над раскладкой. Однако вам придется немного подумать, как и где вы расположите отдельные фрагменты содержимого. В действии этот подход можно увидеть [здесь](https://jsbin.com/zurapetono/1/edit?html,css,output).

### Многоколоночная раскладка выигрывает

Свойства для многоколоночный раскладки однозначно выигрывают для создания эффекта плитки. Это достигается за счет простоты и лаконичности разметки. В элементарных случаях их возможностей достаточно. Хотя польза есть от обоих подходов.

```css
.masonry-layout {
  column-count: 3;
  column-gap: 0;
}
.masonry-layout__panel {
  break-inside: avoid;
  padding: 5px;
}
.masonry-layout__panel-content {
  padding: 10px;
  border-radius: 10px;
}
```

Рассмотрим этот код. Наши панели в идеале также должны быть блоками. Поэтому мы проведем небольшой рефакторинг.

```css
.masonry-layout {
  column-count: 3;
  column-gap: 0;
}
.masonry-layout-panel {
  break-inside: avoid;
  padding: 5px;
}
.masonry-layout-panel__content {
  padding: 10px;
  border-radius: 10px;
}
```

У нашей простейшей плитки по прежнему есть потенциал. Мы сделаем ее круче и флексбокс поможет нам в этом.

## Вложенные кластеры с контентом

Добавление вложенных кластеров в нашу раскладку может немного разбить контент и слегка помешать потоку, что и является нашей целью. Это может быть использовано для создания эффекта контента, содержащего колонки.

Кластеры это по сути вложенные раскладки, с вертикальным или горизонтальным обтеканием. Флексбокс отлично подходит для этого.

![группа контента с вертикальным обтеканием](/images/development/flex/1_XaERXcb0ysiyMTNxva-j4Q.png)

Наша базовая раскладка не вписывается идеально в четырехугольник, но кластеры должны это сделать, ведь мы не хотим, чтобы у нас были пустые места в раскладке. Чтобы побороть это, мы можем задать размеры кластеров. Например, так:

```css
.masonry-layout-panel--small {
  height: 200px;
}
.masonry-layout-panel--medium {
  height: 300px;
}
.masonry-layout-panel--large {
  height: 400px;
}
```

Но это не совсем правильный подход. Задание размеров подойдет не для каждого случая. Лучше будет  ввести колонкоподобные контейнеры, которые мы обсуждали ранее. Рассмотрим следующий вариант:

```markup
<div class=”masonry-layout-panel masonry-layout-cluster masonry-layout-cluster--vertical”>
  <div class=”masonry-layout-cluster__segment masonry-layout-cluster__segment--column”>
    <div class=”masonry-layout-panel masonry-layout-cluster__segment”>
      <div class=”masonry-layout-panel__content”>
        <h1>hello</h1>
      </div>
    </div>
  </div>
  <div class=”masonry-layout-cluster__segment masonry-layout-cluster__segment--column”>
    <div class=”masonry-layout-panel masonry-layout-cluster__segment”>
      <div class=”masonry-layout-panel__content”>
        <h1>yes</h1>
      </div>
    </div>
    <div class=”masonry-layout-panel masonry-layout-cluster__segment”>
      <div class=”masonry-layout-panel__content”>
        <p>
          Some cool pics.
        </p>
      </div>
    </div>
  </div>
</div>
```

Поток кластеров может быть  как горизонтальным, так и вертикальным. Если поток кластера горизонтальный, мы задаем колонки с сегментами, обтекающими вертикально и наоборот. Это изменяется с помощью `flex-direction`. Сегменты кластера увеличиваются/уменьшаются, заполняя пустое пространство, а кластеры работают как блоки.

Если нам нужен более тонкий контроль над сегментами кластеров, мы можем создать служебные классы, чтобы задать в процентах `flex-basis`. Нам не нужен служебный класс "полный размер", так как мы можем просто включить один элемент в контейнер и  он займет всю ширину или высоту. Для "половинки" мы зададим `flex-basis: 50%` . Достоинством такой имплементации будет возможность поместить  любое количество  колонок или рядов соответственно.

Как может выглядеть код? Как вариант:

```css
.masonry-layout-cluster {
  display: flex;
  padding: 0;
}
.masonry-layout-cluster--vertical {
  flex-direction: row;
}
.masonry-layout-cluster--horizontal {
  flex-direction: column;
}
.masonry-layout-cluster__segment {
  display: flex;
  flex: 1 1 auto;
}
.masonry-layout-cluster__segment--row {
 flex-direction: row;
}
.masonry-layout-cluster__segment--column {
  flex-direction: column;
}
.masonry-layout-cluster__segment--half {
  flex-basis: 50%;
}
.masonry-layout-cluster__segment--quarter {
  flex-basis: 25%;
}
```

Вы можете увидеть код в действии [здесь](https://jsbin.com/tuxoqusaxu/2/edit?css,output). Вложенные кластеры это самая сложная часть для понимания, но с их помощью мы можем проще решать некоторые задачи.

## Темизация и панели с изображениями

Наша задача это изоляция стилей структуры раскладки от темизирующих стилей. Это облегчает использование кода в других проектах. Если вы смотрели демонстрации кода в этой статье, вы заметили, что у панелей с контентом закругленные углы. Это сделано путем добавления минимальной темизации.

![скругленные углы у плиточных элементов раскладки](/images/development/flex/1_n2mjkAnx5NNAK7w-I1zJxw.png)

```css
.masonry-layout-panel__content {
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
}
```

Как насчет изображений? Достаточно часто требуется вывести изображения как отдельные панели в плитке. Если мы поместим изображение внутри панели, на него будут влиять пэддинги, заданные для нашей темы. Так почему бы нам не использовать для изображения класс `masonry-layout__panel-content` с модификатором?

```markup
<img src="img/photo.jpg" class="masonry-layout-panel__content--img">
```

Это почти то, что надо. Надо добавить немного темизации, специфичной для изображений и будет самое то.

```css
.masonry-layout-panel__content--img {
  max-width: 100%;
  padding: 0;
}
```

Проверить, как это выглядит, можно в [демо](https://jsbin.com/zamabonuhe/2/edit?html,css,output). Примечание: так как имена классов имеют тенденцию раздуваться, в примерах кода используются аббревиатуры. Например, `masonry-layout` становится `ml`, `masonry-layout-cluster` становится `ml-clstr`. Заглушки для изображений выводятся желтым цветом.

## Анимация панелей при наведении

![эффект при наведении на панель](/images/development/flex/1_sDjPLMU-Q2I3KpWOiuO8Gw.png)

Как насчет того, чтобы наши панели реагировали на действия пользователя? Мы можем сделать панели поворачивающимися  и показывающими дополнительный контент при наведении. Для этого мы реализуем нашу панель в форме карты с содержимым. Добавив контейнеры для содержимого с обеих сторон. Это все требует от нас задания высоты наших панелей, поэтому мы можем использовать служебные классы для задания высоты, например:

```css
.masonry-layout-flip--medium {
  height: 300px;
}
```

Ну и новый блок для переворачивающихся карт:

```markup
<div class=”masonry-layout-panel masonry-layout-flip--medium masonry-layout-flip”>
  <div class=”masonry-layout-panel__content masonry-layout-flip__content”>
    <img src=”img/photo-1.jpg” class=”masonry-layout-flip__panel masonry-layout-flip__panel--front masonry-layout-flip__panel--img”/>
    <div class=”masonry-layout-flip__panel masonry-layout-flip__panel--back”>
      <p>Here is a flpped image…</p>
    </div>
  </div>
</div>
```

Используя трансформации и переходы CSS, мы добавим анимацию при наведении для наших панелей, которые будут переворачиваться и показывать обратную сторону.

```css
/* CSS FOR FLIPPER PANELS */

.masonry-layout-flip {
  perspective: 1000;
}
.masonry-layout-flip:hover .masonry-layout-flip__content {
  transform: rotateY(180deg);
}
.masonry-layout-flip--md {
  height: 300px;
}
.masonry-layout-flip__panel {
  backface-visibility: hidden;
  border-radius: 10px;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
}
.masonry-layout-flip__panel--front {
  transform: rotateY(0deg);
  z-index: 2;
}
.masonry-layout-flip__panel--back {
  transform: rotateY(180deg);
}
.masonry-layout-flip__content {
  height: 100%;
  overflow: visible;
  position: relative;
  transform-style: preserve-3d;
  transition: 0.25s;
}
```

Вы можете увидеть этот эффект на [первом элементе раскладки в демо](https://jsbin.com/vixaxofato/3/edit?html,css,output).

![Панель с эффектом при наведении](/images/development/flex/1_8Y__HtUYHClzv9jTMvxLAQ.png)

Мы не ограничены переворачивающимися панелями. Мы можем добавлять различные эффекты к панелям при фокусе. В итоговом коде я еще добавлю кое-какие эффекты.

## Добавляем отзывчивость

Если вы дошли до этого раздела, то наверняка заметили, что наша плиточная раскладка совсем не торт на маленьких экранах. Сделаем ее отзывчивой. Что мы хотим получить? При увеличении экрана мы хотим увеличивать число колонок в макете. А при уменьшении экрана, кроме уменьшения числа колонок мы будем разбирать кластеры, позволяя их сегментам занимать всю ширину раскладки. Разумеется, мы будем разрабатывать наши стили, начиная с мобильных. Вот пример с отзывчивым количеством столбцов:

```css
/* COLUMN CHANGES */

.masonry-layout {
  column-count: 1;
  column-gap: 0;
}
@media (min-width: 768px) {
  .masonry-layout {
    column-count: 2;
  }
}
@media (min-width: 1200px) {
  .masonry-layout {
    column-count: 3;
  }
}
```

Для вложенных кластеров мы будем игнорировать горизонтальный поток и `flex-basis` на маленьких экранах. Мы хотим, чтобы кластеры распадались и их сегменты занимали всю зону видимости, вне зависимости от того, являются ли они колонками или рядами.

```css
/* CLUSTER FLOW IGNORED AT LOWER VIEWPORT */

@media (min-width: 768px) {
  .masonry-layout-cluster__segment--row {
    flex-direction: row;
  }
}
@media (min-width: 768px) {
  .masonry-layout-cluster--vertical {
    flex-direction: row;
  }
}


/* FLEX-BASIS IGNORED AT LOWER VIEWPORT */

@media (min-width: 768px) {
  .masonry-layout-cluster__segment--half {
    flex-basis: 50%;
  }
  .masonry-layout-cluster__segment--quarter {
    flex-basis: 25%;
  }
}
```

Демонстрацию этого кода можно посмотреть [здесь](https://jsbin.com/loronibali/2/edit?css,output).

## Используем препроцессор

Не нужно лишний раз говорить, что использование препроцессоров значительно облегчает написание стилей. Я настоятельно рекомендую использовать препроцессор вместе с инструментами для добавления вендорных префиксов. Я лично использую Stylus, исходный код в нем значительно меньше скомпилированных стилей.

Итак, для сравнения итоговый код CSS из примера в этой статье (без вендорных префиксов и темизации, в именах классов использованы аббревиатуры).

```css
/* MASONRY CSS */
.ml {
  box-sizing: border-box;
  column-count: 1;
  column-gap: 0;
  position: relative;
}
.ml * {
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .ml {
    column-count: 2;
  }
}
@media (min-width: 1200px) {
  .ml {
    column-count: 3;
  }
}
.ml-pnl {
  margin: 0;
  padding: 5px;
}

@media (min-width: 768px) {
  .ml-pnl {
    break-inside: avoid;
  }
}
.ml-pnl__cntnt {
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  width: 100%;
}
.ml-pnl__cntnt--img {
  max-width: 100%;
  padding: 0;
}
.ml-flp {
  perspective: 1000;
}
.ml-flp:hover .ml-flp__cntnt {
  transform: rotateY(180deg);
}
.ml-flp--sm {
  height: 200px;
}
.ml-flp--md {
  height: 300px;
}
.ml-flp--lg {
  height: 400px;
}
.ml-flp__pnl {
  backface-visibility: hidden;
  border-radius: 10px;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
}
.ml-flp__pnl--frnt {
  transform: rotateY(0deg);
  z-index: 2;
}
.ml-flp__pnl--bck {
  transform: rotateY(180deg);
}
.ml-flp__cntnt {
  height: 100%;
  overflow: visible;
  position: relative;
  transform-style: preserve-3d;
  transition: 0.25s;
}
.ml-clstr {
  display: flex;
  padding: 0;
}
.ml-clstr--vrt {
  flex-direction: column;
}
@media (min-width: 768px) {
  .ml-clstr--vrt {
    flex-direction: row;
  }
}
.ml-clstr--hrz {
  flex-direction: column;
}
.ml-clstr__sgmnt {
  display: flex;
  overflow: hidden;
  flex: 1 1 auto;
}
.ml-clstr__sgmnt--rw {
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .ml-clstr__sgmnt--rw {
    flex-direction: row;
  }
}
.ml-clstr__sgmnt--clmn {
  flex-direction: column;
}
@media (min-width: 768px) {
  .ml-clstr__sgmnt--hlf {
    flex-basis: 50%;
  }
  .ml-clstr__sgmnt--qrt {
    flex-basis: 25%;
  }
}
```

## Заключение

Мы рассмотрели методику создания плиточной раскладки на чистом CSS. Мне действительно нравится результат. Плитка на чистом CSS может работать, хотя она и не безупречна. Я вижу потенциальные проблемы. Например, сложности будут,если вы хотите вывести блог, отсортированный по дате, это потребует дополнительных размышлений. Одним из решений будет использование колонок с последующим заполнением их в хронологическом порядке. В результате последняя запись будет в первом столбце, предыдущая во втором и так далее.

Я собираюсь продолжить работу над кодом, [результаты выкладываются на github](https://github.com/jh3y/driveway). Можете с чистой душой форкать репозиторий или [экспериментировать с демокодом](https://jsbin.com/loronibali/2/edit?css,output) (раз уж вы дочитали до этого места, то именно в этой демке вы найдете обещанные дополнительные эффекты при наведении).