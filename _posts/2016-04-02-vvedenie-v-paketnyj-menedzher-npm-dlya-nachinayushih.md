---
title: "Введение в пакетный менеджер NPM для начинающих"
layout: post
categories: [development]
tags: [javascript, devtools, translation, sitepoint]
date: 2016-04-02 12:29:32 +0300
prism: yes
description: "Краткое введение в npm: установка, настройка и основные команды"
original: "http://www.sitepoint.com/beginners-guide-node-package-manager/"
original_title: "A Beginner’s Guide to npm — the Node Package Manager"
original_author: "Peter Dierx"
thumbnail: "/images/development/tools/1426064914package_manager-1024x682-min.jpg"
---

Node.js делает возможным написание серверных приложений на JavaScript. Он построен на движке JavaScript V8 и написан на C++ — и поэтому он быстрый. Изначально он создавался как серверное окружение для приложений, но разработчики начали использовать его для создания инструментов, помогающих автоматизировать выполнение локальных задач. В итоге возникшая вокруг Node.js  новая экосистема инструментов (типа  [Grunt](http://gruntjs.com/) и [Gulp](http://gulpjs.com/)), привела к трансформации процесса фронтенд-разработки.

Чтобы использовать все эти инструменты (или пакеты) в Node.js нам нужна возможность устанавливать и управлять ими. Для этого создан npm, пакетный менеджер Node.js. Он устанавливает нужные вам пакеты и предоставляет удобный интерфейс для работы с ними. Но перед тем как начать использовать npm, вам надо установить в своей системе Node.js.

## Установка Node.js

Перейдите на [страницу загрузок Node.js](https://nodejs.org/en/download/) и скачайте нужную вам версию.  Есть установщики для Windows и Mac, а также скомпилированные бинарники и исходный код для  Linux. Кроме того, в Linux вы можете установить Node.js с помощью пакетного менеджера, все это [описано в документации](https://github.com/nodejs/node-v0.x-archive/wiki/installing-node.js-via-package-manager).

В этой статье мы будем использовать стабильную версию 5.7.0.

Посмотреть, где установлен Node и проверить версию можно следующими командами:

```bash
$ which node
/usr/local/bin/node
$ node --version
v5.7.0

```

Чтобы удостовериться, что установка прошла успешно, выполним несколько команд в простой интерактивной среде Node (REPL).

```bash
$ node
> console.log('Node is running');
Node is running
> .help
.break Sometimes you get stuck, this gets you out
.clear Alias for .break
.exit  Exit the repl
.help  Show repl options
.load  Load JS from a file into the REPL session
.save  Save all evaluated commands in this REPL session to a file
> .exit

```

Установка работает, поэтому теперь мы можем сфокусироваться на npm, который включен в установку.

```bash
$ which npm
/usr/local/bin/npm
$ npm --version
3.6.0
```

## Пакеты Node

С помощью npm можно устанавливать пакеты локально или глобально. В локальном режиме пакеты устанавливаются в каталог `node_modules` родительского каталога. Владельцем каталога является текущий пользователь. Глобальные пакеты устанавливаются в  каталог `{prefix}/lib/node_modules/`, владельцем которого является root (префиксом в данном случае обычно является каталог `/usr/` или `/usr/local`). Это значит, что вам надо использовать `sudo`  для глобальной установки пакетов, что может повлечь ошибки с полномочиями  при разрешении сторонних зависимостей, а также создает проблему для безопасности. Изменим это:

![пакетный менеджер как складской рабочий](/images/development/tools/1426064914package_manager-1024x682-min.jpg){: itemprop="image"}

## Изменение места установки глобальных пакетов

Посмотрим, что скажет нам команда `npm config`.

```bash
$ npm config list
; cli configs
user-agent = "npm/3.6.0 node/v5.7.0 linux x64"

; node bin location = /usr/local/bin/node
; cwd = /home/sitepoint
; HOME = /home/sitepoint
; 'npm config ls -l' to show all defaults.
```

Мы получили основную информацию об установке. Теперь важно узнать место установки глобальных пакетов:

```bash
$ npm config get prefix
/usr/local
```

Этот префикс мы хотим изменить так, чтобы устанавливать пакеты в свой домашний каталог. Для этого создайте в домашнем каталоге папку `.node_modules_global` и укажите ее в качестве места установки пакетов в конфигурации:

```bash
$ cd && mkdir .node_modules_global
$ npm config set prefix=$HOME/.node_modules_global
```

Внеся такую небольшую правку в конфигурацию, мы изменили место для глобальной установки пакетов. Также в нашем домашнем каталоге появился файл `.npmrc`.

```bash
$ npm config get prefix
/home/sitepoint/.node_modules_global
$ cat .npmrc
prefix=/home/sitepoint/.node_modules_global
```

Сам npm по-прежнему установлен в каталог, владельцем которого является root. Но так как мы поменяли место установки глобальных пакетов, мы можем использовать полученное преимущество. Мы установим npm еще раз, но теперь в место, указанное нами. Заодно мы получим последнюю версию npm.

```bash
$ npm install npm --global
/home/sitepoint/.node_modules_global/bin/npm -> /home/sitepoint/.node_modules_global/lib/node_modules/npm/bin/npm-cli.js
/home/sitepoint/.node_modules_global/lib
└── npm@3.7.5
```

Наконец, нам надо добавить `.node_modules_global/bin` в нашу переменную окружения `$PATH`, чтобы мы могли запускать глобальные пакеты из командной строки. Сделаем это, добавив следующую строку в файл `.profile` или `.bash_profile` и перезапустив терминал.

```bash
export PATH="$HOME/.node_modules_global/bin:$PATH"
```

Теперь командная оболочка будет сразу находить пакеты, установленные в `.node_modules_global/bin` и использовать корректную версию `npm`.

```bash
$ which npm
/home/sitepoint/.node_modules_global/bin/npm
$ npm --version
3.7.5

```

## Глобальная установка пакетов

На данный момент у нас уже есть один глобальный пакет — это сам пакет npm. Изменим это и установим еще один пакет, это будет [UglifyJS](https://www.npmjs.com/package/uglify-js) (инструмент для минификации JavaScript). Для глобальной установки используется флаг `--global`, его можно записывать сокращенно `-g`.

```bash
$ npm install uglify-js --global
/home/sitepoint/.node_modules_global/lib
└─┬ uglify-js@2.6.2
  ├── async@0.2.10
  ├── source-map@0.5.3
  ├── uglify-to-browserify@1.0.2
  └─┬ yargs@3.10.0
    ├── camelcase@1.2.1
    ├─┬ cliui@2.1.0
    │ ├─┬ center-align@0.1.3
    │ │ ├─┬ align-text@0.1.4
    │ │ │ ├─┬ kind-of@3.0.2
    │ │ │ │ └── is-buffer@1.1.2
    │ │ │ ├── longest@1.0.1
    │ │ │ └── repeat-string@1.5.4
    │ │ └── lazy-cache@1.0.3
    │ ├── right-align@0.1.3
    │ └── wordwrap@0.0.2
    ├─┬ decamelize@1.1.2
    │ └── escape-string-regexp@1.0.5
    └── window-size@0.1.0
```

Как вы можете видеть из вывода в консоль, у нас установлены дополнительные пакеты — это зависимости UglifyJS.

## Вывод списка установленных пакетов

Мы можем вывести список глобально установленных пакетов с помощью команды `npm list`  с опцией `--global`:

```bash
$ npm list --global
├─┬ npm@3.7.5
│ ├── abbrev@1.0.7
│ ├── ansi-regex@2.0.0
│ ├── ansicolors@0.3.2
│ ├── ansistyles@0.1.3
....................
└─┬ uglify-js@2.6.2
  ├── async@0.2.10
  ├── source-map@0.5.3
  ├── uglify-to-browserify@1.0.2

```

Такой вывод списка, со всеми зависимостями, перенасыщен. Мы можем выводить его в более читаемом виде с помощью опции `--depth=0`:

```bash
$ npm list -g --depth=0
├── npm@3.7.5
└── uglify-js@2.6.2

```

Стало лучше — теперь мы видим только список установленных пакетов с номерами их версий, без зависимостей.

Теперь мы можем обрабатывать файлы JavaScript в терминале с помощью UglifyJS. Например, следующая команда сделает из файла `example.js` минифицированный `example.min.js`:

## Локальная установка пакетов

Локальная установка используется в npm по умолчанию, то есть достаточно не использовать флаг `--global`. Пакет будет установлен в каталог `node_modules` родительского каталога. Создадим каталог с проектом в нашем домашнем каталоге:

```bash
$ mkdir ~/project && cd ~/project
$ npm install underscore
/home/sitepoint/project
└── underscore@1.8.3
$ ls
node_modules
$ ls node_modules
underscore
```

## Вывод списка локальных пакетов

Также как и в случае с  глобальными пакетами, список локальных выводится командой `npm list`:

```bash
$ npm list
/home/sitepoint/project
└── underscore@1.8.3
```

Как видите, мы можем устанавливать локальные пакеты, где угодно. Это также значит, что мы можем создать другой каталог и установить туда другую версию пакета (в нашем случае это библиотека underscore).

## Удаление локальных пакетов

Так как npm это пакетный менеджер, у него есть возможность удалять пакеты. Предположим, что установленная в предыдущем примере версия underscore вызывает проблемы с совместимостью. Мы можем удалить этот пакет и поставить более старую версию.

```bash
$ npm uninstall underscore
- underscore@1.8.3 node_modules/underscore
$ npm list
/home/sitepoint/project
└── (empty)
```

## Установка определенной версии пакета

Теперь установим нужную версию underscore. В команде установки номер версии указывается после символа `@`:

```bash
$ npm install underscore@1.8.2
/home/sitepoint/project
└── underscore@1.8.2
$ npm list
/home/sitepoint/project
└── underscore@1.8.2
```

## Обновление пакета

В последней версии underscore исправили мешавший нам баг и мы хотим обновить версию этого пакета.

```bash
$ npm update underscore
underscore@1.8.3 node_modules/underscore
$ npm list
/home/sitepoint/project
└── underscore@1.8.3
```

Примечание: для этой статьи, библиотека underscore была указана как зависимость в `package.json` (см. [управление зависимостями](#heading-section-10)).

## Поиск пакетов

Мы уже пару раз использовали команду `mkdir`. Есть ли пакет node с подобным функционалом?

```bash
$ npm search mkdir
npm WARN Building the local index for the first time, please be patient
```

Такой пакет нашелся ([mkdirp](https://www.npmjs.com/package/mkdirp)), установим его. 

```bash
$ npm install mkdirp
/home/sitepoint/project
└─┬ mkdirp@0.5.1
  └── minimist@0.0.8
```

Теперь создадим файл `mkdir.js`:

```bash
var mkdirp = require('mkdirp');
mkdirp('foo', function (err) {
    if (err) console.error(err)
    else console.log('Directory created!')
});
```

И запустим его в терминале:

```bash
$ node. mkdir.js
Directory created!
```

## Управление кэшем

После установки пакета npm сохраняет его копию в кэше, поэтому при следующей его установке вам не нужно беспокоить сеть. Кэш хранится в каталоге `.npm` вашего домашнего каталога.

```bash
$ ls ~/.npm
_locks  minimist  mkdirp  registry.npmjs.org  underscore

```

Этот каталог со временем замусоривается старыми пакетами и иногда его полезно очищать.

```bash
$ npm cache clean
```

## Управление зависимостями

В нашем проекте пока только два пакета, но их количество очень быстро  возрастает. Установка зависимостей вручную очень неудобна, поэтому для управления ими мы можем использовать файл `package.json`, расположив его в корне нашего проекта. Он генерируется с помощью команды `npm init`, которая выведет в консоль несколько вопросов для создания файла:

```bash
$ npm init
This utility will walk you through creating a package.json file.
Press ^C at any time to quit.
name: (project) demo
version: (1.0.0)
description: Demo of package.json
entry point: (index.js)
test command:
git repository:
keywords:
author: Sitepoint
license: (ISC)
```

В результате мы получим файл со следующим содержимым:

```javascript
{
  "name": "demo",
  "version": "1.0.0",
  "description": "Demo package.json",
  "main": "main.js",
  "dependencies": {
    "mkdirp": "^0.5.1",
    "underscore": "^1.8.3"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Sitepoint",
  "license": "ISC"
}
```

Вы можете сгенерировать это файл и более простым способом, с помощью опции `--yes` (автоматический ответ "да" на все вопросы):

```bash
$ npm init --yes
```

Файл `package.json` будет создан в качестве `name` будет использовано название каталога.

Вы также можете добавить `private: true`, чтобы предотвратить случайную публикацию частных репозиториев или подавления любых предупреждений при выполнении `npm install`. Создадим новый каталог и используем `package.json` для установки зависимостей.

```bash
$ mkdir ~/demo && cd ~/demo
$ cp ~/project/package.json ~/demo
$ npm install
$ npm list
demo@1.0.0 /home/sitepoint/demo
├─┬ mkdirp@0.5.1
│ └── minimist@0.0.8
└── underscore@1.8.3
```

Это показывает, как просто мы можем установить пакеты, нужные нам в другом каталоге на основе нашего файла `package.json`. Но как поддерживать его актуальность при установке новых пакетов? Для этого используется флаг `--save`.

```bash
$ npm install request --save
$ npm list --depth=0
demo@1.0.0 /home/sitepoint/demo
├── mkdirp@0.5.1
├── request@2.53.0
└── underscore@1.8.3

```

Наш файл `package.json` также обновился:

```javascript
"dependencies": {
  "mkdirp": "^0.5.1",
  "request": "^2.53.0",
  "underscore": "^1.8.3"
}
```

## Менеджеры версий

Есть пара инструментов, позволяющих использовать несколько версий Node.j на одном компьютере. Первая это [n](https://github.com/tj/n), другая  — [nvm](https://github.com/creationix/nvm)(Node Version Manager). Если вас интересует эта возможность, подробнее о ней можно узнать из следующей статьи: [Install Multiple Versions of Node.js using nvm](http://sitepoint.com/quick-tip-multiple-versions-node-nvm).

## Заключение

В этой статье освещены основы работы с npm. Я показал, как установить Node.js, как изменить место установки глобальных пакетов (так мы можем избежать использования `sudo`) и как установить пакеты локально и глобально. Я также рассмотрел удаление, обновление и установку определенной версии пакета, а также управление зависимостями проекта.

В [каталоге npm](https://www.npmjs.com/) тысячи пакетов и их число будет расти, с учетом [анонса jQuery](http://blog.npmjs.org/post/111475741445/publishing-your-jquery-plugin-to-npm-the-quick) о публикации всех плагинов как пакетов npm.