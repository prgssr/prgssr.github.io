---
layout: doc
title: "Установка"
description: "Установка Jekyll. Системные требования, Ruby и RubyGems. Установка в Windows и Mac OS. Установка пре-релизов."
prism: yes
---
Установка готовой к работе версии Jekyll занимает несколько минут. Если у вас возникли сложности, пожалуйста [сообщите](https://github.com/jekyll/jekyll/issues/new), описав их.

### Требования

Установка Jekyll проста, но для начала в вашей системе должны быть установлены:

* [Ruby ](http://www.ruby-lang.org/en/downloads/) (с пакетами для разработчиков)
* [RubyGems](http://rubygems.org/pages/download)
* Операционная система --- Linux, Unix или Mac OS X
* [NodeJS](http://nodejs.org/) или иное  JavaScript окружение для запуска CoffeeScript


###### Запуск  Jekyll на Windows
{: .info}
Несмотря на отсутствие официальной поддержки Windows, Jekyll можно запустить на этой операционной системе. Инструкции можно прочитать [здесь](http://jekyllrb.com/docs/windows/#installation).
{: .info}

### Установка с помощью RubyGems

Это лучший способ установки. Просто откройте терминал и выполните команду:

```bash
$ gem install jekyll
```

Все зависимости Jekyll будут установлены автоматически и вам не надо будет беспокоиться об этом. Если вы столкнетесь с проблемами, ищите решения на странице [troubleshooting](http://jekyllrb.com/docs/troubleshooting/) или [сообщите о проблеме](https://github.com/jekyll/jekyll/issues/new), это поможет сообществу улучшить  Jekyll.

###### Установка инструментов командной строки  Xcode
{: .info}
Если вы работаете на Mac OS X и столкнулись с проблемами при установке зависимостей Jekyll, вам надо установить Xcode  и его инструменты командной строки. Скачать их можно через `Preferences → Downloads → Components`.
{: .info}

#### Пре-релизы
{: #pre-releases}

Если вы хотите установить пре-релиз, убедитесь, что ваше окружение соответствует его требованиям и выполните:

```bash
gem install jekyll --pre
```


Эта команда выполнит самую последнюю версию пре-релиза, если же вам нужна определенная версия, вы можете определить ее с помощью опции `-v`:

```bash
gem install jekyll -v '2.0.0.alpha.1'
```

Если же вы хотите установить версию Jekyll для разработчиков, то процесс немного усложнится. Но вы получите самую свежую версию из существующих, но не стабильную:

```bash
$ git clone git://github.com/jekyll/jekyll.git
$ cd jekyll
$ script/bootstrap
$ bundle exec rake build
$ ls pkg/*.gem | head -n 1 | xargs gem install -l
```

### Опциональные дополнения

Существует много дополнительных возможностей Jekyll, которые вы можете установить, в зависимости от ваших планов. В их число входит поддержка  LaTeX  и альтернативных движков рендеринга. Подробности можно узнать на странице [Extras](/documentation/21_extra.html).

###### Совет: активация подсветки синтаксиса
{: .protip}
***Если вы хотите подсвечивать синтаксис с помощью [Pygments](http://pygments.org/) или [Rouge](https://github.com/jayferd/rouge), ознакомьтесь с [документацией](http://jekyllrb.com/docs/templates/#code-snippet-highlighting) прежде чем приступать к работе.***
{: .protip}
