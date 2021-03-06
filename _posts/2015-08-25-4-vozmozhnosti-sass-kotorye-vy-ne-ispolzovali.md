---
layout: post
title: "4 возможности Sass, которые вы не использовали"
date: 2015-08-25 19:43:00
categories: [development]
tags: [sass, translation, sitepoint]
description: "Комментарии Sass, локальные и глобальные переменные, плейсхолдеры и использование амперсанда."
original: "http://www.sitepoint.com/sass-features-may-never-tried/"
original_author: "М.Дэвид Грин"
original_title: "4 Sass Features You May Not Have Tried"
prism: yes
thumbnail: noimage
---
После того, как вы начинаете менять рабочее окружение для работы с SASS, нелегко расстаться с привычными рабочими стереотипами. Вам могут нравится возможности SASS и вы активно используете некоторые из них, не пытаясь освоить более продвинутые. На самом деле возможности SASS намного больше и применение более продвинутых фич дает вам большие преимущества.

##  1. CSS и строчные комментарии

Когда вы стилизуете страницу, вы можете включить комментарии в ваш CSS, чтобы те, кто будет работать с ней после вас сразу во всем разобрались. В зависимости от сложности и специфики вашего CSS эти комментарии должны решить проблему погружения в ваш код для любого человека через любое время и, возможно, этим человеком будете вы, вернувшись к проекту через длительное время.

Sass дает возможность оставлять обычные CSS комментарии, начинающиеся с `/*` и заканчивающиеся `*/`. В такие комментарии можно включать несколько строчек текста и останутся в том же виде в итоговом CSS. Поэтому SASS откоментированный следующим образом:

```scss
a {
  color: #ccc;
  &.halloween {
    /* This is for seasonal links */
    color: #ff8c00;
  }
}
```

Преобразуется в следующий CSS:

```css
a {
  color: #ccc;
}

a.halloween {
  /* This is for seasonal links */
  color: #ff8c00;
}
```

SASS также позволяет включать строчные комментарии, которые специфичны именно для SASS. В отличие от комментариев CSS, они не будут отображаться в скомпилированном коде. Строчный комментарий начинается с двойного слэша --- `//`.

```scss
a {
  color: #ccc;
  &.halloween {
  // Chosen colour below after trying #ff8d00, #ff8b00 & ff8a00.
  /* This is for seasonal links */
  color: #ff8c00;
  }
}
```

После компиляции в CSS, в коде останется только многострочный комментарий:

```css
a {
  color: #ccc;
}

a.halloween {
  /* This is for seasonal links */
  color: #ff8c00;
}
```

## 2. Локальные и глобальные переменные

Управление пространством имен это один из самых сложных аспектов любого языка, SASS здесь не исключение. SASS позволяет создавать глобальные и локальные переменные и переопределять их при необходимости.

Глобальные переменные в SASS обычно используются для семантических названий  цветов. Например, вверху основного файла SASS можно определить `$color_success` как цвет для текста сообщений об успешном выполнении чего-либо, который может наследовать и модифицироваться многими селекторами.

```scss
//defining a global success color
$color_success: #090;

.state_success {
  color: lighten($color_success, 50%);
  background-color: $color_success;
}
```

Сгенерированный CSS:

```css
.state_success {
  color: #9f9;
  background-color: #090;
}
```

Переменная `$color_success `является глобальной, потому что она была определена вне селекторов и поэтому она будет действовать во всех пространствах имен. Но так как это не константа, вы можете в любое время изменить ее значение, и это значение будет влиять на все селекторы, в которых эта переменная используется после переопределения. Для примера, следующий селектор, использующий переменную `$color_success`:

```scss
state_success_particular {
  //overriding the global success color locally
  $color_success: #900;
  color: lighten($color_success, 50%);
  background-color: $color_success;
}
```
В сгенерированном CSS переменная `$color_success` примет новое значение:

```css
.state_success_particular {
  color: #f99;
  background-color: #900;
}
```

В данном случае мы изменили значение глобальной переменной в локальном окружении. Поэтому любой следующий селектор будет получать значение первоначальное глобальное значение. А если поменять значение глобальной переменной вне селектора, например:

```scss
//Overriding earlier globals globally (a bad idea)
$color_success: #900;

.state_success_particular {
  color: lighten($color_success, 50%);
  background-color: $color_success;
}
```

Это изменит значение этой переменной для всех использующих ее селекторов. Но это плохая идея, так как одна и та же переменная будет иметь разное значение для разных селекторов в зависимости от их расположения в коде. Учитывайте эти особенности, изменения глобальной переменной внутри селектора будет влиять только на этот селектор.

## 3. Плэйсхолдеры для расширений

