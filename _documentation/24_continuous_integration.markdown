---
layout: doc
title: "Непрерывная интеграция"
description: "Непрерывная интеграция с Travis. Настройка с фрагментами конфигурационных файлов."
prism: yes
---
Вы можете тестировать свой сайт в окружениях с различными версиями Ruby. Следующий гид покажет вам, как настроить бесплатное сборочное окружение на [Travis](https://travis-ci.org/) с интеграцией [GitHub](https://github.com/) для пулл-реквестов. Для частных репозиториев существуют платные альтернативы.

### 1. Активация Travis и GitHub

Активация сборок Travis  в вашем репозитории GitHub достаточно проста:

1. Перейдите на страницу вашего профиля на travis-ci.org: `https://travis-ci.org/profile/username`.
2. Выберите репозиторий, для которого вы хотите активировать сборки.
3. Кликните на слайдер справа, дождитесь сообщения "ON" и смены цвета на темно-серый.
4. Опционально сконфигурируйте сборку нажав иконку с гаечным ключом. Дальнейшая информация будет в вашем файле `.travis.yml`, а  детальное рассмотрение ниже.

### 2. Тестовый скрипт

Простейший тестовый скрипт запускает команду `jekyll build` и  показывает, что Jekyll может собрать сайт. Итоговый сайт не проверяется,  показывается лишь правильность сборки.

При тестировании вывода Jekyll наиболее полезен [html-proofer](https://github.com/gjtorikian/html-proofer). Он проверяет ваш собранный сайт на  наличие всех ссылок и изображений. Используйте его с командой `htmlproof` или напишите скрипт на Ruby, использующий этот gem.

#### Скрипт для запуска HTML Proofer

```bash
#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build
bundle exec htmlproof ./_site
```

Некоторые опции могут быть определены прямо в командной строке. Информация об этом есть в README `html-proofer`, также можно выполнить локально `htmlproof --help`.

#### Библиотека  HTML Proofer

Вы также можете активировать `HTML Proofer` в `Rakefile`:

```bash
#!/usr/bin/env ruby

require 'html/proofer'
HTML::Proofer.new("./_site").run
```

Опции передаются как второй аргумент  в `.new` и в виде хэша Ruby. Подробно они описаны README `html-proofer`.

### 3. Конфигурация ваших сборок Travis

Следующий файл используется для конфигурации ваших сборок в Travis. Так как Jekyll  создан на Ruby и требует установки RubyGems, мы выберем окружение Ruby. Ниже показан пример файла `.travis.yml` с объяснением каждой строки.

Примечание: при установке gem'ов [Travis автоматически установит зависимости](http://docs.travis-ci.com/user/languages/ruby/#Dependency-Management):

```yaml
source "https://rubygems.org"

gem "jekyll"
gem "html-proofer"
```

```yaml
language: ruby
rvm:
- 2.1
# Assume bundler is being used, install step will run `bundle install`.
script: ./script/cibuild

# branch whitelist
branches:
  only:
  - gh-pages     # test the gh-pages branch
  - /pages-(.*)/ # test every branch which starts with "pages-"

env:
  global:
  - NOKOGIRI_USE_SYSTEM_LIBRARIES=true # speeds up installation of html-proofer
```

Теперь разберем этот файл построчно:

```yaml
language: ruby
```

Эта строка сообщает Travis о необходимости использовать сборочный контейнер Ruby. Она дает вашим скриптам доступ к Bundler, RubyGems и Ruby.

```yaml
rvm:
- 2.1
```
RVM это популярная система управления версиями Ruby (также как  rbenv, chruby и т.д.). Эта директива указывает Travis, какую версию Ruby использовать с вашими скриптами.

```yaml
script: ./script/cibuild
```

Travis позволяет запускать любой произвольный скрипт для тестирования вашего сайта. Единственное условие --- все скрипты для вашего проекта должны быть помещены в каталог `script` и вызвать тестовый скрипт `cibuild`. Эта строка полностью изменяема, вы можете прямо в ней запустит сборку сайта.

```yaml
install: gem install jekyll html-proofer
script: jekyll build && htmlproof ./_site
```

В директиве  ` script ` может использоваться любая валидная команда командной строки.

```yaml
# branch whitelist
branches:
  only:
  - gh-pages     # test the gh-pages branch
  - /pages-(.*)/ # test every branch which starts with "pages-"
```

Вы можете обеспечить запуск сборок Travis только для определенных веток вашего сайта. Для этого надо указать ветви в конфигурационном файле Travis. Указав ветвь `gh-pages` вы гарантируете, что заданный скрипт (указанный выше) будет работать только с этими ветвями. Если вы обновляете сайт пулл-реквестами, вы можете задать сборку для ветвей, содержащих изменения с помощью регулярных выражений типа указанного `/pages-(.*)/`.

Директива `branches ` полностью опциональна.

```yaml
env:
  global:
  - NOKOGIRI_USE_SYSTEM_LIBRARIES=true # speeds up
```

Используете `html-proofer`?  Вам понадобиться эта переменная окружения. Nokogiri используется для парсинга HTML на скомпилированном сайте и поставляется с библиотеками, которые при каждой установке необходимо компилировать. Вы можете уменьшить время установки  Nokogiri задав переменной `NOKOGIRI_USE_SYSTEM_LIBRARIES` значение `true`.

###### Обязательно исключите `vendor` из вашего `_config.yml`
{: .warning}
Travis переносит все гемы из каталога `vendor` на свои сборочные серверы, что может вызвать ошибки в Jekyll
{: .warning}

```yaml
exclude: [vendor]
```
