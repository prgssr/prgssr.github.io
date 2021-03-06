---
layout: post
title: Хак для маршрутизации в Jekyll
categories: [development]
tags: [ jekyll, translation, sitepoint]
date: 2015-09-25 13:14:44
description: "Создание маршрутизации в Jekyll без использования плагинов, с помощью файлов с данными и markdown."
original: "http://www.sitepoint.com/hacking-routing-component-jekyll/"
original_author: "Хьюго Жирадель"
original_title: "Hacking a Routing Component in Jekyll"
prism: true
thumbnail: noimage
related: 8
---
Изначально я хотел написать о маршрутизации в Jekyll на хостинге  GitHub с использованием  Markdown, Liquid и YAML. Для названия это оказалось слишком затянуто, но тем не менее суть не поменялась --- в Jekyll нет роутера и я надеюсь, что нашел неплохую имитацию.

Сразу уточню --- я привык к инфраструктуре [symfony](http://symfony.com/), поэтому роутер для меня это компонент, маршрутизирующий URL в имена, что позволяет безопасно изменять URl без необходимости обновлять все ссылки в коде.


## Зачем нам это надо?


Сейчас я работаю над [документацией](http://sassdoc.com/) для SASS. У нас достаточно контента --- около 20 страниц в 4 секциях, с большим количеством образцов кода и перекрестных ссылок.

Некоторое время назад, мне захотелось изменить один URL. Соответственно, мне пришлось менять все ссылки, ведущие на этот URL. На всех 20 страницах --- согласитесь, это не слишком хорошо.

Поэтому нам нужен компонент с маршрутизацией. Это позволит нам ссылаться по именам, а не по строго заданному пути, позволяя изменять путь и переименовывать  страницы безболезненно.

## Как это работает?

Что же нужно для реализации этого? Если вы пользуетесь Jekyll и не привязаны к безопасному режиму (а он, к сожалению, дефолтный на Github), то вы можете найти (или написать на Ruby) плагин для этого. И это будет лучшим решением.

Но если вы пользуетесь Github (а это большинство пользователей Jekyll), то вы не можете использовать  плагины, вам стоит попробовать хакинг [Liquid](http://docs.shopify.com/themes/liquid-documentation/basics) и [Markdown](http://daringfireball.net/projects/markdown/).

Основная идея состоит в том, чтобы хранить все маршруты, привязанные к URL в специальном файле. Jekyll позволяет определить для этого глобальную переменную в [файлах с данными (YAML/JSON/CSV )](/documentation/14_data_files.html). Это позволит нам переходить по URL, указывая только их имена.

Чтобы было проще, мы добавим немного синтаксического сахара --- создадим ссылки в Markdown, впрочем, начнем с начала.


## Создание роутера

Задача маршрутизатора --- преобразовывать имена в URl. Мы можем создать файлы YAML/JSON/CSV в каталоге `_data`  нашего проекта с Jekyll, наш файл будет называться `routes.yml`:

```yaml
home: "/"
about: "/about-us/"
faq: "/frequently-asked-questions/"
repository: "https://github.com/user/repository"
```

Вы заметили, что мы не ограничились внутренними ссылками. Мы можем полностью определить маршрутизацию и для внешних URL, это избавит нас от необходимости набирать эти URL вручную. В данном примере мы ограничились четырьмя строчками роутов, на деле их может быть тысячи.

Так как наш файл находится в `_data`, его контент доступен со всех остальных страниц сайта через `site.data.имяфайла.ключ`. Например, у нас есть страница со следующим кодом:

```markdown
---
layout: default
title: "About us"
---

<!-- Content about us -->

Go to our [GitHub repository]({{ site.data.routes.repository }}).
Or read the section dedicated to [Frequently Asked Questions]({{ site.data.routes.faq }}).
```

Как видите, мы теперь используем роуты вместо URL. Здесь нет никакой магии, просто Jekyll берет значение глобальной переменной по указанному пути.

Теперь, если наш репозиторий переедет с Github или же раздел About us будет переименован в  просто /about/, мы можем не волноваться. Просто обновим роутер и все линки будут автоматически обновлены.


## Добавляем синтаксический сахар

У нас уже есть роутер, позволяющий изменять URL без последующего прочесывания сайта на предмет сломанных ссылок. Однако, использование имен типа `site.data.routes.faq` не слишком удобно. Мы сделаем наш роутер элегантным!

Да и нет. С начала я хотел сделать маленькую фукцию `route()` принимающую ключ и возвращающую URL из `site.data.routes.ключ.` Но из-за безопасного режима это не пройдет. Увы.

Затем я вспомнил о фиче Markdown, которой никогда не пользовался раньше: [реферальные ссылки](http://daringfireball.net/projects/markdown/syntax#link). Вот как представляются реферальные ссылки в Markdown:

```markdown
[I am a link](http://link.url/)
```

Вы также можете установить ссылку на ссылку, которая будет невидимой на странице, например:

```markdown
[I am a link][id_reference]

​[id_reference]: http://link.url
```

Примечание: обычные скобки заменяются квадратными при использовании ссылок вместо URL.

Это позволит вам держать все определения ссылок в одном месте, а не разбрасывать их по всему документу. Как я говорил, я не пользовался этой фичей, но в данном случае она выручает.

Идея состоит в том, чтобы автоматически генерировать ссылки из нашего роутера, чтобы использовать его в любом файле. В Liquid это делается сравнительно легко:


```liquid
# _includes/route.html
{% raw %}
{% for route in site.data.routes %}
[{{ route[0] }}]: {{ route[1] }}
{% endfor %}

{% endraw %}
```

Добавление этого цикла в любом месте страницы, заставляет Jekyll обработать его как код Liquid,который затем будет преобразован в ссылки Markdown. Например, теперь мы можем наш предыдущий пример сделать таким:


```liquid
---
layout: default
title: "About us"
---

<!-- Content about us -->

Go to our [GitHub repository][repository].
Or read the section dedicated to [Frequently Asked Questions][faq].
{% raw %}
{% for route in site.data.routes %}
[{{ route[0] }}]: {{ route[1] }}
{% endfor %}
{% endraw %}
```


Единственная проблема - подключение этого цикла на каждую страницу.  В начале, я хотел добавит его в макет, чтобы цикл добавлялся везде автоматически. Но проблема в том, что макеты не обрабатываются как Markdown в Jekyll, поэтому все ссылки останутся невидимыми. И, разумеется, не будут пригодными.

Однако мы можем сделать кое-что получше. Мы можем вынести этот цикл в фрагмент (partial)  Liquid  и подключать его на каждой странице автоматически, вместо того, чтобы вставлять его вручную. Создадим фрагмент routes.html в каталоге `_includes`:

{% raw %}
```liquid
{% for route in site.data.routes %}
[{{ route[0] }}]: {{ route[1] }}
{% endfor %}
```
{% endraw %}

И изменим код страницы:

{% raw %}
```yaml
---
layout: default
title: "About us"
---
{% include routes.html %}

<!-- Content about us -->

Go to our [GitHub repository][repository].
Or read the section dedicated to [Frequently Asked Questions][faq].
```
{% endraw %}

Примечание: фрагмент можно подключить в любом месте страницы, необязательно наверху.


## Заключение


Итак, мы решили проблему с маршрутизацией в Jekyll. Взглянем на недостатки нашего решения:

- Работоспособно в Markdown, если ваши ссылки в чистом HTML, вам придется ограничиться работой с {% raw %}`{{ site.data.routes.<key> }}`{% endraw %}.
- Вы не сможете добавлять анкоры к ссылкам, разве что вы опять обойдетесь без синтаксического сахара --- {% raw %} `{{ site.data.routes.<key> }}#anchor`{% endraw %}, например.
- вам надо подключать фрагмент HTML  на всех страницах, даже если вы сделаете это, отредактировав вводную YAML.

А в остальном это отличное решение, имхо.
