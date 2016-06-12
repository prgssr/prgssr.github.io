---
title: "Как добавить ReactJS в существующее веб-приложение"
layout: post
categories: [development]
tags: [javascript, translation, scotch]
date: 2016-06-10 15:20:23 +0300
prism: yes
description: "Замена jQuery на React — на что обратить внимание"
original: "https://scotch.io/tutorials/how-to-sprinkle-reactjs-into-an-existing-web-application"
original_title: "How to Sprinkle ReactJS into an Existing Web Application"
original_author: "Andrew Del Prete"
thumbnail: "/images/react.png"
scripts: codepen
---


Очень часто при ознакомлении с новой технологией, будь то JavaScript фреймворк или методология CSS, мы сталкиваемся с простым вызовом: "А как добавить эту крутую вещь на свой старый и запущенный сайт?" Многие руководства показывают, как это сделать с чистого листа, но в реальности у нас далеко не всегда есть такая роскошь.

В этой статье я дам несколько базовых примеров по использованию  ReactJS в качестве замены для существующего кода, написанного на jQuery.

## От jQuery к React

Недавно передо мной была поставлена задача взять достаточно большой функционал, написанный на jQuery и переписать его на React. Процесс был очень сложным, так как jQuery был распылен по разным местам кодовой базы. Построение полного пользовательского интерфейса с jQuery вполне возможно (и мы делаем это уже многие годы), но при этом возникают сложности  с масштабируемостью и поддерживаемостью.

Независимо от того, что вы используете — Angular, Ember, Vue, React или jQuery, вы пытаетесь сделать то же, что долгие годы делали разработчики:

**Вывести HTML → Получить события от пользователей → Обновить HTML**

Так как jQuery сильно зависит от селекторов типа `.classes` и `#IDs`, используемых для манипуляций с DOM, HTML становится запутанным и перенасыщенным атрибутами, которые нужны лишь для того, чтобы сообщать jQuery о своем существовании. Это не представляет особой проблемы при небольшом объеме кода, но с его увеличением становится сложно расшифровать, какие классы для CSS, а какие для JavaScript. Если вам приходилось когда-либо искать селекторы `.class` или `#ID` в ваших шаблонах HTML или в JavaScript для изменения какой-нибудь функциональности, то вы понимаете, о чем я.

#####  Архитектура с сильной зависимостью от идентификаторов и классов при выборке и манипуляции HTML может быть очень хрупкой.
{: .info}

Так что делать, если ваш код пронизан jQuery или целиком построен на каком-нибудь ином фреймворке, как начать заменять элементы пользовательского интерфейса чем-то типа React?

## На что надо сразу обратить внимание?

### Обертка/элемент-контейнер

Независимо от того, используется ли  в приложении  jQuery  или другой популярный фреймворк,  в большинстве случаев будет использоваться своего рода корневой элемент, оборачивающий фрагмент пользовательского интерфейса. Если в кодовой базе для реализации функционала  используется jQuery, то обычно есть элемент, действующий как селектор-обертка. Этот элемент находится с помощью  используется и используется для динамического обновления DOM.

```markup
<!-- 
  .MyAwesomeFeature acts as a container to select 
  and manipulate child components with jQuery.
-->
<div class="MyAwesomeFeature">
  <div class="MyAwesomeFeature__title"></div>
  <div class="MyAwesomeFeature__image"></div>
</div>

<script>
  var container = $(".MyAwesomeFeature");
  $(".MyAwesomeFeature__title", container).text("Hello World!");

  // Other DOM changes, event handlers, etc...
</script>
```
 
### Изолированное и распределенное состояние

Также стоит уяснить, изолировано ли состояние вашего функционала в отдельном контейнере или разделено между несколькими элементами.

1. **Изолированное состояние** — состояние изолировано в отдельном контейнере. Любая интерактивность (все кнопки, поля ввода и т.д.) содержится внутри контейнера.
2. **Распределенное состояние** — состояние разбросано по множественным элементам. Примером этого может быть календарь, обновляемый путем выбора даты из выпадающего меню в другом месте страницы. Меню и календарь являются раздельными контейнерами, но делят состояние и функциональность.

Я собираюсь показать четыре примера распределенного/изолированного состояния с  jQuery и затем с  ReactJS.

## Пример изолированного состояния с jQuery

Предположим, у нас есть существующее  веб-приложение, показывающее эмодзи и кнопку, при нажатии на которую выводится другой эмодзи. Ниже показан код, который является образцом типичного приложения jQuery, в нем мы находим основной родительский элемент и  динамически вносим в него изменения.

Вот разметка этого примера:

```markup
<!--
    Demonstrates how jQuery can be used to 
    use a container as a selector and update 
    the content within.
-->
<div id="mood-container">
  <div class="Mood">
    <div class="Mood__emoji"></div>
    <div class="Mood__name">[ Emoji Placeholder ]</div>
    <button class="Mood__button">Random Mood</button>
  </div>
</div>
```

