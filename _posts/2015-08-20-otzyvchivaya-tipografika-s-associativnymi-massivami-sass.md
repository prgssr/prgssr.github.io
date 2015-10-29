---
layout: post
title: "Отзывчивая типографика с ассоциативными массивами Sass"
date: 2015-08-20 12:32:00
categories: [development]
tags: [sass, translation, smashingmagazine]
description: "Отзывчивая типографика с Sass. Автоматическая генерация медиа-запросов с размером шрифта и высотой строки."
original: "http://www.smashingmagazine.com/2015/06/responsive-typography-with-sass-maps/"
original_author: "Jonathan Suh"
original_title: "Responsive Typography With Sass Maps"
prism: yes
noimage: truth
---
Управление последовательным типографским ритмом задача не из простых, и она усложняется, когда требуется обеспечить отзывчивость сайта. К счастью, карты Sass (они же ассоциативные массивы, они же хэши, они же мапы) заметно упрощают работу с отзывчивой типографикой.

Написание кода это одно, а  учет всех размеров шрифтов для каждой контрольной точки это уже другое, даже если речь идет только о простых параграфах . А ведь есть еще и заголовки от `h1` до `h6` и размеры каждого из них также отличаются для каждой контрольной точки и еще больше все запутывается, когда их масштабирование не линейно.

Если вы уже занимались этой проблемой, то вам знаком подобный код:

```css
p { font-size: 15px; }

@media screen and (min-width: 480px) {
  p { font-size: 16px; }
}
@media screen and (min-width: 640px) {
  p { font-size: 17px; }
}
@media screen and (min-width: 1024px) {
  p { font-size: 19px; }
}

```

Переменные Sass позволяют использовать значения неоднократно, но управление ими для всех размеров шрифтов на всех размерах экранов становится беспорядочным.

```scss
$p-font-size-mobile : 15px;
$p-font-size-small  : 16px;
$p-font-size-medium : 17px;
$p-font-size-large  : 19px;

$h1-font-size-mobile: 28px;
$h1-font-size-small : 31px;
$h1-font-size-medium: 33px;
$h1-font-size-large : 36px;

// I think you get the point…
```

