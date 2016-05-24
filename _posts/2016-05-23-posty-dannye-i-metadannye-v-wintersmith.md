---
title: "Посты, данные и метаданные в Wintersmith"
layout: post
categories: [development]
tags: [static, javascript, translation, sitepoint]
date: 2016-05-23 21:42:21 +0300
prism: full
description: "Вторая статья о Wintersmith — написание постов и создание сайта на основе данных"
original: "http://www.sitepoint.com/creating-posts-custom-metadata-data-wintersmith/"
original_title: "Creating Posts, Custom Metadata, and Data in Wintersmith"
original_author: "Брайан Риналди"
thumbnail: "/images/development/static/wintersmith.png"
---


В  первой части нашего короткого цикла мы ознакомились с Wintersmith, одним из лучших генераторов статических сайтов на базе Node.js. Мы рассмотрели установку, начало работы и некоторые особенности дефолтного шаблонизатора Jade.

В этой части мы научимся создавать посты в формате  Markdown, задавать собственные метаданные, а также рассмотрим сборку и развертывание сайта.

## Создание постов

В первой части мы создавали наши шаблоны на основе Jade. Теперь же пришло время создать контент для нашего сайта. По умолчанию посты создаются в [Markdown](http://daringfireball.net/projects/markdown/) на движке [Marked](https://github.com/chjj/marked), другие движки доступны как [плагины](https://github.com/jnordberg/wintersmith/wiki/Plugins).

Большинство разработчиков знакомы с Markdown, но не пугайтесь, если вы не относитесь к их числу — он прост. Тем более, что  многие редакторы кода поддерживают его по умолчанию или через плагины. Также существуют специальные редакторы Markdown, например, [Mou ](http://25.io/mou/) для OSX  и [MarkdownPad](http://markdownpad.com/) для  Window. Я не буду вдаваться в детали Markdown, но если вам нужно с чего-то начать, рекомендую эту  [страницу](http://daringfireball.net/projects/markdown/syntax).

Посты помещаются в каталог `contents/articles`, каждый пост получает свой каталог, что дает удобные для SEO URL. Например, наш пост для эпизода шестого сезона Adventure Time! под названием “Breezy”, будет помещен в каталог `articles/season-6-breezy`. В этом каталоге будет один файл — `index.md`.

###  Метаданные поста

В верхней части каждого поста располагаются метаданные в [формате YAML](http://www.yaml.org/start.html), аналогично [вводным в Jekyll](/documentation/07_frontmatter). Обязательными являются три вида метаданных: `template`, `title` и `date`. `template` определяет шаблон, используемый для рендеринга, `title` название поста, а `date` — его дата. Если не указан `template`, пост не будет рендерится, а при отсутствии `title` и `date` эти поля будут заполнены дефолтными значениями.

Мы можем добавить столько метаданных, сколько захотим. Это мы рассмотрим позднее в разделе о собственных метаданных.

В Wintersmith также можно определять метаданные для постов в формате JSON, вкладывая файл JSON  в каталог с постом. Детали этого описаны в [документации](https://github.com/jnordberg/wintersmith#model).

###  Определение размеров выдержки из постов

Wintersmith позволяет нам определить, на каком месте заканчивать выдержку из поста. Это гарантирует, что фрагмент не превысит определенную длину или завершится в нелогичном месте. Для определения места окончания этой выдержки просто поместите следующий код в ваш файл поста Markdown:

```markup
<span class="more"></span>
```

Если мы не добавим этот `span`, Wintersmith будет искать первый экземпляр тегов `<h2>` или `<hr>`. Если и этих тегов не будет, выдержка будет содержать весь пост, что, конечно, не желательно. Выдержка активируется через свойство страницы `intro`, в файле `templates/partials/homepagemiddle.jade`:

```jade
 !{ typogr(article.intro).typogrify() }
```

Если мы хотим проверить, были ли это свойство определено, мы можем использовать свойство страницы `hasMore`. Подробнее узнать о настройках можно изучив код [плагина страницы](https://github.com/jnordberg/wintersmith/blob/718250eefdef08e9667650c350da0fb37c185936/src/plugins/page.coffee)

## Собственные метаданные

Зачастую бывает нужно добавить свои метаданные, глобальные для сайта или локальные для страницы. Посмотрим, как это делается в Wintersmith.

### Глобальные метаданные

Мы можем задать произвольные метаданные в файле `config.json` внутри объекта `locals`. Например, мы можем задать имя сайта, описание и баннер нашего сайта.

```javascript
{
  "locals": {
    "url": "http://localhost:8080",
    "name": "Adventure Time!",
    "owner": "Brian Rinaldi",
    "description": "Adventure Time is an American animated television series created by Pendleton Ward for Cartoon Network. The series follows the adventures of Finn, a human boy, and his best friend and adoptive brother Jake, a dog with magical powers to change shape and grow and shrink at will. Finn and Jake live in the post-apocalyptic Land of Ooo. Along the way, they interact with the other main characters of the show: Princess Bubblegum, The Ice King, and Marceline the Vampire Queen.",
  "banner": "/assets/images/about.jpg"
},
...
```

Эти значения доступны для всех шаблонов вашего сайта, как свойства объекта `locals`. Например, мы используем эти значения в файле шаблона `templates/partials/footer.jade`:

```jade
div(class="4u")
    section
        header
            h2 What's this all about?
        a(href="#",class="image featured")
            img(src= locals.banner)
        p= locals.description
```

Стоит отметить, что в этом примере можно ссылаться на `banner` и `description` напрямую, без `locals`.

### Метаданные поста

Как мы уже упоминали, в каждом посте могут быть свои метаданные. Эти метаданные могут содержать любые значения на ваш выбор. Например, вот метаданные для одной из статей  (`contents/articles/season-6-breezy/index.md`), мы задали метаданные `shortdesc` и `banner`.

```yaml
---
title:  "Breezy (Season 6)"
date:   2014-06-05 10:33:56
template: article.jade
shortdesc: Finn decides to get back into the dating game to help his wilting arm flower.
banner: /assets/images/breezy.jpg
---
```

У нас есть доступ к значению `shortdesc` через объект `metadata` внутри объекта страницы. Вот образец его использования в цикле `templates/partials/footer.jade`:

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

Разумеется, эти метаданные доступны и при выводе страницы, вот шаблон `contents/templates/article.jade`:

```jade
header
    h2= page.title
    p= page.metadata.shortdesc
```

## Собственные данные

Не все на нашем сайте сводится к постам или метаданным. Часто встречаются и  другие типы коллекций данных. Так, в нашем примере есть коллекция персонажей Adventure Time! с именами, описаниями и изображениями. Вместо того, чтобы  вбивать это все на страницы,  мы можем добавить их на сайт в виде данных,  что позволяет многократно их  использовать, везде где нужно с достаточной гибкостью. Посмотрим, как это работает.

Данные в  Wintersmith напоминают [коллекции Jekyll](/documentation/13_collections) тем, что они основаны на файлах. Вместо помещения одиночного файла JSON в заданный каталог, для каждого объекта создается  свой собственный файл в определенном вами подкаталоге каталога `contents`.

Например, на нашем  сайте-образце каталог `contents/characters` содержит набор файлов, содержащих данные в формате JSON о персонажах. Вот содержимое `contents/characters/lsp.json`:

```javascript
{
  "description": "Lumpy Space Princess (LSP) acts like a bratty, apathetic, sassy, attention-seeking and willfully ignorant teenager, often texting on her phone.",
  "image": "/assets/images/lsp.jpg",
  "name": "Lumpy Space Princess"
}
```

Эти данные автоматически считываются объектом `contents`  и присоединяются к нему как объект с именем папки, а каждый файл становится объектом в массиве. Каждое свойство внутри файла доступно через объект `metadata`. Вот, как мы будем выводить список персонажей на главной странице:

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

## Сборка и развертывание

После того как мы закончили проект, мы можем выложить его на сервер. Но сначала нам надо сгенерировать статические файлы, чтобы было, что отправлять на сервер, для этого выполните следующую команду:

```bash    
$ wintersmith build
```

По умолчанию команда сгенерирует файлы в каталоге `build`, но мы можем выбрать другой каталог с опцией `-o`. Мы также можем принудительно очистить каталог сборки с помощью опции `-X`. Полный лист опций можно узнать, выполнив  команду `wintersmith build --help`.


## Заключение

Очевидно, что  Wintersmith  предлагает полный набор для построения статических сайтов, позволяя собирать сложные проекты в экосистеме Node.js/npm. К сожалению, многие моменты очень слабо раскрыты в его документации.

К достоинствам следует отнести то, что он написан на CoffeeScript, что облегчает работу JS-разработчикам, ведь многие детали работы можно понять, изучив исходный код. В дополнение, вот [подборка сайтов на основе Wintersmith](https://github.com/jnordberg/wintersmith/wiki/Showcase), многие из них с исходниками и их можно использовать для решения своих задач. Это не является надлежащей заменой документации, но позволяет решить часть проблем, связанных с ее отсутствием.

Для сравнения с остальными генераторами статических сайтов, посмотрите на мой [проект на GitHub](https://github.com/sitepoint-editors/Static-Site-Samples), там кроме  Wintersmith, тот же сайт собран на основе Jekyll, Harp и Middleman.

