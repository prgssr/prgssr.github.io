---
layout: doc
title: "Проблемы"
header: "Разное"
description: "Распространенные проблемы при установке или использовании Jekyll. Способы решения."
prism: yes
---
Если вы столкнулись с какими-либо проблемами при установке или использовании Jekyll, в этом разделе вы найдете  несколько советов, которые могут помочь. Если проблема, с котороый вы столкнулись, не упомянута, [проверьте остальные ресурсы помощи](http://jekyllrb.com/help/).

* [Проблемы при инсталляции](/documentation/25_troubleshooting.html#installation-problems)
* [Проблемы при работе Jekyll](/documentation/25_troubleshooting.html#problems-running-jekyll)
* [Проблемы с базовым URL](/documentation/25_troubleshooting.html#base-url-problems)
* [Проблемы конфигурации](/documentation/25_troubleshooting.html#configuration-problems)
* [Проблемы разметки](/documentation/25_troubleshooting.html#markup-problems)

### [Проблемы инсталляции](#installation-problems)

Если вы сталкиваетесь с ошибками при инсталляции gem'ов, вам может помочь установка заголовочных файлов для компиляции расширений в Ruby 2.0.0. В Ubuntu и Debian это делается следующей командой:

```bash
sudo apt-get install ruby2.0.0-dev
```

А в  Red Hat, CentOS и  Fedora так:

```bash
sudo yum install ruby-devel
```

При развертывании на [NearlyFreeSpeech](https://www.nearlyfreespeech.net/) перед инсталляцией Jekyll вам надо выполнить следующие команды:

```bash
export GEM_HOME=/home/private/gems
export GEM_PATH=/home/private/gems:/usr/local/lib/ruby/gems/1.8/
export PATH=$PATH:/home/private/gems/bin
export RB_USER_INSTALL='true'
```

На  Mac OS X вам надо обновить RubyGems:

```bash
sudo gem update --system
```

Если проблемы остались, [используйте Xcode для установки инструментов командной строки](http://www.zlu.me/ruby/os%20x/gem/mountain%20lion/2012/02/21/install-native-ruby-gem-in-mountain-lion-preview.html), это упростит установку gem'ов:

```bash
sudo gem install jekyll
```

В Gentoo RubyGems устанавливаются так :

```bash
sudo emerge -av dev-ruby/rubygems
```

В Windows надо установить [RubyInstaller DevKit.](https://wiki.github.com/oneclick/rubyinstaller/development-kit)

#### Не найдено окружение JavaScript (ExecJS::RuntimeUnavailable)

Эта ошибка случает в ходе инсталляции `jekyll-coffeescript`, когда у вас нет правильного JavaScript окружения. Чтобы решить ее, установите gem'ы `execjs `и `therubyracer` или ` nodejs`. Больше информации на [GitHub Jekyll](https://github.com/jekyll/jekyll/issues/2327).

### [Проблемы при запуске](#problems-running-jekyll)

На Debian и Ubuntu вам может понадобиться добавить /var/lib/gems/1.8/bin/ к пути, чтобы команды `jekyll` стали исполняемыми в терминале.

### [Проблемы с базовым адресом](#base-url-problems)

Если вы использует опцию базового URL, например:

```bash
jekyll serve --baseurl '/blog'
```

То проверяйте доступность сайта по следующему адресу:


http://localhost:4000/blog/index.html


Он не будет работать по простому адресу:


http://localhost:4000/blog


### [Проблемы  с конфигурированием](#configuration-problems)

Порядок иерархии для конфликтующих [настроек конфигурации](/documentation/06_configuration.html) следующий:

1. Флаги командной строки.
2. Настройки конфигурационных файлов.
3. Дефолтные значения.

Именно: все дефолтные значения перекрываются опциями в `_config.yml`, а флаги командной строки имеют приоритет перед всеми остальными настройками.

### [Проблемы с разметкой](#markup-problems)

В различных языках разметки, поддерживаемых Jekyll бывают свои пролемы. В этом разделе мы собрали самые распространенные из них.

#### Liquid

В последней версии 2.0 ошибку вызывает использование двойных фигурных скобок {% raw %}`{{`{% endraw %}:

{% raw %}

```liquid
'{{' was not properly terminated with regexp: /\}\}/  (Liquid::SyntaxError)
```

{% endraw %}

#### Выдержки

Начиная с версии 1.0.0 Jekyll автоматически генерирует выдержки. С версии 1.1.0 Jekyll  также прогоняет эти выдержки через Liqud, что может повлечь странные ошибки с несуществующими ссылками и незакрытыми тегами. Если вы столкнулись с такими ошибками, задайте опцию `excerpt_separator: ""` в `_config.yml`.
