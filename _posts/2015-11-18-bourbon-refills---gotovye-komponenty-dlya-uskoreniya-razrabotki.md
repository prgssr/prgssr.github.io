---
layout: post
title: "Bourbon Refills - готовые компоненты для ускорения разработки"
categories: [development]
tags: [sass, bourbon, translation, sitepoint]
date: 2015-11-18 22:25:41
description: "Последний элемент Bourbon - библиотека готовых компонентов и паттернов Refills."
original: "http://www.sitepoint.com/bourbon-refills-provide-drop-design-functionality"
original_title: "Bourbon Refills Provide Drop-In Design and Functionality"
original_author: "М.Дэвид Грин"
prism: yes
noimage: true
thumbnail: "/images/thoughtbot.png"
---

## Философия Refills в Bourbon

Если вам надоело жертвовать своими стандартами разработки ради шаблонов, авторы которых не заинтересованы в чистом и последовательном коде или вы устали от фреймворков, которые хотят захватить весь сайт, то вам пришло время испытать Bourbon Refills.

Библиотека Refills состоит из полезной подборки независимых и настраиваемых компонентов веб-страниц, таких как аккордеоны, вкладки, футеры, наборы шрифтов и прочие удобности. Bourbon Refills это набор слаженного кода HTML, SCSS и JQuery, готового к использованию на вашем сайте в виде сниппетов, дающих раскладку, дизайн и функциональность.

В отличие от большинства фреймворков, продуктивно работающих при адаптации к их требованиям всего сайта, Refills можно вставить на любых фрагментах сайта, созданных с [Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/) и [Bitters](http://bitters.bourbon.io/), независимо от того, используется ли этот инструментарий на всем сайте. Refills поддерживается сообществом, но работа по проверке и общее кураторство проекта осуществляется все той же командой [Thoughtbot](http://www.thoughbot.com/), разработавшей Bourbon.

Одним из лучших аспектов библиотеки Refills является независимость и самодостаточность ее отдельных паттернов или компонентов. Все компоненты Refills отзывчивы благодаря Neat, все написаны с условием требований ненавязчивости и портируемости, такими как запрет на вложение селекторов CSS более, чем на 2 уровня, минимализация стилей и оперирование локальными переменными).

