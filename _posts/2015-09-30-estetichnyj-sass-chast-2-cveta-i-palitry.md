---
layout: post
title: "Эстетичный Sass часть 2: цвета и палитры"
date: 2015-09-30 18:17:21
description: "Способы управления цветовыми палитрами в Sass - создание оттенков цветов, контраст и прозрачность"
categories: [development]
tags: [sass, translation, scotch]
prism: yes
original: "https://scotch.io/tutorials/aesthetic-sass-2-colors"
original_author: "David Khourshid"
original_title: "Aesthetic Sass 2: Colors and Palettes "
thumbnail: "/images/development/sass/Screen-Shot-2015-03-29-at-4.07.22-PM-522x250.png"
scripts: codepen
series: "Эстетичный Sass"
---
Цвет очень важен в дизайне --- он играет визуальную и психологическую роль. Правильно подобранная палитра, соответствующая замыслу вашего дизайна значительно улучшает эстетическое впечатление от вашего сайта.

Вы (или ваш дизайнер) можете подходить к проекту с готовой палитрой. Если нет, настоятельно рекомендую прочитать [теорию цвета для дизайнеров](http://www.dtelepathy.com/blog/design/color-theory) и [создание собственных палитр](http://www.smashingmagazine.com/2010/02/08/color-theory-for-designer-part-3-creating-your-own-color-palettes/). В идеале, хорошая палитра состоит из двух контрастных "брендовых цветов" или двух похожих цветов (из монохромной схемы) плюс нескольких осветленных или затемненных цветов для гибкости.

Если вы уже определились со своей палитрой, встроенные функции Sass помогут вам манипулировать ее цветами.

## Ссылки на цветовую палитру

Переменные SASS (`$variables`) дают отличный способ упорядоченно и многократно ссылаться на цвета. Они ориентированны на семантические именования цветовых палитр, а не на их названия, исходя из внешнего вида. Переменная типа `$color-blue ` имеет немного смысла (кроме того, что она указывает на синий цвет), а вот `$color-primary` показывает роль этого цвета. Это также дает нам гибкость при темизации или в случае смены брендовых цветов.

Несмотря на то, что `$color-variables` это неплохое начало, хорошей идеей будет хранить цвета в виде карты SASS (SASS map).  Таким образом, цвета будут упорядочены, на них будет проще ссылаться и проходить по ним циклом.

Ниже показана базовая цветовая палитра Scotch.io:

```scss
$scotch-colors: (
  'primary': #8e3329,
  'accent': #d98328,
  'secondary': #5a1321,
  'foreground': #191919,
  'background': #e9e9e9
);
```

Каждый цвет имеет семантическое значение, описывающее его роль. Можно использовать функцию Sass  `map-get()` или  собственную функцию-утилиту (рекомендуется) для ссылок на отдельные цвета:

```scss
@function scotch-color($key: 'primary') {
  @return map-get($scotch-colors, $key);
}

$button-color: scotch-color('primary'); // #8e3329
```

Цветовую палитру желательно ограничить определенным количеством цветов (4 -7). Остальные  цвета создаются как оттенки и тени цветов из палитры.

## Оттенки и тени

Добавление оттенков и теней к вашей палитре даст вам большее количество цветов для проекта при сохранении согласованности вашей оригинальной палитры. Для создания теней и оттенков цвета в SASS есть функция `mix()`, которая смешивает оригинальный цвет с черным или белым:

```scss
$color-primary: scotch-color('primary'); // #8e3329

$color-primary-tinted: mix(white, $color-primary, 10%); // #99473e
$color-primary-shaded: mix(black, $color-primary, 10%); // #7f2d24
```

Если установлен интервал осветления/затемнения, служебная функция может возвращать нужный оттенок соответствующей степени затемнения/осветления требуемого цвета (вместо использования магических чисел):

```scss
$color-interval: 10% !global;

@function scotch-color-level($color-name: 'primary', $level: 0) {
  $color: scotch-color($color-name);
  $color-base: if($level < 0, black, white);

  @return mix($color-base, $color, $level * $color-interval);
}

// Example:
.panel {
  background-color: scotch-color-level('primary', 2);
}
```

В Sass также есть функция  [scale-color()](http://sass-lang.com/documentation/Sass/Script/Functions.html#scale_color-instance_method), позволяющая  добавлять к базовому цвету  оттенки красного, зеленого и синего, изменять насыщенность и осветленность, изменять альфа-компоненты цвета --- и все это в зависимости от уже произведенных манипуляций с цветом. Так, увеличение `$lightness`  на уже осветленном цвете даст меньший эффект, чем аналогичная операция на темном цвете.

Функции [lighten()](http://sass-lang.com/documentation/Sass/Script/Functions.html#lighten-instance_method) и [darken()](http://sass-lang.com/documentation/Sass/Script/Functions.html#darken-instance_method) действуют похожим образом, но при больших значениях [уничтожают исходные цвета](http://codepen.io/KatieK2/pen/tejhz/), делая их слишком темными или светлыми.

## Прозрачность и непрозрачность

Дизайн проекта можно значительно улучшить, добавив несколько уровней прозрачности к цветам из палитры. Прозрачность контекстуальна --- ее эффективность в дизайне зависит от фона, который открывается под прозрачным элементом. Прозрачность обычно используется для создания контраста и, в зависимости от используемых цветов и фонов, уровень непрозрачности необходимый для достижения нужного контраста может различаться.

Исходя из этого будет логично упорядочить различные (семантические) уровни прозрачности, используемые в дизайне с помощью карты SASS:

```scss
$scotch-opacity: (
  'light': 0.8, // opacity used with lighter colors
  'dark': 0.4   // opacity used with darker colors
  // ... etc.
);

```

Служебная функция `scotch-color-alpha()` изменяет уровень непрозрачности цвета на основе переданного значения `$opacity` и функции [rgba](http://sass-lang.com/documentation/Sass/Script/Functions.html#rgba-instance_method):

```scss
@function scotch-color-alpha($name: 'primary', $opacity: 0) {
  $color: scotch-color($name);

  // Get the named opacity level, if it exists
  @if map-key-exists($scotch-opacity, $opacity) {
    $opacity: map-get($scotch-opacity, $opacity);
  }

  // Use rgba() to manipulate the color's alpha level
  @return rgba($color, $opacity);
}

// Example usage:
$button-transparent-color: scotch-color-alpha('primary', 'light');
// => rgba(#8e3329, 0.8)
```

Функции [opacify()](http://sass-lang.com/documentation/Sass/Script/Functions.html#opacify-instance_method) и [transparentize()](http://sass-lang.com/documentation/Sass/Script/Functions.html#transparentize-instance_method) могут использоваться  для уменьшения/увеличения прозрачности соответственно. Эти функции полезны, если у цвета уже есть прозрачность. Однако, правильно построенная палитра должна основываться на полностью непрозрачных цветах.

## Контраст и доступность

Если мы решили, что два выбранных цвета составляют хорошую пару для переднего и заднего плана (цвета текста и фона, например), мы можем использовать функцию [lightness($color) ](http://sass-lang.com/documentation/Sass/Script/Functions.html#lightness-instance_method) для выбора цвета переднего плана:

```scss
// Returns either a dark or light foreground color, given
// the background color
@function scotch-foreground-color($bgcolor, $threshold: .65) {
  @return if(lightness($bgcolor) >= $threshold, $color-dark, $color-light);
}
```

Это работает в большинстве сценариев, но может выдавать неправильные позитивные/негативные цвета около `$threshold` (границы). Поэтому стоит зараннее вручную проверять контраст между цветами в паре, в первую очередь во избежание проблем с доступностью.

Текущая [рекомендация по доступности](http://www.w3.org/TR/WCAG/#visual-audio-contrast) говорит, что контраст между цветамм текста и фона должен быть минимум 4.5 к 1 (3 к 1 при большом шрифте) на уровне АА, а на уровне ААА 7 к 1 и 4.5 к 1 соответственно. Вы можете почитать о [минимальном контрасте](http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html), чтобы лучше понимать, как рассчитываются эти цифры.

Ли Веру разработала [инструмент для проверки контраста](http://leaverou.github.io/contrast-ratio/), который очень удобен при подборе пар цветов. Комбинируя основной цвет в палитре-примере, scotch red (`#8e3329`) и светлый цвет, white (`#ffffff`),  получаем контраст 7.9, что подходит для любого размера текста на любом уровне, а значит, это хорошая пара для основного и фонового цветов.

## Собственные варианты цветов

Иногда в проектах бывают собственные варианты цветов, предложенные дизайнером. Это упрощает определение теней и оттенков всех цветов, так как они уже будут в палитре. Это также значит, что мы не сможем использовать преимущества  функций по изменению цвета. За примером подобного дизайна далеко ходить не надо ---  в Google’s Material Design  все оттенки цветов заранее определены:

![Палитра материального дизайна](/images/development/sass/Screen-Shot-2015-03-29-at-4.07.22-PM-522x250.png){: itemprop="image"}

В этом случае помогут многомерные карты SASS, в которых будут записаны все вариации основных цветов. Вот образец хранения цветовых значений и функции для адаптации оригинальной палитры:

```scss
$scotch-color-key: 'base' !default;

$scotch-colors: (
  'primary': (
    'base': #8e3329,
    'light': #d9534f,
    'dark': #c9302c
  ),
  'accent': (
    'base': #d98328,
    'light': #dd8f3d,
    'dark': #c57623
  ),
  'secondary': (
    'base': #5a1321,
    'light': #7b1a2d,
    'dark': #51111e
  ),
  'foreground': (
    'base': #191919,
    'light': #333333,
    'dark': #111111,
    'darker': #000000
  ),
  'background': (
    'base': #e9e9e9,
    'light': #ffffff,
    'dark': #dddddd
  )
);

```

Модифицированная функция `scotch-color()` обрабатывает выборку цветов, вот [демо](http://sassmeister.com/gist/ac4322cc0564cd37c432).

Базовый (дефолтный) цвет определен в `$scotch-color-key`. Функция `scotch-color()` модифицирована для извлечения определенного варианта цвет на основе переданного ключа ('base', 'light', 'dark' и т.д.) и переданной степени прозрачности. Это позволяет извлекать нужный цвет одним аргументом, например `$color: scotch-color('primary')`

<p class='codepen'  data-height='200' data-theme-id='2089' data-slug-hash='0d74b9a54fb2ebc3c3be270284ed618d' data-default-tab='result' data-line-numbers='' data-animations='run'>See the Pen <a href="http://codepen.io/davidkpiano/pen/0d74b9a54fb2ebc3c3be270284ed618d/">0d74b9a54fb2ebc3c3be270284ed618d</a> by David Khourshid (<a href="http://codepen.io/davidkpiano">@davidkpiano</a>) on <a href="http://codepen.io">CodePen</a>.</p>


## Завершение

Цвета это очень важная часть дизайна проекта. Поэтому лучше сразу организовать цвета проекта в отдельной карте SASS, чтобы затем  извлекать их через `map-get` или кастомную функцию. В SASS есть [много встроенных функций для работы с цветом](http://sass-lang.com/documentation/Sass/Script/Functions.html) и получения оттенков и теней основных цветов. Если оттенки определены заранее, используйте для их упорядочивания многомерные карты SASS.

Общей целью эстетичного цветного дизайна в SASS является возможность:

*  предоставлять и изменять цвета в гармонии с выбранной цветовой палитрой
*  избегать использования "магических" чисел

В следующей части нашей серии мы рассмотрим типографику и вертикальный ритм.
