---
title: Разработка расширяемых компонентов на HTML и CSS
layout: post
categories: [development]
tags: [css, translation, css-tricks]
date: 2016-09-08 23:01:02 +0300
prism: yes
description: "Джон Яблонски о подходе к веб-разработке на основе создания расширяемых компонентов"
original: "https://css-tricks.com/developing-extensible-html-css-components/"
original_title: "Developing Extensible HTML and CSS Components"
original_author: "Джон Яблонски"
thumbnail: "noimage"
scripts: codepen
---

Ушли те дни, когда мы  делали страницы фиксированной ширины из макетов фотошопа по принципу pixel-perfect. Для того, чтобы делать  раскладку, адаптирующуюся к любой ширине экрана, наши рабочие процессы изменились и стали более последовательными и гибкими. Мы пришли к пониманию важности модульности и того, как она способствует гибкости, необходимой нам, чтобы оставаться быстрыми в браузере. Для меня как дизайнера и фронтенд-разработчика, гибкость является неотъемлемой частью моего подхода к веб-проектам. Также я заметил, что занимаюсь вопросами дизайна в браузере намного чаще, чем с файлами и для поддержки этого рабочего процесса мне нужна возможность строить модули интерфейса, которые можно легко расширять.

## Расширяемые модули

Для обеспечения последовательности в структуре наших компонентов и паттернов, важно строить их в повторяемой и предсказуемой манере, следуя основным шагам.

### Шаг 1: определите тип модуля

Первый шаг это определение типа модуля, с которым мы работаем — вариантов здесь два: компонент или паттерн. Компонент это независимый модульный объект, у которого нет дочерних элементов, но есть модифицирующие состояния, изменяющие его внешний вид (пример: кнопка, сообщения, миниатюры изображений). С другой стороны, паттерн это объект, содержащий дочерние элементы (которые могут быть самостоятельными компонентами), влияя на каждый из них (например, хедер, логотип, навигация). И у паттернов, и у компонентов есть модифицирующие состояния, изменяющие их внешний вид или структуру.

### Шаг 2: определите основу для модуля

Следующим шагом будет поиск основных правил для компонента или паттерна, которые будут наследовать все их вариации. Эти правила должны быть относительно минимальными и затрагивать свойства, которые редко меняются. Наиболее часто в моей практике это были правила для свойств `margin`, `padding`, `position` и `display`.