Вы даже можете создавать новые паттерны и компоненты, расширяющие возможности библиотеки, если вы [написали их в соответствии с требованиями](https://github.com/thoughtbot/refills).

## Начинаем работать с Refills

Чтобы использовать библиотеку Refills в вашем проекте должны быть установлены:

* Bourboun (4.0+)
* Neat
* Bitters (10.1+)
* jQuery (для элементов, требующих JavaScript)

Все эти инструменты легко настроить для беспроблемной работы в ходе разработки и простого развертывания. Я уже написал несколько статей на Sitepoint о [Bourbon](/development/5-sposobov-uluchshit-sass-s-pomoshyu-bourbon.html), [Neat](/development/semanticheskie-setki-s-sass-bourbon-i-neat.html) и [Bitters](/development/dobavlyaem-bitters-k-bourbon-i-sass.html), а также о том, как быстро приступить к работе с ними.

Этот список может показаться угрожающим для общего веса ваших страниц, если вам нужно только по быстрому сделать хедер, футер и пару виджетов. Но вы должны учесть метод работы Bourbon. При компиляции кода Sass на странице, Bourbon и Neat не присутствуют на странице, пока вы их не задействуете. Bitters это очень легкий набор улучшений стилей, сопоставимый с обычным CSS-сбросом (который рекомендуется делать для кросс-браузерности). [jQuery](http://jquery.com/) же используется практически повсеместно и добавляет столько удобства, особенно в части обеспечения кроссбраузерности JavaScript, что, скорее всего, вы также уже используете его. А если вы загружаете jQuery из CDN, он может быть уже кэширован  браузером ваших пользователей.

После настройки вам надо перейти на [страницу Refills](http://refills.bourbon.io/) и выбрав нужные вам элементы, скопировать код в ваши файлы  HTML, Sass и JavaScript.

Просто скопировать. Не переживайте, это выглядит странным, но это работает.

В отличие от остальных библиотек, существующих изолированно и вызываемых динамически в случае необходимости, Refills создан для включения и модификации внутри вашего кода. Многие элементы Refills включают разметку HTML, в которую вы можете добавить собственный контент и также вы можете изменить большую часть кода Sass и JavaScript, чтобы адаптировать элемент к стилю вашего сайта. Refills дает вам стартовую точку для разработки, а не законченный неизменяемый продукт.

Добавление модифицированного элемента Refill на ваш сайт это как использование кастомно-сгенерированного виджета, за исключением того, что у вас есть полный контроль за всеми возможными модификациями. Обычно базовый HTML можно рассматривать как пример использования, а не как кусок кода. Например, разметка паттерна “Tables” это простая таблица с кастомным классом, запускающим стили Refills.

Этот подход означает, что библиотека Refills не заботиться о ваших способах организации файлов, вы сами решаете, куда вставить и как отредактировать кусок кода. Например, если вы используете модульный подход при компиляции Sass, вы можете создать файл `module-name.scss` для каждого элемента Refill и затем импортировать эти файлы в основной файл `main.scss` вместе с другими задействованными вами компонентами. Refills поддерживает такой подход также как легко, как и любой другой.

## Паттерны

Библиотека Refills состоит из отобранных и единообразно выглядящих компонентов, называемых паттерны. Если вы знакомы с внешним видом типичного сайта на основе [Twitter Bootstrap](http://getbootstrap.com/) или [Zurb Foundation](http://foundation.zurb.com/), большинство этих элементов будут вам знакомы. Разница в том, что вы можете выбрать компоненты нужные вам и придать им желаемый внешний вид на своем сайте.

Среди паттернов есть  навигация по вкладкам, презентационные элементы в виде карт (с опциональными лентами), гибкие сетки для представления изображений или текста, хедеры с выпадающим меню, футеры, стилизованные таблицы, виджет Google Maps и другие. Вы можете поместить любой из них на свой нестилизованный сайт и убедиться, что в них нет лишних стилей, а лишь базис для дальнейшего использования.

Все элементы предоставляются в базовом виде и это дает вам большой простор для кастомизации и модификации их в соответствии с вашим дизайном. Благодаря интеграции с Bitters, вы можете легко изменить их внешний вид --- например, изменить стили рамок или цветовых тем,а за счет интеграции с Neat вы добиваетесь отзывчивости и беспроблемного встраивания в макет.

Типичным примером паттерна является скроллинг навигации на странице. Он позволяет вам создать оглавление в верхней части страницы и переходить с помощью этого оглавления на любой раздел страницы, возвращаясь в оглавление с помощью кнопки “Back to top”.

Этот паттерн начинается со стандартного HTML, с несколькими классами и идентификаторами для CSS и JavaScript:

```markup
<div class="scroll-on-page">
  <aside id="scroll-on-page-top">
    <a class="scroll-on-page-link" href="#scroll-link-1">First Scroll Link</a>
    <a class="scroll-on-page-link" href="#scroll-link-2">Second Link</a>
    <a class="scroll-on-page-link" href="#scroll-link-3">Last Link</a>
  </aside>

  <article>
    <section>
      <h4 id="scroll-link-1">First Target</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt?</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt?</p>
    </section>
    <section>
      <h4 id="scroll-link-2">Second Target</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt?</p>
    </section>
    <section>
      <h4 id="scroll-link-3">Last Target</h4>
      <p>lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum aliquid necessitatibus, repudiandae veniam labore, consequatur maiores dolore unde non deleniti, aliquam minima ex nulla error eveniet vel tempore, in incidunt?</p>
      <a class="scroll-on-page-link" href="#scroll-on-page-top">Back to top</a>
    </section>
  </article>
</div>
```

Как видите, это просто заглушка со сгенерированным контентом и вам, конечно, надо использовать этот код как модель, используя свои теги, а не копируя его один в один. Заполняющего контента включено ровно столько, чтобы вы увидели, как работает вертикальный скроллинг.

В следующем разделе у нас фрагмент кода SCSS для создания отзывчивых стилей у элементов навигации отдельно от стилей статьи, по которой производится навигация:

```scss
.scroll-on-page aside {
  @include media($large-screen) {
    @include span-columns(4);
  }
}

.scroll-on-page-link {
  border-bottom: 1px solid transparentize($base-link-color, .8);
  padding: $base-spacing / 2 0;
  margin-right: $base-spacing;
  display: block;

  &:last-child {
    margin-bottom: $base-spacing;
  }
}

.scroll-on-page article {
  h4 {
    margin-bottom: .5em;
  }

  section p:last-of-type {
    margin-bottom: 2em;
  }

  @include media($large-screen) {
    @include span-columns(8);
  }
}

// Based on code by http://codepen.io/xmark/
```

Ну, и наконец, JavaScript, чтобы все работало красиво:

```javascript
(function (jQuery) {
  jQuery.mark = {
    jump: function (options) {
      var defaults = {
        selector: 'a.scroll-on-page-link'
      };
      if (typeof options == 'string') defaults.selector = options;
      var options = jQuery.extend(defaults, options);
      return jQuery(options.selector).click(function (e) {
        var jumpobj = jQuery(this);
        var target = jumpobj.attr('href');
        var thespeed = 1000;
        var offset = jQuery(target).offset().top;
        jQuery('html,body').animate({
          scrollTop: offset
        }, thespeed, 'swing')
        e.preventDefault();
      })
    }
  }
})(jQuery);


jQuery(function(){
  jQuery.mark.jump();
});
```

В данном случае, полная имплементация jQuery включена для того, чтобы скрипт можно было просто поместить внутри тега `<script>` используя переменную `jQuery` вместо более традиционной `$`. Изучив библиотеку Refills, вы заметите, что многие элементы показывают только код, который вы можете использовать внутри блока `(function (jQuery) { ... })(jQuery);`. Вы также можете предпочесть использовать `$`, так как внутри этой обертки эта переменная почти изолирована, но вам надо внимательно переходить от одного элемента Refills к другому, поскольку в этом они не последовательны.

## Компоненты

В отличие от паттернов Refills, компоненты Refills это небольшие виджеты, которые могут располагаться внутри контекста страницы. Однако, многие из них также будут знакомы разработчикам, раннее сталкивавшимися с другими CSS-фреймворками. Самые маленькие из них кажутся просто логичными расширениями библиотеки Bitters, в других же функциональность более значительна.

Среди прочих компонентов вы можете выбрать меню-аккордеоны, хлебные крошки, бэджи, группы кнопок, эффекты при наведении, анимацию, разбивку на страницы и параллакс, прогресс-бары, слайдеры, наборы текстур и прочее.

Опять-таки, фокус сделан на том, чтобы компоненты были базовыми и независимыми насколько это возможно, а также, чтобы они могли унаследовать базовые стили от Bitters.

Одним из моих любимых компонентов является интерактивное модальное окно, не требующее JavaScript за счет использования скрытых чекбоксов и CSS-селекторов для соседних элементов.

Вот разметка этого компонента:

```markup
<div class="modal">
  <label for="modal-1">
    <div class="btn js-btn">Click for Modal</div>
  </label>
  <input class="modal-state" id="modal-1" type="checkbox" />
  <div class="modal-window">
    <div class="modal-inner">
      <label class="modal-close" for="modal-1"></label>
      <h1>Modal Title</h1>
      <p class="intro">Intro text lorem ipsum dolor sit ametm, quas, eaque facilis aliquid cupiditate tempora cumque ipsum accusantium illo modi commodi  minima.</p>
      <p class="body">Body text lorem ipsum dolor ipsum dolor sit sit possimus amet, consectetur adipisicing elit. Itaque, placeat, explicabo, veniam quos aperiam molestias eriam molestias molestiae suscipit ipsum enim quasi sit possimus quod atque nobis voluptas earum odit accusamus quibusdam.</p>
    </div>
  </div>
</div>
```

При желании вы можете поменять классы из этой разметки (типа “body” и “intro”) на более удобные для вас. Это все делается путем редактирования SCSS. В этом компоненте он написан аккуратно и кроссбраузерно, и, конечно, с сохранением отзывчивости:

```scss
.modal {
  $modal-padding: 3em;
  $modal-background: $base-background-color;
  $modal-close-color: $light-gray;
  $modal-image-height: 135px;
  $modal-image-width: $modal-image-height;

  label {
    cursor: pointer;
    margin-bottom: 0;
  }

  label img {
    $img-width: 300px;
    border-radius: $img-width/2;
    display: block;
    max-width: $img-width;
  }

  input[type="checkbox"] {
    display: none;
  }

  .btn {
    @extend button;
  }

  .modal-open {
    overflow: hidden;
  }

  .modal-window { // overlay
    @include transition(opacity .25s ease);
    @include position(fixed, 0px 0px 0px 0px);
    background: rgba(0,0,0, .85);
    opacity: 0;
    text-align: left;
    visibility: hidden;
    z-index: 99999999999;

    .modal-bg {
      @include position(absolute, 0px 0px 0px 0px);
      cursor: pointer;
    }
  }

  .modal-close {
    @include position(absolute, ($modal-padding /2) ($modal-padding /2) null null);
    @include size(1.5em);
    cursor: pointer;
    background: $modal-background;

    &:after,
    &:before {
      @include position(absolute, 3px 3px 0 50%);
      @include transform(rotate(45deg));
      @include size(.15em 1.5em);
      background: $modal-close-color;
      content: '';
      display: block;
      margin: -3px 0 0 -1px;
    }

    &:hover:after,
    &:hover:before {
      background: darken($modal-close-color, 10);
    }

    &:before {
      @include transform(rotate(-45deg));
    }
  }

  .modal-inner {
    @include transition(opacity .25s ease);
    border-radius: $base-border-radius;
    background: $modal-background;
    margin: auto;
    max-height: 95%;
    position: relative;
    overflow: auto;
    width: 95%;
    padding: $modal-padding /2;
    margin-top: .6em;

    @include media($medium-screen) {
      padding: $modal-padding;
      width: 60%;
      max-height: 60%;
      margin-top: 10em;
    }

    @include media($large-screen) {
      width: 50%;
      margin-top: 10em;
    }

    h1 {
      color: $base-font-color;
      margin-bottom: .6em;
      text-align: left;
      text-transform: capitalize;
    }

    p.body, p.intro {
      font-size: $base-font-size;
      max-width: 100% !important;
      text-align: left;

      &.intro {
        color: $blue;
        line-height: 1.6em;
      }

      &.body {
        color: $base-font-color;
        line-height: 1.45em;

        @include media($medium-screen) {
          @include columns(2 8em);
        }
      }
    }

    a.cta {
      color: white;
      display: inline-block;
      margin-right: .5em;
      margin-top: 1em;

      &:last-child {
        padding: 0 2em;
      }
    }
  }

  .modal-state:checked + .modal-window {
    opacity: 1;
    visibility: visible;
  }

  .modal-state:checked + .modal-window .modal-inner {
    top: 0;
  }
}

// Based on code by Kasper Mikiewicz
```

Как видите, весь код для отзывчивости  добавлен изначально и вы можете выбрать свой способ его обработки. Легко просто скопировать и вставить эти фрагменты, но важно прочитать  код и понять, что он делает, перед тем как добавлять его на свою страницу.

Оригинал этого кода написан [Каспером Микевичем](http://idered.pl/) и разработчики Refills не забыли упомянуть его в комментариях к коду.

## Система шрифтов

Третий плюс Bourbon Refills это набор элегантных и точно отстроенных систем шрифтов, упрощающих совмещение шрифтов и улучшающих внешний вид сайта. Также настроен последовательный вертикальный ритм для упрощения восприятия больших блоков текста. Это важно для блогеров, если они хотят, чтобы читатели не утомлялись от большого количества параграфов.

Системы шрифтов включают шрифты с засечками и без засечек, брусковый, традиционный и другие. Все эти термины знакомы тем, кто использует шрифты в современном вебе, но Refills дает визуальные примеры каждого из них, а, значит, вы уверенно можете выбрать то, что вам нужно. И после того, как вы применили систему шрифта, вы увидите изменения стиля во всех элементах Refills, находящихся в той же области видимости.

Еще одно преимущество Refills это то, что для всех шрифтов реализована изящная деградация, то есть запасные варианты в виде безопасных веб шрифтов, если загрузка шрифтов не поддерживается. Это обеспечит правильную работу во всех операционных системах.

Типичным образцом системы шрифта в Refill является сглаженный шрифт без засечек (Rounded Sans-Serif). Как и остальные элементы, в нем есть образец HTML, который лучше воспринимать как образец, а не копировать автоматически. Ключевым моментом здесь является  элемент `<head>`, в котором подключаются шрифты от Google с помощь элементов `link`:

```markup
<head>
  <link href='http://fonts.googleapis.com/css?family=Nunito:400,700,300' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Varela+Round' rel='stylesheet' type='text/css'>
</head>

<article class="type-system-rounded">
  <p class="type">Article Type</p>
  <h1>Article Heading</h1>
  <h2>These override some of the styles specified in the <code>_variables.scss</code> and <code>_typography.scss</code> partials in <a href="//bitters.bourbon.io">Bitters</a>. You can replace the typography variables and the header font specifications in Bitters with these styles. Then you won&rsquo;t need the wrapping class <code>.type-system-name</code>.</h2>
  <p class="date">30 Mar 2014</p>
  <p><span>Lorem ipsum dolor sit amet</span>, consectetur adipisicing elit. Consequatur a, ullam, voluptatum incidunt neque doloremque vel inventore distinctio laudantium harum</a> illo quam nulla dolor alias iure impedit! Accusamus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, a, ullam, voluptatum incidunt neque porro numquam doloremque vel inventore distinctio laudantium harum illo quam nulla dolor alias iure impedit.
    <a href="javascript:void(0)" class="read-more">Read More <span>&rsaquo;</span></a>
  </p>
  <h3>Subheading lorem</h3>
  <p><span>Consequatur ullam, voluptatum</span> incidunt neque porro numquam doloremque vel inventore distinctio laudantium harum illo quam nulla dolor alias iure impedit. Accusamus. Consequatur, a, ullam, voluptatum incidunt neque porro numquam doloremque vel inventore distinctio laudantium harum illo quam nulla dolor alias iure impedit! Accusamus.</p>
  <hr>
  <p class="author">Author Name</p>
</article>
```

SCSS использует эти подключенные шрифты и применяет их так, чтобы показать их в лучшем виде на стандартных HTML-элементах.

```scss
article.type-system-rounded {
  $sans-serif: 'Nunito', sans-serif;
  $sans-serif-2: 'Varela Round', sans-serif;

  @include clearfix;
  text-align: left;

  .type {
    border-bottom: 1px solid;
    display: inline-block;
    font-family: $sans-serif;
    font-size: .7em;
    font-weight: 800;
    margin-bottom: 2em;
    padding: .3em 0;
    text-align: left;
    text-transform: uppercase;
  }

  h1 {
    font-family: $sans-serif-2;
    font-size: 1.8em;
    margin-bottom: .5em;

    @include media($medium-screen) {
      font-size: 2.4em;
    }
  }

  h2 {
    font-family: $sans-serif-2;
    font-size: 1.2em;
    font-weight: 400;
    line-height: 1.4em;
    margin-bottom: .9em;

    @include media($medium-screen) {
      font-size: 1.4em;
    }
  }

  code {
    white-space: nowrap;
    font-family: monaco;
    background: #F7F7F7;
    border: 1px solid #E0E0E0;
    border-radius: $base-border-radius * 1.5;
    padding: .1em .4em;
    font-size: .7em;
    font-style: normal;
  }


  h3 {
    font-family: $sans-serif-2;
    font-size: 1.2em;
    font-weight: 400;
    line-height: 1.3em;
    margin-bottom: .4em;
  }

  p.date {
    color: transparentize($base-font-color, .6);
    font-family: $sans-serif;
    font-size: .9em;
    margin-bottom: .3em;
  }

  p {
    font-family: $sans-serif;
    line-height: 1.4em;
    font-size: 1.05em;
    font-weight: 300;
    margin-bottom: 1.5em;

    span {
      font-family: $sans-serif-2;
      text-transform: uppercase;
      font-size: 0.8em;
    }
  }

  a.read-more {
    display: inline-block;
    font-family: $sans-serif-2;
    font-weight: 700;
    font-size: .8em;
    text-transform: uppercase;
    margin-left: .2em;
    position: relative;

    span {
      position: absolute;
      font-size: 1.5em;
      top: -1px;
      right: -12px;
    }
  }

  hr {
    width: 3em;
  }

  p.author {
    font-family: $sans-serif;
  }
}
```

SCSS координирует жирность шрифта и высоту строки, чтобы добиться лучшей читаемости текста. И, конечно, вы можете делать любые изменения в коде в соответствии со своим вкусом.

## Вещи, которые надо учитывать

Хотя Refills это отличный ресурс для тех, кто не хочет использовать ограничивающие фреймворки или шаблоны, есть несколько моментов, которые надо держать в уме. Одной из мелких неприятностей является то, что при нажатии на кнопку "copy" не предусмотрено никаких сообщений о том, скопировался элемент или нет. Когда вы заметите это, вы будете больше уделять внимания тому, что вы копируете и вставляете.

Следующий баг это то, что библиотека Refill заполнена статическими примерами, готовыми к подключению на ваши страницы, но в которых не предусмотрен широкий диапазон форматов. Например, я часто предпочитаю HAML при написании разметки, но код предоставляется только в виде стандартного HTML. Если вы предпочитаете вместо HTML использовать HAML, Jade или другой синтаксис, воспользуйтесь командной строкой или используйте [автоматический конвертер](http://htmltohaml.com/).

Точно также весь код Sass представлен в популярном формате SCSS. Если вы предпочитаете классический Sass с отступами, вам надо модифицировать свой рабочий процесс, чтобы код SCSS интерпретировался корректно. У каждого синтаксиса есть свои преимущества и все они в конечном итоге сводятся к вашим [предпочтениям в разработке](http://thesassway.com/editorial/sass-vs-scss-which-syntax-is-better), учитывайте это при внедрении Refills.

Вы также можете заметить некоторую непоследовательность в JavaScript в Refills.  Многие его компоненты созданы сообществом и они не всегда полностью следуют единому стандарту. Например, я заметил, что некоторые компоненты используют старый синтаксис jQuery `.bind()` для обработки событий, в других реализован более современный синтаксис `.on()`.

Но если у вас есть свои представления о стандартах кодирования, вы всегда сможете изменить элементы Refill в соответствии с выбранным стандартом.

## Refills для всех

Больше всего меня привлекает в Refill его совместимость со всеми библиотеками Bourbon. Гибкость вашего сайта не пострадает от подключения  Refills и вы сразу сможете перейти от дизайна к работающим прототипам максимально быстро.

Для разработчика, который знает, как работает эта экосистема и хочет быстро сделать работающий прототип, который будет хорошим стартом для дальнейшего дизайна, Bourbon Refills  будет самой удобной возможностью из существующих.

