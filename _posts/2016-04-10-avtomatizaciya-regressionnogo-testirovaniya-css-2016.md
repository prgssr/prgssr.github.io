---
title: "Автоматизация регрессионного тестирования CSS 2016"
layout: post
categories: [development]
tags: [css, devtools, translation, css-tricks]
prism: yes
date: 2016-04-10 12:24:10 +0300
description: "Краткое ввведение в библиотеку BakstopJS для регрессионного тестирования CSS"
original: "https://css-tricks.com/automating-css-regression-testing/"
original_title: "Automating CSS Regression Testing"
original_author: "Garris Shipon"
thumbnail: "/images/development/tools/fig7-802x1024.png"
---

Первая версия этой статьи была опубликована в декабре 2014 года, в апреле 2016 вышла новая версия с учетом изменений в библиотеке BackstopJS.

## Случаи использования  регрессионного визуального тестирования

Просто поищите по запросу "CSS regression testing" и общая тема будет очевидной: поломать CSS легко, а тестировать сложно.

Так было в начале моей работы над большим проектом по рефакторингу, который я делал для крупного онлайн-ритейлера. Также как и у многих других  веб-компаний, этот процесс заключался в добавлении отзывчивого поведения к нашему массивному веб-приложению электронной коммерции, изначально расчитанному на экран шириной 1024 пикселя.

Я понял, что это будет объемная и тонкая работа. Добавление различного поведения для множества контрольных точек,  означает обилие сложных для выявления ошибок. Мне нужен был  способ, позволяющий нашим разработчикам автоматически выявлять баги до того, как наша система контроля качества столкнется с сотней мелких проблем в раскладке (которые надо документировать, отслеживать и, разумеется, решать).

## BackstopJS приходит на помощь

Мне хотелось найти решение, которое было бы удобным для веб-разработчиков. Это значит, что оно должно легко устанавливаться локально, использовать знакомые веб-парадигмы и давать нам разумную уверенность в том, что смена селектора для мобильного устройства не приведет к трудно находимому багу на настольном компьютере.