<p data-height="265" data-theme-id="0" data-slug-hash="QNPPYV" data-default-tab="result" data-user="andrewdelprete" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewdelprete/pen/QNPPYV/">Isolated state with jQuery</a> by Andrew Del Prete (<a href="http://codepen.io/andrewdelprete">@andrewdelprete</a>) on <a href="http://codepen.io">CodePen</a>.</p>

*Это самая распространенная, хотя и не единственная стратегия изменения DOM с помощью  jQuery.*

## Пример изолированного состояния с ReactJS

Одним из преимуществ использования библиотеки типа React является возможность инкапсулировать  JavaScript и HTML внутри компонента. Результат получается более надежным, поддерживаемым и подходящим для многократного использования.

Это особенно помогает при работе с большими приложениями, в которых рендеринг и обновление производятся совместно внутри компонента. Я имею в виду не смешивание логики и представления,  а согласованную организацию JavaScript и HTML внутри компонента. Эта же идея реализуется во всех JavaScript фреймворках, отсюда и сам термин фреймворк.

Как правило, все фреймворки:

1. Монтируются к определенному контейнеру  (к элементу div с `#id`, например).
2. Выводят содержимое в контейнер.
3. Отслеживают и обновляют содержимое в контейнере.
4. Удаляют контейнер в отдельных случаях.

Итак, наша разметка с интеграцией React:

```markup
<!--
    Demonstrates how ReactJS mounts itself 
    to a container and takes it from there.
-->
<div id="mood-container" />
```

<p data-height="265" data-theme-id="0" data-slug-hash="QNPRWz" data-default-tab="result" data-user="andrewdelprete" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewdelprete/pen/QNPRWz/">Isolated state with ReactJS</a> by Andrew Del Prete (<a href="http://codepen.io/andrewdelprete">@andrewdelprete</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Пример распределенного состояния с jQuery

Мы легко можем делать это с jQuery, но когда одна часть сайта динамически влияет на другую при помощи простых селекторов это сильно запутывает код. Опять-таки, при использовании классов и идентификаторов для манипуляции DOM, вы обязаны сами все это отслеживать.

<p data-height="265" data-theme-id="0" data-slug-hash="XdQLrR" data-default-tab="result" data-user="andrewdelprete" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewdelprete/pen/XdQLrR/">Shared state with jQuery</a> by Andrew Del Prete (<a href="http://codepen.io/andrewdelprete">@andrewdelprete</a>) on <a href="http://codepen.io">CodePen</a>.</p>

В этом примере мы используем название эмодзи в селекторах `.Mood__name` и `.Mood__button-name` и обновляем эмодзи в одном контейнере с помощью кнопки из другого контейнера. Это можно немного очистить, но без особого успеха, так как пытаясь управлять всем только с помощью селекторов jQuery, мы всегда загрязняем код.

## Пример распределенного состояния с React

В ReactJ есть два распространенных способа работы с состоянием, распределенным между несколькими компонентами.

1. Обернуть компоненты в контейнер для управления состоянием и передать данные/функции в дочерние компоненты как свойства.
2. Использование библиотек типа Redux для помещения состояния и действий на глобальный уровень и подсоединения компонентов к ним.

### Использование контейнера для распределенного состояния

Это широко распространенная практика особенно для одностраничных приложений или фрагментов пользовательского интерфейса, полностью выводимых при помощи React. Так как мы хотим, чтобы наши компоненты общались друг с другом, мы оборачиваем их родительским контейнером, а он передает вниз свойства для обновления каждого компонента. Именно так работает ReactJS из коробки и в этом нет ничего нового.

Этот метод хорошо работает в тех случаях, когда у вас есть возможность обернуть пользовательский интерфейс одним контейнером. В большинстве давно поддерживаемых приложений это невозможно, но в некоторых случаях, в зависимости от раскладки пользовательского интерфейса, может быть вариантом.

<p data-height="265" data-theme-id="0" data-slug-hash="bpJPZB" data-default-tab="result" data-user="andrewdelprete" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewdelprete/pen/bpJPZB/">Shared state with ReactJS - Container</a> by Andrew Del Prete (<a href="http://codepen.io/andrewdelprete">@andrewdelprete</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Использование Redux для распределенного состояния

Библиотеки типа Redux (и различные варианты Flux) облегчают коммуникацию между компонентами, расположенными в разных областях приложения. Это распределенное состояние позволяет вам подсоединять действия и свойства состояния к вашим компонентам путем обновления глобального объекта, предоставляемого Redux.

<p data-height="265" data-theme-id="0" data-slug-hash="oxRxdG" data-default-tab="js,result" data-user="andrewdelprete" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewdelprete/pen/oxRxdG/">Shared state with ReactJS - Redux</a> by Andrew Del Prete (<a href="http://codepen.io/andrewdelprete">@andrewdelprete</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Заключение

Надеюсь, у вас появилось понимание того, на что нужно обращать внимание при интеграции ReactJS в существующее приложение. При использовании jQuery для фрагмента пользовательского интерфейса вы можете заменить контейнер монтируемым компонентом React. А если состояние разделено между нескольким компонентами, то вы можете использовать метод контейнера или подключить библиотеку типа Redux.