И вот здесь нам помогут [карты Sass](https://jonsuh.com/blog/sass-maps/): они помогают управлять  [z-индексом и цветами](https://jonsuh.com/blog/organizing-z-index-with-sass/), помогут и с размерами шрифтов.

## Упорядочиваем размеры шрифтов с картами Sass

Начнем с создания карты Sass, содержащей пары ключ-значение: контрольные точки будут ключами, а размеры шрифтов значениями.

```scss
$p-font-sizes: (
  null  : 15px,
  480px : 16px,
  640px : 17px,
  1024px: 19px
);
```

Исходя из того, что в первую очередь мы делаем дизайн для мобильных устройств, ключ `null` задает дефолтный размер шрифта (без медиа-запроса), затем идут все контрольные точки в восходящем порядке.

Затем добавим миксин, проходящий через эту карту и генерирующий медиа-запросы:

```scss
@mixin font-size($fs-map) {
  @each $fs-breakpoint, $fs-font-size in $fs-map {
    @if $fs-breakpoint == null {
      font-size: $fs-font-size;
    }
    @else {
      @media screen and (min-width: $fs-breakpoint) {
        font-size: $fs-font-size;
      }
    }
  }
}
```

Примечание: стоит упомянуть, что в этом миксине, также как и следующем, есть некоторая базовая программная логика.  Sass благодаря встроенному набору расширений [SassScript ](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#sassscript) делает возможными некоторые базовые конструкции программирования типа ветвления `if/else`, циклов `each` и многое другое. Я советую вам уделить некоторое время изучению [документации](http://sass-lang.com/documentation/file.SASS_REFERENCE.html). Программные возможности Sass откроют для вас новое измерение возможностей Sass.

Вам осталось только применить этот миксин к параграфам:

```scss
p {
  @include font-size($p-font-sizes);
}
```

Что даст нам в результате следующий CSS:

```css
p { font-size: 15px; }

@media screen and (min-width: 480px) {
  p { font-size: 16px; }
}
@media screen and (min-width: 640px) {
  p { font-size: 17px; }
}
@media screen and (min-width: 1024px) {
  p { font-size: 19px; }
}
```

Управление и отслеживание размеров шрифта для элементов стало намного легче. Для каждого элемента можно создать свою карту и добавлять ее значения с помощью миксина к соответствующему селектору:

```scss
$h1-font-sizes: (
  null  : 28px
  480px : 31px,
  640px : 33px,
  1024px: 36px
);

h1 {
  @include font-size($h1-font-sizes);
}
```

Это позволяет сохранять размеры шрифтов у разных элементов последовательными:

```scss
p, ul, ol {
  @include font-size($p-font-sizes);
}
```

## Решаем проблему фрагментации контрольных точек

Но подождите! А если мы захотим шрифт в параграфе, равный 17 пикселям и шрифт в основном заголовке (`h1`) равный 33 пикселям, на контрольной точке в 700 пикселей, а не 640? С решением выше нам потребуется вручную добавлять меди-запрос для 640 пикселей. Решая одну проблему, мы случайно создали другую: фрагментацию контрольных точек.

Если мы можем управлять размерами шрифтов в картах Sass, то сможем ли мы сделать то же и с контрольными точками? Сможем!

Давайте создадим карту для обычных контрольных точек и зададим каждому значению соответствующее имя. Мы также немного изменим карту с размерами шрифтов, использовав в ней названия контрольных точек из карты `$breakpoints`, чтобы установить между ними связь:

```scss
$breakpoints: (
  small : 480px,
  medium: 700px, // Previously 640px
  large : 1024px
);

$p-font-sizes: (
  null  : 15px,
  small : 16px,
  medium: 17px,
  large : 19px
);

$h1-font-sizes: (
  null  : 28px,
  small : 31px,
  medium: 33px,
  large : 36px
);
```

В качестве последнего шага, мы немного настроим миксин, производящий итерацию по карте с размерами шрифтов, теперь перед генерацией меди-запроса он будет использовать название контрольной точки, чтобы получить соответствующее значение из `$breakpoints`.

```scss
@mixin font-size($fs-map, $fs-breakpoints: $breakpoints) {
  @each $fs-breakpoint, $fs-font-size in $fs-map {
    @if $fs-breakpoint == null {
      font-size: $fs-font-size;
    }
    @else {
      // If $fs-font-size is a key that exists in
      // $fs-breakpoints, use the value
      @if map-has-key($fs-breakpoints, $fs-breakpoint) {
        $fs-breakpoint: map-get($fs-breakpoints, $fs-breakpoint);
      }
      @media screen and (min-width: $fs-breakpoint) {
        font-size: $fs-font-size;
      }
    }
  }
}
```

Примечание: дефолтной картой с контрольными точками для миксина является `$breakpoints`, если вы используете для своей карты другое имя, не забудьте поменять второй аргумент (`$fs-breakpoints: $breakpoints`).

Все! И как теперь нам добавить кастомную контрольную точку, отсутствующую в `$breakpoints`? В карте с размерами шрифтов добавьте значение этой контрольной точки (например, `900px`) в качестве ключа и миксин сделает всю работу за вас:

```scss
$p-font-sizes: (
  null  : 15px,
  small : 16px,
  medium: 17px,
  900px : 18px,
  large : 19px,
  1440px: 20px,
);

p {
  @include font-size($p-font-sizes);
}
```

Вся магия заключена в миксине, спасибо функции Sass [map-has-key](http://sass-lang.com/documentation/Sass/Script/Functions.html#map_has_key-instance_method). Она проверяет существует ли название ключа в `$breakpoints`: если существует, использует его, а если нет, то воспринимает ключ как кастомное значение, которое использует для построения медиа-запроса.

```css
p { font-size: 15px; }

@media screen and (min-width: 480px) {
  p { font-size: 16px; }
}
@media screen and (min-width: 700px) {
  p { font-size: 17px; }
}
@media screen and (min-width: 900px) {
  p { font-size: 18px; }
}
@media screen and (min-width: 1024px) {
  p { font-size: 19px; }
}
@media screen and (min-width: 1440px) {
  p { font-size: 20px; }
}
```

## Улучшаем вертикальный ритм, масштабируя высоту строки

Высота строки также важна для создания устойчивого вертикального ритма. Поэтому, давайте не уходя далеко сразу подключим ее к нашему решению.

Расширим карту с размерами шрифтов, теперь высота строки будет вместе с размером шрифтов будет составлять список значений для нужных ключей:

```scss
$breakpoints: (
  small : 480px,
  medium: 700px,
  large : 1024px
);

$p-font-sizes: (
  null  : (15px, 1.3),
  small : 16px,
  medium: (17px, 1.4),
  900px : 18px,
  large : (19px, 1.45),
  1440px: 20px,
);
```

Примечание: хотя значение для высоты строки можно задать в любых валидных CSS-единицах (проценты, пиксели, em и т.д.), [рекомендуется](https://css-tricks.com/almanac/properties/l/line-height/) использовать значения без указания единиц измерения, они являются [предпочтительными](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#Prefer_unitless_numbers_for_line-height_values) во избежание неожиданностей при наследовании.

Затем нам надо модифицировать наш миксин, чтобы он включил высоту строки в генерируемый CSS:

```scss
@mixin font-size($fs-map, $fs-breakpoints: $breakpoints) {
  @each $fs-breakpoint, $fs-font-size in $fs-map {
    @if $fs-breakpoint == null {
      @include make-font-size($fs-font-size);
    }
    @else {
      // If $fs-font-size is a key that exists in
      // $fs-breakpoints, use the value
      @if map-has-key($fs-breakpoints, $fs-breakpoint) {
        $fs-breakpoint: map-get($fs-breakpoints, $fs-breakpoint);
      }
      @media screen and (min-width: $fs-breakpoint) {
        @include make-font-size($fs-font-size);
      }
    }
  }
}

// Utility function for mixin font-size
@mixin make-font-size($fs-font-size) {
  // If $fs-font-size is a list, include
  // both font-size and line-height
  @if type-of($fs-font-size) == "list" {
    font-size: nth($fs-font-size, 1);
    @if (length($fs-font-size) > 1) {
      line-height: nth($fs-font-size, 2);
    }
  }
  @else {
    font-size: $fs-font-size;
  }
}+
```

Миксин проверяет, является ли значение ключа списком (размер шрифта, высота строки) или это просто значение размера шрифта. Если это список, то его значения извлекаются с помощью [функции nth](http://sass-lang.com/documentation/Sass/Script/Functions.html#nth-instance_method). Подразумевая, что первое значение это размер шрифта, а второе --- высота строки. Посмотрим на это в действии:

```scss
p {
  @include font-size($p-font-sizes);
}
```

Это простое правило генерирует следующий CSS:

```css
p { font-size: 15px; line-height: 1.3; }

@media screen and (min-width: 480px) {
  p { font-size: 16px; }
}
@media screen and (min-width: 700px) {
  p { font-size: 17px; line-height: 1.4; }
}
@media screen and (min-width: 900px) {
  p { font-size: 18px; }
}
@media screen and (min-width: 1024px) {
  p { font-size: 19px; line-height: 1.45; }
}
@media screen and (min-width: 1440px) {
  p { font-size: 20px; }
}
```

Это решение при желании можно легко расширить для работы с другими атрибутами --- насыщенностью шрифта, отступами и т.д. Нужно всего лишь модифицировать миксин `make-font-size ` и использовать функцию `nth` для извлечения значений из списка.

## Выводы

Существуют разные способы достижения отзывчивой типографики и устойчивого вертикального ритма --- мое решение не является единственным. Однако, оно неплохо показывает себя в работе.

Использование этого миксина скорее всего повлечет дубликацию медиа-запросов. Было много дискуссий о дубликатах медиа-запросов и группировке медиа-запросов, об использовании [директивы @extend вместо миксинов](https://tech.bellycard.com/blog/sass-mixins-vs-extends-the-data/), а также о производительности и размере файлов --- однако все тесты свелись к тому, что [разница минимальная даже в худших случаях и незаметная в остальных ](http://sasscast.tumblr.com/post/38673939456/sass-and-media-queries).

Я также замечу, что мое решение не фундаментально (оно не обрабатывает диапазоны медиа-запросов, максимальную ширину или ориентацию области экрана). Эти возможности можно реализовать в миксине (туда же можно добавить конвертацию пикселов в `em`), но я предпочитаю писать комплексные медиа-запросы вручную. Не забывайте, что вы можете использовать [функцию map-get](http://sass-lang.com/documentation/Sass/Script/Functions.html#map_get-instance_method) для извлечения значений из существующих карт.

## Альтернативы

[Viewport Units](https://css-tricks.com/viewport-sized-typography/)  (`vh`, `vw`, `vmin` и `vmax`) также можно использовать для создания отзывчивой типографики:

![изменение размера окна с Viewport Units - большой экран](/images/development/vh-header-big.gif "Viewport Units - большой экран")
![изменение размера окна с Viewport Units - маленький экран](/images/development/vh-header-small.gif "Viewport Units - маленький экран")

*Образец действия Viewport Units. Один Viewport Unit = 1% от ширины области экрана (Viewport). Для 1000 пикселей, `1vw = 10px`; для 500 пикселей, `1vh = 5px`*

Viewport Units могут использоваться для [создания отзывчивых заголовков](http://demosthenes.info/blog/739/Creating-Responsive-Hero-Text-With-vw-Units). Однако, так как текст с ними масштабируется к ширине или высоте области экрана (а не к размеру страницы или ее фрагмента), а в CSS отсутствуют значения минимума и максимума для размера шрифта, Viewport Units не подходят для основного текста --- независимо от выбранного вами размера этот шрифт будет или очень большим или очень маленьким на крайних размерах экрана, что в итоге требует использования все тех же медиа-запросов.

Библиотека [FitText.js](http://fittextjs.com/) делает ту же работу, делая размеры заголовков однострочными на любых экранах. Этого же можно добиться, используя в заголовке SVG.

Ну и нельзя не упомянуть [Эрика Ван Блокланда](https://twitter.com/letterror) и его разработки по [отзывчивой типографике](http://letterror.com/dev/mathshapes/page_20_Excellence.html), такие как буквы, изменяющиеся при изменении размера области экрана с учетом имеющегося пространства.

## Дополнительные ресурсы

[Modular Scale](http://www.modularscale.com/) это отличный инструмент для создания отзывчивой типографики. Также нельзя не отметить отличную статью Сары Свайдан о [техниках отзывчивой типографики](http://tympanus.net/codrops/2013/11/19/techniques-for-responsive-typography/).
