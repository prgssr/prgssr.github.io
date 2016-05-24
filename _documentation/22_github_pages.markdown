---
layout: doc
title: "Развертывание на  GitHub"
header: "Развертывание"
description: "Развертывание Jekyll на  GitHub. Gem github-pages."
prism: yes
---
[GitHub Pages](http://pages.github.com/) это публичные страницы пользователей, организаций и репозиториев, с бесплатным хостингом от GitHub  с доменом `github.io` или с кастомным доменом. GitHub Pages  работают на Jekyll, поэтому кроме  поддержки обычного HTML они дают прекрасную возможность для хостинга сайтов на Jekyll.

Никогда не работали с GitHub Pages ранее? Есть [отличное руководство от Джонатана Макглона](http://jmcglone.com/guides/github-pages/), из него вы узнаете достаточно о Git, GitHub и Jekyll для запуска собственного сайта. 


### Развертывание на  GitHub Pages

GitHub Pages работают за счет сборки отдельных ветвей или репозиториев на GitHub. Их два типа — страницы пользователей/организаций и страницы проектов. Способы развертывания обоих типов сайтов почти идентичны, за исключением нескольких малозначительных деталей.

###### Используйте gem `github-pages`
{: .info}
Наши коллеги с github создали gem [github-pages](https://github.com/github/pages-gem), используемый для управления Jekyll и его зависимостями на GitHub Pages. Использование его в ваших проектах поможет вам при развертывании на GitHub Pages избежать каких-либо различий между версиями gem. Чтобы использовать текущую версию gem  в вашем проекте, добавьте в ваш `Gemfile` следующий код:
{: .info}

```ruby
source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
```

Это гарантирует, что при запуске `bundle install` у вас будет корректная версия `github-pages`. Если это не работает, попробуйте простой вариант:
{: .info}

```ruby
source 'https://rubygems.org'

gem 'github-pages'
```

После чего выполняйте `bundle update`. Текущую версию Jekyll, используемую на GitHub, можно узнать с помощью команды `github-pages versions` (на данный момент это 3.1.6).
{: .info}

### Страницы пользователей и организаций

Страницы пользователей и организаций располагаются в специальном репозитории GitHub , предназначенном только для хранения файлов GitHub Pages. Репозиторий должен быть назван по имени учетной записи. Например, репозиторий [mojombo’s user page repository](https://github.com/mojombo/mojombo.github.io) назван `mojombo.github.io`.

Содержимое ветки `master` вашего репозитория будет использовано для сборки и публикации сайта на GitHub, поэтому обеспечте нахождение Jekyll  в этом каталоге.

###### Кастомные домены не влияют на название репозитория
{: .protip}
GitHub Pages изначально ориентированы на работу с субдоменом `username.github.io`, поэтому репозитории должны называться по имени учетной записи даже при использовании кастомного домена
{: .protip}

### Страницы проектов

В отличие от страниц пользователей и организаций, страницы проектов хранятся в репозитории проекта, к которому они относятся; а сам контент сайта хранится в специальной ветви `gh-pages`. Контент этой ветки будет отображаться с помощью Jekyll и собранный сайт доступен в отдельном каталоге вашего поддомена на GitHub Pages, например, `username.github.io/project` (если вы не задали кастомный домен).

Репозиторий проекта Jekyll сам по себе является прекрасным образцом структуры ветвления --- [мастер ветка](https://github.com/jekyll/jekyll) содержит актуальную версию Jekyll, а сайт Jekyll находится в ветке [gh-pages ](https://github.com/jekyll/jekyll/tree/gh-pages) того же репозитория.

###### Исходные файлы должны находиться в корневом каталоге
{: .warning}
Github Pages [переписывает](https://help.github.com/articles/troubleshooting-github-pages-build-failures#source-setting) [конфигурацию исходников сайта](http://jekyllrb.com/docs/configuration/#global-configuration), поэтому если вы расположите исходники не в корневом каталоге, ваш сайт может быть собран некорректно
{: .warning}

### Структура URL страницы проекта

Иногда вам нужен предпросмотр сайта, перед отправкой вашего его в ветку `gh-pages`. Однако используемая для страниц проектов структура подкаталогов затрудняет правильное определение URL. Чтобы ваш сайт собирался правильно, используйте в ваших шаблонах переменную `site.github.url`.

{% raw %}
```liquid
<!-- Useful for styles with static names... -->
<link href="{{ site.github.url }}/path/to/css.css" rel="stylesheet">
<!-- and for documents/pages whose URL's can change... -->
<a href="{{ page.url | prepend: site.github.url }}">{{ page.title }}</a>
```
{% endraw %}

Это даст вам возможность для локального предпросмотра сайта и одновременно правильную его  генерацию из ветки `gh-pages` на GitHub.


###### Документация, помощь и поддержка с GitHub Pages
{: .protip}
Для больше информации о работе с  GitHub Pages и решения проблем, смотрите [раздел помощи на GitHub Pages](https://help.github.com/categories/20/articles). При более серьезных проблемах обращайтесь в [поддержку GitHub](https://github.com/contact).
{: .protip}
