---
layout: post
title: "CSS аудит: инвентаризация вашего кода"
categories: [development]
tags: [translations, css]
published: True
description: "Аудит кода CSS - методы и инструменты: type-o-matic, Dust-Me Selectors и CSS Lint"
original: "http://alistapart.com/article/css-audits-taking-stock-of-your-code"
original_author: "Сюзан Робертсон"
---

{% include translate.html %}

Немногих привлекает перспектива аудита кода, но для меня это один из любимых видов проектов. Это настоящее детективное расследование. Вы начинаете с кода сайта и копаете все глубже: вы смотрите сколько таблиц CSS подключено, как это влияет на производительность и как написаны эти CSS. Ваша цель найти способы улучшения, которые сделают ваш код лучше, а сайт быстрее.

В этой статье я поделюсь подходом к организации аудита и расскажу о преимуществах полной проверки вашего CSS и используемых для этого инструментах.

## Выгоды аудита

Аудит позволяет вам организовать ваш код и исключить повторение. Вам не нужно писать какой-либо код во время аудита, вы просто анализируете его и составляете рекомендации для клиента или обсуждаете их в своей команде. Эти рекомендации должны гарантировать, что в новом коде не будет старых ошибок. Давайте рассмотрим внимательнее остальные плюсы аудита:

####  Уменьшение размера файлов. 
Полный обзор CSS позволяет вам найти способы рефакторинга кода: провести чистку неиспользуемых правил и, возможно, уменьшить общее количество правил. Вы также сможете найти любые мелочи, такие как устаревшие браузерные префиксы. Избавление от неиспользуемого или ненужного кода  позволяет уменьшить размер файлов, скачиваемых пользователями вашего сайта.

####  Создание согласованного стайл-гайда. 
Во время аудита удобно создавать документацию о ваших стилях. Можно создать  стайл-гайд или ограничиться рекомендациями о том, где применяются те или иные фрагменты кода. Независимо от формы вашей документации, она позволит сэкономить массу времени новым членам вышей команды и позволит им быстрее понять архитектуру ваших приложений.

####  Стандартизация вашего кода.
Организация кода, независимо от различий применяемых к ней подходов, очень важна для поддержки и развития вашего кода в будущем. Например, если вы рассортируете свойства по алфавиту, то вы быстро выявите дубликаты в коде, потому как оба одинаковых свойства окажутся рядом. Также имеет смысл группировать CSS-свойства согласно их функционалу - позиционирование, блочная модель и т.д. Системный подход позволит вам избежать повторений.

####  Улучшение производительности.
И в заключение - самый важный плюс. Аудит CSS, применяемый вместе с объединением и сжатием таблиц стилей, позволяет заметно ускорить сайт. Например, вот что сообщил мне Гарри Робертс, фронт-энд разработчик из Англии, регулярно проводящий аудит, о своем последнем сайте.:

При переработке Fasetto.com с целью улучшения производительности, вместо 27 файлов со стилями для одностраничного сайта (в основном с различными фрэймворками типа Bootstrap)  получился один, который (после минификации и, местами, инлайнизации для сокращения числа запросов) весит 5.4 килобайт в сжатом виде.

Это значительный выигрыш, особенно для пользователей с медленным соединением, хотя выгоду от этого, разумеется, получают все.

##  Как проводить аудит: инвентаризация.

Теперь, когда вы знаете о плюсах аудита, возникает вопрос: с чего начать? Я хотел бы начать с рассмотрения нескольких инструментов, позволяющих провести обзор имеющейся кодовой  базы. Вы можете проводить свой аудит и по-другому, с учетом имеющихся на сайте проблемных мест или в соотвествии с вашей методикой разработки (например, БЕМ или OOCSS). Самое главное, это осознавать, что именно нужно для вашего сайта в первую очередь.

После диагностики кода с помощью инструментов, я рассматриваю его построчно.

##  Инструментарий

