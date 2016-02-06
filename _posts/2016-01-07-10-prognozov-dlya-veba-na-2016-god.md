---
layout: post
title: "10 прогнозов для веба на 2016 год"
categories: [development]
tags: [mobile, static, seo, translation, sitepoint]
date: 2016-01-07 21:44:32
description: "Прогноз Крейга Баклера по основным трендам в веб-разработке на 2016 год"
prism: yes
original_author: "Крейг Баклер"
original: "http://www.sitepoint.com/10-web-predictions-2016/"
original_title: "10 Web Predictions for 2016"
thumbnail: noimage
---

С новым годом! Несмотря на то, что мои  [прогнозы на 2015 год оказались не слишком удачными](http://www.sitepoint.com/10-web-predictions-2015-results/), я сделаю еще одну попытку. Мои руны говорят, что веб поравнялся с Ураном...

## 1. Нас ждут новые взломы больших корпоративных сайтов

Давайте начнем с плохих предсказаний. Сайты государственных органов и крупных мультинациональных корпораций будут взламываться. Это однозначно. Среди целей - налоговое управление, ФБР, VTech, Ashley Madison, T-Mobile, Scottrade, CVS, OPM, UCLA Health, Carphone Warehouse, TalkTalk, Trump Hotels и даже менеджер паролей LastPass. Персональные данные будут украдены и в худших случаях пароли и данные кредитных карт будут распространены.

Несмотря на рассказы в СМИ о сложных атаках, доступ к большинству систем будет получен с помощью банальных SQL-инъекций и брутфорса. Во многих системах данные не шифруются, а дела с безопасностью обстоят печально.

И взломы будут продолжаться, пока компании не начнут относится к безопасности серьезно. Система не может быть безопасной на 100%, но я предполагаю, что многие из ныне крупных сайтов содержат много кода, написанного много лет назад новичками. Мой совет: наймите хакеров или платите деньги за выявленные уязвимости пока не поздно.

## 2. Статические сайты станут мэйнстримом

Генераторы статических сайтов, такие как [Jekyll](http://jekyllrb.com/), [Middleman ](http://middlemanapp.com/) и [Metalsmith](http://www.metalsmith.io/) доступны уже несколько лет. Типичная система управления контентом строит страницу при посещении пользователя с помощью шаблонов и данных, хранящихся в базе данных. В генераторах статики этап сборки проводится только один раз, при этом сразу генерируется полный сайт. Преимущества статического сайта следующие:

* Скорость. В обычной CMS можно настроить кэширование, но статические сайты полностью генерируются и кэшируются с самого начала.
* Надежность. "Ошибка подключения к базе данных" никогда не случится, так как статический сайт требует только самый базовый веб-сервер. Код на серверной части и базы данных могут использоваться для добавления функциональности, такой как поиск и заполнение форм, но в общем вся обработка сведена к минимуму.
* Безопасность. В отличие от CMS, сломать простые файлы HTML сложнее и в этом  намного меньше смысла. Но даже  если такой взлом удался, сайт можно стереть и сгенерировать  заново.
* Легкость. Для работы контент-менеджеров можно сохранить существующее окружение CMS, добавив шаги сборки и развертывания.

Генераторы статических сайтов хороши для нечасто обновляемых сайтов. Они популярны среди авторов технических блогов, но все больше агентств и корпораций адаптирует их в 2016 году.

## 3. Рыночная доля Chrome не будет расти

Chrome сегодня это самый популярный браузер, [занимающий 54% рынка](http://www.sitepoint.com/browser-trends-december-2015-fight-firefoxs-future/). Я не буду предсказывать падение его доли, но я сильно сомневаюсь, что Chrome сможет достичь 60% до конца года. Причины следующие:

1. Увеличенное потребление памяти и нестабильность.  Chrome пожирает ресурсы и пользователи обращают на это внимание.
2. Подозрительность — Google отслеживает ваши действия в сети активнее остальных компаний.
3. Возросшая конкуренция. Остальные браузеры не стоят на месте.

На самом деле, конкуренция между браузерами сильна, как никогда. Это отлично: мы не хотим вернуться к браузерной монокультуре, как во времена IE6.

## 4. Vivaldi начнет привлекать внимание

[Vivaldi](https://vivaldi.com/) это новый браузер, построенный на основе старой версии Opera. Многих пользователей разочаровало отсутствие привычных возможностей 12-ой версии  после портирования на движок Blink. Несколько бывших разработчиков решили объединить усилия и создали Vivali, чтобы вернуть браузеру былую славу. Среди возможностей — цвета для вкладок, различные для конкретных сайтов, быстрые команды, заметки, почта, панели и полная настраиваемость.

Vivaldi вряд ли наберет сколько-нибудь заметную долю рынка, но интерес к нему будет возрастать весь год, особенно среди опытных пользователей и фанатов старой версии Opera.

## 5. Apple должен разобраться с недостатками Safari

Я не согласен с мнением, что [Safari это IE нашего времени](http://nolanlawson.com/2015/06/30/safari-is-the-new-ie/), но он ощутимо отстал остальных браузеров, включая браузеры от Microsoft.

* Safari поддерживает [меньшее количество технологий](https://html5test.com/results/desktop.html). А поддерживает чаще с использованием вендорного префикса `-webkit`.
* Использование Safari уменьшается несмотря на хорошие продажи  iPhone и iPad.
* Apple не разрешает использование альтернативных браузеров в iOS  (Chrome и Firefox в iOS основаны на Safari).
* Сайты для Safari нельзя тестировать, не имея оборудования Apple.
* Apple неохотно работает  с сообществом и не раскрывает свои намерения.

Safari уязвим, так как HTML5 становится жизнеспособной альтернативой для нативных приложений. И даже фанат Apple отложит в сторону свой iPhone, когда браузер не будет выполнять свою работу.

У Apple есть простые решения этой проблемы. Можно просто допустить конкурирующие браузеры на iOS или переключиться на движок Blink. Игнорирование проблемы грозит популярности устройств в долгосрочной перспективе.

## 6. Можно будет использовать Grid-раскладку

[Модуль  CSS Grid Layout ](http://www.w3.org/TR/css-grid-1/) находился на стадии рабочего черновика в течение 4-х лет и [частично поддерживался только в одном браузере](http://caniuse.com/#search=grid) — IE/Edge. У Chrome, Opera и Firefox есть экспериментальные реализации, но окончательно Grid-раскладка вступит в игру в 2016.

У Grid-раскладки есть несколько преимуществ над Flexbox:

* сетку можно задать до загрузки контента, чтобы улучшить производительность рендеринга
* элементы можно позиционировать как в рядах, так и в колонках
* элементы можно упорядочивать разными способами
* выравнивание высоты колонок и вертикальное центрирование доступны изначально, без каких-либо хаков

Grid-раскладка и Flexbox могут сосуществовать. Сетки более эффективны для создания раскладки страницы — хедеров, футеров, боковых колонок и т. п. Flexbox — для раскладки внутри контейнеров типа форм или виджетов. В любом случае, эпоха запутанных раскладок на плавающих элементах подходит к концу.

## 7. "Мобилификация" дизайна

Мне сложно предсказывать тренды дизайна, но это кажется неизбежным. "Сначала мобильные" будет философией дизайна, а не просто техническим подходом. Несмотря на возможности отзывчивого дизайна, однотипные раскладки будут использоваться на всех устройствах. Меню будут доступны через иконку-гамбургер. Боковые панели, которые являются традиционной частью веб-дизайна со времен табличной верстки, станут необязательными.

Многие вещи в вебе станут проще, изящнее и производительнее. И это хорошо. Google AMP и Facebook Instant отправятся на свалку истории.

## 8. Средний вес страниц уменьшится

Я предсказываю это каждый год, но если тренд на упрощение продолжится, то почему бы этому наконец-то не случится. Средний вес страницы за время моих прогнозов в последние три года удвоился и [превышает уже 2.2 Мб](http://www.sitepoint.com/average-page-weight-increased-another-16-2015/). Это потеря времени, пропускной способности сети и терпения пользователя, но мы одержимы бессмысленными фотографиями в высоком разрешении, интеграцией с социальными сетями и навязчивой рекламой.

Как минимум, я надеюсь, что увеличение веса страницы не превысит 1.3% в месяц.

## 9. WebAssembly будет нишевой технологией

WebAssembly был одним из самых раскрученных анонсов в 2015 году. Он ускоряет подключение JavaScript за счет компиляции исходников в простой, быстро обрабатываемый и  совместимый с движком JavaScript байт-код и упаковывает его в компактный двоичный файл. В итоге это уменьшает размер загрузки и запускает приложение быстрее (хотя это  не значит, что приложение будет работать быстрее).

Компиляторы C/C++ в WebAssembly должны появиться в 2016 году, что поможет разработчикам сложных игр или больших браузерных приложений. Я думаю, что потребуется несколько лет, прежде чем большинство начнет компилировать JavaScript. При этом технологии типа неизбежного  HTTP/2 смогут улучшить подключение JavaScript и без каких-либо дополнительных усилий.

## 10. SEO умрет

Покойся с миром, поисковая оптимизация (1996-2016).

В самом начале SEO было простым обманом поисковых движков за счет бессмысленного повторения ключевых слов, вне зависимости от их соответствия смыслу страницы. Google убил этот способ с помощью алгоритма PageRank, используя ссылки для ранжирования по релевантности. Это привело к взрывному росту автоматических ссылочных ферм, существующих только для создания ссылок на нужный сайт.

Это техническое противостояние продолжалось, так как люди ищут легкие способы, чтобы стать №1 в Google. SEO продавалось как [змеиное масло](https://en.wikipedia.org/wiki/Snake_oil) — загадочная техника, которая не дает никаких гарантий даже того, что ваш сайт не пострадает от нее. SEO компании хорошо поработали — у них было двадцать лет сомнительных технических практик и незаслуженных доходов. Но это время прошло — Google победил. Клиенты  стали умнее и смеются над их претензиями и тактикой запугивания.

Вот решение, которое гарантирует хороший результат: создавайте хороший контент, который заинтересует  других. И все. Вы можете выиграть немного за счет оптимизации кода и техник поискового маркетинга, таких как реклама и кампании в социальных сетях. Но дни, когда SEO имело смысл как отдельный сервис, уже прошли.

Извиняюсь, если вы работаете в великой SEO-компании, которая не дает несбыточных или вводящих в заблуждение обещаний. Я уверен, что такая компания есть — просто я с подобными еще не сталкивался.
