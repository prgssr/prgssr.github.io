---
layout: post
title: "Семантические сетки с Sass, Bourbon и Neat"
categories: [development]
tags: [sass, bourbon, translation, sitepoint]
date: 2015-11-15 17:09:24
description: "Сеточная система Neat это часть экосистемы Bourbon,  упрощающая верстку."
original: "http://www.sitepoint.com/sass-bourbon-neat-lightweight-semantic-grids/"
original_title: "Sass and Bourbon Neat for Lightweight Semantic Grids"
original_author: "М.Дэвид Грин"
prism: yes
thumbnail: "/images/thoughtbot.png"
---

Если вы уже являетесь поклонником [Sass](http://sass-lang.com/) и [Bourbon](http://bourbon.io/), то вам придется по душе и [Neat](http://neat.bourbon.io/). Это легковесная семантичная система сеток, прекрасно интегрированная в экосистему Sass и Bourbon, созданная авторами Bourbon --- компанией [Thoughtbot](http://thoughtbot.com/).  

Если же вы еще не в курсе, то Sass это препроцессор CSS, позволяющий вам значительно улучшить рабочий процесс. Bourbon это набор миксинов для Sass, улучшающий и расширяющий возможности Sass. Ознакомиться с ними можно в моей [предыдущей статье](/development/5-sposobov-uluchshit-sass-s-pomoshyu-bourbon.html). После прочтения вы будете готовы к тому, чтобы ознакомиться с Neat.  

## Модульный подход

Одной из задач фреймворка Bourbon является сохранение модульности, вас никто не заставляет подключать код, который вы не будете использовать. Именно с учетом этого, разработчики Bourbon выпустили сеточную систему Neat как отдельное дополнение к Bourbon. Они хотели создать небольшую семантичную сеточную систему, решающую большую часть задач по созданию раскладки страницы без лишней догматичности.  

Целью было создать такой компонент,  который дает все необходимые преимущества, но который вовсе необязательно подключать, если она не нужна. Neat можно подключить к проекту Bourbon, но пока вы ее не примените, она ничего не добавит к итоговому коду CSS.

## Что такое семантичная сетка?

Семантика это термин, который очень часто используется в веб-разработке. Для Neat семантика это прежде всего способность сеточной системы работать с HTML элементами, не изменяя их нативные классы и использовать их в соответствии с предназначением, оставляя разметку чистой.

Разберем это на быстром примере.

Представьте, что вы верстаете страницу, на которой надо вывести `article` и `aside` внутри `section`. Вы хотите использовать предназначенные для этого элементы HTML и не хотите загромождать страницу лишними классами или элементами-обертками. Вы хотите, чтобы `aside` был спозиционирован влево от статьи на дисплее десктопа и чтобы у вас оставалась возможность изменить расположение элементов на других устройствах.

Начнем с простого HTML:

```markup
<section>
  <aside>
    <p>Highlighted information</p>
  </aside>
  <article>
    <p>This is the content of the article</p>
  </article>
</section>
```

Без CSS содержимое `aside` окажется сверху, а под ним будет `article`. Чтобы разместить их странице в нужных местах, вам нужно лишь применить к ним миксины Neat. Сначала вы определяете, что элемент `section` является контейнером, а затем указываете, сколько колонок (из 12 дефолтных) займет каждый из элементов-потомков  (`aside` и `article`, соответственно).

```scss
@import bourbon/bourbon
@import neat/neat

section {
  @include outer-container;
  aside {
    @include span-columns(3);
  }
  article {
    @include span-columns(9);
  }
}
```

Это безупречно работает с любым кодом  Sass и Bourbon, с любыми классами и CSS селекторами. И если вы хотите, вы можете привязать этот код к конкретным классам CSS, Neat просто сделает свою работу. Вот разметка:

```markup
<section class="article-container">
  <aside class="interesting-insight">
    <p>Highlighted information</p>
  </aside>
  <article class="syndicated-content">
    <p>This is the content of the article</p>
  </article>
</section>
```

Сетка Neat работает точно также (мы подразумеваем, что вы скопировали директивы `@import` из предыдущего фрагмента):

```scss
.article-container {
  @include outer-container;
  .interesting-insight {
    @include span-columns(3);
  }
  .syndicated-content {
    @include span-columns(9);
  }
}
```

## Отзывчивая раскладка страницы

На странице, сверстанной с кодом из предыдущих примеров, содержимое `aside` всегда будет слева от `article` независимо от размеров окна. Но, что делать, если вам нужно, чтобы на дисплеях меньше 500 пикселей выводился на всю ширину сверху?

Вы можете это сделать, задав контрольную точку `$mobile` равной 500px с помощью функции Neat `new-breakpoint()`. Эта функция также позволяет вам определить общее количество колонок при таком размере экрана для всех элементов в данном контексте:

```scss
$mobile: new-breakpoint(max-width 500px 4);

section {
  @include outer-container;
  aside {
    @include span-columns(3);
    @include media($mobile) {
      @include span-columns(4);
    }
  }
  article {
    @include span-columns(9);
    @include media($mobile) {
      @include span-columns(4);
    }
  }
}
```

Теперь `aside` и `article` будут идти друг за другом, занимая всю ширину экрана, если дисплей равен 500px или меньше. На больших дисплеях будет все та же раскладка со статьей и боковой колонкой.

Давайте теперь посмотрим на CSS, сгенерированный для этой базовой отзывчивой раскладки:

```css
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

section {
  max-width: 68em;
  margin-left: auto;
  margin-right: auto;
}

section:after {
  content: "";
  display: table;
  clear: both;
}

section aside {
  float: left;
  display: block;
  margin-right: 2.35765%;
  width: 23.23176%;
}

section aside:last-child {
  margin-right: 0;
}

@media screen and (max-width: 500px) {
  section aside {
    float: left;
    display: block;
    margin-right: 7.42297%;
    width: 100%;
  }

  section aside:last-child {
    margin-right: 0;
  }
}

section article {
  float: left;
  display: block;
  margin-right: 2.35765%;
  width: 74.41059%;
}

section article:last-child {
  margin-right: 0;
}

@media screen and (max-width: 500px) {
  section article {
    float: left;
    display: block;
    margin-right: 7.42297%;
    width: 100%;
  }

  section article:last-child {
    margin-right: 0;
  }
}
```

Существует множество лучших практик и CSS-трюков, делающих получаемые стили  надежными. Например, Bourbon и Neat берут на себя отмену обтекания, удаление правого отступа у последних элементов и расчет ширины элементов и отступов в процентах с точностью до 5 десятичных символов для всех заданных размеров экрана. Это значительно уменьшает трудоемкость верстки.

## Упорядочивание по приоритету контента

Если вы хотите переключить порядок вывода элементов, без изменения разметки HTML, Neat поддерживает удобный метод отрицательного позиционирования. Вы можете легко сдвинуть каждую колонку относительно ее родительского элемента:

```scss
section {
  @include outer-container;
  aside {
    @include span-columns(3);
    @include shift(-12);
  }
  article {
    @include span-columns(9);
    @include shift(3);
  }
}
```

Теперь элемент `article` будет слева, а `aside` справа. И вы точно также сможете добавить для них "мобильные стили" как и в предыдущем примере:

```scss
$mobile: new-breakpoint(max-width 500px 4);

section {
  @include outer-container;
  aside {
    @include span-columns(3);
    @include shift(-12);
    @include media($mobile) {
      @include span-columns(4);
    }
  }
  article {
    @include span-columns(9);
    @include shift(3);
    @include media($mobile) {
      @include span-columns(4);
    }
  }
}
```

## Кастомизация настроек

Одним из реальных преимуществ Neat является гибкость конфигурирования. Neat позволяет вам устанавливать собственные значения почти для всего, что вы хотите настроить в ходе разработки сайта, но при этом в ней есть практичные настройки по умолчанию, такие как число колонок и ширина отступов между ними.

По умолчанию  число колонок равно 12, что дает достаточную гибкость в большинстве раскладок, но вы можете изменить это число, задав новое значение переменной `$grid-columns`, например, 16.

```scss
$grid-columns: 16;

section {
  @include outer-container;
  aside {
    @include span-columns(4);
  }
  article {
    @include span-columns(12);
  }
}
```

## Вложенные сетки

В Neat есть возможность создавать вложенные сетки, используя элементы макета в качестве контейнеров. Это позволяет создавать гибкие презентации, используя множество элементов, спозиционированных внутри вложенного элемента. Все, что вам нужно, это задать число колонок для внутренних элементов относительно их количества, занимаемого внешним элементом.

Например, вот элемент `article` с тремя вложенными элементами `div`:

```markup
<section>
  <aside>
    <p>Highlighted information</p>
  </aside>
  <article>
    <div>This is the first sub-nested element</div>
    <div>This is the second sub-nested element</div>
    <div>This is the third sub-nested element</div>
  </article>
</section>
```
Теперь вы просто  указываете сколько колонок от общей ширины `article` занимает каждый из `div`:

```scss
section {
  @include outer-container;
  aside {
    @include span-columns(3);
  }
  article {
    @include span-columns(9);
    div {
      @include span-columns(3 of 9);
    }
  }
}
```

И так как Bourbon и Neat являются расширениями Sass, они могут быть полностью модифицированы с использованием стандартных техник разработки  Sass.

## Настраиваемые и ненавязчивые

Сетки Neat достаточно гибки и просты, для реализации большинства стандартных подходов к верстке макетов. Если вы хотите реализовать методику "сначала мобильные" с одной колонкой на смартфоне, двумя на планшете и тремя колонками на десктопе; добавить или убрать отступы между колонками; вложить несколько рядов элементов в контейнер --- Neat справится со всем этим.

Изучите [документацию Neat](http://neat.bourbon.io/docs/) и рассмотрите  [примеры на сайте](http://neat.bourbon.io/examples/), чтобы найти вдохновение для своего следующего проекта. С Bourbon и Neat, Sass дает вам возможности для широких экспериментов с дизайном раскладки страницы, не раздувая код и не нарушая семантику разметки.
