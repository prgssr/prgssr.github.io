---
title: Как работают в флексбоксе z-index и автоотступы
layout: post
categories: [development]
tags: [css,translation, sitepoint]
date: 2016-06-15 18:35:11 +0300
prism: yes
description: "У флекс-элементов может работать z-index, а автоотступы в флексбоксе дают изящное выравнивание."
original: "https://www.sitepoint.com/quick-tip-how-z-index-and-auto-margins-work-in-flexbox/"
original_title: "Quick Tip: How z-index and Auto Margins Work in Flexbox"
original_author: "George Martsoukos"
thumbnail: "noimage"
scripts: codepen
---

[Флексбокс](https://www.w3.org/TR/css-flexbox-1/) широко известен как средство для решения традиционных проблем с раскладкой, таких как создание приклеенного футера или колонок одинаковой высоты. Но кроме этих возможностей, есть и другие, менее популярные, но не менее полезные. Рассмотрим пару из них.

## Флексбокс и `z-index`

Как вы  знаете, свойство `z-index` работает только у позиционированных элементов. По умолчанию, все элементы не являются позиционированными, им задано свойство `position: static`. Позиционированными являются элементы, свойство `position` которых имеет значение `relative`, `absolute`, `fixed` или `sticky`.

Однако "не позиционированный" элемент, такой как элемент внутри флексбокса также может получать `z-index`. В [спецификации флексбокса](https://drafts.csswg.org/css-flexbox-1/#painting) сказано:

>Элементы в флексбоксе отрисовываются также как и строчные блоки, за исключением случаев, когда вместо "сырого" документа используется документ с измененным порядком, тогда начинают действовать значения `z-index`, отличные от автоматического, и создается контекст наложения даже для элементов со статическим позиционированим.

Чтобы понять это поведение, рассмотрим следующий пример:

<p data-height="465" data-theme-id="0" data-slug-hash="JKYEgj" data-default-tab="result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/JKYEgj/">Flexbox and z-index</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Здесь у нас два элемента: `.front` и `.back`. У `.front` один потомок с цифрой 1, сам `.front` позиционирован — ему задано `position: fixed` и он занимает всю зону видимости.

Элемент `.back` является флекс-контейнером. У него два потомка — простые блоки с номерами 2 и 3. Исходя из того, о чем мы говорили, мы можем задать им `z-index`, не изменяя их свойство `position`.

В демо `z-index: 2` добавляется им при нажатии на кнопку, после чего флекс-элементы оказываются выше элемента `.front`.

## Флексбокс и `margin:auto`

Применяя автоотступы к элементам в флекс-контейнере, мы можем реализовать традиционные паттерны пользовательского интерфейса. Для начала предположим, что мы хотим сделать традиционную раскладку хедера:

![Обычная раскладка хедера](/images/development/flex/1465278836header.png)

Чтобы построить это, мы будем использовать флексбокс. Никаких флоатов, фиксированной ширины и подобных штук.

Вот наша разметка:

```markup
<header>
  <nav>
    <h1 class="logo">LOGO</h1>

    <ul class="menu">
      <li>
        <a href="">About</a>
       </li>
      <li>
        <a href="">Projects</a>
      </li>
      <li>
        <a href="">Contact</a>
      </li>
    </ul>

    <ul class="social">
      <li>
        <a href="">Facebook</a>
      </li>
      <li>
        <a href="">Twitter</a>
      </li>
    </ul>
  </nav>
</header>

```

И стили:

```css
header {
  background: #333;
}

nav {
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.menu {
  margin-left: 60px;
  margin-right: auto;
}
```

В этом примере элемент `nav` является флекс-контейнером, а лого (`.logo`), основное (`.menu`) и социальное меню (`.social`) явлются элементами в флекс-контейнере. Как вы можете видеть из предыдущей иллюстрации, первые два флекс-элемента выровнены по левой стороне флекс-контейнера вдоль основной оси. С другой стороны, социальное меню выровнено по правому краю родительского элемента вдоль основной оси.

Одним из способов  создания такого выравнивания является добавление `margin-right: auto` к основному меню. С этой одной строчкой кода мы можем переписать текущее выравнивание для социального меню и толкнуть все его элементы в правую часть контейнера. Сходным образом мы используем свойство `align-self` для изменения дефолтного выравнивания флекс-элементов по поперечной оси.

Кроме автоотступов есть второй метод, который мы можем использовать для построения нужной раскладки. Сначала мы удалим свойство `margin-right` у основного меню, а затем добавим ему `flex-grow: 1`.

Хотя результат в обоих случаях выглядит одинаково, есть одно большое отличие. С первым вариантом у нашего основного меню есть расчитанная исходная ширина. Так, например, при ширине зоны видимости в 1100px меню будет выглядеть примерно так:

![первый вариант меню при ширине экрана в 1100px](/images/development/flex/1465278899menuwidth.png)

С другой стороны, при втором варианте ширина меню увеличивается, так как мы задали `flex-grow: 1`. Вот как это выглядит при той же ширине экрана в 1100px:

![второй вариант меню при ширине экрана в 1100px](/images/development/flex/1465278971menuwidth2.png)

Демо на Codepen:

<p data-height="365" data-theme-id="0" data-slug-hash="ezpgqx" data-default-tab="result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/ezpgqx/">Custom Flexbox Alignment With Auto Margins</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Предположим, мы хотим изменить раскладку хедера, вот как она должна выглядеть:

![Новый вариант раскладки хедера](/images/development/flex/1465279009headervertical.png)

Разметка остается прежней, мы всего лишь вносим несколько изменений в CSS:

```css
nav {
  background: #333;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 180px;
  padding: 20px;
  box-sizing: border-box;
}

.menu {
  margin-top: 60px;
  margin-bottom: auto;
}   
```

Обратите внимание, что в этом примере социальное меню выровнено по нижнему краю контейнера. Опять-таки, это сделано путем добавления `margin-bottom: auto` к основному меню. Конечно, мы также можем использовать `flex-grow: 1`, но это решение увеличит высоту меню.

Рассмотрим демо на Codepen:

<p data-height="565" data-theme-id="0" data-slug-hash="GqpWKW" data-default-tab="result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/GqpWKW/">Custom Flexbox Alignment With Auto Margins</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Также надо учитывать, что при задании `justify-content` в любом из наших примеров, мы не заметим никаких визуальных отличий. Это происходит потому, что мы используем автоотступы для выравнивания флекс-элементов. И только при удалении автоотступов, `justify-content` будет действовать. В [соответствии со спецификацией](https://www.w3.org/TR/css-flexbox-1/#auto-margins):

>Если пустое пространство распределяется с помощью автоотступов, свойства для выравнивания не будут иметь эффекта в том же измерении, так как отступы заберут себе все пустое пространство для выравнивания.

Теперь создадим новый вариант нашего хедера:

![новый вариант хедера](/images/development/flex/1465279051header2.png)

Без сомнений, этого можно легко добиться, задав флекс-контейнеру `justify-content: space-between`. Но здесь мы тоже можем сделать раскладку с помощью автоотступов. Все что нужно сделать, это добавить `margin: 0 auto` к основному меню.

Демо на Codepen:

<p data-height="465" data-theme-id="0" data-slug-hash="GqpWKW" data-default-tab="result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/GqpWKW/">Custom Flexbox Alignment With Auto Margins</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Заключение

В этой статье мы рассмотрели две малоизвестные особенности флексбокса. Вот они:

* Мы можем применять `z-index` к флекс-элементам, даже если они не позиционированы, то есть имеют `position: static`.
* Мы можем использовать автоотступы для выравнивания флекс-элементов по основным осям.

