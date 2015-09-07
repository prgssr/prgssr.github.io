---
layout: post
title: Снимаем вершки с медиа-запросов
date:   2015-08-07 11:36:00
categories: [development]
tags: [translation sitepoint CSS]
published: True
description: "Условная загрузка стилей в современные браузеры без помощи JavaScript"
original: "http://www.sitepoint.com/cutting-the-mustard-with-css-media-queries/"
original_author: "Энди Кирк"
prism: yes
noimage: truth
---
{% include translate.html %}

{% include toc.md %}

[Снимать вершки (Cutting the Mustard)](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard) это термин Тома Маслена с BBC. Суть его метода состоит в использовании JavaScript для проверки возможностей браузера перед дальнейшей загрузкой CSS и JavaScript, чтобы улучшить ощущения пользователей и загрузить лишь базовые файлы, если возможности браузера невелики.

Этот метод вызвал огромный интерес, появились такие статьи как [Migrating to Flexbox by Cutting the Mustard](http://www.sitepoint.com/migrating-flexbox-cutting-mustard/), [Server Side Mustard Cut](https://css-tricks.com/server-side-mustard-cut/) и [Progressive Enhancement](http://www.sitepoint.com/javascript-dependency-backlash-myth-busting-progressive-enhancement/)

## Делаем лучше

Мой опыт подсказывает, что даже самый базовый функционал может быть проблемным для самых старых браузеров, поэтому я хотел бы не передавать в старые браузеры никаких стилей, а по возможности оставить им только чистый HTML.

Конечно, очевидное решение использовать JavaScript для условной загрузки стилей решает задачу, но при этом современные браузеры, в которых JavaScript отключен пользователями, будут получать страницы без стилей. Поэтому я искал возможность условной загрузки CSS без использования скриптов и в итоге нашел [старый пост Крейга Баклера](http://www.sitepoint.com/support-old-browsers-responsive-web-design/). После нескольких экспериментов я пришел к следующему коду:

```markup
<!-- in the <head> -->
<link rel="stylesheet" href="css/your-stylesheet.css"
      media="only screen and (min-resolution: 0.1dpcm)">
<link rel="stylesheet" href="css/your-stylesheet.css"
      media="only screen and (-webkit-min-device-pixel-ratio:0)
      and (min-color-index:0)">
```

Давайте проверим,  к чему это приведет.

## Как это работает

Первый элемент `<link>` с меди-запросом загружает стили только в следующих браузерах:

* IE 9+
* FF 8+
* Opera 12
* Chrome 29+
* Android 4.4+

А второй  элемент `<link>` с меди-запросом загружает стили для такого набора браузеров:

* Chrome 29+
* Opera 16+
* Safari 6.1+
* iOS 7+
* Android 4.4+

При совмещении этих запросов, данная техника позволяет не загружать стили, если браузер не относится к следующему списку:

* IE 9+
* FF 8+
* Opera 12, 16+
* Chrome 29+
* Safari 6.1+
* iOS 7+
* Android 4.4+

Примечание: стили загружаются только один раз, независимо от количества элементов `<link>`.

Можно скомбинировать медиа-запросы в один элемент `<link>`, разделив их с помощью запятой, вот так:

```markup
<link rel="stylesheet" href="css/your-stylesheet.css"
      media="only screen and (min-resolution: 0.1dpcm),
      only screen and (-webkit-min-device-pixel-ratio:0)
      and (min-color-index:0)">
```

Однако, я предпочитаю разделять их, чтобы было проще понимать, что происходит.

Так что если вы структурируете вашу разметку для семантичности и доступности, старые браузеры смогут по прежнему воспроизводить ваш нестилизованный контент в чистом HTML.

Это, конечно, очень субъективно, но на мой взгляд, все, кто использует эти браузеры, заслуживают того, чтобы получить то, что им нужно. Вполне вероятно, что передавая в старые браузеры современный CSS, вы можете поломать некоторые вещи и страница будет совершенно непригодной. Наш метод, как минимум, ничего не испортит. И более важно то, что вам не надо ничего тестировать в этих браузерах. Вы разобрались с ними. По крайней мере, в теории.

Конечно, список поддерживаемых вами браузером может меняться и в этом еще одно преимущество этой техники - вы можете расширять список браузеров. Например, вам надо добавить поддержку ИЕ8 - вы просто добавляете условный комментарий, загружающий стили в браузер:

```markup
<!--[if IE 8]>
<link rel="stylesheet" href="css/your-stylesheet.css">
<![endif]-->
```

А если вам надо поддерживать старые устройства на основе WebKit с соотношением пикселей больше 1, вы просто добавите еще один элемент `<link>` с целевым меди-запросом:

```markup
<link rel="stylesheet" href="css/your-stylesheet.css"
      media="only screen and (-webkit-min-device-pixel-ratio:1.1)">
```

Сам по себе, этот код будет загружать стили только для  Android 2.2+ (у меня не было возможности протестировать более ранние версии), но если он подключен в дополнение к другим элементам `<link> `, он просто добавляет эту группу браузеров.

Также возможно, что вы сможете изменить медиа-запросы основного элемента `<link>`, чтобы кастомизировать выборку поддерживаемых браузеров. Однако, тестирование этого будет достаточно сложным, так что будьте осторожны.

## "Но это же хак!"

Да, наверное, хотя это зависит от вашего подхода. Медиа-запросы созданы для тестирования возможностей браузера перед применением CSS и в данном случае мы используем их именно с этой целью, хотя и косвенно.

Опять-таки, независимо от того, хак это или нет, я доволен этой техникой и она работает во всех проведенных мной тестах, в ближайшее время я планирую использовать ее на рабочем сайте.

## Где это не работает

Я много тестировал этот метод и столкнулся только с одним случаем, когда он не работает так, как ожидалось. UC Browser в Android 4.4 не реагирует на медиа-запрос. Насколько я понимаю,это происходит в силу того, что этот браузер использует старую версию движка Webkit.

Если вам нужна поддержка этого браузера, вы можете заставить его загрузить стили с помощью JavaScript:

```javascript
if (navigator.userAgent.indexOf('UCBrowser') > -1) {
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'css/your-stylesheet.css';
  document.getElementsByTagName('head')[0].appendChild(link);
}
```

В качестве бонуса добавлю, что нет никакого способа отключить JavaScript в Android UC Browser, а значит этот код загрузит стили в любом случае, кроме, конечно, сбоев в сети и прочего форс-мажора.

Конечно, если вы найдете более специфичные браузеры, которые вам надо поддерживать, вы всегда может добавить подобный код, но я рекомендую делать это только при необходимости, ведь иначе мы утрачиваем смысл техники условной загрузки без JavaScript.

[Я создал тестовую страницу](http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2015/08/1438671257support.html), чтобы проверить базовый метод в различных браузерах. Если вы найдете  браузеры, в которых метод работает не так, как ожидается или если вы найдете другие медиа-запросы, добавляющие поддержку новых браузеров или групп браузеров, пожалуйста оставьте там комментарий или создайте issue в [GitHub репозитории](https://github.com/Fall-Back/CSS-Mustard-Cut).

## Как насчет загрузки скриптов?

ОК, вы используете CSS для определения списка поддерживаемых браузеров, а, значит, скорее всего вам понадобиться загружать скрипты только для тех же самых браузеров. И как это сделать?

Этого можно достичь несколькими способами, но самый простой работает примерно так:

* Добавьте к своим стилям безвредное CSS свойство к элементу `body` со значением, отличным от дефолтного.
* Используйте JavaScript метод `getComputedStyle` на элементе `body`, чтобы выяснить применено ли свойство или нет.
* Если свойство задано, то вы можете запускать остальной JavaScript.

Например, свойство `clear` по умолчанию задано как `none`.  Установка его в значение `both` для `body` не вызовет каких-либо видимых последствий (но если это внезапно произойдет, то вы сможете взять иное свойство). В CSS эта декларация будет выглядеть так:

```css
body {
  clear: both;
}
```

А вот и скрипт для проверки:

```javascript
var is_supported = false
  , val = '';
if (window.getComputedStyle) {
  val = window.getComputedStyle(document.body, null).getPropertyValue('clear');
} else if (document.body.currentStyle) {
  val = document.body.currentStyle.clear;
}

if (val == 'both') {
  is_supported = true;
}
```

## Итоговый код

Независимо от того, считаете ли вы это хаком или нет, я всего лишь показываю многоразовый способ выявления относительно современных браузеров и предотвращения загрузки в старые браузеры современных скриптов и стилей, заставляя их отображать лишь чистый HTML. Необходимый код невелик и позволяет вам сконцентрироваться на создании современных страниц для современных браузеров с использованием последних технологий.

Возможно, что вам не понадобиться все, о чем я написал, но вот на всякий случай полный код:

```markup
<head>
  <link rel="stylesheet" href="mq-test.css"
        media="only screen and (min-resolution: 0.1dpcm)">
  <link rel="stylesheet" href="mq-test.css"
        media="only screen and (-webkit-min-device-pixel-ratio:0)
        and (min-color-index:0)">
  <link rel="stylesheet" href="mq-test.css"
        media="only screen and (-webkit-min-device-pixel-ratio:1.1)">

  <!--[if IE 8]>
  <link rel="stylesheet" href="mq-test.css">
  <![endif]-->

  <script>
    if (navigator.userAgent.indexOf('UCBrowser') > -1) {
      var link  = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'mq-test.css';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  </script>
</head>
<body>
<!-- content here... -->
  <script>
    var is_supported = false
      , val = '';
    if (window.getComputedStyle) {
      val = window.getComputedStyle(document.body, null).getPropertyValue('clear');
    } else if (document.body.currentStyle) {
      val = document.body.currentStyle.clear;
    }

    if (val == 'both') {
      is_supported = true;
    }

    if (is_supported) {
      // Load or run JavaScript for supported browsers here.
    }
  </script>
</body>
```

Я также сделал [еще один тест со всеми расширениями](http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2015/08/1438671259support-extra.html).

## Благодарности

Я бы не сделал это без использования [BrowserStack](https://www.browserstack.com/), [Can I Use](http://caniuse.com/), работы всей команды [Browserhacks](http://browserhacks.com/) и [Джеффа Клейтона](https://github.com/jeffclayton/css_hack_testing), поэтому спасибо всем, кто участвовал и пожалуйста дайте мне знать, если у вас появятся какие-либо идеи или отзывы.