Все примеры кода в статье используют [систему именования БЭМ](https://en.bem.info/) (блок, элемент, модификатор). БЭМ дает множество преимуществ, но главным из них для меня является то, что я могу узнать, что  делает фрагмент разметки, просто взглянув на его название. Если вы хотите узнать больше об этой методологии, я советую в качестве введения [эту статью](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).
{: .info}

```html
<div class="block"></div>
```

```css
.block {
  position: relative;
  margin: 0 0 1em;
}
```

### Шаг 3: определите общие элементы

Если вы создаете компонент, то вы можете сразу перейти к следующему шагу, но если вы создаете паттерн с дочерними элементами, то следующим шагом вы должны определиться с ними. Эти элементы тематически связаны с родительским блоком (но могут существовать и вне паттерна как самостоятельные компоненты).

```html
<div class="block">
  <div class="block__element">…</div>
  <div class="block__another-element">…</div>
</div>
```

```css
.block__element {
  padding: 1em;
  background: white;
  border: 1px solid black;
}

.block__another-element {
  position: absolute;
  top: 0;
  right: 0;
}
```

### Шаг 4: расширяйте при помощи модификаторов

Финальный шаг это расширение вашего компонента или паттерна с помощью модификаторов. Модификаторы это по сути вариации, расширяющие основной блок вместе с его потомками, которые могут создаваться по необходимости.

**Пример модификатора HTML**

```html
<div class="block block-modifier">
  <div class="block__element">…</div>
  <div class="block__another-element">…</div>
</div>
```


**Пример модификатора CSS**

```css
.block-modifier {
  border-top: 3px solid red;
}

.block-modifier .block__element {
  background: grey;
}
```

## Примеры

Теперь, когда мы рассмотрели базовые шаги по построению расширяемых компонентов и паттернов, пришло время исследовать несколько примеров. Мы начнем со сравнительно простого компонента и его расширения в различных сценариях, а затем перейдем к немного более сложному паттерну.

### О компонентах

Следующее демо показывает несколько традиционных компонентов и их вариации. Каждый компонент состоит из родительского блока и модификаторов, расширяющих стили этого блока. Это позволяет быстро создавать такие вариации, дает ва гибкость при разработке и адаптации компонентов к любому пользовательскому интерфейсу.

### Образцы обычных компонентов

<p data-height="565" data-theme-id="0" data-slug-hash="rLqxPb" data-default-tab="result" data-user="jonyablonski" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/jonyablonski/pen/rLqxPb/">Common Extendable Components</a> by Jon Yablonski (<a href="http://codepen.io/jonyablonski">@jonyablonski</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Компоненты по своей природе должны быть сравнительно простыми, так как не содержат дочерних элементов. Теперь перейдем к более сложному вопросу.

### О паттернах

Медиа-паттерн это объект состоящий из медиа-элемента (это может быть изображение или видео) и связанного с ним контента (обычно в форме текста). Вы должно быть знакомы с вариацией медиа-паттерна, известной как [медиа-объект](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/) или [флаг-объект](http://csswizardry.com/2013/05/the-flag-object/), которую мы слегка затронем. Этот паттерн — отличный пример того, как разработка с учетом расширяемости дает вам бесконечную гибкость.

### Дефолтный медиа-паттерн

Мы начнем с нашего дефолтного паттерна, то есть паттерна без каких-либо модификаторов. Я добавил семантический тег `<article>`, но вы можете заменить на более подходящий вам тег. Базовые стили нашего медиа-паттерна включают следующее:

1. Стили флекс-контейнера.
2. Внешние отступы для контейнера и его содержимого.

Эти стили унаследуют все медиа-паттерны. В дополнение каждый медиа-паттерн будет содержать медиа-элемент (в нашем случае изображение) и тело медиа-паттерна, включающее в себя название и список-описание.

```html
<article class="media">
        <div class="media__item">
            <img
            src="TapeRecorder.jpg" alt="Tape Recorder">
        </div>
        <div class="media__body">
            <h1 class="media__body-title">Default</h1>
            <dl class="media__body-list">
                <dt class="media__body-list-title">Aperture</dt>
                <dd class="media__body-list-data">4.970854</dd>
                <dt class="media__body-list-title">ISO</dt>
                <dd class="media__body-list-data">200</dd>
                <dt class="media__body-list-title">Exposure Time</dt>
                <dd class="media__body-list-data">0.05</dd>
            </dl>
        </div>
    </article>
```

```scss

/**
 * Media
 */
.media {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 $base-spacing;

    @media #{$medium} {
        margin: 0 0 $base-spacing*2;
    }
}

.media__item {
    margin: 0 0 $base-spacing;

    img {
        display: block;
    }
}

.media__body {
    width: 100%;
}

.media__body-title {
    margin: 0 0 $base-spacing/2;
    font-size: $base-font-size;
    color: $base-accent-color;
}

.media__body-list {
    font-size: 0.825em;
}

.media__body-list-title {
    margin: 0 $base-spacing/2 0 0;
    font-weight: bold;
}

.media__body-list-data {
    margin: 0 $base-spacing $base-spacing 0;
}
```

<p data-height="465" data-theme-id="0" data-slug-hash="WxYbKd" data-default-tab="result" data-user="jonyablonski" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/jonyablonski/pen/WxYbKd/">Default Media Pattern</a> by Jon Yablonski (<a href="http://codepen.io/jonyablonski">@jonyablonski</a>) on <a href="http://codepen.io">CodePen</a>.</p>


### Паттерн медиа-карточка (Media Card)

Хотя дефолтный медиа-паттерн может быть достаточен в некоторых случаях, во многих ситуациях вам нужно значительно изменить его внешний вид. Следующий шагом надо разобраться с вариациями, которые позволят нашему паттерну адаптироваться к разным ситуациям. Начнем с вариации, которая сильно отличается от дефолтного внешнего вида — медиа-карточки. Нам практически не придется менять разметку и мы можем изменить внешний вид нашего паттерна просто добавив родительскому блоку класс-модификатор:


```scss
/**
 * Media
 */
.media {
    /* Modifers */
    &--card {
        margin: 0;
        background: white;
        box-shadow: $base-box-shadow;
    }
}


.media__body {
    /* Block Modifers */
    .media--card & {
        padding: 0 $base-spacing;
    }
}

```


<p data-height="465" data-theme-id="0" data-slug-hash="jAQbrP" data-default-tab="result" data-user="jonyablonski" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/jonyablonski/pen/jAQbrP/">Media Card Pattern</a> by Jon Yablonski (<a href="http://codepen.io/jonyablonski">@jonyablonski</a>) on <a href="http://codepen.io">CodePen</a>.</p>


### Паттерн медиа-объект (Media Object)

Предположим, что далее нам понадобился паттерн, в котором изображение и текст выводятся рядом при наличии достаточного пространства. Это паттерн обычно известен как "медиа-объект". Для его создания мы просто расширим медиа-паттерн, который у нас уже есть, чтобы минимизировать избыточный код.

```scss
/**
 * Media
 */
.media {
   
    /* Modifers */
    &--object {
        @media #{$small} {
            flex-wrap: nowrap;
        }
    }
}

.media__item {
  
    /* Block Modifers */
    .media--object & {
        @media #{$small} {
            margin: 0 $base-spacing $base-spacing 0;
        }
    }
    
    /* Element Modifers */
    &--reversed {
        @media #{$small} {
            order: 1;
            margin: 0 0 $base-spacing $base-spacing;
        }
    }
}

.media__body {
      
    /* Element Modifers */
    &--centered {
        @media #{$small} {
            align-self: center;
        }
    }
}

```

<p data-height="465" data-theme-id="0" data-slug-hash="pbQjdE" data-default-tab="result" data-user="jonyablonski" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/jonyablonski/pen/pbQjdE/">Media Object Pattern</a> by Jon Yablonski (<a href="http://codepen.io/jonyablonski">@jonyablonski</a>) on <a href="http://codepen.io">CodePen</a>.</p>



### Паттерн медиа-планка (Media Slat)

Попробуем пойти еще дальше создав вариант паттерна, с которым наш подход будет проверяться по-настоящему. Созданные нами вариации прекрасно реализуют мои потребности в дизайне, но мне нужен еще один вариант с большей модификацией. В этом варианте будет заполняться все пространство окна — половина текстом и половина изображением. В дополнение к этому мне нужно, чтобы текст выравнивался на одном уровне с остальным контентом страницы. Мы называем это медиа-планка.

```scss
/**
 * Media
 */
.media {
    
    /* Modifers */
    &--slat {
        position: relative;
        width: 100%;
        overflow: hidden;
        background-color: white;
        
        @media #{$small} {
            flex-wrap: nowrap;
            height: 200px;
        }
        
        @media #{$medium} {
            height: 250px;
        }

        @media #{$large} {
            height: 300px;
        }

        @media #{$xlarge} {
            height: 400px;
        }
    }
}

.media__item {
      
    /* Block Modifers */
    .media--slat & {
        @media #{$small} {
            margin: 0;
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
            width: 60%;
            height: 100%;
            overflow: hidden;
        }
    }
}

.media__body {

    /* Block Modifers */
    .media--slat & {
        padding: $base-spacing $base-spacing 0;
        
        @media #{$small} {
            position: absolute;
            z-index: 2;
            top: 50%;
            transform: translate( 0, -50% );
            max-width: (map-get($breakpoints, medium) - $base-spacing )/2;
            align-self: center;
        }

        @media #{$large} {
            left: 50%;
            transform: translate( -(map-get($breakpoints, medium) - $base-spacing )/2, -50%);
            padding-left: $base-spacing/2;
        }
    }
}

```

<p data-height="465" data-theme-id="0" data-slug-hash="grQajV" data-default-tab="result" data-user="jonyablonski" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/jonyablonski/pen/grQajV/">Media Slat Pattern</a> by Jon Yablonski (<a href="http://codepen.io/jonyablonski">@jonyablonski</a>) on <a href="http://codepen.io">CodePen</a>.</p>



Теперь у нас есть несколько вариантов медиа-паттерна: дефолтный вариант, медиа-карточка, медиа-объект и полноэкранная планка. Эти варианты будут полезны в разных обстоятельствах и они все используют в качестве основы одинаковый код. Также хорошо, что любое изменение базового паттерна повлияет на все паттерны, делая все экземпляры синхронизированными и единообразными.

## Заключение

Мы рассмотрели, почему расширяемые компоненты и паттерны хороши при построении интерфейсов, требующих гибкости и поддерживаемости. Для иллюстрации этого мы изучили шаги, необходимые при создании расширяемых компонентов. Преимущество построения интерфейсов таким способом станет очевидным сразу, потому что вы будете тратить меньше времени на рефакторинг при неожиданных изменениях или дополнениях дизайна, а стили компонентов будет легче поддерживать.


