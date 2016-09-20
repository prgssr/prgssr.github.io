---
title: "Темизация с Sass: бесконечная история"
layout: post
categories: [development]
tags: [sass, translation, sitepoint]
date: 2016-09-20 20:30:15 +0300
prism: yes
description: "Хьюго Жирадель о 4 подходах к темизации на основе Sass"
original: "https://www.sitepoint.com/sass-theming-neverending-story/"
original_title: "Sass Theming: The Neverending Story"
original_author: "Хьюго Жирадель"
thumbnail: "noimage"
---

Создание сеточных систем и движков темизации в Sass это бесконечная история. Похоже, что в наши дни сеточных систем на основе Sass не меньше, чем фреймворков JavaScript и почти у каждого разработчика есть свой способ работы с цветовыми темами в стилях.

В сегодняшней статье, я хочу разобрать последнюю проблему и быстро показать пару способов создания цветовых схем в Sass. Но перед тем как идти дальше разберемся с предметом статьи.

Предположим, у нас есть компонент, такой как классический [медиа-объект](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/). Теперь попробуем применить к нему различные цветовые схемы, например, отдельную палитру к каждой категории. Для категории А у нашего объекта будет красный заголовок и граница красного оттенка, а для категории B будет использоваться палитра с синими цветами.

Наконец, предположим, что у вас не две темы, а дюжина, с множеством цветовых вариантов для компонента. Вы пришли к логичному выводу, что управлять этим вручную совсем непрактично и это именно тот  случай, когда нужна автоматизация при помощи инструментов. В данном случае в роли инструмента выступает Sass.

OK, теперь мы готовы. Обсуждать категории несколько скучно, поэтому наши темы будут  представлять  драконов и единорогов. Любой из наших подходов будет основываться на использовании ассоциативного массива с темами. Каждая тема это ассоциативный массив, содержащий ключи, связанные с используемыми цветами.

```scss
$themes: (
  'unicorn': (
    'primary': hotpink,
    'secondary': pink
  ),
  'dragon': (
    'primary': firebrick,
    'secondary': red
  )
) !default;
```

Каждая из наших тем состоит из двух цветов: первого (primary) и второго (secondary).  Мы могли назвать их по-другому, например, альфа и бета, это не имеет значения. Смысл состоит в возможности извлекать соответствующие  цвета темы.


## Как на самом деле работает темизация?

Конечно, для этого есть много способов, но обычно тема это всего лишь класс, привязанный к определенным стилям. Класс может добавляться к элементу `body` или конкретным компонентам для темизации только небольшого модуля, как мы рассмотрели чуть раньше.

В целом, в ваших таблицах стилей может быть один из двух вариантов:

```scss
.theme-class .component {
  /* Стиль для компонента, потомка элемента с классом `.theme-class` */
}

.component.theme-class {
  /* Стиль для компонента с классом `.theme-class` */
}
```

## Подход на основе индивидуальных миксинов

Начнем с самого простого и, наверное, моего любимого подхода на основе индивидуальных миксинов. Проще говоря, у вас есть пара миксинов, в названии которых указаны свойства, которые они стилизуют. Например, `theme-color` для темизации свойства  `color` или `theme-background-color` для темизации цвета фона.

Использование этих миксинов будут выглядеть примерно так:

```scss
/**
 * Медиа-объект
 * 1. В качестве border-color используем второй цвет темы
 */
.media {
  margin: 15px;
  padding: 15px 0;
  border-top: 5px solid;
  float: left;
  @include border-color('secondary'); /* 1 */
}

/**
 * Название медиа-объекта
 * 1. В качестве цвета названия используем первый цвет темы
 */
.media__title {
  font-size: 1em;
  margin: 0 0 10px;
  @include color('primary'); /* 1 */
}
```

Согласитесь, этот код выглядит элегантно. Кроме того, его смысл очевиден даже без комментариев.

**Код**

Давайте посмотрим, как это сделать. Мы не собираемся повторять логику кода внутри каждого индивидуального миксина, поэтому нам нужен приватный миксин, чтобы собрать все это и затем использовать внутри каждого последующего миксина.

