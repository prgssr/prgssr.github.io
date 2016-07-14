---
title: Плитка Sitepoint&#58; практическая реализация
layout: post
categories: [development]
tags: [css, translation, sitepoint]
date: 2016-07-14 20:32:07 +0300
prism: yes
description: "Реализация плитки Sitepoint в виде независимых темизируемых компонентов на основе флексбокса"
original: "https://www.sitepoint.com/sitepoints-tiles-a-case-study/"
original_title: "SitePoint’s Tiles: A Case Study in Components, Theming and Flexbox"
original_author: "Хьюго Жирадель"
thumbnail: "/images/development/flex/14666862827HJARw4-1024x599.png"
scripts: codepen
---

![Плитка Sitepoint](/images/development/flex/14666862827HJARw4-1024x599.png){: itemprop="image"}

Я долгое время сотрудничаю с  SitePoint и мне всегда нравился дизайн их плиток с карточками статей. В них есть вся необходимая информация о статьях: название, автор, дата, категория и даже метрики популярности (количество комментариев и лайков).

Я решил, что такая плитка является интересным компонентом для построения, как в части HTML, так и в части CSS. В этой статье шаг за шагом мы построим этот компонент, попытавшись добиться максимума: доступности, поддерживаемости, темизации и адаптированности к SEO.

## Начинаем с контента

Компонент всегда стоит создавать в следующем порядке: сначала содержимое, затем разметка, потом стили и, наконец, JavaScript (если он нужен). Мы не будем отклоняться от этого правила и начнем с контента.

```markup
HTML & CSS

8 comments

A Tale of CSS and Sass Precision

by Hugo Giraudel

May 12, 2016

```

Теперь мы можем начать оборачивать наш контент тегами HTML. В роли главного контейнера выступит элемент `<article>`, мне кажется, что это его корректное использование. Внутри основного контейнера будут размещены контейнер для верхней части, контейнер для названия статьи (хотя он и не обязателен) и футер с метаданными.

```html
<article class="c-article-tile">
  <div class="c-article-tile__header">
    HTML & CSS

    8 comments
  </div>
  <div class="c-article-tile__body">
    A Tale of CSS and Sass Precision
  </div>
  <footer class="c-article-tile__footer">
    by Hugo Giraudel

    May 12, 2016
  </footer>
</article>
```

Примечание: мы используем [именование классов на основе BEM](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/) с [пространствами имен](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/) — вы можете свободно использовать то, что предпочитаете.

Далее нам нужны субконтейнеры для наших элементов. Один для категории, один для счетчика комментариев, тег заголовка для названия, контейнер для автора и еще один для даты. Также добавим ссылки.

```html
<article class="c-article-tile">
  <!-- Tile header -->
  <div class="c-article-tile__header">
    <a class="c-article-tile__category"
       href="https://www.sitepoint.com/html-css/">
      HTML & CSS
    </a>
    <a class="c-article-tile__comment-count"
       href="https://www.sitepoint.com/a-tale-of-css-and-sass-precision/#comments">
      8 comments
    </a>
  </div>

  <!-- Tile body -->
  <div class="c-article-tile__body">
    <h2 class="c-article-tile__title">
      <a href="https://www.sitepoint.com/a-tale-of-css-and-sass-precision/">
        A Tale of CSS and Sass Precision
      </a>
    </h2>
  </div>

  <!-- Tile footer -->
  <footer class="c-article-tile__footer">
    <span class="c-article-tile__author">
      by
      <a href="https://www.sitepoint.com/author/hgiraudel/">
        Hugo Giraudel
      </a>
    </span>
    <time class="c-article-tile__date"
          datetime="2016-05-12T12:00">
      May 12, 2016
    </time>
  </footer>
</article>
```


Выглядит неплохо! Несколько важных моментов:

