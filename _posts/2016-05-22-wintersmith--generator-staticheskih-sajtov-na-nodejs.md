---
title: "Wintersmith — генератор статических сайтов на Node.js"
layout: post
categories: [development]
tags: [static, javascript, translation, sitepoint]
date: 2016-05-22 13:57:06 +0300
prism: full
description: "Статья прошлогодняя, впрочем,  Wintersmith за это время особо не поменялся."
original: "http://www.sitepoint.com/getting-started-wintersmith-nodejs-static-site-generator/"
original_title: "Getting Started with Wintersmith: A Node.js-based Static Site Generator"
original_author: "Брайан Риналди"
thumbnail: "/images/development/static/wintersmith.png"
---

Я много говорил и писал на тему статических сайтов в последнее время. В общем, я рекомендую всем  Jekyll, как наиболее стабильный и функциональный генератор на даный момент. Но многих разработчиков останавливает то, что он написан на Ruby. И многие спрашивают: "Есть ли альтернатива, основанная на JavaScript и доступная через npm?".

В этой статье, первой в серии из двух частей, мы рассмотрим такой вариант: [Wintersmith](http://wintersmith.io/). Это производительный генератор статических сайтов, у которого есть один очень серьезный недостаток — отсутствие детальной документации. Надеюсь, что эта статья позволит людям, знакомым с JavaScript, начать работать с Wintersmith.

## Образец сайта

Для этой статьи  я сделал пример сайта, который вы можете найти [здесь](https://github.com/sitepoint-editors/Static-Site-Samples). Это фан-сайт [ Adventure Time!](http://www.cartoonnetwork.com/games/adventuretime/index.html) и выглядит он так:
![Adventure Time!](/images/development/static/1427419172sample-project.jpg)

Целью нашего проекта является сборка этого сайта с использованием генераторов статических сайтов для их сравнения. Этот сайт прост, но в нем есть определенные вещи, которые должны быть и в [ Wintersmith](http://wintersmith.io/):

* Собственные глобальные метаданные— возможность глобально задавать собственные метаданные,  доступные для шаблонов;
* Собственные метаданные постов— возможность задавать собственные метаданные для поста, доступные при выводе поста отдельно или в списке;
* Наборы данных — возможность добавлять контент, не являющийся постом или страницей, а собственным типом данных (в нашем случае это  данные о персонажах).
Все данные о персонажах, контент и изображения взяты из [Adventure Time! wiki](http://adventuretime.wikia.com/). Дизайн взят из бесплатного шаблона [ HTML5UP](http://html5up.net/).

## Как настроить Wintersmith

Одним из преимуществ базирования Wintersmith на Node.js и npm является простота установки. Для этого достаточно выполнить в консоли следующую команду (в Windows можно обойтись без `sudo`):

```bash
$ sudo npm install -g wintersmith
```

Все! Теперь вы можете начинать новый проект.

### Создание сайта

Для создания нового сайта на базе Wintersmith достаточно следующей команды:

```bash
$ wintersmith new [project name]
```

Для нашего тестового сайта мы используем имя  “wintersmithsite”, поэтому команда будет такой:

```bash
$ wintersmith new wintersmithsite
```

Команда создаст каталог с именем проекта и поместит в него набор файлов, которые мы можем модифицировать в ходе построения сайта.

Если мы взглянем на сгенерированные сайты, мы увидим, что Wintersmith размещает конфигурацию, шаблоны и плагины в корневой каталог, а содержимое сайта в специальный каталог “contents”.

### Тестирование сайта

Для запуска сайта на локальном сервере, перейдите в его каталог и запустите предпросмотр:

```bash
$ cd wintersmithsite
$ wintersmith preview
```

По умолчанию , локальный сервер запускает на порту 8080, поэтому наш сайт доступен по адресу `http://localhost:8080`. При желании мы можем задать другой порт с опцией `-p`. Кроме того, по умолчанию сервер настроен на выдачу в консоль детальных сообщений об ошибках и загруженных ресурсах. Об остальных опциях сервера можно узнать, вызвав помощь:

```bash
$ wintersmith preview -help
```

Настраивать опции сайта можно также путем редактирования файла `config.json`, расположенного в корне проекта.

## Основы шаблонов

В качестве шаблонизатора по умолчанию Wintersmith использует [ Jade](http://jade-lang.com/) (ныне также известный как [pug](https://github.com/pugjs/pug),  на русском можно почитать [ перевод документации](http://jsman.ru/jade/) или  [введение](https://habrahabr.ru/post/278109/)). Им же мы будем пользоваться для примеров в этой статье, но учтите, что в Wintersmith достаточно [плагинов](https://github.com/jnordberg/wintersmith/wiki/Plugins) на случай, если вы предпочитаете иной шаблонизатор.

Шаблоны располагаются в каталоге `templates` в корне сайта. Jade достаточно минималистичный шаблонизатор  — в нем нет скобок и закрывающих тегов, для правильного вывода важны отступы. Рассмотрим его основы, чтобы перейти к созданию шаблонов.

### Вывод данных

В Jade есть много способов для вывода данных из переменных. Наиболее традиционный это присваивание значения переменной тегу в шаблоне. Например, в следующем примере шаблон `templates/article.jade` поместит название статьи внутрь тега `<h2>`:

```jade
h2= page.title
```

По умолчанию содержимое переменной экранируется перед выводом. Это значит, что если внутри переменной есть HTML, то теги не будут выводится, на выходе будет только простой текст. Если нам нужен рендеринг содержимого, мы должны прямо указать это в шаблоне, добавив восклицательный знак, в нашем файле `templates/article.jade` это будет выглядеть так:

```jade
section.content!= typogr(page.html).typogrify()
```

Мы можем делать тоже самое с атрибутами. Следующий пример из `templates/partials/homepagemiddle.jade` создает тег `<a>` с атрибутом `href`, содержащим адрес статьи.

```jade
a(href= article.url, class="image featured")
```

Если вам интересно, как сделать переменные доступными объекту страницы по умолчанию, это описано в [документации](https://github.com/jnordberg/wintersmith#the-page-plugin). Отдельно замечу,что переменная `article` не дефолтная, а результат цикла, позднее мы это рассмотрим.

Другой способ вывода переменных в  Jade это  `#{ variableName }`. При этом весь контент экранируется (в нашем примере этот метод не применялся).

Если же вы хотите, чтобы контент выводился неочищенным, используйте синтаксис `!{ variableName }`. Например, если мы выводим  основное содержимое поста, мы хотим, чтобы все теги рендерились. Вот пример из `templates/partials/homepagemiddle.jade`:

```jade
!{ typogr(article.intro).typogrify() }
```
Весь код, находящийся до вертикальной черты будет выведен как [простой текст](http://jade-lang.com/reference/plain-text/).

### Модули npm

Вы, наверное, заинтересовались, как вызывается `typogrify()`. В Wintersmith можно использовать модули npm. В сгенерированном нами сайте используются три модуля: [typogr](https://www.npmjs.com/package/typogr) (именно его мы и использовали выше), [Moment.js](https://www.npmjs.com/package/moment) (об этом модуле есть [статья](http://www.sitepoint.com/managing-dates-times-using-moment-js/)) и [ Underscore](https://www.npmjs.com/package/underscore).

Давайте взглянем, как используется Moment.js для форматирования даты внутри шаблона `templates/partials/homepagemiddle.jade`:

```jade
p= "Posted " + moment.utc(article.date).format('MMM DD, YYYY')
```

Moment.js предлагает широкий функционал, в который входит не только форматирование, и все это доступно внутри ваших шаблонов. И мы не ограничены одним только Moment.js: мы можем добавить любой модуль npm командой `require` внутри `config.json`, установить через `npm install` и затем использовать в шаблонах.

### Вложения

Для удобства поддержки и многократного использования повторяющихся фрагментов, мы можем разбить наши шаблоны с помощью [вложений](http://jade-lang.com/reference/includes/). Код из шаблона `templates/index.jade` подключает шаблон `templates/partials/header.jade` (расширение файла `jade` при подключении не указывается):

```jade
include ./partials/header
```

Jade также поддерживает наследование,с помощью чего создаются отдельные блоки многократно используемого кода. Детали описаны в [документации](http://jade-lang.com/reference/inheritance/).

### Условия

Иногда вам нужно изменять вывод шаблона в зависимости от каких-либо условий. В  Jade для этого есть [условное ветвление](http://jade-lang.com/reference/conditionals/).  Jade  поддерживает `if`, `else if`, `else` и `unless` (отрицательная форма `if`).

Пример из `templates/partials/header.jade` выводит баннер везде, кроме `page` (так как все посты относятся к типу `page`, баннер будет выведен только на домашней странице):

```jade
if !page
    section(id="banner")
        header
            h2 Explore the Land of Ooo...
            p ...and its many kingdoms!
```

Это же условие можно реализовать с помощью `unless page`.

Jade также поддерживает блоки условий `case`, подробности, как всегда, в [документации](http://jade-lang.com/reference/case/).

### Циклы

Циклы активно используются в наших шаблонах, пробегаем ли мы ими по постам или данным. В Jade есть [циклы](http://jade-lang.com/reference/iteration/) `each` и `while`.

Следующий пример из файла `templates/partials/homepagemiddle.jade ` выводит все символьные данные с помощью цикла `each`. В середине домашней страницы мы отобразим каждый символ вместе с его изображением, названием и описанием. Цикл `each` проходит через каждый объект в массиве и назначает его значение переменной `character`, тем самым получая доступ ко всем свойствам элементов.

```jade
each character in contents.characters
    div(class="4u")
        section(class="box")
            span(class="image featured")
                img(src= character.metadata.image)
            header
                h3= character.metadata.name
            p= character.metadata.description
```

К сожалению, нельзя добавить лимит или сдвиг для этого цикла. Это можно сделать скомбинировав переменные и условия, в следующем примере мы так покажем только первые два поста. Учтите, что тире перед объявлением переменных  (`i` и `articles`) показывает, что они будут работать на сервере все время компиляции. Это значит, что на готовой странице  сайта этот код выводиться не будет.

```jade
- var i=0
 - var articles = env.helpers.getArticles(contents);
 each article in articles
     - i++
     if i<3
         div(class="6u")
             section(class="box")
                 a(href= article.url, class="image featured")
                     img(src= article.metadata.banner)
                 header
                     h3= article.title
                     p= "Posted " + moment.utc(article.date).format('MMM DD, YYYY')
                 | !{ typogr(article.intro).typogrify() }
                 footer
                     ul(class="actions")
                         li
                             a(href= article.url, class="button icon fa-file-text") Continue Reading
```

Мы используем `env.helpers.getArticles(contents);` для получения массива статей в каталоге contents/articles. Это не  документировано,  метод берет начало из [плагина разбивки страниц](https://github.com/jnordberg/wintersmith/blob/718250eefdef08e9667650c350da0fb37c185936/examples/blog/plugins/paginator.coffee), настраиваемого в `config.json`.

Следующий и последний пример в нашей статье показывает имитацию лимита и отступа в цикле одновременно (пропускаются первые две статьи, затем выводятся пять):

```jade
- var i=0
- var articles = env.helpers.getArticles(contents);
each article in articles
    -i++
    if (i>2) && (i<8)
        li
            span(class="date")
                !=moment.utc(article.date).format('MMM')
                strong= moment.utc(article.date).format('DD')
            h3
                a(href=article.url)= article.title
            p= article.metadata.shortdesc
```

## Заключение

В этой статье мы познакомились  с  Wintersmith, генератором статических сайтов на Node.js. Мы рассмотрели установку и начало работы, а также обсудили некоторые особенности Jade, дефолтного шаблонизатора в Wintersmith. В следующей части, я покажу, как создавать посты, используя Markdown, как настраивать собственные метаданные, как провести сборку и развертывание сайта.

Как вы заметили, одним из наиболее интересных преимуществ Wintersmith является возможность использования модулей npm. Это значительно расширяет возможности разработчиков по настройке и добавлению функционала на сайт.
