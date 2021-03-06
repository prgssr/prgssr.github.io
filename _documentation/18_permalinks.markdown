---
layout: doc
title: "Постоянные ссылки"
description: "Пермалинки в Jekyll. Задание формата ссылок в _config.yml. Образцы стилей постоянных ссылок."
prism: yes
---
Jekyll позволяет гибко создавать URL на вашем сайте. Вы можете задать  вид постоянных ссылок в [конфигурации](/documentation/06_configuration.html) или во [вводной ](/documentation/07_frontmatter.html)для каждого поста. Вы можете использовать встроенные стили для создания ссылок или создать свой. Стиль по умолчанию --- `date`.

Постоянные ссылки конструируются путем создания шаблонного URL, в котором динамические элементы заменены ключевыми словами с префиксами из двоеточий. например, дефолтный стиль `date` определен так:

`/:categories/:year/:month/:day/:title.html`.


### Переменные шаблонов для задания вида ссылок
{: #template-variables}

Переменная |Описание
-----------|--------
`year` | Год из названия поста.
`month` | Месяц из названия поста.
`i_month` | Месяц из названия поста без начального нуля.
`day` | День из названия поста.
`i_day` | День из названия поста без начального нуля.
`short_year` | Год из названия поста без указания века.
`hour` | Час из даты поста в 24-часовом формате (00..23).
`minute` | Минута из даты поста  (00..59).
`second` | Секунда из даты поста  (00..59). 
`title` | Заголовок из названия документа. Может быть переписан в кратком названии (`slug`) из вводной YAML.
`slug` | Заголовок из названия документа, в котором  все символы кроме цифр и букв заменены дефисами. Может быть переписан значением переменной `slug` во вводной.
`categories` | Категории, заданные для поста. Если пост относится к нескольким категориям, Jekyll создает иерархию (например, `/category1/category2`).Также  Jekyll автоматически парсит двойные слэши в URL, при отсутствии категорий эта переменная будет игнорироваться.

### Встроенные стили для постоянных ссылок

Вы может создать собственный стиль постоянных ссылок с помощью [переменных шаблона](/documentation/18_permalinks.html#template-variables), для удобства в Jekyll также есть встроенные стили.

Стиль ссылок | Шаблон URL
-------------|-----------
`date` | `/:categories/:year/:month/:day/:title.html`
`pretty` | `/:categories/:year/:month/:day/:title/`
`ordinal` | `/:categories/:year/:y_day/:title.html`
`none` | `/:categories/:title.html`

### Страницы и коллекции

Настройка постоянных ссылок определяет стили постоянных ссылок постов. У страниц и коллекций свой стиль постоянных ссылок, для страниц дефолтный --- `/:path/:basename`, а для коллекций `/:collection/:path`.

Эти стили изменяются в соответствии со стилем суффиксов, определенным в настройке постоянных ссылок поста . Например, стиль постоянных ссылок `pretty`, содержащий обратный слэш, обновит постоянные ссылки страницы также добавив им обратный слэш: `/:path/:basename/`. Стиль `date`, содержащий расширение файла, добавит ко всем ссылкам расширение: `/:path/:basename:output_ext`. Это же справедливо и для пользовательских стилей постоянных ссылок.

Постоянную ссылку для отдельной страницы или документа коллекции всегда можно переписать во [вводной](/documentation/07_frontmatter.html). А постоянные ссылки коллекций можно также кастомизировать в [настройке коллекции](/documentation/13_collections.html).

### Образцы стилей постоянных ссылок

Для образца возьмем пост с названием `/2009-04-29-slap-chop.md`:

Шаблон URL |Итоговый URL постоянной ссылки
-----------|------------------------------
Не определен (дефолтный `date`) | `/2009/04/29/slap-chop.html`
`pretty`| `/2009/04/29/slap-chop/index.html`
`/:month-:day-:year/:title.html` | `/04-29-2009/slap-chop.html`
`/blog/:year/:month/:day/:title/` | `/blog/2009/04/29/slap-chop/`
`/:year/:month/:title`  [Детали](/documentation/18_permalinks.html#extensionless)|`/2009/04/slap-chop`

### Постоянные ссылки без расширений
{: #extensionless}

Jekyll поддерживает постоянные ссылки, не содержащие обратный слэш или расширение файла, но это требует дополнительной настройки сервера. При использовании постоянных ссылок без расширений, выходные файлы будут по прежнему иметь расширение (обычно `.html`) и веб-сервер сможет маршрутизировать запросы без расширений к этим файлам.

[GitHub Pages](/documentation/22_github_pages.html) и встроенный сервер Jekyll (WEBrick) поддерживают постоянные ссылки без расширений, не требуя какой-либо дополнительной настройки.

#### Apache

В сервере Apache имеется развитая поддержка разнообразного контента, ссылки без расширений настраиваются опцией [multiviews](https://httpd.apache.org/docs/current/content-negotiation.html#multiviews) в `httpd.conf ` или `.htaccess`:

```bash
Options +MultiViews
```

#### Nginx

Директива [try_files](http://nginx.org/en/docs/http/ngx_http_core_module.html#try_files) позволяет вам определить список файлов для поиска при обработке запроса. Следующая конфигурация позволяет Nginx искать файл с расширением `.html`, если в запрашиваемом  URI  расширение отсутствует.

```bash
try_files $uri $uri.html $uri/ =404;
```