```scss
/// Миксин Themify 
/// @access private
/// @author Hugo Giraudel
/// @param {String} $property - темизируемое свойство
/// @param {String} $key - ключ цвета, используемого из темы
/// @param {Map} $themes [$themes] - ассоциативный массив с темами
@mixin themify($property, $key, $themes: $themes) {
  // Проход по темам
  @each $theme, $colors in $themes {
    // Создание селектора (типа `.media.theme-unicorn, .theme-unicorn .media`)
    &.theme-#{$theme},
    .theme-#{$theme} & {
      // Вывод декларации
      #{$property}: map-get($colors, $key);
    }
  }
}
```

И публичный API:

```scss
/// Темизация цвета шрифта с помощью миксина `themify` 
/// @access public
/// @see {mixin} themify
@mixin color($arguments...) {
  @include themify('color', $arguments...);
}

/// Темизация цвета границы элемента с помощью миксина `themify` 
/// @access public
/// @see {mixin} themify
@mixin border-color($arguments...) {
  @include themify('border-color', $arguments...);
}

/// Темизация цвета фона элемента с помощью миксина `themify` 
/// @access public
/// @see {mixin} themify
@mixin background-color($arguments...) {
  @include themify('background-color', $arguments...);
}
```

Все! Возвращаясь к нашему предыдущему примеру, вот как будет выглядеть полученный CSS:

```css
.media {
  margin: 15px;
  padding: 15px 0;
  border-top: 5px solid;
  float: left;
}

.media.theme-unicorn,
.theme-unicorn .media {
  border-color: pink;
}

.media.theme-dragon,
.theme-dragon .media {
  border-color: red;
}

.media__title {
  font-size: 1em;
  margin: 0 0 10px;
}

.media__title.theme-unicorn,
.theme-unicorn .media__title {
  color: hotpink;
}

.media__title.theme-dragon,
.theme-dragon .media__title {
  color: firebrick;
}
```

**Плюсы**

* Благодаря именованию миксинов на основе стилизуемых свойств, API остается ясным и чистым даже у неопытного разработчика.

**Минусы**

* Этот подход использует несколько миксинов вместо одного — это можно рассматривать как излишнюю сложность. Но можно и не рассматривать, так как большинство из них просто клоны.
* Так как цвета извлекаются напрямую из ассоциативного массива на основе ключей, ими нельзя манипулировать с помощью цветовых функций типа `lighten` или `mix`.  Хотя это можно сделать с расширенной версией миксина.

## Подход на основе блочного миксина

