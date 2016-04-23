---
title: "Начинаем работу с Browserify"
layout: post
categories: [development]
tags: [javascript, devtools, translation, scotch]
date: 2016-04-23 11:49:18 +0300
prism: yes
description: "Краткое введение в  Browserify — что это такое, отличия от webpack, настройка и интеграция в рабочий процесс"
original: "https://scotch.io/tutorials/getting-started-with-browserify"
original_title: "Getting Started with Browserify"
original_author: "Peleke Sengstacke"
thumbnail: "/images/development/tools/gSKWAXlyQJuySCmh8H0d_ca4bc09.png"
---

Browserify изменил мою жизнь.

...Мою жизнь как разработчика Javascript, разумеется. В отличие от многих моих коллег, возможно, от большинства из них — мне не нравится заниматься написанием пользовательского интерфейса. Совместная работа над кодом клиентской части всегда была для меня как визит к дантисту. Которого я боялся...

Но тут появился [Browserify](http://browserify.org/). И это изменило все.


Browserify позволяет использовать `require` в браузере также, как это делается в Node. Это не просто синтаксический сахар для загрузки скриптов на клиенте. Это инструмент, переносящий все ресурсы экосистемы NPM с сервера на клиент.

Простая, но невероятно мощная штука.

В этой статье мы рассмотрим следующие вопросы:

* Что такое Browserify и как он работает
* Browserify или Webpack
* Создание первого проекта
* Трансформация с Browserify
* Правильная настройка конфигурации Browserify
* Интеграция с Gulp

Перед тем, как начать, убедитесь, что у вас установлены Node и NPM. Для работы над статьей я использовал Node 5.7.0 и NPM v3.6.0, но проблем из-за использования других версий быть не должно. Для начала работы можете [выкачать репозиторий](https://github.com/Peleke/browserify_introduction) или написать код самостоятельно.

Приступим.

## Почему Browserify?

Каждый, кто работал с Node, знаком с функцией [require](http://fredkschott.com/post/2014/06/require-and-the-module-system/) из проекта [CommonJS](http://www.commonjs.org/).

Подключение модуля с помощью require открывает публичный API модуля файлу, в котором вызывается `require`.

```javascript
"use strict";
const React = require('react');

let Component = React.createClass ({
    /* Using React, save the world */
});
```

Имплементация `require` в Node делает модуляризацию серверного кода элементарной задачей. Установите, подключите, используйте. Тупо просто.

Загрузка модулей на клиенте это нечто совершенно иное. В самом простом случае, вы загружаете модули с помощью серии тегов `<script>` в вашем  HTML. Это совершенно правильно, но это может быть проблематичным в силу двух причин:

* вы вынуждены вручную управлять зависимостями, чтобы обеспечить правильный порядок тегов, подключающих скрипты; с усложнением зависимостей все это становится громоздким;
* процитирую фразу Кайла Симпсона из [документации LAB.js](https://github.com/getify/LABjs): "с обычными тегами `<script>` вы не можете кроссбраузерно контролировать загрузку и исполнение скриптов".

[Спецификация](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) и загрузчики AMD, а [Require.js один из самых популярных среди них](http://requirejs.org/), появились как решения для этих проблем. И, честно говоря, они потрясающие. Нет ничего неправильного в Require.js или загрузчиках AMD в целом, но новые решения типа Browserify или Webpack, обладают [явными преимуществами над Require.js](http://benmccormick.org/2015/05/28/moving-past-requirejs/).

Среди прочего, Browserify: 

* упрощает многие задачи по препроцессингу за счет своей системы трансформации;
* решает те же проблемы с асинхронной загрузкой, что и Require.js;
* открывает дверь во фронтенд для огромной и развивающейся экосистемы NPM.

По ходу статьи мы рассмотрим все это и многое другое. Но для начала разберемся, а почему не Webpack?

## Browserify или Webpack

Все религиозные войны между Angular и Ember, Grunt и Gulp, Browserify и Webpack показывают одну простую вещь: **выбор инструментов для разработки это серьезный вопрос**.

Выбор между Browserify и Webpack зависит большей частью от того, какие инструменты вы уже используете и какие задачи ставятся перед вашим проектом. Существует достаточно различий в их функционале, но самое важное отличие, на мой взгляд, это это их назначение:

* Browserify стремится провести экосистему Node в браузер. Он поддерживает только синтаксис CommonJS `require` и предоставляет браузерные [шимы](https://github.com/web-standards-ru/dictionary/blob/master/dictionary.md#shim) для [большей части функциональности](https://github.com/substack/browserify-handbook#builtins) ядра Node.
* Webpack стремится унифицировать синтаксис модулей JavaScript и предоставить полный набор инструментов для управления статическими ресурсами сайта. Он не накладывает ограничений на ваш выбор модулей и дает полную поддержку  Javascript, CSS и даже обработку изображений.

Если ваш проект и его зависимости тесно привязаны к экосистеме Node, Browserify будет правильным выбором. Если вам нужно больше возможностей по управлению статическими ресурсами, а не только скриптами, то тогда вам подойдет Webpack.

Мне больше подходит Browserify, так как мне редко нужны дополнительные возможности Webpack. Но если ваша система сборки ресурсов достаточно сложная, то Webpack будет хорошим выбором.

Если вы решили проверить это, ознакомьтесь с  [Front-End Tooling Book's chapter on Webpack](http://tooling.github.io/book-of-modern-frontend-tooling/dependency-management/webpack/introduction.html) и [Pete Hunt's Webpack How-To](https://github.com/petehunt/webpack-howto), перед тем как изучать официальную документацию.

## Собираем наш первый проект с Browserify

*Примечание: если вам лень заниматься копипастой кода, просто [клонируйте репозиторий](https://github.com/Peleke/browserify_introduction/).*

Приступим к работе. Первый шаг это установка Browserify. Откройте терминал и выполните:

```bash
npm install --global browserify
```

Вы установили пакет с Browserify и сделали его доступным для всей системы.

И, да, если консоль потребовала от вам использовать `sudo`, [разберитесь с этим](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

Затем нашему маленькому проекту понадобится дом. Найдите уютное место на жестком диске и создайте новый каталог:

```bash
mkdir Browserify_Introduction && cd Browserify_Introduction
```

Для работы нам нужна простенькая домашняя страница, вот наш `index.html`:

```markup
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <title>Getting Cozy with Browserify</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <style>
      h1, p, div { text-align: center; }
      html       { background: #fffffe; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Welcome to the Client Side.</h2>

      <div class="well">
        <p>I see you've got some numbers. Why not let me see them?</p>

        <div id="response">
        </div>
      </div>
    </div>
    <script src="main.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
```

Если кто-то вдруг решит набрать эту разметку вручную, то он однозначно заметит ссылку на несуществующий файл `main.js`. Создадим этот файл.

Но сначала мы установим [Ramda](http://ramdajs.com/0.19.1/index.html):

```bash
npm install ramda --save
```

В Ramda нет ничего особенного, я выбрал эту библиотеку только потому что она мне нравится. 

Теперь поместите в `main.js` следующий код:

```javascript
main.js
"use strict";

var R = require('ramda');

var square = function square (x) { return x * x; }  
var squares = R.chain(square, [1, 2, 3, 4, 5]); 

document.getElementById('response').innerHTML = squares;
```

Этот код простой, но мы все равно разберем его пошагово:

* сначала мы подключаем библиотеку Rambda как R;
* затем создаем простую функцию `square` для использования в нашем примере;
* затем используем некоторые возможности Rambda и полученный результат присваиваем `squares`;
* находим на странице `div` с id `response` и помещаем в него `squares`.

Важно сразу обратить внимание на то, что мы используем `require`, доступный только в окружении Node вместе с DOM API, доступном только в браузере.

Это не должно работать. И фактически это не работает. Если вы откроете `index.html` в браузере и откроете консоль, вы увидите ReferenceError, дожидающуюся вашего внимания.

![сообщение об ошибке в developer toolbar ](/images/development/tools/wuZzMzYTKy2w6Pw73P8O_9128ac2.png)

Давайте избавимся от этого.

В том же каталоге, где находится ваш `main.js` запустите:

```bash
browserify main.js -o bundle.js
```

Теперь снова откройте `index.html` и вы увидите в середине страницы массив с квадратами чисел.

Так просто.

## Под капотом 

Когда вы приказываете Browserify обработать `main.js`, он сканирует этот файл и запоминает все файлы, которые вы подключаете. После чего подключает исходники этих файлов к итоговому, а затем проделывает то же самое с зависимостями этих файлов.

Другими словами, Browserify разбирает полностью все зависимости проекта, используя `main.js` как входную точку и включает в итоговый файл исходный код всех найденных зависимостей.

Если вы откроете свой `bundle.js`, вы увидите это в действии. В начале будет немного загадочного обфусцированного кода, затем ваш исходный код, и, наконец, полный код библиотеки  Ramda. 

Волшебство, не так ли?

Теперь рассмотрим некоторые дополнительные основы Browserify.

## Трансформации Browserify 

Возможности Browserify не ограничиваются конкатенацией кода зависимостей. Он также может трансформировать код.

"Трансформировать" может означать многое. Это может быть [компиляция  Coffeescript в Javascript](https://github.com/jnordberg/coffeeify), [транспиляция ES2015 в ванильный Javascript](https://github.com/babel/babelify) или даже [замена объявлений const на var](https://github.com/thlorenz/varify).

Если ваш код изменен, это считается как трансформация. Мы еще рассмотрим использование трансформаций в полном примере, так что ждите подробностей. А пока можете добавить на будущее в закладки [растущий список доступных трансформаций в Browserify](https://github.com/substack/node-browserify/wiki/list-of-transforms).

## Карты исходников

Одним из недостатков трансформаций (и сборок в целом) являются потеря ссылок на строки. Когда код выдает ошибку, вы ждете, что браузер скажет вам: "Чувак, смотри строку 57, столбец 23". Но вместо этого он выдает невнятное "Взгляни на переменную q на первой строке в столбце  18,278 в main.min.js".

Решением являются [карты исходников (Source Maps)](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). Это файлы, которые говорят браузеру, как транслировать ссылки на строки в трансформированном коде в ссылки на строки в исходниках.

В Browserify карты исходников активируются тривиально. 

```bash
browserify --debug main.js -o bundle.js
```

Флаг `--debug` приказывает Browserify  включить информацию о карте исходников в `bundle.js`. И этого достаточно, чтобы они заработали.

У этого есть один очевидный недостаток: добавление карт исходников в ваш `bundle.js` увеличивает его размер примерно вдвое.

Это нормально для разработки. Но мы же не хотим заставлять пользователя скачивать файл вдвое большего размера, чем нужно.

Решение состоит в создании двух файлов: одного для карты исходников, второго для самого проекта. Если вы используете Browserify отдельно, вашим инструментом будет [exorcist](https://www.npmjs.com/package/exorcist).

После установки (`npm install --global exorcist`), вы можете использовать его следующим образом:

```bash
browserify main.js --debug | exorcist bundle.map.js > bundle.js
```

Так вы переносите всю информацию о картах исходников из `bundle.js` в отдельный файл `bundle.map.js`.

Вот собственно и вся требуемая помощь от пакета exorcist, детали вы можете [почерпнуть из документации](https://www.npmjs.com/package/exorcist#api).

## Сборка в реальном времени

Я знаю, что всех раздражает переходить из текстового редактора в командную строку каждый раз после изменения файла.

И мы можем обойтись без этого.

Есть куча инструментов для  Browserify, отслеживающих изменения в ваших файлах и перезапускающих сборку в случае изменений. Мы рассмотрим пару из них: [Watchify](https://github.com/substack/watchify) и [Beefy](http://didact.us/beefy/).

### Watchify

Watchify это стандартный инструмент для автоматической пересборки вашего `bundle.js` при обновлении файлов исходников.

Сначала установите его с помощью NPM:

```bash
npm install --global watchify
```

Затем удалите ваш `bundle.js.`

После чего в терминале перейдите в ваш рабочий каталог и выполните команду:

```bash
watchify main.js -o bundle.js -v
```

Флаг `-v` приказывает Watchify уведомлять вас о каждой пересборке проекта. Все будет работать и без него, но вы не будете знать, когда запускалась и сколько времени заняла сборка. 

И обратите внимание, что использование Watchify идентично использованию Browserify! Проводится точно та же работа и в вашем рабочем каталоге будет обновленный `bundle.js`.

Теперь откройте `main.js` и сохраните его без каких-либо изменений. Вы увидите, что Watchify пересобирает ваш проект и выводит сообщения об этом — это все, что требуется для пересборки вашего проекта при изменении исходников.

В [репозитории Watchify](https://github.com/substack/watchify) есть вся информация по продвинутому использованию, типа совместного использования с exorcist.

Если вы сейчас проверяли работу Watchify на практике, не забудьте прибить процесс Watchify перед переходом к следующему примеру (закрыв терминал, выполнив `kill $(pgrep node)`).

### Beefy

Круто, что нам не надо каждый раз перезапускать сборку после изменений, но нам по-прежнему приходится обновлять браузер вручную. Это кошмар!

Или просто лень.

Независимо от причин, [Beefy](http://didact.us/beefy/) позволит с легкостью реализовать автоматическое обновление браузера сразу после пересборки. У этого пакета есть две функции:

* запуск локального сервера;
* отслеживание изменений в  ваших файлах-исходниках.

При изменении кода автоматически запускается пересборка, а при задании соответствующей опции также происходит и обновление браузера.

Если вам больше ничего не надо, то с Beefy у вас не будет проблем. 

Для начала установите этот пакет:

```bash
npm install -g beefy
```

Я устанавливаю его глобально, потому как часто его использую. Если вы хотите использовать его только в рамках проекта, вам подойдет другая команда:

```bash
beefy main.js --live
```

В любом случае, дальше все просто. Сначала удалите `bundle.js`. Затем в терминале перейдите в рабочий каталог и выполните:

```bash
beefy main.js --live
```

Beefy выведет информацию о том, что он прослушивает <http://127.0.0.1:9966>.

А если он будет ругаться на ошибку: "Error: Could not find a suitable bundler!", выполните следующую команду.

```bash
beefy main.js --browserify $(which browserify) --live
```

Команда `--browserify $(which browserify)` дает указание использовать Beefy использовать глобальную версию Browserify. Если вы не столкнулись с указанной ошибкой, то вам это не надо.

Теперь Beefy отслеживает `main.js`. Если в вашем приложении иная входная точка, например, `app.js`, то вы должны указать ее. Опция `--live` отвечает за обновление браузера после пересборки.

Рассмотрим это в действии. В вашем браузере перейдите по адресу <http://localhost:9966>. Вы увидите ту же самую домашнюю страницу, что и в предыдущих примерах.

![домашняя страница проекта с Beefy до обновления](/images/development/tools/gSKWAXlyQJuySCmh8H0d_ca4bc09.png){: itemprop="image"}

Теперь откройте `main.js`, и измените значение `squares`:

```javascript
"use strict";

var R = require('ramda');

var square = function square (x) { return x * x; }  
var squares = R.chain(square, [1, 2, 3, 4, 5, 6]); 

document.getElementById('response').innerHTML = squares
```

Сохраните и проверьте страницу. Вы увидите обновленную версию:

![домашняя страница проекта с Beefy после обновления](/images/development/tools/CZwrn3lNSIuoZPF5g54q_d3a34c4.png)

И если вы смотрели на страницу до сохранения, то вы заметили, что она обновилась в реальном времени.

Beefy пересобирает `main.js` после каждого запроса к серверу за `bundle.js`. Beefy не сохраняет `bundle.js` в ваш рабочий каталог, когда он вам понадобится для готового проекта, его надо собрать с помощью Browserify. Мы еще рассмотрим, как можно разобраться с этой мелкой проблемой.

Итак, мы разобрались с Beefy, более подробная информация, как всегда, [в документации пакета](https://github.com/chrisdickinson/beefy).

## Создание базовой конфигурации Browserify

Продолжаем осваивать основы Browserify. Сделаем небольшую конфигурацию Browserify, способную:

* подключать зависимости, написанные как на Javascript, так и на Coffeescript;
* отображать обновления на клиенте в реальном времени;
* собирать минифицированный `bundle.js` с отдельными картами исходников при ручной сборке.

Настоящая конфигурация для коммерческого проекта должна делать больше. Но  наша конфигурация должна лишь показать, как можно использовать Browserify для нетривиальных задач и упростить для вас расширение возможностей Browserify в будущем.

Мы будем использовать [скрипты npm]({% post_url 2016-02-29-pochemu-npm-skripty %}) для настройки проекта (в следующем разделе мы сделаем это же с помощью Gulp).

Приступим.

### Установка зависимостей

Нам надо установить несколько пакетов:

* [Caching-Coffeify](https://github.com/thlorenz/caching-coffeeify) для поддержки  Coffeescript в ходе работы сервера;
* [Coffeeify](https://github.com/substack/coffeeify) для поддержки Coffeescript при сборке проекта;
* [Beefy](http://didact.us/beefy/) для перезагрузки в реальном времени;
* [Minifyify](https://github.com/ben-ng/minifyify) для минификации нашего проекта.

Beefy у нас уже установлен, все остальное мы поставим одной командой:

```bash
npm install --save-dev caching-coffeeify coffeeify minifyify
```

Теперь приступим к сборке наших скриптов. Откройте `package.json`, в нем вы найдете объект `scripts`, в котором должен быть ключ `test`. 

Сразу после него добавьте задачу `serve`:

```javascript
"serve" : "beefy main.js --live"
```

Готовый `package.json` вы найдете в моем [репозитории на GitHub](https://github.com/Peleke/browserify_introduction/blob/master/package.json). И, да, если в предыдущих примерах вам пришлось использовать опцию `--browserify $(which browserify)`, то вам придется использовать ее и сейчас.

Сохранитесь, вернитесь в терминал и запустите `npm run serve`. Вы увидите тот же вывод, что и ранее с Beefy.

Вы можете получить ошибку ENOSPC. В этом случае запустите `npm dedupe` и попытайтесь еще раз. Если и это не поможет, вам стоит попробовать [первый ответ из обсуждения на stackoverflow](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/31926452#31926452).

Мы связали команду `beefy main.js --live` с именем скрипта `serve`. Когда мы выполняем `npm run <имя скрипта>`, npm выполняет команду, связанную с этим скриптом внутри объекта `scripts` в `package.json`. В нашем случае `npm run serve` запускает Beefy.

Начало неплохое. Перейдем к завершению.

Откройте `package.json` еще раз и измените скрипт `serve`:

```bash
"serve" : "beefy main.js --browserify -t caching-coffeeify --live"
```

При использовании Beefy опция `--browserify` позволяет передавать опции для запуска Browserify.  Первая из этих опций  `-t`, говорящая о том, что при сборке будет трансформация, в нашем случае это Caching-Coffeeify, компиляция  Coffeescript в Javascript, оптимизированная для перекомпиляции только того, что поменялось, в отличие от стандартной опции трансформации Coffeeify. 

Теперь мы можем использовать Coffeescript в нашем проекте. Вы можете увидеть это в действии, создав  `list_provider.coffee` отдельно от `main.js`:

```coffeescript
# list_provider.coffee
"use strict"
module.exports = () => [1, 2, 3, 4, 5]
```

И исправив, соответственно, `main.js`:

```javascript
// main.js
"use strict";

var R = require('ramda'),
      get_list = require('./list_provider.coffee');

var square = function square (x) { return x * x; }  
var squares = R.chain(square, get_list()); 

document.getElementById('response').innerHTML = squares
```

Теперь запустите `npm run serve`, перейдите на <http://localhost:9966> — все будет работать.

### Задание по сборке

Теперь добавим в `package.json` задание по сборке минифицированного проекта с отдельными картами источников:

```javascript
/* Remainder omitted */

"serve"         : "beefy main.js --browserify -t caching-coffeeify --live",
"build" : "browserify main.js --debug -t coffeeify -t -p [ minifyify --map bundle.js.map --output build/bundle.map.js ] > build/bundle.js" 

/* Remainder omitted */
```

Теперь выполните в рабочем каталоге `mkdir build`, в созданный каталог мы будем сохранять `bundle.js` и карту исходников. Запустите `npm run build` и проверяйте, что появилось в вашем рабочем каталоге.

![сборка с npm-скриптами](/images/development/tools/n4ncskLKRLimbEPJfwVd_d65b91b.png)

## Настройка сборки с Gulp

Я думаю, что вы уже знакомы с Gulp. Если нет, взгляните на [этот проект](http://gulpjs.com/).

Использование скриптов npm прекрасно для простых проектов. Но при усложнении они могут оказаться громоздкими и нечитаемыми.

Вот здесь и поможет Gulp.

Ради краткости мы сделаем простую задачу по сборке со следующим функционалом:

* Сама сборка;
* Трансформация Coffeescript с помощью Coffeeify;
* Трансформация ES2015 с помощью Babelify;
* Создание отдельных карт исходников.

Но если вас тянет к чему-то большему, обратите внимание на `gulpfile` из репозитория. В нем есть задача `watch`, использующая более сложные возможности.

Начнем с установки:

```bash
npm install -g gulp && npm install gulp --save-dev
```


Но  недостаточно одного gulp, нам надо установить и инструменты, которые мы собираемся использовать в проекте; все зависимости перечислены в gulpfile ниже.

```bash
npm install --save-dev vinyl-source-stream vinyl-buffer gulp-livereload gulp-uglify gulp-util gulp babelify babel-preset-es2015 buffer merge rename source sourcemaps watchify
```

А вот и сам `gulpfile.js`:

```javascript
// gulpfile.js
// Heavily inspired by Mike Valstar's solution:
//   http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/
"use strict";

var babelify   = require('babelify'),
        browserify = require('browserify'),
        buffer     = require('vinyl-buffer'),
        coffeeify  = require('coffeeify'),
        gulp       = require('gulp'),
        gutil      = require('gulp-util'),
        livereload = require('gulp-livereload'),
        merge      = require('merge'),
        rename     = require('gulp-rename'),
        source     = require('vinyl-source-stream'),
        sourceMaps = require('gulp-sourcemaps'),
        watchify   = require('watchify');

var config = {
    js: {
        src: './main.js',       // Входная точка
        outputDir: './build/',  // Каталог для сохранения результирующего файла
        mapDir: './maps/',      // Подкаталог для карт исходников
        outputFile: 'bundle.js' // Название результирующего файла
    },
};

// Этот метод облегчает использование часто используемых опций сборки в различных задачах
function bundle (bundler) {

    // Добавлений опций к "базовому" бандлеру, передаваемому в качестве параметра
    bundler
      .bundle()                                                        // Запуск бандлера
      .pipe(source(config.js.src))                        // Входная точка
      .pipe(buffer())                                               // Конвертация для конвейера Gulp
      .pipe(rename(config.js.outputFile))          // Переименование итогового файла с 'main.js'
                                                                              //   на 'bundle.js'
      .pipe(sourceMaps.init({ loadMaps : true }))  // Активация карт исходников
      .pipe(sourceMaps.write(config.js.mapDir))    // Сохранение карт исходников
                                                                                      //   в их каталог
      .pipe(gulp.dest(config.js.outputDir))        // Сохранение результирующего файла/
      .pipe(livereload());                                       // Перезагрузка браузера 
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)  // Передача входной точки для browserify
                                .transform(coffeeify)      //  Цепь трансформацийs: Сначала coffeeify . . .
                                .transform(babelify, { presets : [ 'es2015' ] });  // Затем babelify с презетом ES2015

    bundle(bundler);  // Цепочка опций из бандлера выше -- карты исходников, переименования, и т.д.
})

```

Теперь выполните команду `gulp bundle` в вашем рабочем каталоге и вы получите  `bundle.js` в подкаталоге `build/` и `bundle.js.map` в `build/maps/`. 

В конфигурации в основном указаны специфичные для Gulp моменты, впрочем, все откомментировано. Важно отметить, что в задаче `bundle` мы можем вызывать трансформации по цепочке. Это неплохой пример, насколько интуитивным и понятным может быть API Browserify, более подробно все [возможности описаны в документации](https://github.com/substack/node-browserify).

## Заключение

Итак, мы выполнили намеченное и изучили:

* Зачем нужен Browserify и чем он хорош;
* Что общего у Browserify и Webpack;
* Как использовать Browserify для сборки простого проекта;
* Как использовать трансформации Browserify для непростых проектов;
* Как использовать npm-скрипты для настройки сборки и обновления в реальном времени;
* Основы интеграции Browserify и Gulp

Этого более, чем достаточно, чтобы начать продуктивно использовать Browserify. Есть несколько ссылок, которые вам стоит добавить в закладки:

* [Справочник по Browserify](https://github.com/substack/browserify-handbook);
* [Список трансформаций Browserify](https://github.com/substack/node-browserify/wiki/list-of-transforms);
* [Репозиторий с рецептами Gulp](https://github.com/gulpjs/gulp/tree/master/docs/recipes), включающий примеры использования Browserify.



