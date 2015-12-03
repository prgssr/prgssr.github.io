---
layout: post
title: "5 способов улучшить Sass с помощью Bourbon"
categories: [development]
tags: [sass, bourbon, translation, sitepoint]
date: 2015-11-14 10:44:41
description: "5 простых примеров использования библиотеки Bourbon"
original: "http://www.sitepoint.com/5-ways-improve-sass-bourbon/"
original_title: "5 Ways to Improve Your Sass with Bourbon"
original_author: "М.Дэвид Грин"
prism: yes
thumbnail: "/images/thoughtbot.png"
---

Если вы часто пишите CSS, вполне возможно, что вы уже знакомы с [Sass](http://sass-lang.com/). Sass это один из лучших способов препроцессинга вашего CSS для получения чистого, [не повторяющегося](https://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself) и поддерживаемого кода. Возможности Sass очень значительны.

Но одно из главных достоинств Sass это расширяемость --- сторонние разработчики могут создавать надстройки над Sass, еще больше увеличивающие его возможности. Одним из наиболее легких и эффективных инструментов такого рода является [Bourbon](http://bourbon.io/).

Bourbon это библиотека миксинов, функций и дополнений к Sass, расширяющих его функционал и делающих более удобным ваш рабочий процесс в Sass. Если вы не знакомы с Bourbon, [я написал пошаговую инструкцию по его установке](/development/nachinaem-rabotu-s-sass-i-bourbon.html), с изучения которой вы можете начать.

После установки Bourbon, я рекомендую вам попробовать некоторые из моих любимых способов облегчения разработки в Sass  с его помощью.

## 1. Форматы шрифтов

Со всем сегодняшним разнообразием браузеров и форматов шрифтов, для подключения нового шрифта [нужен достаточно объемный фрагмент кода](http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).
Но возможности дополнительных шрифтов стоят того, будь то яркий шрифт для заголовка или универсальный иконочный шрифт, позволяющий вам сэкономить траффик.

Для поддержки всех основных браузеров вам надо создавать файлы со шрифтами во всех основных форматах и затем подключать их в CSS до начала использования. Браузеры достаточно сообразительны, чтобы понять, какой из них надо использовать, но для кроссбраузерности надо добавлять все варианты. CSS для этого выглядит так:

```scss
@font-face {
    font-family: My-Font;
    font-weight: normal;
    font-style: italic;
    src: url('/styles/fonts/myfont.eot');
    src: url('/styles/fonts/myfont.eot?#iefix') format('embedded-opentype'),
       url(/styles/fonts/myfont.woff') format('woff'),
       url('/styles/fonts/myfont.ttf') format('truetype'),
       url('/styles/fonts/myfont.svg##My-Font) format('svg');
}
```

Теперь вы можете использовать этот шрифт в заголовках:

```css
h1, h2, h3 {
    font-family: 'My-Font', sans-serif;
}
```

В Bourbon есть очень удобный миксин, позволяющий добавлять новые шрифты легко и быстро. Если вы последовательны в именовании шрифтов и загружаете их в один каталог на сервере, то Bourbon сгенерирует за вас весь необходимый CSS из предыдущего примера:

```scss
@include font-face(My-Font, '/fonts/my_font/MyFont-Italic', normal, italic);
```

Теперь вы можете использовать ‘My-Font’ где угодно в ваших стилях и все форматы для всех браузеров будут на месте.

Если вы не хотите использовать "пуленепробиваемый синтаксис" `@font-face`, в миксине есть дополнительный аргумент `$file-formats`, позволяющий указать нужные форматы шрифтов.

```scss
@include font-face(My-Font, '/fonts/my_font/MyFont-Italic', normal, italic,  $file-formats: eot woff2 woff);
```

В Bourbon также есть переменные для готовых наборов шрифтов, поддерживаемых во всех браузерах. Это поможет вам задавать шрифт с подобранными по сходству альтернативами на случай его отсутствия в других операционных системах.

Вот эти переменные:

```scss
font-family: $helvetica;
font-family: $georgia;
font-family: $lucida-grande;
font-family: $monospace;
font-family: $verdana;
```

Они генерируют следующие декларации `font-family`:

```scss
font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
font-family: Georgia, Cambria, "Times New Roman", Times, serif;
font-family: "Lucida Grande", Tahoma, Verdana, Arial, sans-serif;
font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;
font-family: Verdana, Geneva, sans-serif;
```

## 2. Поля ввода в формах

Хлеб и масло веб-разработки это контроль над внешним видом форм. Но добавление стилей, единообразно работающих во всех элементах формы, обычно означает написание более сложных селекторов.

Например:

```css
input[type="email"], input[type="number"],
input[type="password"], input[type="search"],
input[type="tel"], input[type="text"],
input[type="url"], input[type="color"],
input[type="date"], input[type="datetime"],
input[type="datetime-local"], input[type="month"],
input[type="time"], input[type="week"] {
  color: #999;
}
```

В Bourbon есть набор дополнений, облегчающих создание и управление едиными стилями форм. Приведенный выше CSS генерируется в Bourbon одной строчкой:

```scss
#{$all-text-inputs} {
  color: #999;
}
```

Похоже дополнение есть и для кнопок:

```scss
#{$all-button-inputs} {
  background: #f3f;
}
```

Это даст следующие стили:

```css
input[type="button"],
input[type="reset"],
input[type="submit"] {
  background: #f3f;
}
```

Если вам нужно контролировать состояния `:active` и `:hover` элементов формы, Bourbon тоже справится с этим. Просто добавьте `-active` или `-focus` к уже известным вам дополнениям и вы сгенерируете код.

```scss
#{$all-text-inputs-hover} {
  color: #000;
}
```

Сгенерирует такой CSS:

```css
input[type="email"]:hover, input[type="number"]:hover,
input[type="password"]:hover, input[type="search"]:hover,
input[type="tel"]:hover, input[type="text"]:hover,
input[type="url"]:hover, input[type="color"]:hover,
input[type="date"]:hover, input[type="datetime"]:hover,
input[type="datetime-local"]:hover, input[type="month"]:hover,
input[type="time"]:hover, input[type="week"]:hover {
  color: black;
}
```

## 3. Преобразование единиц

Одна из тех вещей, на которые постоянно приходится тратить время это конвертирование пиксельных размеров изображений и шрифтов в относительные единицы типа `em` или `rem`. Вы можете каждый раз заниматься расчетами, когда у вас поменялись значения. А можете использовать удобные функции Bourbon для конвертации.

Начнем с простой конвертации пикселей в `em` при дефолтном соотношении 16px = 1em. Вот код:

```scss
p {
  font-size: em(10);
}
```

И его результат:

```css
p {
  font-size: 0.625em;
}
```

Если у вас другой базовый размер шрифта, вы можете передать его в качестве второго аргумента в ту же самую функцию `em()`:

```scss
p {
  font-size: em(10, 32);
}
```

Получится:

```css
p {
  font-size: 0.3125em;
}
```

Если вместо em вы используете rem, чтобы использовать базовое значение независимо от родительского элемента, то вы можете использовать функцию `rem()`:

```sass
p
  font-size: rem(10)
```

```css
p {
  font-size: 0.625rem;
}
```

В Bourbon есть еще несколько алгоритмов конвертации, включая изящную функцию `modular-scale()`, упрощающую расчет модульного масштабирования на основе гармонических интервалов или проверенного веками золотого сечения, что можно использовать при создании раскладки или вертикального ритма.

## 4. Поддержка Flexbox

Самая актуальная новинка в мире CSS-раскладки это [flexbox](http://www.sitepoint.com/are-we-ready-to-use-flexbox/), позволяющий вам определять расположение элементов на экране намного проще, чем при использовании старых методов, требующих большого количества дополнительной разметки и навороченных правил CSS. Flexbox же начиная с 2009 года неоднократно видоизменялся и  постепенно становится все более актуальным.

Конечно, для его использования  в различных браузерах вам нужно добавить много вендорных префиксов и предусмотреть запасные варианты. В зависимости от того, как много браузеров вы собираетесь поддерживать, использование флексбокса может потребовать написания достаточно объемных CSS:

```css
.container {
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  flex-direction: column;
  -ms-flex-direction: column;
  -webkit-box-align: center;
  -moz-box-align: center;
  box-align: center;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  -o-align-items: center;
  align-items: center;
  -ms-flex-align: center;
  -webkit-box-pack: justify;
  -moz-box-pack: justify;
  box-pack: justify;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
  -ms-flex-pack: justify;
}

.container > .box {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
```

При виде такого количества кода, первоначальная радость от предвкушения Flexbox сменяется болью. Но если вам действительно нужно поддерживать все эти старые браузеры, в Bourbon есть возможность генерировать все эти объемы кода  несколькими строчками:

```scss
.container {
  @include display(flex);
  @include flex-direction(column);
  @include align-items(center);
  @include justify-content(space-between);
}

.container > .box {
  @include flex(1);
}
```
Я уже упоминал в примечании к первой статье, что в Bourbon 5 (на данный момент [вышла альфа версия](https://github.com/thoughtbot/bourbon/releases/tag/v5.0.0.alpha.0)) все будет по-новому. В частности, все миксины с вендорными префиксами будут удалены --- разработчики библиотеки [рекомендуют  использовать для этого  Autoprefixer](https://github.com/postcss/autoprefixer).
{: .info}

В Bourbon есть возможность поддержки большого набора свойств Flexbox. И при обновлении Bourbon генерируемый код будет меняться в зависимости от поддержки Flexbox  в браузерах.

## 5. Изображения для экранов Retina

Сейчас надо быть готовыми к тому, что у посетителей сайта встречаются устройства не только с обычными дисплеями, но и с дисплеями повышенной четкости и разработчикам нелегко выбрать нужное изображение с учетом максимального качества и минимального объема.

Один из подходов решения этой проблемы использует медиа-запросы для выявление соотношения пикселей устройства и передачу фонового изображения в зависимости от вида дисплея. Работающий CSS выглядит так:

```css
.hero {
  background-image: url(hero-background.png);
}

@media only screen and (-webkit-min-device-pixel-ratio: 1.3),
       only screen and (min--moz-device-pixel-ratio: 1.3),
       only screen and (-o-min-device-pixel-ratio: 1.3 / 1),
       only screen and (min-resolution: 125dpi),
       only screen and (min-resolution: 1.3dppx) {

    .hero {
      background-image: url(hero-background_2x.png);
      background-size: 400px 300px;
    }

}
```

Как видите, здесь много избыточности, особенно, если вы четко соблюдаете единообразие и системность при именовании файлов. Bourbon позволяет решать эту задачу одной строчкой кода:

```scss
.hero {
  @include retina-image(hero-background, 400px 300px, png);
}
```

Последний параметр не обязателен, если вы используете PNG --- в Bourbon это формат по умолчанию. Вы также можете кастомизировать это команду дополнительными параметрами, типа изображения для дисплеев с ретина или добавив суффикс.

## Приступайте сегодня

Со всей этой полезной функциональностью и дюжинами функций с дополнительными возможностями нет смысла писать чистый Sass без Bourbon ведь это как писать CSS без Sass. Просто [попробуйте](http://bourbon.io/), он стоит того!
