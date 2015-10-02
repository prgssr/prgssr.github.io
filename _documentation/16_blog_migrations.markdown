---
layout: doc
title: "Миграция блога"
description: "Миграция блога в Jekyll. Установка jekyll-import и дополнительных модулей. Drupal, Wordpress, Joomla, Blogspot и Tumblr."
prism: yes
---
Если вы переключились на Jekyll с другой системы ведения блога, вам помогут расширения для импорта. Подробно они описаны в специальном разделе [документации](http://import.jekyllrb.com/docs/home/), здесь я опишу только самые общие вопросы по популярным системам.

Большая часть расширений требует доступа к базе данных для генерации постов для Jekyll. Все методы генерируют посты в HTML с вводной и  расширением `.markdown` в каталоге `_posts`.

## Установка модуля для импорта

Так как в расширениях для импорта имеются  самые разные зависимости, они выделены в отдельный модуль `jekyll-import`.

```bash
gem install jekyll-import
```

После установки модуля, все расширения будут доступны как часть стандартного интерфейса Jekyll в командной строке.

###### Jekyll-import требует отдельной установки некоторых зависимостей.
{: .warning}
Чтобы излишне не расширять модуль `jekyll-import`  в него не включены все зависимости - при необходимости установить что-либо дополнительно будет выведено сообщение об ошибке с указанием требуемого модуля. При желании вы можете узнать заранее о зависимостях, изучив метод `require_deps` выбранного расширения для импорта
{: .warning}

## Установка дополнительных модулей

У импортеров, работающих с базами данных есть дополнительная зависимость --- модуль `sequel`, сообщение об этом выводится в консоли. Устанавливается модуль традиционно:

```bash
gem install sequel
```

Это не все. Если после установки `sequel` выводится ошибка, типа:

```bash
LoadError: cannot load such file -- mysql (Sequel::AdapterNotFound)

```

Это значит, что надо установить модуль для работы конкретно с базой данных MySQL --- `mysql`.  Он, в свою очередь, требует наличия в системе пакета `libmysqlclient-dev`. Вот так все сложно:

```bash
sudo apt-get install libmysqlclient-dev
gem install mysql
```

Импорт можно  запускать командой следующего образца:

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::MyImporter.run({
      # options for this importer
    })'
```

`MyImporter` это название конкретного расширения для импорта, у большинства расширений имеются дополнительные опции.  Команды удобнее отредактировать в текстовом редакторе, а затем копировать в консоль.

## Импорт из Blogspot

Для импорта из [Blogspot](https://www.blogger.com/) вам надо сначала [экспортировать содержимое блога](https://support.google.com/blogger/answer/97416) в файл XML (`blog-MM-DD-YYYY.xml`) и выполнить команду: 

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::Blogger.run({
      "source"                => "/path/to/blog-MM-DD-YYYY.xml",
      "no-blogger-info"       => false, # not to leave blogger-URL info (id and old URL) in the front matter
      "replace-internal-link" => false, # replace internal links using the post_url liquid tag.
    })'
```

Обязательно только поле `source`, остальные поля опциональны, `labels` экспортируются как теги.

Если методика не сработает, есть также запасные варианты:

* [Скрипт для миграции](https://gist.github.com/kennym/1115810) от [@kennym](https://github.com/kennym).
* [Альтернативное расширение для импорта](https://gist.github.com/juniorz/1564581) из blogspot.


## Импорт из CSV

Команда для импорта из CSV:

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::CSV.run({
      "file" => "my_posts.csv"
    })'
```

Файл CSV будет считан по следующим столбцам:

1. `title` - название
2. `permalink` - адрес
3. `body` - содержание
4. `published_at` - дата публикации
5. `filter`  - процессор (т.е. markdown, textile)

## Drupal 7

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::Drupal7.run({
      "dbname"   => "name",
      "user"     => "myuser",
      "password" => "mypassword",
      "host"     => "myhost",
      "prefix"   => "mytableprefix"
    })'
```

Обязательны поля `dbname` и `user`. Для остальных есть дефолтные значения: `password` ---  `""`, `host` --- `"localhost"`, `prefix` --- `""`.

## Joomla

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::Joomla.run({
      "dbname"   => "name",
      "user"     => "myuser",
      "password" => "mypassword",
      "host"     => "myhost",
      "section"  => "thesection",
      "prefix"   => "mytableprefix"
    })'
```

Обязательны поля `dbname` и `user`, для остальных есть дефолтные значения. В Joomla последних версий (3.1 точно) параметр `section` не используется, поэтому импорт завершается ошибкой. Исправляется это путем изменения файла `jekyll-import/importers/joomla.rb`, параметр просто удаляется из запроса (`AND sectionid = '#{section}'`).

## Импорт из RSS


```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::RSS.run({
      "source" => "my_file.xml"
    })'
```

Импортируются посты как из локального файла, так и из удаленного, разумеется, не больше, чем их имеется в файле (в Jekyll обычно 10), расширение файлов --- HTML,  в вводной указывается layout и название поста.


## Tumblr

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::Tumblr.run({
      "url"            => "http://myblog.tumblr.com",
      "format"         => "html", # or "md"
      "grab_images"    => false,  # whether to download images as well.
      "add_highlights" => false,  # whether to wrap code blocks (indented 4 spaces) in a Liquid "highlight" tag
      "rewrite_urls"   => false   # whether to write pages that redirect from the old Tumblr paths to the new Jekyll paths
    })'
```

Единственный обязательный параметр --- `url`.

### Wordpress

Для Wordpress существует [плагин](https://wordpress.org/plugins/jekyll-exporter/) с экспортом содержимого в Jekyll. И это предпочтительный вариант.

Если же использовать общий метод, то для импорта из Wordpress требуется установить модули `unidecode` и `mysql2`.

Вот команда для экспорта , как правило, кроме стандартных опций (`dbname`, `user` и `password`) надо задать и `socket`, в Ubuntu это `/var/run/mysqld/mysqld.sock`.

```bash
ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::WordPress.run({
      "dbname"   => "",
      "user"     => "",
      "password" => "",
      "host"     => "localhost",
      "socket"   => "",
      "table_prefix"   => "wp_",
      "site_prefix"    => "",
      "clean_entities" => true,
      "comments"       => true,
      "categories"     => true,
      "tags"           => true,
      "more_excerpt"   => true,
      "more_anchor"    => true,
      "extension"      => "html",
      "status"         => ["publish"]
    })'
```