На тот момент не существовало ничего, что удовлетворяло бы этим требованиям из коробки. Это стало причиной для создания [BackstopJS](http://backstopjs.org/).

BackstopJS это приложение для визуального тестирования регрессий, соединившее  [CasperJS](http://casperjs.org/), [PhantomJS](http://phantomjs.org/) и [ResembleJS](http://huddle.github.io/Resemble.js/)  в легко настраиваемый инструмент для тестирования множественных состояний приложения (или URL), элементов DOM и размеров экрана.

Сейчас перейдем к небольшому пятнадцатиминутному введению в установку и первоначальную настройку BackstopJS.

## Образец тестирования визуальных регрессий

Инструкции будут основаны на простом демонстрационном проекте ([архив ZIP](http://css-tricks.com/examples/myCoolProject.zip)). Проект взят непосредственно со [страницы примеров Bootstrap](http://getbootstrap.com/getting-started/#examples).

### Демонстрационный проект

Распакуйте демонстрационный проект. Мы установим фреймворк для тестирования прямо в эту папку.

![Каталог проекта](/images/development/tools/fig1-768x750.png)

Ниже показано то, что вы увидите открыв `myCoolProject/index.html` в браузере. Помните, этот дизайн отзывчив. Изменяйте размер окна браузера, чтобы увидеть самую узкую раскладку.

![Внешний вид тестируемой страницы](/images/development/tools/fig10.png)

### Установка BackstopJS с помощью npm

Для дальнейшей работы необходимо окружение Node.js и интегрированный пакетный менеджер npm. Подробнее об этом можно прочитать в [этой статье]({% post_url 2016-04-02-vvedenie-v-paketnyj-menedzher-npm-dlya-nachinayushih %}).
{: .info}


Теперь перейдите в корень проекта (`/myCoolProject/`)  и установите BackstopJS:

```bash
$ cd ~/path-to-myProjects/myCoolProject
$ npm install backstopjs
```

Ваш каталог будет выглядеть так:

![Каталог проекта после установки BackstopJS](/images/development/tools/fig2-768x750.png)

Все, установка закончена. Теперь перейдем к тестированию.

### Генерация конфигурационного файла BackstopJS

Процесс первоначальной настройки достаточно прост. Чтобы он стал еще проще, в BackstopJS есть возможность генерации конфигурационного файла, который вы затем можете модифицировать для своего проекта. Перейдите в каталог `myCoolProject/node_modules/backstopjs/` и выполните команду:

```bash
$ cd ~/path-to-myProjects/myCoolProject/node_modules/backstopjs/
$ npm run genConfig
```

Это добавит в корень вашего проекта каталог для скриншотов BackstopJS — `backstop_data` и сгенерирует базовый конфигурационный файл `backstop.json`. 

![Каталог BackstopJS после конфигурирования](/images/development/tools/fig3.png)

В конфигурационном файле вы определяете правила для тестирования. Посмотрим на этот файл:

```javascript
{
  "viewports": [
    {
      "name": "phone",
      "width": 320,
      "height": 480
    }, {
      "name": "tablet_v",
      "width": 568,
      "height": 1024
    }, {
      "name": "tablet_h",
      "width": 1024,
      "height": 768
    }
  ],
  "scenarios": [
    {
      "label": "My Homepage",
      "url": "http://getbootstrap.com",
      "hideSelectors": [],
      "removeSelectors": [
        "#carbonads-container"
      ],
      "selectors": [
        "header",
        "main",
        "body .bs-docs-featurette:nth-of-type(1)",
        "body .bs-docs-featurette:nth-of-type(2)",
        "footer",
        "body"
      ],
      "readyEvent": null,
      "delay": 500,
      "onReadyScript": null,
      "onBeforeScript": null
    }
  ],
  "paths": {
    "bitmaps_reference": "../../backstop_data/bitmaps_reference",
    "bitmaps_test": "../../backstop_data/bitmaps_test",
    "compare_data": "../../backstop_data/bitmaps_test/compare.json",
    "casper_scripts": "../../backstop_data/casper_scripts"
  },
  "engine": "phantomjs",
  "report": ["browser", "CLI"],
  "cliExitOnFail": false,
  "debug": false,
  "port": 3001
}
```

В этой конфигурации вы можете заметить три объекта `viewports`: для телефона (`phone`) и планшетов в вертикальной (`tablet vertical`) и горизонтальной (` tablet horizontal`) ориентации, каждый со свойствами `name`, `width` и `height`. Вы можете добавить столько объектов `viewports`, сколько вам нужно; BackstopJS  необходим, как минимум, один. 

Затем идет объект `scenarios`, включающий URL и селекторы элементов, которые BackstopJS  будет тестировать. Каждый объект-сценарий следует рассматривать как тест для отдельной статической страницы или состояния глобального приложения. Вы можете добавить столько `scenarios`, сколько вам нужно, BackstopJS  достаточно одного.

Внутри каждого сценария есть список селекторов. Селекторы записываются в стандартной нотации CSS. Для каждого заданного селектора, BackstopJS сделает скриншот и протестирует этот участок в вашей раскладке. Участок селектора может быть маленьким типа `button` или большим как `body` — в документации подробно описана эта возможность применительно к динамическим веб-приложениям.

Вы могли заметить при генерации конфигурации, что наш URL указывает на `http://getbootstrap.com.` Это то, с чем мы будем сравнивать, если запустим BaskStopJS сейчас. Это иллюстрирует возможность BackstopJS одинаково использовать локальный или удаленный URL, эти же тесты легко провести и для разработки в локальном окружении, на стадии контроля качества, в промежуточном или рабочем окружении.
{: .info}

### Изменение шаблона конфигурации

В нашем демо-проекте, внесите следующие изменения в объекте `scenarios` внутри `myCoolProject/backstop.json`.

```javascript
"scenarios": [
  {
    "label": "My Local Test",
    "url": "../../index.html",
    "hideSelectors": [],
    "removeSelectors": [
    ],
    "selectors": [
      "nav",
      ".jumbotron",
      "body .col-md-4:nth-of-type(1)",
      "body .col-md-4:nth-of-type(2)",
      "body .col-md-4:nth-of-type(3)",
      "footer"
    ],
    "readyEvent": null,
    "delay": 0,
    "onReadyScript": null,
    "onBeforeScript": null
  }
],
```


### Создание референсных скриншотов

В каталоге `myCoolProject/node_modules/backstopjs/` выполните команду:

```bash
$ npm run reference
```

Эта задача создаст новый каталог (или обновит существующий) со скриншотами  заданных селекторов для всех контрольных точек. Когда процесс завершится, взгляните внутрь каталога `/myCoolProject/backstop_data/bitmaps_reference/`:

![каталог с референсными скриншотами](/images/development/tools/fig4.png)

Пока все хорошо. Нам уже есть, что сравнивать. Приступим к тесту!

## Запуск нашего первого теста

Мы подошли к запуску первого теста. **Но учитывайте, что пока мы ничего не меняли в нашем CSS, все тесты будут пройдены успешно.**

В каталоге `myCoolProject/node_modules/backstopjs/` выполните:

```bash
$ npm run test
```

В результате мы получим новый каталог, содержащий тестовые изображения: `/myCoolProject/backstop_data/bitmaps_test/<timestamp>` (`<timestamp>` это время создания скриншотов). 

После того как тестовые изображения сгенерированы, BackstopJS откроет браузер с отчетом, сравнивающим последние изображения с референсными (по умолчанию этот отчет доступен по адресу `http://localhost:3001/compare/`, вы можете поменять порт, изменив настройку `port` в файле конфигурации).  Значимые отличия будут обнаружены и показаны.

![отчет о сравнении скриншотов в браузере](/images/development/tools/fig5-920x1024.png)

Так как мы еще не вносили изменения в CSS, тестовый отчет BackstopJS показывает успешное прохождение тестов. Попробуем изменить CSS и посмотрим, что получится.

### Обновление индексного файла и запуск второго теста

Вот, что вы увидите, открыв (не изменяя) файл `myCoolProject/index.html` в браузере. Обратите внимание на отступы от текста.

![демо-страница в браузере до изменений](/images/development/tools/fig8.png)

Давайте все испортим! Откройте `myCoolProject/index.html` и добавьте следующий код перед закрывающим тегом `</head>`:

```markup
<style>
  .jumbotron {
    padding: 0px;
  }
</style>
```

Вот как выглядит страница сейчас:

![демо-страница в браузере после изменений](/images/development/tools/fig9.png)

Это именно то, что постоянно встречается при веб-разработке. Какой-нибудь неизолированный код ломает раскладку совершенно неожиданно для вас. :(

Теперь запустите в каталоге `myCoolProject/node_modules/backstopjs/`:

```bash
$ npm run test
```

Тестирование будет запущено и ошибки будут найдены. Если вы посмотрите отчет, то в нижней части вы увидите визуальные различия между эталоном и найденными проблемами.

![Отчет о тестировании с ошибками](/images/development/tools/fig6-920x1024.png)

Визуальное сравнение скриншотов выводит рядом все три картинки: референсный скриншот, непрошедший тест скриншот и визуальное различие между ними.

![Визуальное сравнение скриншотов](/images/development/tools/fig7-802x1024.png){: itemprop="image"}


### Что и требовалось — регрессия найдена!

Это был очень простой пример. В реальной жизни, дизайнерам и разработчикам приходиться работать над очень сложными отзывчивыми раскладками. И тогда ценность системы типа нашей будет очень заметна. Автоматизируя повторяющиеся задачи мы можем продвинуть наши проекты CSS вперед, фокусируясь на более сложных и творческих задачах вместо рутины.

### О рабочем процессе

Существует много способов интеграции этой системы тестирования в ваш рабочий процесс. Вы можете запускать тесты при каждой сборке проекта или делать это вручную. Вы можете даже интегрировать BackstopJS в систему непрерывной интеграции. Все эти вопросы находятся за пределами темы этой статьи, информацию вы можете найти в [официальной документации](https://github.com/garris/BackstopJS#usage-notes).

## Развитие проекта BackstopJS

С момента релиза в 2014 году, BackstopJS  значительно продвинулся. Вокруг него сложилось сообщество, усилиями которого добавлено  много возможностей:

* **Поддержка тестирования SPA (одностраничных приложений)** — используйте скрипты Casper и явные триггеры веб-приложения, чтобы обеспечить захват скриншотов в нужный момент (т.е. после ответов API, анимации CSS или окончания иного асинхронного процесса).
* **Имитация пользовательского взаимодействия** — используйте скрипты  Casper внутри ваших сценариев для симуляции взаимодействия с элементами на экране.
* **Интеграция с CI** — интерфейс командной строки BackstopJS позволяет продвинутым пользователям включить тестирование визуальных регрессий в процесс непрерывной интеграции.
* **Активные файлы конфигурации** — начиная с версии 1.0.0, у вас есть возможность использовать для конфигурации вместо `json` файлы `javascript` и, соответственно, логическое ветвление внутри них, которое можно использовать для изменения тестирования в зависимости от окружения или других условий, указания разных конфигурационных файлов и использования BackstopJS в качестве централизованного тестового сервера для множественных окружений, вертикалей, профилей, проектов и т.д.
