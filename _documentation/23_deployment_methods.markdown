---
layout: doc
title: "Методы развертывания"
description: "Методы развертывания сайта на Jekyll."
prism: yes
---
Сайты на Jekyll могут развертываться самыми разными способами, благодаря статическому выводу контента. Мы опишем несколько наиболее распространенных техник.

### Провайдеры веб-хостинга (FTP)

Любой традиционный провайдер хостинга позволяет вам закачать ваши файлы на серверы через FTP. Чтобы закачать сайт на Jekyll через FTP, просто соберите сайт командой `jekyll` и скопируйте сгенерированный каталог `_site` в корневой каталог вашего аккаунта на хостинге. Обычно это каталоги  `httpdocs` или `public_html`.

#### FTP с использованием Glynn

Существует специальный проект [Glynn](https://github.com/dmathieu/glynn), позволяющий легко сгенерировать сайт на Jekyll  и отправить готовые статические файлы на хостинг через FTP.

### Собственный веб-сервер

Если у вас есть свой выделенный сервер, процесс развертывания на нем аналогичен, за исключением того, что для вас доступны новые методы (такие как `scp` и прямой доступ к файловой системе) для передачи файлов. Просто не забудьте поместить содержимое `_site` в корневой каталог вашего сервера.

### Автоматизированные методы

Существует также несколько способов автоматизации развертывания сайтов на Jekyll. Если у вас есть метод, не указанный здесь, мы с радостью [добавим ](http://jekyllrb.com/docs/contributing/) его, чтобы им могли пользоваться все.

#### Хук  `post-update ` в Git

Если вы сохраняете свой сайт на Jekyll  с помощью [Git](http://git-scm.com/) (а вы ведь используете системы контроля версий, не так ли?), то вы можете легко автоматизировать процесс развертывания путем настройки хука после обновлений в вашем репозитории Git [по образцу](http://web.archive.org/web/20091223025644/http://www.taknado.com/en/2009/03/26/deploying-a-jekyll-generated-site/).

#### Хук `post-receive` в Git

Чтобы удаленный сервер обновлял сайт после каждой отправки изменений в Git, вы можете создать пользовательский аккаунт с публичными ключами для авторизации в файле `authorized_keys`. При наличии этого файла, настройка хука после приема (post-receive) делается следующим образом:

```bash
laptop$ ssh deployer@example.com
server$ mkdir myrepo.git
server$ cd myrepo.git
server$ git --bare init
server$ cp hooks/post-receive.sample hooks/post-receive
server$ mkdir /var/www/myrepo
```

Теперь добавьте следующие строки  для хука после приема (не забудьте, что Jekyll должен быть установлен на сервере):

```bash
GIT_REPO=$HOME/myrepo.git
TMP_GIT_CLONE=$HOME/tmp/myrepo
PUBLIC_WWW=/var/www/myrepo

git clone $GIT_REPO $TMP_GIT_CLONE
jekyll build -s $TMP_GIT_CLONE -d $PUBLIC_WWW
rm -Rf $TMP_GIT_CLONE
exit
```

И в завершение, запустите следующую команду на пользовательском компьютере для активации автоматического развертывания:

```bash
laptops$ git remote add deploy deployer@example.com:~/myrepo.git
```

Теперь все просто --- надо указать серверу (nginx или Apache) мониторить `/var/www/myrepo ` и запускать следующую команду:

```bash
laptops$ git push deploy master
```

#### Хук Jekyll

Вы также можете использовать хук Jekyll, сервер, прослушивающий посты с GitHub и генерирующий  сайт на Jekyll  с последующим переносом для публикации. Его можно использовать для запуска собственного сервера в стиле GitHub.

Этот метод полезен, когда вам надо работать с сервером, защищенным firewall, подключая экстра-функционал сервера типа базовой аутентификации HTTP или же если вы хотите хостить ваш сайт непосредственно на CDN или хостинге файлов типа S3.

Шаги по настройке полностью документированы в [репозитории Jekyll-hook](https://github.com/developmentseed/jekyll-hook).

#### Static Publisher

[Static Publisher](https://github.com/static-publisher/static-publisher) это еще один вариант автоматического развертывания с сервером, прослушивающим посты, но не привязанный конкретно к GitHub. В нем есть развертывание в один клик на  Heroku, есть возможность наблюдения за несколькими проектами на одном сервере, простой интерфейс админки и возможность публикации на S3 или в git-репозиторий (т.е. на gh-pages).

#### Rake

Еще один способ развертывания сайтов на Jekyll это использование [Rake](https://github.com/jimweirich/rake), [HighLine](https://github.com/JEG2/highline) или [Net::SSH](https://github.com/net-ssh/net-ssh). Более сложный пример развертывания Jekyll  с помощью Rake показан на [Git Ready](https://github.com/gitready/gitready/blob/cdfbc4ec5321ff8d18c3ce936e9c749dbbc4f190/Rakefile).

#### rsync

После того как вы сгенерировали каталог `_site`, вы можете легко развернуть его с помощью скрипта rsync `tasks/deploy`, аналогичного [этому скрипту развертывания](https://github.com/henrik/henrik.nyh.se/blob/master/script/deploy). Разумеется, вам надо изменить настройки в соответствии с настройками вашего сайта. 

Другой способ облегчения процесса публикации это авторизация на основе сертификата. Имеет смысл ограничить доступ rsync каталогом, который вы собираетесь синхронизировать. Для этого есть скрипт rrsync.

**Шаг 1: установите rrsync в домашний каталог сервера**

* [Скачайте rrsync](https://ftp.samba.org/pub/unpacked/rsync/support/rrsync) 
* Поместите в каталог `bin` домашнего каталога (`~/bin`)
* Сделайте его исполняемым (`chmod +x`)

**Шаг 2: настройте SSH-доступ на основе сертификата на сервере**

Этот [процесс](https://wiki.gentoo.org/wiki/SSH#Passwordless_Authentication) многократно описан в сети. Отличие от  обычного подхода состоит в том, что в `~/.ssh/authorized_keys` устанавливается ограничение на основе сертификатов авторизации.  После настройки запустите `rrsync` и установите его в папку, в которой у него должен быть доступ для чтения.

```ruby
command="$HOME/bin/rrsync <folder>",no-agent-forwarding,no-port-forwarding,no-pty,no-user-rc,no-X11-forwarding ssh-rsa <cert>
```

`<folder>` в данном случае это путь к вашему сайту. Например, `~/public_html/you.org/blog-html/`.

**Шаг 3: Rsync на клиенте**

Добавьте к исходникам сайта скрипт `deploy`:

```bash
#!/bin/sh

rsync -crvz --rsh='ssh -p2222' --delete-after --delete-excluded   <folder> <user>@<site>:
```

В командной строке используются следующие параметры:

*  `--rsh=ssh -p2222` — Порт для доступа SSH. Этот параметр следует указывать если хост использует порт, отличный от дефолтного (например, HostGator)
*  `<folder>` — Имя локального каталога с готовой сборкой сайта (по умолчанию `_site`)
*  `<user>` — Имя пользователя на хостинге
*  `<site>` — Сервер хостинга

С такой настройкой выполните следующую команду:

```bash
rsync -crvz --rsh='ssh -p2222' --delete-after --delete-excluded   _site/ hostuser@example.org:
```

Не забудьте двоеточие (`:`) после имени сервера.

**Шаг 4: исключите скрипт для развертывания из сборки**

Этот шаг рекомендуется, если вы используете эту инструкцию для развертывания своего сайта. Если вы поместили скрипт `deploy` в корневой каталог вашего проекта, Jekyll скопирует его на собранном сайте. Это можно предотвратить, изменив файл конфигурации `_config.yml`.

Просто добавьте в него следующую строку:

```yaml
# Do not copy these files to the output directory
exclude: ["deploy"]
```

Также вы можете использовать файл `rsync-exclude.txt`, для определения файлов, отправляемых на сервер.

Теперь вы можете публиковать свой сайт путем запуска скрипта `deploy`. Если ваш сертификат SSH [защищен контрольной фразой](https://martin.kleppmann.com/2013/05/24/improving-security-of-ssh-private-keys.html), вам придется вводить ее при каждом выполнении скрипта.

### Rack-Jekyll

[Rack-Jekyll](https://github.com/adaoraul/rack-jekyll/) это простой способ развертывания вашего сайта на любой Rack сервер типа EC2, Slicehost, Heroku и т.д. Также может работать с  [shotgun](https://github.com/rtomayko/shotgun/), [rackup](https://github.com/rack/rack), [mongrel](https://github.com/mongrel/mongrel), [unicorn](https://github.com/defunkt/unicorn/) и [прочими](https://github.com/adaoraul/rack-jekyll#readme).

Развертывание на Heroku с использованием Rack-Jekyll описано в [этой статье](http://blog.crowdint.com/2010/08/02/instant-blog-using-jekyll-and-heroku.html).

### Jekyll-Admin для Rails

Если вы хотите работать с Jekyll внутри существующего приложения Rails вы можете это сделать с помощью [Jekyll-Admin](https://github.com/zkarpinski/Jekyll-Admin), подробно это описано в [Readme Jekyll-Admin](https://github.com/zkarpinski/Jekyll-Admin/blob/master/README).

### Amazon S3

Если вы хотите хостить ваш сайт на Amazon S3, вы можете сделать это с помощью приложения [s3_website](https://github.com/laurilehmijoki/s3_website). Оно автоматически отправит ваш сайт на Amazon S3, где он будет работать также как любой веб-сервер, динамически масштабируя практически безлимитный трафик. Этот подход имеет преимущества за счет минимизации расходов на хостинг с оплатой того, что вы используете.

### OpenShift

Для развертывания на Opensift есть [готовый картридж](https://github.com/openshift-cartridges/openshift-jekyll-cartridge).

###### Совет: используйте GitHub Pages для беспроблемного хостинга Jekyll
{: .protip}
GitHub Pages работают на Jekyll, поэтому являются идеальным решением для удобного и [бесплатного хостинга](http://jekyllrb.com/docs/github-pages/).
{: .protip}

### Kickster

[Kickster](http://kickster.nielsenramon.com/) предназначен для упрощения развертывания на GitHub сайтов, использующих неподдерживаемые плагины.

Kickster  предоставляет базовый проект Jekyll, улучшенный за счет использования лучших практик и инструментов оптимизации. В Kickster встроены скрипты для автоматического и безболезненного развертывания на  GitHub Pages.

Настроить Kickster легко — просто установите соответствующий гем. Более подробная документация есть на [странице проекта](https://github.com/nielsenramon/kickster#kickster). Если вы не хотите использовать гем или начинать новый проект, вы можете просто скопировать скрипты для развертывания на [Travis CI](https://github.com/nielsenramon/kickster/tree/master/snippets/travis) или [Circle CI](https://github.com/nielsenramon/kickster#automated-deployment-with-circle-ci).

### Aerobatic

[Aerobatic](https://www.aerobatic.com/) это дополнение к Bitbucket, реализующее функционал GitHub Pages. Оно "из коробки" включает непрерывное развертывание, поддержку кастомных доменов с wildcard-ссертификатами SSL, CDN, базовую аутентификацию и промежуточные этапы.

Автоматизация с этим дополнением сборки и развертывания сайта на Jekyll также проста, как и на GitHub Pages — отправляйте изменения в репозиторий (исключив каталог `_site`) и через несколько секунд запустится сборка с развертыванием вашего сайта на доступном по всему мире хостинг-сервисе. Процесс сборки позволяет устанавливать и запускать кастомные плагины Ruby. Подробности [в разделе документации  о Jekyll](https://www.aerobatic.com/docs/static-generators#jekyll).