---
title: Доступные SVG
layout: post
categories: [development]
tags: [accessibility, svg, translation, css-tricks]
date: 2016-07-27 23:12:00 +0300
prism: yes
description: "Доступность SVG изображений: от иконок до инфографики"
original: "https://css-tricks.com/accessible-svgs/"
original_title: "Accessible SVGs"
original_author: "Heather Migliorisi"
thumbnail: "/images/development/svg/image07.png"
scripts: codepen
---

Масштабируемая векторная графика (SVG, Scalable Vector Graphic) все чаще становится  предпочитаемым форматом графики в интернете сегодня. Возможно, вы тоже уже использовали SVG [вместо иконочного шрифта](https://sarasoueidan.com/blog/icon-fonts-to-svg/) или графики в форматах jpg, gif и png. Рассмотрим, как это влияет на пользователей вспомогательных технологий и что нужно, чтобы обеспечить благополучный пользовательский опыт для всех.

## Графика и альтернативный текст

Перед тем как перейти к собственно доступным SVG, разберемся с  несколькими основными вопросами о графике, доступности и альтернативном тексте.

### 1. Нуждается ли графика в альтернативном тексте?

Если графика выполняет чисто декоративную роль, альтернативный текст не нужен.

> В тегах `<img>` должен быть атрибут `alt` для валидности, но его можно оставить пустым (без пробелов), разметка `<img src="pathtofile.svg" alt="">` будет по прежнему валидной.

### 2. Какой контекст у графики и окружающего ее текста?

Если графика окружена текстом или содержимым, в котором есть альтернативный текст, то дополнительный альтернативный текст в атрибуте `alt` не нужен. Например:

<p data-height="365" data-theme-id="0" data-slug-hash="jrORXq" data-default-tab="result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/jrORXq/">SVG as img src for figure with figcaption</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>


Какой альтернативный текст наиболее оптимален для графики, которой необходим атрибут `alt` (см. пример 4 для подробной информации)? В зависимости от содержимого изображения, он может быть разным:

<p data-height="465" data-theme-id="0" data-slug-hash="WxNBZp" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/WxNBZp/">SVG as img src for figure with figcaption</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### 3. Есть ли у графики функция? Если так, то она должна быть донесена до пользователя.

Например, вместо точного описания того, что представлено на иконках...

![Образец иконки](/images/development/svg/image01.png)

**Пример плохого кода:**

```html
<a href="http://codepen.io/username">
  <img src="codepen_icon.png" 
      alt="Логотип CodePen">
</a>
```

...передайте пользователю контекст иконки.

**Пример хорошего кода:**

```html
<a href="http://codepen.io/username">
  <img src="codepen_icon.png" 
  alt="Посмотреть прикрепленные пены">
</a>
```

Для более полного понимания ознакомьтесь со статьей WebAIM ["Alternative Text"](http://webaim.org/techniques/alttext/) и [руководством W3C по доступности изображений](https://www.w3.org/WAI/tutorials/images/).

Примеры в статье работают с браузерами, поддерживающими SVG (IE 10+, FF, Chrome и Safari) и [наиболее распространенными скринридерами](http://webaim.org/projects/screenreadersurvey6/#used): Jaws, NVDA, VoiceOver (VO) и Narrator.
{: .info}

## Способы подключения SVG на страницу

Для самой базовой имплементации SVG у нас есть следующие варианты:

### 1. SVG в `img src`

<p data-height="265" data-theme-id="0" data-slug-hash="yembbb" data-default-tab="html" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/yembbb/">SVG as img src</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Перед тем, как продолжить, проверьте статистику браузеров посетителей вашего сайта. Если используется версия Safari Desktop 9.1.1 или iOS Version 9.3.2, а также более поздняя версия, то этого кода достаточно.

Однако многие пользователи по прежнему используют более старые версии Safari или IOS, поэтому нам надо добавить `role="img"`, вот так: `<img src="linktofile.svg" alt="Pixels, my super cute cat" role="img">`.

И спасибо разработчикам, пофиксившим этот баг [Safari/WebKit](https://bugs.webkit.org/show_bug.cgi?id=145263).

Этот пример хорош в качестве самого простого способа подключения SVG, но он не дает нам доступа к содержимому SVG с помощью AT (Assistive technology) или CSS/JS. Поэтому, если нам нужно больше контроля над SVG, мы инлайнируем его непосредственно в HTML.

### 2. Инлайновый SVG

Инлайновый SVG дает более полный контроль и  более предсказуемые результаты, чем при использовании с `<use>` или `<img>`, так как исходники SVG непосредственно доступны в DOM, а DOM полностью открыт для API вспомогательных технологий.

Возьмем тот же базовый SVG из примера с `<img>` и попробуем добавить движение глаз. Мы можем сделать это с помощью JavaScript, если мы вложим SVG непосредственно в HTML.

<p data-height="265" data-theme-id="0" data-slug-hash="begvBM" data-default-tab="result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/begvBM/">Basic SVG - Cat</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Так как в SVG нет никакого видимого текста, описывающего графику, нам надо добавить альтернативный текст:

* внутри `<svg>`, добавив `<title>A short title of the SVG</title>`, который должен быть первым потомком родительского элемента — это будет использоваться как подсказка при наведении курсора.
* описание, при необходимости (оно не будет зачитываться).

В соответствии со [спецификацией W3C](https://www.w3.org/TR/SVG11/struct.html#DescriptionAndTitleElements), нам не надо делать ничего дополнительно, кроме добавления `<title>` и, возможно, `<desc>` так как они доступны  Accessibility API. К сожалению, поддержка в браузерах пока недостаточна (см.  [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=231654&q=SVG%20%20title%20attribute&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified) и [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1151648)).

Чтобы гарантировать доступ AT к `<title>` и `<desc>`:

Добавьте соответствующий ID к `<title>` и `<desc>`:

* `<title id="uniqueTitleID">Название SVG</title>`
* `<desc id="uniqueDescID">Более длинное и полное описание сложной графики.</desc>`

В теге `<svg>` добавьте:

  * `aria-labelledby="uniqueTitleID uniqueDescID"` используйте ID названия и описания; подключение и названия, и описания обеспечивает лучшую поддержку в скринридерах, чем `aria-describedby`.

Еще один момент:
 
* в теге `<svg>` добавьте `role="img"` (таким образом, SVG не будет проходиться браузерами, которые добавляют SVG роль группы).

Итак, добавляем анимацию (моргание глаз):

```javascript
setInterval(function blinkeyes() {
  var tl = new TimelineLite();
  tl.to(".eye", .4, {scaleY:.01, repeat:3, repeatDelay:.4, yoyo:true, transformOrigin: "50% 70%", ease:Power2.easeInOut});
  return tl; 
 }, 5000);

var master = new TimelineLite(); 
master.add(blinkeyes());
```

Обновите название/описание так, чтобы оно точно описывало изображение:

```svg
<desc id="catDesc">An illustrated gray cat with bright green blinking eyes.</desc>
```

<p data-height="265" data-theme-id="0" data-slug-hash="adQoOJ" data-default-tab="result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/adQoOJ/">Simple Inline  Accessible SVG Cat - using  title and desc</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>


### 3. Вложение SVG с помощью `object` или `iframe`

Сейчас я стараюсь держаться подальше от использования `<object>` или `<iframe>`. Они неадекватны в плане использования со скринридером.

Вот как это было у меня.

Итак, выбираем метод вложения SVG и добавляем `tabindex="0"`:

```html
<object type="image/svg+xml" 
    data="/path-to-the-svg/filename.svg" 
    width="50%" 
    tabindex="0">
  <img src="Fallback_image.jpg" alt="alt content here">
</object>
```


```html
<iframe src="/path-to-the-svg/filename.svg" 
    width="65%" 
    height="500" 
    sandbox 
    tabindex="0">
  <img src="Fallback_image.jpg" alt="alt content here">             
</iframe>
```

Используя нашего моргающего кота из последнего примера, нам надо заменить `role="img"` на `role="group"`.

```svg
<svg id="cat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" aria-labeledby="pixels-title pixels-desc" role="group">
```

И с этого момента все становится хуже.

Добавьте элемент в SVG `<text>`, в котором будет находится содержимое `<title> ` и, возможно, `<desc>` (для NVDA):

```svg
<text id="nvda-title">A cute, gray cat with green eyes. Cat illustration by Heather Migliorisi.</text>
```

Затем добавьте класс, чтобы спрятать текст визуально, оставив содержимое доступным для скринридеров. Мы можем сделать это, задав `font-size: 0`.

```css
.sr-only { font-size: 0; }
```

Итак, мы пришли к тому, что  `<title>` (а, по возможности, и `<desc>`)  и `<text>` содержат одинаковый контент, для поддержки JAWS и NVDA.

**Примечания:**

* `<object>` и `<iframe>` не работают в Chrome. Chrome видит содержимое запасного варианта (`img src`), поэтому вы можете скинуть весь текст туда, скопировав его в третий (или в четвертый) раз.
* JAWS не читает содержимое `<text>` (кроме отмеченного `aria-labelledby`/`describedby`)

Я рекомендую (исходя из поддержки браузерами и скринридерами) использовать, где возможно `<img src="svg.svg>`. Но это доступно не всегда, ведь изображения не обладают интерактивностью и анимациями `object` и `iframe`, а [запасные варианты](https://css-tricks.com/a-complete-guide-to-svg-fallbacks/) достаточно сложны. 

## Иконки

Есть несколько статей на тему замены иконочных шрифтов SVG. Мне было любопытно, облегчит ли использование SVG для иконок имплементацию их доступности. В смысле, могут ли браузеры поддерживать `<title>`, заданный в основном SVG, при использовании `<use>`. Увы, не могут. Но это можно сделать с самой иконкой и я сейчас покажу как.

После создания файла SVG, содержащего иконки (я люблю использовать для этого [icomoon](https://icomoon.io/)) и [подключения его в документ](http://codepen.io/hmig/full/OXWMLr/), нам нужно определить паттерны, необходимые для сайта (иконка+ссылка, иконка+текст, просто иконка). Исходя из этих паттернов, мы можем разработать соответствующий метод применения альтернативного текста.

В начале код иконки обычно выглядит как вот этот из генератора иконок:

```svg
<svg> 
  <title>phone</title>
  <use xlink:href="#icon-phone"></use>
</svg>
```

### Пример №1: отдельная иконка со смыслом

Иконки со смысловой нагрузкой требуют альтернативного текста. Этот метод похож на инлайнирование SVG.

* обновите текст названия так, чтобы он отражал предназначение иконки, допустим, это сервисная поддержка мобильных устройств.
* добавьте `role="img"` в `<svg>` (так как SVG не подключается последовательно, он не всегда распознается AT. Например, следующие варианты не работают Mac - VoiceOver + Chrome или Safari, Windows - NVDA + FF).

```svg
<svg role="img"> 
  <title>Supports Mobile Devices</title>
  <use xlink:href="#icon-phone"></use>
</svg>
```

Еще раз, нам нужно смотреть статистику браузеров, чтобы узнать, надо ли нам сделать что-то еще. Если у пользователей сайта Chrome 49.1 или новее, мы можем на этом остановиться.

Однако, если  у большинства пользователей более старые версии Chrome, то нам надо добавить `id="xxxx"` к `<title>` и `aria-labelledby="xxxx"` к `<svg>`.

Здесь стоит в очередной раз поблагодарить разработчиков Chrome за [исправленный баг](https://bugs.chromium.org/p/chromium/issues/detail?id=566252).

<p data-height="265" data-theme-id="0" data-slug-hash="EyxBQa" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/EyxBQa/">Example 1: Standalone SVG Icon, Meaningful</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Пример №2: отдельная декоративная иконка

Декоративные иконки (то есть иконки, дублирующие информацию, переданную текстом или не имеющие особого значения) не нуждаются в альтернативном тексте, их надо прятать от скринридера. В следующем примере мы прячем SVG с помощью `aria-hidden="true"`.

```html
<p>
  <svg aria-hidden="true"> 
    <title>checkmark</title>
    <use xlink:href="#icon-checkmark"></use>
  </svg> 
  Success! Your order went through.
</p>
```

<p data-height="265" data-theme-id="0" data-slug-hash="yJYVpa" data-default-tab="result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/yJYVpa/">yJYVpa</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Пример №3: иконка-ссылка без текста

Для иконок-ссылок без текста, мы можем использовать `aria-label` в элементе `<a>`, чтобы добавить описательный альтернативный текст. В нашем случае к ссылке добавлен `aria-label="See Picked Pens"`.

```html
<a href="link" aria-label="See Picked Pens">
  <svg> 
    <use xlink:href="#icon-codepen"></use>
  </svg>
</a>
```

<p data-height="265" data-theme-id="0" data-slug-hash="dXYOZj" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/dXYOZj/">Example 3: Linked Icon, no text</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Пример №4: иконка-ссылка со статическим текстом

Для иконок-ссылок с текстом надо использовать `aria-label` в ссылке, добавляя альтернативный текст с описанием.

С `aria-label` в теге `a` скринридер не читает текст внутри ссылки, поэтому мы добавили `aria-label="See Picked Pens"` в `a`.

```html
<a href="link" aria-label="See Picked Pens">
  <svg> 
    <use xlink:href="#icon-codepen"></use>
  </svg>
  CodePen
</a>
```

<p data-height="265" data-theme-id="0" data-slug-hash="NrGbwP" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/NrGbwP/">Linked Icon, with static text</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>


### Пример №5: иконка-ссылка с динамическим текстом

Итак, предположим в ссылке у нас динамическое значение текст + иконка. В таком случае мы не должны использовать `aria-label` в ссылке, так как значение динамического текста будет утрачено. В таком случае мы можем использовать тег  `span` и текст, спрятанный за экраном. Числовым значением в `id="itemsInCart"` тега `span` является динамически добавляемый элемент.

* добавьте дополнительный `span` с остальным альтернативным текстом  (типа “предметов в вашей корзине”);
* добавьте этому `span` класс `class="offscreen-text"`, чтобы визуально прятать его;
* добавьте `aria-hidden="true"` в `svg`.

```html
<a href="http://example.com" id="cart">
  <span id="itemsInCart">0</span>
  <span class="offscreen-text">items in your shopping cart</span>
  <svg aria-hidden="true">
    <use xlink:href="#icon-cart"></use>
  </svg>
</a>
```

<p data-height="265" data-theme-id="0" data-slug-hash="mEeOBv" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/mEeOBv/">Example 5: Linked Icon, with dynamic text</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>


**Все образцы иконок:**

<p data-height="265" data-theme-id="0" data-slug-hash="yObzRL" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/yObzRL/">Accessible SVG Icons</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Сложные изображения: доступные графики

Замечательно, что мы можем использовать SVG вместо PNG и JPG, особенно при отображении сложного контента типа графиков. Было бы чрезмерным передавать всю информацию с графика в атрибуте `alt`, поэтому задание альтернативного текста в изображении будет непростым. Но, используя SVG, мы можем сделать весь текст доступным непосредственно.

![График популярности скринридеров](/images/development/svg/image07.png)

### 1. Настройка файла

**Порядок слоев** — в Adobe Illustrator слои SVg экспортируются снизу вверх. Это важно, потому что мы хотим настроить слои так, чтобы они могли логично переключаться с клавиатуры в ходе чтения. Группа “Jaws” должна быть в коде сначала, поэтому в иллюстраторе слой “Jaws” находится в самом низу.

![Порядок слоев в Adobe Illustrator](/images/development/svg/image06-768x257.png)

**Именование слоев** — это хорошая практика, тем более что названия слоев будут добавляться как `id` при экспорте SVG. Не волнуйтесь насчет одинаковых имен, в таком случае, к `id` будет добавляться число.

![Перенос названий слоев в id при экспорте SVG](/images/development/svg/image08-768x385.png)

**Группирование слоев** — важно обратить внимание на то, как сгруппированы элементы. Текстовая метка + ключ элемента вместе со столбиком графика объединяются в одну группу  для каждого варианта графика (Jaws, NVDA и т.д.). Это сделано для понимания прочитанного при использовании скринридеров. В некоторых браузерах пользователь может нажать на столбик и соответствующий текст будет зачитан и/или выделен.

**Сохранение/экспорт** — для гарантии я  держу две версии своего SVG, одну для редактирования в Illustrator, а вторую для редактирования кода. Версию для работы в Illustrator  я сохраняю через меню "сохранить как", а более чистую версию для веба через “файл → экспорт → svg”.

**Оптимизация** — это последнее, что нужно сделать перед ручным редактированием SVG. Инструмент от Джейка Арчибальда [SVGOMG](https://jakearchibald.github.io/svgomg/) отлично справляется с этим. Добавьте SVG, затем переключитесь в режим просмотра “CODE”, чтобы увидеть именно то, что переключает каждая функция. Не забудьте про опцию “prettify”, ведь мы еще будем редактировать код вручную и он должен быть читаемым.

![Работа с SVGOMG](/images/development/svg/image00.gif)

Лучше всего воздержаться от ручного редактирования SVG (добавления доступности) до  полной уверенности в его готовности. Потому как после начала ручного редактирования, работа с SVG в редакторе (Inkscape/Illustrator/и т.д.)  может случайно изменить что-либо из добавленного вручную.

**Контроль за исходниками** — если вы используете контроль версий на основе git  (git, SourceTree и т.д.), добавляйте SVG в коммит. Управление файлом в одной из систем версий поможет решить проблемы с неудачными изменениями в нем, особенно если он был открыт и сохранен в редакторе после ручного исправления, так как Illustrator не понимает любой код для доступности (`aria-*`) и удаляет его.

### 2. Добавление доступности к SVG

**Проходимость для скринридеров** — SVG делается проходимым во всех браузерах после добавления `role="group"` в `<svg>`. В соответствии с новой спецификацией SVG, это должно указывать на роль графического документа. Однако, спецификация по прежнему находиться в режиме разработки и в браузерах еще не реализована.

**Название и описание** — так как у нас есть текстовые элементы в SVG, работающие как название и описание, мы привяжем их к элементу `<svg>` с помощью `aria-labelledby="graph-title"` и `aria-describedby="graph-desc"`.

**Очистка разметки SVG** — удалите все странности, создаваемые Illustrator. Например, к нашему элементу `<text>` добавлено несколько `<tspan>`. Скрин ридер может зачитать отдельные буквы вместо слова целиком (“J” “a” “w” “s” “- 44%” вместо “Jaws - 44%”). Поэтому надо удалить необязательные `<tspan>`, оборачивающие отдельные буквы.

**Плохой пример:**

```svg
<text class="cls-2" transform="translate(345.49 36.45)">
  J
  <tspan x="6.23" y="0">a</tspan>
  <tspan x="14.22" y="0">w</tspan>
  <tspan x="26.51" y="0">s - 44%</tspan>
</text>
```

**Исправленный пример**

```svg
<text class="cls-2" transform="translate(345.49 36.45)">
  Jaws - 44%
</text>
```

**Добавление ссылки на опрос** — это разумное решение, так как график основан на результатах опроса. В SVG 2 это не обязательно, но пока мы добавим `xlink:` к `href`.

```svg
<a xlink:href="http://webaim.org/projects/screenreadersurvey6/#used">
```

Больше об использовании `xlink` вы можете узнать из статьи Дадли Стори  [“We’ll Always Have Paris: Using SVG Namespacing and XLink”](http://thenewcode.com/1066/Well-Always-Have-Paris-Using-SVG-Namespacing-and-XLink).

**Добавление семантических ролей** —  к группам, содержащим столбцы графика, метку и ключ. Сделаем группу, содержащую список всех столбцов, так как большинство скринридеров зачитывают общее число и позицию каждого элемента списка:

```svg
<g id="bars" role="list">
```

Отдельные группы будут размещаться внутри этой группы-списка:

```svg
<g id="Jaws" role="listitem">
```

**Добавление метки к списку** — это даст пользователям вспомогательных технологий больше информации о графике, с которым они взаимодействуют. Метка добавляется к группе, содержащей список `aria-label="bar graph"`.

```svg
<g id="bars" role="list" aria-label="bar graph" transform="translate(0,58)">
```

**Тестирование и исправление** — [тестировать надо скринридером](https://www.paciellogroup.com/blog/2015/01/basic-screen-reader-commands-for-accessibility-testing/). Как и ожидалось, скринридер считывает название, описание и ключи элементов списка. Но он также проходит через процентные значения на y-осях, каждом прямоугольнике и каждой линии.

Небольшое замечание по скрытию элементов (прямоугольников, кругов) от вспомогательных технологий в SVG. Единственный способ для этого —  добавить им `role="presentation"`. Таким образом вы отключаете нативную семантику для  accessibility API. Если вам надо спрятать много элементов, то, к сожалению, вы не можете просто обернуть их тегом `<g>` и добавить `role="presentation"`. Хорошая новость состоит в том, что новая спецификация SVG Accessibility решает большую часть этих проблем. Элементы, такие как формы без альтернативного текста, будут рассматриваться так, как если бы у них была роль  `none` или `presentation`.

**Скрытие форм/линий** - все элементы с геометрическими формами прячутся путем добавления `role="presentation"`.

![График с подсвеченными текстовыми элементами, которые надо скрыть](/images/development/svg/image02.png)

**Скрытие текстовых элементов** — мешающие текстовые элементы надо спрятать от скринридера (на рисунке выше они подсвечены желтым цветом, это процентные значения у вертикальной оси, линия горизонтальной оси и столбцы в графике) путем добавления `role="presentation"` и `aria-hidden="true"`.

<p data-height="265" data-theme-id="0" data-slug-hash="MeJKee" data-default-tab="html,result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/MeJKee/">Accessible Complex Image - Bar Graph</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Демо-видео использования скринридеров:

* [JAWS](https://www.youtube.com/watch?v=7mKPbuqJC3k&feature=youtu.be)
* [NVDA](https://www.youtube.com/watch?v=Y8-2YzW0xds&feature=youtu.be)
* [VoiceOver](https://www.youtube.com/watch?v=vBuIzme3CJ0&feature=youtu.be)
* [Narrator](https://www.youtube.com/watch?v=EHeRnmBEWoU&feature=youtu.be)

## Интерактивные изображения

Еще лучше, в сравнении с диаграммами и графиками, обстоят дела с доступностью интерактивных изображений. Рассмотрим простую хронологическую инфографику. Она разбивается на верхнюю часть с заголовком и раздел хронологии, который в свою очередь разбивается на сегменты, каждый из которых содержит заголовок, изображение и описание.

![Инфографика с распорядком дня кошек](/images/development/svg/image03-680x1024.png)

Добавим этой инфографике немного жизни и анимируем временные сегменты. Вместо того, чтобы показывать всю информацию сразу, мы выведем только время и круг с названием кошачьей активности. При взаимодействии пользователя с временем или названием будет выводиться остальная информация.

### 1. Настройка файла

Все то же самое, что и в секции [настройка файла](#heading-section-12) предыдущего раздела. Но после описания оптимизации для веба можете смело пропускать все об анимации CSS и переходить непосредственно к доступности.

### 2. Доступность 

Стили удалены из следующих примеров для упрощения кода, но они, разумеется, есть в работающем демо.
{: .info}

**Проходимость для скринридеров** — чтобы SVG был проходимым во всех браузерах, добавьте к SVG `role="group"`/

```svg
<svg id="InteractiveSVG" role="group">
```

**Название и описание** — в нашем примере мы можем использовать текст в верхней части SVG (`<g id="timeline-title">`) в качестве названия и ссылаясь на него с помощью `aria-labelledby` в `<svg>`.

![Название SVG в инспекторе](/images/development/svg/image09-768x223.png)

```svg
<svg id="InteractiveSVG" aria-labelledby="timeline-title" aria-describedby="timeline-desc" role="group">
```

Затем добавим `id` к `<desc>` и привяжем его к `<svg>` с помощью `aria-describedby`.

```svg
<desc id="timeline-desc">An Interactive Timeline</desc>
```

```svg
<svg id="InteractiveSVG" aria-labelledby="timeline-title" aria-describedby="timeline-desc" role="group">
```

**Добавление семантических ролей** — добавьте семантические роли к группам, содержащим хронологию и ее отдельные сегменты. Вот группа с полным списком: `<g id="timeline" role="list">`. 

Добавьте метку к списку: `<g id="timeline" role="list" aria-label="the timeline, from morning to night">`.

Отдельные временные сегменты будут элементами списка: `<g id="play" role="listitem">`.

**Взаимодействие/доступность с клавиатуры** - сразу после каждого элемента `<g>`  с `role="listitem"` добавьте `<a xlink:href></a>` так, чтобы он охватывал все содержимое группы. На данный момент это единственный способ добавить интерактивность к SVG.

Добавьте туда же `tabindex="0"`, чтобы обеспечить фокусируемость во всех браузерах.

```svg
<a xlink:href="#play-group" tabindex="0" id="play-group"></a>
```

**Исправление семантики ссылок** — обратите внимание, что ссылки указывают сами на себя. Это не семантичные ссылки, так как они не ведут к чему-либо и могут смутить пользователей скринридеров. Поэтому добавим `role="img"`, чтобы обозначить, что это изображение, а не ссылка.

```svg
<a xlink:href="#play-group" role="img" id="play-group"></a>
```

**Доступность текста внутри временных сегментов** — добавление роли изображения прекращает проход элементов вспомогательными технологиями, поэтому нам надо добавить `aria-labelledby` с идентификаторами текстовых элементов в том порядке, в котором они читаются.

```svg
<a xlink:href="#play-group" role="img" aria-labelledby="play-time play-text" tabindex="0" id="play-group"></a>
```

**Добавление скрытого описания для изображений** — используйте `<tspan>` с классом для скрытия элемента так, что визуально он скрыт, но остается в DOM.

```svg
<tspan class="offscreen" id="play-description">A gray kitten tangled in a ball of yarn.</tspan>
```

**Добавление идентификатора** к атрибуту `aria-labelledby` в `xlink` так, чтобы он стал читаемым.

```svg
<a xlink:href="#play-group" role="img" aria-labelledby="play-time play-text play-description" tabindex="0" id="play-group"></a>
```

**Добавление стилей для фокуса** — настройка стилей для фокуса необходима пользователям, осуществляющим навигацию в браузере с помощью клавиатуры. Мне нравятся эти стили, поэтому я добавила их и для наведенного состояния.

```css
a:focus [class*="time-circle"], a:hover [class*="time-circle"] {
  stroke: black;
  stroke-width: 5;
  paint-order: stroke;
}
```

**Добавление JavaScript для фокуса окна** — в SVG при навигации по ссылкам окно не всегда сдвигается так, чтобы элемент оказался в области видимости. Причина этого в том, что некоторые браузеры ([баг-репорт добавлен](https://bugzilla.mozilla.org/show_bug.cgi?id=778654) и, надеюсь, скоро будет исправление) прокручивают элемент `<svg>` целиком, не учитывая, что некоторые дочерние элементы могут оказаться за экраном. Поэтому мы добавим немного JavaScript к прокрутке окна, чтобы обеспечить видимость сфокусированных элементов.

Есть и более эффективные способы, но для нашего быстрого примера хватит и этого:

```javascript
$("#play-group").focus(function() {
  window.scrollTo(250,350);
});
...
$("#cuddle-group" ).focus(function(){
  window.scrollTo(250 , 1350);
});
```

<p data-height="565" data-theme-id="0" data-slug-hash="yJgeOe" data-default-tab="result" data-user="hmig" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/hmig/pen/yJgeOe/">Accessible Interactive SVG</a> by Heather Migliorisi (<a href="http://codepen.io/hmig">@hmig</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Видео с демонстрацией работы скринридеров:

* [JAWS](https://www.youtube.com/watch?v=MqMQTN5UMvg&feature=youtu.be)
* [NVDA](https://www.youtube.com/watch?v=CRXYPrEEg0s&feature=youtu.be)
* [VoiceOver](https://www.youtube.com/watch?v=ae1qyUa2gPc&feature=youtu.be)
* [Narrator](https://www.youtube.com/watch?v=m4ucBNCyoYU&feature=youtu.be)

## SVG и режим повышенной контрастности

И еще одна проблема: Windows и режим повышенной контрастности для людей со слабым зрением, использующих эту возможность для улучшения читаемости содержимого. Это проблема потому, что при использовании этой возможности может измениться цвет текста или тела документа, но элементы в SVG не обновляются при изменении режима контрастности.

![Фейспалм](/images/development/svg/image04.png)

Хорошая новость: у нас есть специальные медиа-запросы для решения этой проблемы.

Вот пример исправлений для раздела с иконками в этой статье:

```css
@media screen and (-ms-high-contrast: active) {
  .icon svg {
    /* select a color that will contrast 
       well on black or white because other 
       color modes can be chosen and you 
       need a color that will work with either 
    */
    fill: green;
  }
}

/* black text on white background *.
@media screen and (-ms-high-contrast: black-on-white) {
   .icon svg {
     /* select a dark color that will 
        contrast on black 
        (#fff is too much contrast) 
     */
    fill: #333;
  }
}

/* black text on white background */
@media screen and (-ms-high-contrast: white-on-black) {
 .icon svg {
    /* select a light color that will 
       contrast on white 
       (#000 is too much contrast)
    */
    fill: #efefef;
  }
}
```

## Заключение

Задавайте при необходимости альтернативный текст:

1. Если альтернативного текста нет, прячьте SVG от вспомогательных технологий с помощью `aria-hidden="true"`.
2. Если альтернативный текст есть:    
       1. Добавьте название и/или описание в элемент SVG (или ссылку на них).
       2. Используйте роли для добавления семантических значений (типа `role="list"`, `role="listitem"`).
       3. Прячьте графические и группирующие элементы, которые не следует зачитывать с помощью `role="presentation"`.
       4. Прячьте текстовые элементы, которые не следует зачитывать с помощью `role="presentation"` и `aria-hidden="true"`.

Для интерактивных SVG:

1.  Установите фокус с помощью `xlink` и  `tabindex="0"`.
2.  Если ссылка не выполняет функции ссылки, добавьте соответствующую семантическую роль.
3.  Добавьте JavaScript для настройки фокуса окна.
4.  Задайте CSS для выделения `focus: outline`.

Тестируйте с разными скринридерами и браузерами. Тестируйте в различных режимах контрастности. Тестируйте навигацию с клавиатуры.

## Благодарности

Огромное спасибо Амелии Беллами-Ройдс и Леони Уотсон за проверку примеров и выявление проблем. Я бы не смогла написать эту статью без их помощи.

Баги, сообщения о которых были отправлены в ходе работы над статьей:

**Microsoft:**

* [https://connect.microsoft.com/&#8203;IE/Feedback/Details/&#8203;2483564](https://connect.microsoft.com/IE/Feedback/Details/2483564)
* [https://connect.microsoft.com/&#8203;IE/Feedback/Details/&#8203;2480772](https://connect.microsoft.com/IE/Feedback/Details/2480772)

**Mozilla:**

* [https://bugzilla.mozilla.org/&#8203;show_bug.cgi?&#8203;id=1257399](https://bugzilla.mozilla.org/show_bug.cgi?id=1257399)
* [https://bugzilla.mozilla.org/&#8203;show_bug.cgi?&#8203;id=1257600](https://bugzilla.mozilla.org/show_bug.cgi?id=1257399)

Баги, исправленные в ходе работы над статьей:

* [баг Safari/WebKit](https://bugs.webkit.org/show_bug.cgi?id=145263), требовавший добавления `role="img"` в тег `<img>`.
* [баг Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=566252), требовавший добавления `aria-labelledby` или `aria-label` в SVG для чтения его названия.

## Ресурсы

* [Making the Switch Away from Icon Fonts to SVG: Converting Font Icons to SVG](https://sarasoueidan.com/blog/icon-fonts-to-svg/) by Sara Soueidan
* [WAI Image Tutorial](https://www.w3.org/WAI/tutorials/images/)
* [WebAIM: Alternative Text, Context is Everything](http://webaim.org/techniques/alttext/#context)
* [W3C - Requirements for providing text to act as an alternative for images](https://www.w3.org/TR/html51/semantics-embedded-content.html#alt-text)
* [Accessibility APIs: A Key To Web Accessibility](https://www.smashingmagazine.com/2015/03/web-accessibility-with-accessibility-api/#accessibility-apis) by Léonie Watson & Chaals McCathie Nevile
* [W3C - The ‘desc’ and ‘title’ elements](https://www.w3.org/TR/SVG11/struct.html#DescriptionAndTitleElements)
* [Tips for Creating Accessible SVG](https://www.sitepoint.com/tips-accessible-svg/) by Léonie Watson
* [SVGOMG](https://jakearchibald.github.io/svgomg/) by Jake Archibald
* [W3C - graphics-doc](https://jakearchibald.github.io/svgomg/) (role)
* [We’ll Always Have Paris: Using SVG Namespacing and XLink](http://thenewcode.com/1066/Well-Always-Have-Paris-Using-SVG-Namespacing-and-XLink) by Dudley Storey
* [Basic screen reader commands for accessibility testing](https://www.paciellogroup.com/blog/2015/01/basic-screen-reader-commands-for-accessibility-testing/) by The Paciello Group
* [W3C - Including Elements in the Accessibility Tree](http://w3c.github.io/aria/svg-aam/svg-aam.html#include_elements)
* [-ms-high-contrast media feature](https://msdn.microsoft.com/en-us/library/windows/apps/hh465764.aspx)