Среди инструментов в первую очередь я выделю бесценный [type-o-matic](https://github.com/stubbornella/type-o-matic), созданное Николь Салливан расширение для Firebug, генерирующее JSON-отчет обо всех шрифтах, применяемых на сайте. В качестве бонуса, type-o-matic также создает визуальный отчет, с образцами шрифтов. Изучая эти отчеты, вы заметите похожие стилевые правила , касающиеся шрифтов и  сможете удалить ненужные. Также я заметил, что детальность отчета в JSON формате облегчает совершенствование системы шрифтов на сайте.

В дополнение к type-o-matic я запускаю [CSS Lint](http://csslint.net/). Это очень гибкий инструмент, позволяющий выявить множество потенциальных багов, начиная от отсутствующих безопасных цветов до выявления свойств, которые можно сократить применяя краткую запись (мэрджин, пэддинг и т.п.) Для использования CSS Lint, просто нажмите на сайте стрелку за словом Lint и выберите требуемые опции. Я привык выявлять с его помощью повторяющиеся правила CSS или использование злоупотребление изменением размеров шрифтов, поэтому я всегда проверяю не только производительность (Performance), но и поддерживаемость(Maintainability) и выявление дубликатов (Duplication). CSS Lint возвращает рекомендации для изменений: некоторые из них могут относиться к известным проблемам в старых браузерах, другие же могут иметь характер универсальных рекомендаций. Если же вы запустите CSS Lint со всеми опциями, то получите излишне перегруженный отчет, с ненужными вещами типа рекомендаций для ИЕ6. Тем не менее, это быстрый путь для выяснения общего состояния вашего CSS.

Затем я провожу поиск в CSS по известным свойствам, таким как float или margin, чтобы выяснить как часто они повторяются в коде. В командной строке это удобно делать с помощью утилиты grep (просто наберите grep “float” styles/styles.scss чтобы найти все floatы в стилях). Любые свойства вы можете вырезать или объединить с другими путем создания специальных классов в HTML в соответствии с нуждами вашего проекта.

Я предпочитаю делать это вручную, хотя это и вынуждает меня исследовать весь CSS, который в свою очередь дает мне лучшее понимание структуры проекта в целом. Но если вы ограничены во времени, или недостаточно владеете командной строкой, вот инструменты, которые могут вам помочь в этом.

* [CSS Dig](http://atomeye.com/css-dig.html) - это скрипт на Питоне, который проходит через весь код CSS с выводом удобного отчета по всем свойствам.
* [CSS Colorguard](https://github.com/SlexAxton/css-colorguard) - это совершенно новая утилита, работающая на Node.js, которая создает отчет по использованию цветов в ваших стилях. Соответственно, помогая узнать наиболее используемые цвета, выявить слишком похожие и ограничить палитру  в целях облегчения поддержки. При необходимости, CSS Colorguard может использоваться и  в качестве плагина Grunt или Gulp.
* [Dust-Me Selectors](https://addons.mozilla.org/en-US/firefox/addon/dust-me-selectors) - расширение к Firefox, находящее неиспользуемые селекторы.

## Строчка за строчкой

После автоматической проверки с помощью перечисленных инструментов я перехожу непосредственно к просмотру правил CSS, так как это дает наиболее полное понимание проблем. Например, комментарии в коде (при их наличии) могут объяснить некоторые вещи, пропущенные при автоматическом тестировании.

Одной из основных вещей, которые я проверяю особо внимательно - глубина вложенности селекторов. Основан ли ваш CSS на специфичности селекторов? Или вы видите длинные строки селекторов в файлах CSS или препроцессоров. Высокая степень вложенности означает, что ваш код всегда будет требовать жесткую структуру HTML для правильной работы. Если вы сможете от этого отказаться, то получите код, пригодный для неоднократного использования и дающий более быструю производительность.

## Обзоры и рекомендации

Сейчас мы перейдем к самой увлекательной части. После того, как вы получили все нужные данные, вы можете выяснить как можно улучшить CSS и создать для этого рекомендации.

Список рекомендаций не предполагает какого-либо особого форматирования и заранее установленной формы, главное, он должен быть легко читаемым. Имеет смысл разбить его на две части. В первой будет отчет с перечислением того, что вы нашли в ходе аудита. Сюда можно включить результаты проверки с помощью CSS Lint или Type-o-matic, в виде скриншотов или приложенного файла. Вторая часть будет содержать конкретные рекомендации по улучшению кода. Это может быть просто список с пунктами типа "Объедините схожие стили для шрифтов и создайте на их основе миксин для более широкого использования."

Во время анализа собранной информации, обратите внимание на те места, где вы можете:

1. Сжать код. Если у вас 4 набора различных стилей для одного виджета, несколько похожих стилей для ссылок или слишком много исключений в стандартной сетке. Это те вещи, которые надо выделить в в отдельны модуль. Проще всего это сделать в препроцессорах типа SASS, с помощью миксинов и экстендов, что позволяет применять сразу весь набор стилей к любому классу (хотя проверка выходного CSS из препроцессора нее будет лишней)
2. Сохранение последовательного подхода к коду.
Правильно проведенный аудит гарантирует соответствие кода методике разработки.  В частности, при использовании BEM  или OOCSS важно выдерживать единую методику, не допуская отклонений и исключений. А в случае их появления, документировать их для исключения проблем в командной разработке.

Если вы работаете с клиентом, также важно будет объяснить ему свой подход к CSS, это позволит ему лучше понимать те проблемы в коде, которые вы выявите. Например, я предпочитаю OOCSS, поэтому стремлюсь к модульности и многократному использованию кода; обилие классов не беспокоит меня. Вы должны быть уверены, что ваш клиент понимает значимость вашей работы, когда вы не входите в команду по разработке.

##  Передача клиенту

Вы сделали это! После того, как вы написали рекомендации (и потратили некоторое время на их анализ, чтобы гарантировать их эффективность), вы можете передать их клиенту - и будьте готовы к любым вопросам с его стороны. Если же работа была для вашей команды, то поздравляю - можете вычеркнуть ее из списка заданий.

Но подождите - это не все плюсы от аудита. Теперь у вас есть итоговый отчет по CSS, используйте его как основу для дальнейшей разработки и поддержки проекта. Если недостатки, похожие на выявленные, возникнут вновь останется документ с рекомендациями по их устранению, который поможет любому разработчику при добавлении новых особенностей и разделов. При желании вы можете разработать на базе отчета полноценный стайл-гайд. Также важно определиться с регулярностью проведения аудита, чтобы ваш код оставался кристально чистым. Частота аудита может сильно варьироваться в зависимости от уровня команды и сложности проекта, а своевременность аудита значительно повышает его эффективность.

Проведение аудита это важный шаг для сохранения вашего CSS кода в понятном и работоспособном виде. Это также позволяет своевременно обновлять документацию проекта, что облегчает вашей команде выбор путей для дальнейшего развития проекта. Когда ваш код правильно структурирован, он более производителен. Так что выберите время и начинайте.