Сохранение вашего SASS-кода чистым это благо для разработки. SASS позволяет вкладывать селекторы ради избежания повторения кода, но за это приходиться  платить лишней вложенностью селекторов CSS. Создание миксинов отлично подходит для включения готовых наборов стилей к селекторам, но они чрезмерно увеличивают итоговый размер CSS. Обе эти техники удобны, но использовать их надо осторожно, чтобы сохранять свой CSS компактным и эффективным.

К счастью, SASS позволяет разработчикам расширять существующие селекторы, применяя весь набор стилей от одного селектора к другому с помощью команды `@extend`. К примеру, следующий код применяет стили селектора `.prominent` к еще нескольким селекторам:

```scss
.prominent {
  font-style: bold;
  font-size: 1.5rem;
}

.important {
  color: #900;
  @extend .prominent;
}

.notice {
  color: #090;
  @extend .prominent;
}
```

Скомпилированный CSS:

```css
.prominent, .important, .notice {
  font-style: bold;
  font-size: 1.5rem;
}

.important {
  color: #900;
}

.notice {
  color: #090;
}
```
Но если вы хотите создать наборы стилевых правил и не хотите создавать отдельные селекторы в вашем CSS для них, SASS предоставляет вам плэйсхолдеры для селекторов. Они определяются также как и селекторы класса, только вместо точки в начале селектора используется символ процента. Образец:

```scss
%prominent {
  font-style: bold;
  font-size: 1.5rem;
}

%subtle {
  font-style: regular;
  font-size: 0.75rem;
}

.important {
  color: #900;
  @extend %prominent;
}

.notice {
  color: #090;
  @extend %prominent;
}
```

Этот код генерирует CSS без каких либо упоминаний `%prominent` или `%subtle`, но с применением их стилей:

```css
.important, .notice {
  font-style: bold;
  font-size: 1.5rem;
}

.important {
  color: #900;
}

.notice {
  color: #090;
}
```

В данном примере мы не использовали селектор `%subtle`, поэтому он не оказался в скомпилированном коде и наш CSS не увеличился в размере.

Важно отметить, что расширение стилей при использовании глобальных переменных работает путем добавления селекторов к базовому стилю, а не дубликацией кода. Это значит, что первоначально значение глобальной переменной в экстенде будет действовать даже если ее переопределить локально:

```scss
$color_highlight: #090;

%prominent {
  color: $color_highlight;
  font-style: bold;
  font-size: 1.5rem;
}

.important {
  @extend %prominent;
}

.notice {
  $color_highlight: #900;
  @extend %prominent;
}
```

В скомпилированном коде, переопределение экстенда в классе .notice не отражается:

```css
.important, .notice {
  color: #090;
  font-style: bold;
  font-size: 1.5rem;
}
```

##  4. Амперсанд для родительского селектора

Одна из базовых возможностей SASS, о которой узнают разработчики это амперсанд (&). Когда вы используете амперсанд перед селектором внутри набора правил, селектор прикладывается к родительскому, что особо удобно для псевдоклассов `:hover` или `::after`. И код SCSS:

```scss
.hoverable {
  color: #fff;
  &:hover {
    color: #ff0;
  }
}
```

Дает следующий CSS:

```css
.hoverable {
  color: #fff;
}

.hoverable:hover {
  color: #ff0;
}
```

Но это не единственное применение амперсанда. Когда вы помешаете амперсанд внутрь набора стилевых правил, стили класса , объявленного после амперсанда будут работать только если элемент с этим классом является потомком элемента, для которого написаны базовые правила. Иногда бывает нужно задать стиль, применяющийся лишь в определенных условиях. Например, мы хотим задать границу элементу `.hoverable` являющемуся потомком элемента `.special`:

```scss
.hoverable {
  color: #fff;
  &:hover {
    color: #ff0;
  }
}

.special .hoverable {
  border: 1px solid #f00;
}
```

Мы сделали это, задав отдельное правило для этого случая. И если это потребуется сделать для нескольких случаев, это будет уже более утомительным занятием.


Но с добавлением амперсанда мы делаем то же самое, не покидая пространство селектора `.hoverable`:

```scss
.hoverable {
  color: #fff;
  &:hover {
    color: #ff0;
  }
  .special & {
    border: 1px solid #f00;
  }
}
```

И соответствующий CSS:

```css
.hoverable {
  color: #fff;
}

.hoverable:hover {
  color: #ff0;
}

.special .hoverable {
  border: 1px solid #f00;
}
```

Вы видите, что сделала всего одна строчка с амперсандом? Sass заменил амперсанд родительским селектором, задав таким образом стили для `.hoverable` внутри `.special`.

Подумайте о том, как некоторые из этих идей могут вам помочь при разработке следующего проекта с Sass. Так как все это является частью ядра Sass, вы можете начать использовать это уже сейчас, получив возможность для более эффективной разработки.