* мы не используем элемент `<header>` для верхней части, так как в этом теге обычно содержится заголовок, а это не наш случай;
* мы используем элементы `<span>` вместо `<p>`, так как у нас нет контента, соответствующего параграфу;
* мы используем элемент  `<time>` и его атрибут `datetime` вместо `<span>` [для описания даты](https://developer.mozilla.org/en/docs/Web/HTML/Element/time).

Давайте заменим слово `comments`  иконкой, созданной с учетом требований доступности. Я не буду углубляться в объяснения, если вы хотите узнать больше о методике, читайте статью  [A Working SVG Workflow for Accessible Icons](https://www.sitepoint.com/a-working-svg-workflow-for-accessible-icons/).

```html
<svg style="display: none">
  <symbol id="icon-bubble" viewBox="0 0 32 32">
    <path class="path1" d="M16 2c8.837 0 16 5.82 16 13s-7.163 13-16 13c-0.849 0-1.682-0.054-2.495-0.158-3.437 3.437-7.539 4.053-11.505 4.144v-0.841c2.142-1.049 4-2.961 4-5.145 0-0.305-0.024-0.604-0.068-0.897-3.619-2.383-5.932-6.024-5.932-10.103 0-7.18 7.163-13 16-13z"></path>
  </symbol>
</svg>

<!-- … -->

<a class="c-article-tile__comment-count"
   href="https://www.sitepoint.com/a-tale-of-css-and-sass-precision/#comments">
  8
  <svg class="icon icon-bubble"
       aria-label="comments">
    <use xlink:href="#icon-bubble"></use>
  </svg>
</a>
```

Обратите внимание, как используется атрибут `aria-label` — благодаря ему иконка становится доступной для пользователей вспомогательных технологий.

Наконец, мы можем добавить [микроразметку](https://www.w3.org/TR/microdata/) в наш код, чтобы облегчить обход и индексацию содержимого поисковыми роботами. Мы будем использовать [описание статей с  Schema.org](http://schema.org/Article):

```html
<article class="c-article-tile"
         itemscope
         itemtype="http://schema.org/Article">
  <!-- Tile header -->
  <div class="c-article-tile__header">
    <a class="c-article-tile__category"
       href="https://www.sitepoint.com/html-css/"
       itemprop="keywords">
      HTML & CSS
    </a>
    <a class="c-c-article-tile__comment-count"
       href="https://www.sitepoint.com/a-tale-of-css-and-sass-precision/#comments"
       itemprop="commentCount">
      8
      <svg class="icon icon-bubble"
           aria-label="comments">
        <use xlink:href="#icon-bubble"></use>
      </svg>
    </a>
  </div>

  <!-- Tile body -->
  <div class="c-article-tile__body">
    <h2 class="c-article-tile__title"
        itemprop="headline">
      <a href="https://www.sitepoint.com/a-tale-of-css-and-sass-precision/">
        A Tale of CSS and Sass Precision
      </a>
    </h2>
  </div>

  <!-- Tile footer -->
  <footer class="c-article-tile__footer">
    <span class="c-article-tile__author">
      by
      <a href="https://www.sitepoint.com/author/hgiraudel/"
         itemprop="author">
        Hugo Giraudel
      </a>
    </span>
    <time class="c-article-tile__date"
          datetime="2016-05-12T12:00"
          itemprop="datePublished">
      May 12, 2016
    </time>
  </footer>
</article>
```

Перед тем как перейти к стилям, я хотел бы  сказать несколько слов об инкапсуляции компонента и правильной реализации дизайна. Компонент по определению должен быть многократно используемым. В контексте отзывчивого дизайна это означает *отсутствие фиксированных измерений и интервалов*, поэтому позволим ему свободно занимать пространство его контейнера.

Это означает, что контейнер сам по себе заключает некоторые границы для инкапсулируемого компонента. В нашем случае контейнер должен быть элементом списка, частью компонента-списка, предназначенного для вывода плиток (или карточек или чего-то еще).

Вот как может выглядеть этот компонент-список:

```html
<ul class="c-tile-list">
  <li class="c-tile-list__item">
    <article class="c-article-tile">…</article>
  </li>

  <li class="c-tile-list__item">
    <article class="c-article-tile">…</article>
  </li>

  <li class="c-tile-list__item">
    <article class="c-article-tile">…</article>
  </li>
</ul>
```

На этой стадии мы полностью разобрались с разметкой. Она чистая, доступная и адаптированная к SEO — больше ничего и не надо. Займемся стилями!

## Добавляем стили

В части CSS мы предполагаем [правильную блочную модель для всех элементов](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/). Также мы активно используем флексбокс, потому что, как же иначе?

### Компонент контейнера для списка

Наш компонент-список очень прост, поэтому не нуждается в особых стилях. Он должен обеспечить подобие сетки для наших плиток, обработать пространство между плитками и обеспечить их равную высоту и размещение на одной линии. Это не проблема для флексбокса.

```css
/**
 * 1. Reset default list styles
 * 2. Flexbox used for a grid-like layout for the tiles.
 */
.c-tile-list {
  list-style: none; /* 1 */
  margin: 0; /* 1 */
  padding: 0; /* 1 */
  display: flex; /* 2 */
  flex-wrap: wrap; /* 2 */
}
```

И теперь элементы списка:

```css
/**
 * 1. Flexbox used for equal-height tiles on a same line.
 * 2. Make sure a time never looks distorded.
 * 3. Spacing between tiles.
 */
.c-tile-list__item {
  display: flex; /* 1 */
  flex-direction: column; /* 1 */
  flex: 0 0 300px; /* 2 */
  margin: 10px; /* 3 */
}
```

### Компонент карточки статьи

Теперь перейдем к основному вопросу: компоненту плитки с карточкой статьи. Здесь нужно добавить стили ко многим элементам, начиная с самой плитки.

Как упоминалось ранее, у плитки не должно быть фиксированных измерений, ее размеры должны определяться размерами родительского контейнера. Мы также будем использовать саму плитку в качестве флекс-контейнера, это позволит выровнять ее футер по ее низу, вне зависимости от расчитанной высоты плитки.

```css
/**
 * 1. Make it possible to bottom align the footer in a tile that has a minimum
 *    height.
 * 2. Make sure the tile spread across the full height of the parent if inside
 *    a flex container.
 */
.c-article-tile {
  display: flex; /* 1 */
  flex-direction: column; /* 1 */
  flex: 1 0 auto; /* 2 */
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 255, 255);
}
```

Мы можем продвинуться на уровень глубже и добавить стили к суб-контейнерам (хедеру, основному содержанию и футеру) карточки. Они нужны для горизонтальных внутренних отступов и для упрощения дальнейшего позиционирования, поэтому мы   делаем каждый субконтейнер флекс-контейнером.

```css
.c-article-tile__header,
.c-article-tile__body,
.c-article-tile__footer {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
}
```

Контент в хедере и футере должен быть немного меньше размером, так как это метаданные, которые не должны занимать много пространства. Соответственно, мы  уменьшим размер шрифта в этих субконтейнерах:

```css
.c-article-tile__header,
.c-article-tile__footer {
  font-size: 80%;
}
```

Мы заложили основу для наших контейнеров. Теперь перейдем к непосредственно стилям, начнем с хедера. Ему нужны вертикальные интервалы и нижняя граница, чтобы визуально он походил на заголовок.

```css
/**
 * 1. Rely on the `color` property for the border color by not setting any color
 *    value, making it super convenient for theming.
 */
.c-article-tile__header {
  padding-top: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid; /* 1 */
}
```

По умолчанию направлением флекс-контейнера является нужное нам `row`, поэтому мы не будем его явно задавать в стилях для субконтейнеров. Для выравнивания счетчика комментариев по правой стороне хедера есть два решения. Первое — это задать хедеру `justify-content: space-between` для размещения его элементов. Другое, которое мы будем использовать, это задать счетчику комментариев `margin-left: auto`, полагаясь на [тайну флексбокса](https://medium.com/@samserif/flexbox-s-best-kept-secret-bd3d892826b6#.hwuw69tah).

```css
/**
 * 1. Right align the comment count container in the header.
 */
.c-article-tile__comment-count {
  margin-left: auto; /* 1 */
}
```

Теперь хедер работает, как надо. Мы можем заняться основным содержимым и футером. Для основного содержимого нужны небольшой вертикальный интервал и немного стилей для типографики.

```css
.c-article-tile__body {
  padding-top: 20px;
  padding-bottom: 20px;
}

.c-article-tile__title {
  margin: 0;
  color: #333;
  font-size: 150%;
}
```

И, наконец, мы можем разобраться с футером, что для меня является наиболее интересной частью всей карточки. Для начала футер надо выровнять по нижней границе карточки.

Также футер всегда должен помещаться в одну строчку. К счастью, мы можем принудить его к этому с помощью `hite-space: nowrap`. Однако, мы не контролируем длину имени автора, поэтому нам надо обеспечить, что раскладка не поломается, если имя автора окажется слишком длинным. Я прекрасно знаю, что "обрезка символов это пло...", но в данном случае это меньшее из двух зол.

```css
/**
 * 1. Bottom align the footer in the tile.
 * 2. Prevent any content from the footer from wrapping, effectively forcing it
 *    on a single line at all time.
 */
.c-article-tile__footer {
  padding-top: 10px;
  padding-bottom: 15px;
  margin-top: auto; /* 1 */
  white-space: nowrap; /* 2 */
  color: #949494;
}

/**
 * 1. Prevent the author and the date from overlapping in case they both don’t
 *    fit on the line; add an ellipsis to the author name.
 * 2. Visually no effect when both the author and the date fit; however make
 *    sure they are slightly spaced from each other if they meet on the line.
 */
.c-article-tile__author {
  text-overflow: ellipsis; /* 1 */
  overflow: hidden; /* 1 */
  margin-right: 5px; /* 2 */
}

/**
 * 1. Right align the date container in the footer.
 */
.c-article-tile__date {
  margin-left: auto; /* 1 */
}
```

Вот мы и закончили с  раскладкой плитки. До завершения нам осталось сделать лишь одну вещь.

### Темизация

Вы, должно быть, заметили, что мы совсем ничего не сделали для темизации. Это сделано потому, что я считаю необходимым отделять раскладку компонента от цветовых схем: они служат разным целям и поэтому не могут (и не должны) обрабатываться вместе.

Когда мы переходим к темизации, я предпочитаю опираться на [независимые от компонентов классы с префиксом "t-"](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/#theme-namespaces-t-). Начнем с применения класса темы к нашей карточке:

```html
<article class="c-article-tile t-sass"
         itemscope
         itemtype="http://schema.org/Article">
  …
</article>
```

Теперь мы можем применять стили к карточке на основе этого класса. Мы зададим цвет для текста карточки и ссылок в ней. Это повлияет на цвет границы хедера, но не на цвет футера, цвет которого  (`#949494`) уже задан.

```css
.c-article-tile.t-sass,
.c-article-tile.t-sass a {
  color: #c69;
}
```

Все замечательно, кроме заголовка статьи, который остается розовым, хотя должен быть черным, розовея только в активном состоянии и при наведении курсора. Решением будет принуждение ссылки к унаследованию цвета родителя (`.c-article-tile__title` , `#333`), когда последний не находится в активном состоянии или в состоянии наведения. Для этого мы используем псевдокласс `:not()`:

```css
/**
 * 1. Make the title link inherit the color only when not active / hovered,
 *    effectively making it themed when active / hovered.
 */
.c-article-tile__title:not(:hover):not(:active) > a {
  color: inherit; /* 1 */
}
```

## Подводим итоги

Все! Мы потратили много времени, но надеюсь, что вам это понравилось. Я считаю, что этот небольшой пример является отличной иллюстрацией инкапсуляции компонента, управления темой и применения флексбокса. Можете свободно экспериментировать с кодом и, конечно, делиться полученными улучшениями.

<p data-height="465" data-theme-id="0" data-slug-hash="YWZpXB" data-default-tab="result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/YWZpXB/">SitePoint Tile Concept Example</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>
