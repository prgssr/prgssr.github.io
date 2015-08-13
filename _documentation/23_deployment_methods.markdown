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

#### Хук с post-update  в Git

Если вы сохраняете свой сайт на Jekyll  с помощью [Git](http://git-scm.com/) (а вы ведь используете системы контроля версий, не так ли?), то вы можете легко автоматизировать процесс развертывания путем настройки хука после обновлений в вашем репозитории Git [по образцу](http://web.archive.org/web/20091223025644/http://www.taknado.com/en/2009/03/26/deploying-a-jekyll-generated-site/).

#### Хук с post-receive в Git

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

Теперь все просто - надо указать серверу (nginx или Apache) мониторить `/var/www/myrepo ` и запускать слудующую команду:

```bash
laptops$ git push deploy master
```

#### Хук Jekyll

Вы также можете использовать хук Jekyll, сервер, прослушивающий посты с GitHub и генерирующий  сайт на Jekyll  с последующим переносом для публикации. Его можно использовать для запуска собственного сервера в стиле GitHub.

Этот метод полезен, когда вам надо работать с сервером, защищенным firewall, подключая экстра-функционал сервера типа базовой аутентификации HTTP или же если вы хотите хостить ваш сайт непосредственно на CDN или хостинге файлов типа S3.

Шаги по настройке полностью документированы в [репозитории Jekyll-hook](https://github.com/developmentseed/jekyll-hook).

#### Rake

Еще один способ развертывания сайтов на Jekyll это использование [Rake](https://github.com/jimweirich/rake), [HighLine](https://github.com/JEG2/highline) или [Net::SSH](https://github.com/net-ssh/net-ssh). Более сложный пример развертывания Jekyll  с помощью Rake показан на [Git Ready](https://github.com/gitready/gitready/blob/cdfbc4ec5321ff8d18c3ce936e9c749dbbc4f190/Rakefile).

#### rsync

После того как вы сгенерировали каталог `_site`, вы можете легко развернуть его с помощью скрипта rsync `tasks/deploy`, аналогичного [этому скрипту развертывания](https://github.com/henrik/henrik.nyh.se/blob/master/script/deploy). Понятно, что вам надо изменить настройки в соответствии с настройками вашего сайта. Также есть [специальная команда TextMate](http://gist.github.com/214959), помогающая запустить скрипт из Textmate.

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
***GitHub Pages работают на Jekyll, поэтому являются идеальным решением для удобного и [бесплатного хостинга](http://jekyllrb.com/docs/github-pages/).***
