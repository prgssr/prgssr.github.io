---
layout: doc
title: "Проблемы"
header: "Разное"
description: "Распространенные проблемы при установке или использовании Jekyll. Способы решения."
prism: yes
---
Если вы столкнулись с какими-либо проблемами при установке или использовании Jekyll, в этом разделе вы найдете  несколько советов, которые могут помочь. Если проблема, с котороый вы столкнулись, не упомянута, [проверьте остальные ресурсы помощи](http://jekyllrb.com/help/).

* [Проблемы при инсталляции](/documentation/25_troubleshooting.html#installation-problems)
* [Проблемы при запуске Jekyll](/documentation/25_troubleshooting.html#problems-running-jekyll)
* [Проблемы с базовым URL](/documentation/25_troubleshooting.html#base-url-problems)
* [Проблемы  с конфигурированием](/documentation/25_troubleshooting.html#configuration-problems)
* [Проблемы с разметкой](/documentation/25_troubleshooting.html#markup-problems)

### Проблемы при инсталляции
{: #installation-problems}

Если вы сталкиваетесь с ошибками при инсталляции gem'ов, вам может помочь установка заголовочных файлов для компиляции расширений в Ruby 2.0.0. В Ubuntu и Debian это делается следующей командой:

```bash
sudo apt-get install ruby2.0.0-dev
```

А в  Red Hat, CentOS и  Fedora так:

```bash
sudo yum install ruby-devel
```

Если вы установили все это, особенно в Fedora 23, но расширения по прежнему не компилируются,  в вашем дистрибутиве, возможно, отсутствует пакет `redhat-rpm-config`. Для решения проблемы установите его:

```bash
sudo dnf install redhat-rpm-config
```

При развертывании на [NearlyFreeSpeech](https://www.nearlyfreespeech.net/) перед инсталляцией Jekyll вам надо выполнить следующие команды:

```bash
export GEM_HOME=/home/private/gems
export GEM_PATH=/home/private/gems:/usr/local/lib/ruby/gems/1.8/
export PATH=$PATH:/home/private/gems/bin
export RB_USER_INSTALL='true'
```

В Gentoo RubyGems устанавливаются так :

```bash
sudo emerge -av dev-ruby/rubygems
```

В Windows надо установить [RubyInstaller DevKit.](https://wiki.github.com/oneclick/rubyinstaller/development-kit)

На  Mac OS X вам надо обновить RubyGems:

```bash
sudo gem update --system
```

Если проблемы остались, вы можете скачать и установить инструменты командной строки (типа `gcc`) следующей командой:

```bash
xcode-select --install
```

Что даст вам возможность устанавливать гемы стандартной командой (используя при необходимости `sudo`):

```bash
sudo gem install jekyll
```

Учтите, что обновление Mac OS X  не обновляет автоматически Xcode (это делается отдельно в App Store) и в старых версиях Xcode могут быть проблемы с инструментами командной строки. Если вы столкнулись с проблемами, обновите Xcode  и установите обновленные инструменты командной строки. 

### Jekyll & Mac OS X 10.11

С введением System Integrity Protection (SIP), некоторые каталоги, ранее доступные для записи, теперь считаются системными и поэтому недоступны. Связанные с эти проблемы решаются несколькими способами. Первый вариант это изменить место установки гемов (используя `sudo` при необходимости):

```bash
sudo gem install -n /usr/local/bin jekyll
```

Также можно установить Homebrew и использовать для установки Ruby.

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

После установки Homebrew все просто:

```bash
brew install ruby
```

Продвинутые пользователи (с более сложными запросами) могут найти полезным использование одного из менеджеров версий Ruby  ([RVM](https://rvm.io/), [rbenv](http://rbenv.org/), [chruby](https://github.com/postmodern/chruby), и [т.д.](https://github.com/rvm/rvm/blob/master/docs/alt.md)) для установки Jekyll.

Если вы решили установит Ruby одним из таких методов, вам нужно изменить переменную `$PATH` с помощью следующей команды:

```bash
export PATH=/usr/local/bin:$PATH
```

Приложения с графическим интерфейсом могут обновлять `$PATH`  так:

```bash
launchctl setenv PATH "/usr/local/bin:$PATH"
```

Любой из этих подходов действует так как `/usr/local` рассматривается как безопасный каталог в системах с SIP, позволяет избежать конфликтов с версией Ruby, поставляемой Apple и сохраняет Jekyll и его зависимости в изолированном окружении. Также преимущество этого метода в отсутствии необходимости использовать `sudo` для установки и удаления гемов. 

#### Не найдено окружение JavaScript (ExecJS::RuntimeUnavailable)

Эта ошибка случает в ходе инсталляции `jekyll-coffeescript`, когда у вас нет правильного JavaScript окружения. Чтобы решить ее, установите gem'ы `execjs `и `therubyracer` или `nodejs`. Больше информации на [GitHub Jekyll](https://github.com/jekyll/jekyll/issues/2327).

### Проблемы при запуске Jekyll
{: #problems-running-jekyll}

На Debian и Ubuntu вам может понадобиться добавить `/var/lib/gems/1.8/bin/` к пути, чтобы команды `jekyll` стали исполняемыми в терминале.

### Проблемы с базовым URL
{: #base-url-problems}

Если вы использует опцию базового URL, например:

```bash
jekyll serve --baseurl '/blog'
```

То проверяйте доступность сайта по следующему адресу:


`http://localhost:4000/blog/index.html`


Он не будет работать по простому адресу:


`http://localhost:4000/blog`


### Проблемы  с конфигурированием
{: #configuration-problems}

Порядок иерархии для конфликтующих [настроек конфигурации](/documentation/06_configuration.html) следующий:

1. Флаги командной строки.
2. Настройки конфигурационных файлов.
3. Дефолтные значения.

Именно: все дефолтные значения перекрываются опциями в `_config.yml`, а флаги командной строки имеют приоритет перед всеми остальными настройками.

### Проблемы с разметкой
{: #markup-problems}

В различных языках разметки, поддерживаемых Jekyll бывают свои проблемы. В этом разделе мы собрали самые распространенные из них.

#### Liquid

В последней версии 2.0 ошибку вызывает использование двойных фигурных скобок {% raw %}`{{`{% endraw %}:

{% raw %}

```liquid
'{{' was not properly terminated with regexp: /\}\}/  (Liquid::SyntaxError)
```

{% endraw %}

#### Выдержки

Начиная с версии 1.0.0 Jekyll автоматически генерирует выдержки. С версии 1.1.0 Jekyll  также прогоняет эти выдержки через Liquid, что может повлечь странные ошибки с несуществующими ссылками и незакрытыми тегами. Если вы столкнулись с такими ошибками, задайте опцию `excerpt_separator: ""` в `_config.yml`.