Подход с блочным миксином использует единственный миксин вместо нескольких и основан на использовании директивы `@content` (подробнее об этой директиве можно почитать в [документации](http://sass-scss.ru/documentation/miksini/bloki_kontenta_v_miksinah.html) или в [статье Красимира Цонева](http://krasimirtsonev.com/blog/article/SASS-content-directive-is-a-wonderful-thing)). Его использование будет выглядеть примерно так:

```scss
/**
 * Медиа-объект
 * 1. Указываем для border-color второй (secondary ) цвет темы
 */
.media {
  margin: 15px;
  padding: 15px 0;
  border-top: 5px solid;
  float: left;
  @include themify {
    border-color: $color-secondary; /* 1 */
  }
}

/**
 * Название медиа-объекта
 * 1. Указываем в качестве цвета заголовка первый (primary) цвет темы
 */
.media__title {
  font-size: 1em;
  margin: 0 0 10px;
  @include themify {
    color: $color-primary; /* 1 */
  }
}
```

**Код**

Идея проста: вывести два цвета как переменные внутри миксина `themify`. Проблема заключается в том, что мы не можем сделать это чисто. Переменные, заданные внутри миксина, недоступны контенту переданному с помощью `@content`:

>Блок контента, переданный в миксин, обрабатывается в той области видимости, в которой задан блок, а не в области видимости миксина. Это значит, что локальные переменные миксина нельзя использовать вместе с переданным блоком стилей, так как будут браться значения глобальных переменных.

Для обхода этого ограничения нам нужно использовать хак. Этот обходной способ не сложен: перед выводом `@content`, мы задаем одну глобальную переменную для каждого цвета в теме, а после вывода `@content` сбрасываем эти переменные. Таким образом они будут доступны только в вызове `themify`.

```scss
// Инициализируем наши переменные как `null`, таким образом,
// при использовании вне `themify`, они ничего не выведут.
$color-primary: null;
$color-secondary: null;

/// Миксин Themify 
/// @author Hugo Giraudel
/// @param {Map} $themes [$themes] - ассоциативный массив с темами
@mixin themify($themes: $themes) {
  // Проход по темам
  @each $theme, $colors in $themes {
    // Создание селектора (типа `.media.theme-unicorn, .theme-unicorn .media`)
    &.theme-#{$theme},
    .theme-#{$theme} & {
      // Задание переменных темы как глобальных с `!global`
      $color-primary: map-get($colors, 'primary') !global;
      $color-secondary: map-get($colors, 'secondary') !global;

      // Вывод пользовательского контента
      @content;

      // Глобальное отключение переменных темы с  `!global`
      $color-primary: null !global;
      $color-secondary: null !global;
    }
  }
}
```

Итоговый CSS из примера будет выглядеть также, как и при первом подходе.

**Плюсы**

* В противоположность решению с индивидуальными миксинами, блочный миксин дает возможность манипулировать цветами с помощью функций, так как у нас есть прямой доступ к цветам. сохраненным в переменных темы.
* Я чувствую, что API остается ясным с таким подходом, особенно с учетом того, что внутри миксинов находятся действующие декларации CSS — некоторым людям их проще понять.

**Минусы**

* Такое использование глобальных переменных является хаком. Можно на этом не заморачиваться, хотя качество кода не относится к достоинствам этого подхода.

## Большой миксин со всеми стилями темы

Об этом подходе я уже [писал на Sitepoint  в 2014 году](http://www.sitepoint.com/dealing-color-schemes-sass/). Идея состоит в том, чтобы сделать один большой миксин, который вы обновляете каждый раз, когда вам нужно что-то темизировать.

Это означает, что этот миксин одинаков для всех компонентов в проекте. Если вы хотите сделать новый компонент темизируемым каким-либо образом, вам надо открыть файл с миксином `themify` и добавить в него пару дополнительных правил.

```sass
// Где-то внутри проекта, миксин `themify`
@mixin themify($theme, $colors) {
  // См раздел `Код`
} @include themify;

/**
 * Медиа-объект
 */
.media {
  margin: 15px;
  padding: 15px 0;
  border-top: 5px solid;
  float: left;
}

/**
 * Название медиа-объекта
 */

.media__title {
  font-size: 1em;
  margin: 0 0 10px;
}

@each $theme, $colors in $themes {
  @include themify($theme, $colors);
} 

```


**Код**


```scss
/// Миксин Themify
/// @author Hugo Giraudel
/// @param {String} $theme - тема 
/// @param {Map} $colors - цвета темы
@mixin themify($theme, $colors) {
  // вывод селектора темы
  .theme-#{$theme} {
    // Создание двух вариантов селектора
    // т.е. `.theme .component, .theme.component`
    .media,
    &.media {
      border-color: map-get($colors, 'primary');
    }

    .media__title
    &.media__title {
      color: map-get($colors, 'secondary');
    }
  }
}
```

**Плюсы**

* Так как содержимое миксина поддерживается вручную, мы получаем высокую гибкость селекторов. Вы можете делать практически все, что захотите.
* По той же причине у вас появляется возможность манипулирования цветами при помощи функций типа `darken`.

**Минусы**

* Так как все, что темизируется мы храним в содержимом миксина, это не очень хорошо работает при модульном подходе. Это может быть неплохо на небольших и средних проектах с глобальными стилями.
* Расположение стилей компонента в нескольких местах может запутать, например, в стилях модуля и в миксине темы.

## Подход на основе классов

Подход на основе классов это на самом деле подход на основе DOM. Идея состоит в том, чтобы вместо добавления стилей темы из таблиц стилей добавлять имена классов в разметку типа `border-color-primary`. Эти классы, сгенерированные при помощи Sass ничего не делают сами по себе, а применяют стили при использовании в сочетании с нашими классами  `theme-$theme`.

Вы может узнать больше об этой системе из [статьи Гарри Робертса](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/#theme-namespaces-t-).

```html
<div class="media  theme-unicorn  border-color-primary">
  <img class="media__image" src="http://lorempixel.com/100/100" />
  <h2 class="media__title  color-secondary">This is the headline</h2>
  <p class="media__content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident nulla voluptatibus quisquam tenetur quas quidem, repudiandae vel beatae iure odit odio quae.</p>
</div>
```


```scss
// Где-то внутри проекта (однажды)
@mixin themify($themes: $themes) {
  // См раздел `Код` 
} @include themify($themes);

/**
 * Медиа-объект
 */
.media {
  margin: 15px;
  padding: 15px 0;
  border-top: 5px solid;
  float: left;
}

/**
 * Название медиа-объекта
 */
.media__title {
  font-size: 1em;
  margin: 0 0 10px;
}
```

**Код**

```scss
/// Миксин Themify 
/// @param {Map} $themes [$themes] - Ассоциативный массив с темами
@mixin themify($themes: $themes) {
  // Темизируемые свойства, можно добавиь еще (типа `border-left-color`)
  $properties: ('border-color', 'background-color', 'color');

  // Проход по темам
  @each $theme, $colors in $themes {
    // Проход по цветам темы
    @each $color-name, $color in $colors {
      // Проход по свойствам
      @each $property in $properties {
        // Создание селектора
        // типа `.theme .color-primary, .theme.color-primary`
        .theme-#{$theme} .#{$property}-#{$color-name},
        .theme-#{$theme}.#{$property}-#{$color-name} {
          #{$property}: $color;
        }
      }
    }
  }
}
```

Полученный CSS:

```css
.theme-unicorn .border-color-primary,
.theme-unicorn.border-color-primary {
  border-color: hotpink;
}

.theme-unicorn .background-color-primary,
.theme-unicorn.background-color-primary {
  background-color: hotpink;
}

.theme-unicorn .color-primary,
.theme-unicorn.color-primary {
  color: hotpink;
}

.theme-unicorn .border-color-secondary,
.theme-unicorn.border-color-secondary {
  border-color: pink;
}

.theme-unicorn .background-color-secondary,
.theme-unicorn.background-color-secondary {
  background-color: pink;
}

.theme-unicorn .color-secondary,
.theme-unicorn.color-secondary {
  color: pink;
}

.theme-dragon .border-color-primary,
.theme-dragon.border-color-primary {
  border-color: firebrick;
}

.theme-dragon .background-color-primary,
.theme-dragon.background-color-primary {
  background-color: firebrick;
}

.theme-dragon .color-primary,
.theme-dragon.color-primary {
  color: firebrick;
}

.theme-dragon .border-color-secondary,
.theme-dragon.border-color-secondary {
  border-color: red;
}

.theme-dragon .background-color-secondary,
.theme-dragon.background-color-secondary {
  background-color: red;
}

.theme-dragon .color-secondary,
.theme-dragon.color-secondary {
  color: red;
}
```

Может показаться, что мы генерируем слишком много CSS, но эти стили  вы можете использовать многократно внутри проекта, поэтому результат не так уж и плох.

**Плюсы**

* Это решение обладает преимуществом, так как основано на DOM, что дает интересные возможности по манипулированию темами на лету при помощи JavaScript. Конечно, ведь нам остается только добавлять или удалять классы у элементов, это очень удобно.
* Хотя вывод миксина `themify`  выглядит большим он на самом деле реализует DRY, так как каждый темизируемый цвет текста,  границы, фона или чего-то еще применяется через классы.

**Минусы**

* В некоторых случаях подход на основе DOM нельзя корректно реализовать,  если разметка сделана не вручную (CMS, контент, сгенерированный пользователем...).

## Заключение

Я уверен, что забыл дюжину других способов применения стилей темы в Sass, но я думаю, что эти 4 различных варианта раскрывают большую часть темы. Что до меня, то я бы выбрал подход с индивидуальными миксинами или же подход на основе DOM, если нам хочется добиться модульности (что всегда хорошо).



