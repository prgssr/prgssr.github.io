---
layout: post
title: "Шрифты в вебе: переносы, рендеринг и дополнительные настройки"
categories: [development]
tags: [typography, css, translation, sitepoint]
date: 2015-12-10 21:02:03
description: "Описание 3-х свойств css для управления внешним видом текста: hyphens, text-rendering, font-feature-settings"
prism: yes
original: "http://www.sitepoint.com/cross-browser-web-fonts-part-3/"
original_title: "Cross-browser Web Fonts part 3: Hyphens, Text Rendering, and Font Feature Settings"
original_author: "Крис Миллс"
scripts: codepen
thumbnail: "/images/development/typography/1393232213fontdeck-info.png"
---

Широкая поддержка `@font-face` в браузерах творит чудеса в веб-типографике, давая нам возможность использовать любые шрифты по нашему усмотрению. Но разнообразие доступных шрифтов это еще не вся типографика. Существуют и другие важные вещи, которые долгое время не были реализованы в вебе, такие как правильные переносы длинных слов, а также использование дополнительных возможностей Opentype шрифтов — лигатур, кернинга, росчерков и прочих.

В этой статье мы рассмотрим некоторые из таких новых возможностей.

## Переносы

Раздел можно было бы назвать "решение проблемы длинных слов, в тексте выровненном по ширине", но это было бы не менее ужасно, чем сама проблема. Если кратко, то проблема заключается в том, что мы до сих пор не можем использовать в вебе выравнивание по ширине (`text-align: justify`), потому что это ужасно выглядит.

![текст без дефисов](/images/development/typography/1393232191hyphens-before.png){: title="текст без дефисов"}

К счастью, сейчас у нас появились пути решения этой проблемы. Лучшим из них является свойство CSS [hyphens](/development/svojstva-css-dlya-upravleniya-veb-tipografikoj.html#heading-hyphens), добавляющее дефисы там, где это нужно и создающее визуальное впечатление, что слова продолжаются на следующей строке. За счет разбития длинных слов ширина колонки заполняется более равномерно, с меньшим количеством пропусков. Код выглядит так:

```css
p {
  font-size: 2.1em;
  text-align: justify;  
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
```

![текст с дефисами](/images/development/typography/1393232190hyphens-after.png){: title="текст с дефисами"}

Существуют и другие значения для `hyphens: none` отключит все дефисы, включая проставленные вручную, а `manual` оставит только дефисы, проставленные вручную с помощью `&hyphen;` (обычный дефис, выводится всегда) или `&shy;` (мягкий дефис, выводится только при переносе — есть специальные сервисы для расстановки в тексте мягких переносов).  Для того, чтобы это свойство работало у теста должен быть задан атрибут `lang`, а в браузер должен быть интегрирован [словарь поддержки переносов](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens#Notes_on_supported_languages). В действии это можно проверить в демо в одном из [поддерживающих этот функционал браузеров](http://caniuse.com/#search=hyphens).


<p data-height="268" data-theme-id="0" data-slug-hash="JGdMpL" data-default-tab="result" data-user="prgssr" class='codepen'>See the Pen <a href='http://codepen.io/prgssr/pen/JGdMpL/'>Hyphenation example</a> by prgssr (<a href='http://codepen.io/prgssr'>@prgssr</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

## Рендеринг текста

Свойство `text-rendering` дает браузерному движку рендеринга информацию о том, что он должен оптимизировать при рендеринге. Доступны следующие значения:

* `auto`: оставляет выбор на усмотрение браузера. Оптимизироваться может  скорость, четкость или геометрическая точность. В браузерах WebKit/Blink  по умолчанию оптимизируется скорость, в Firefox — скорость для шрифтов не больше 20 пикселей и четкость для больших шрифтов.
* `optimizeSpeed`: браузер оптимизирует скорость, отключая излишние возможности типа кернинга и лигатур.
* `optimizeLegibility` — браузер оптимизирует четкость, реализуя все красивости, которые доступны в шрифте.
* `geometricPrecision` — браузер оптимизирует геометрическую точность, это значит, что некоторые аспекты шрифта, не масштабируемые линейно, будут масштабироваться более гладко при различном зуме. В Firefox это значение обрабатывается идентично `optimizeLegibility`.

```css
p {
  text-rendering: optimizeLegibility;
}
```

Управление рендерингом шрифта доступно в  Firefox, Chrome и Safari с упомянутыми выше ограничениями.

## Настройка возможностей шрифтов

`font-feature-settings` это замечательное новое свойство, позволяющее вам управлять использованием альтернативными глифами, имеющимися внутри ваших файлов с [шрифтами OTF](https://en.wikipedia.org/wiki/OpenType) (некоторыми из них), такими как лигатуры и росчерки.

### Как узнать какие возможности шрифта доступны?

Хороший вопрос. И он достаточно сложный, так как описания шрифтов на удивление плохо передают такую информацию. К счастью, недавно эта информация стала доступна благодаря сервисам хостинга шрифтов типа [Fontdeck](http://fontdeck.com/).

![описание шрифта с fontdeck](/images/development/typography/1393232213fontdeck-info.png){: title="описание шрифта с fontdeck" itemprop="image"}

После того, как вы узнали об имеющихся возможностях шрифта, вы можете начать настраивать их с помощью свойства `font-feature-settings`. Его значения это список кодов, представляющих различные возможности шрифта, например:

```css
p {
    -webkit-font-feature-settings: "dlig" 1, "kern" 1, "frac" 1;
    -moz-font-feature-settings: "dlig" 1, "kern" 1, "frac" 1;
    -ms-font-feature-settings: "dlig" 1, "kern" 1, "frac" 1;
    font-feature-settings: "dlig" 1, "kern" 1, "frac" 1;
}
```

Firefox и IE11 уже не нуждаются в вендорных префиксах, но я их оставил для тех, кто пользуется старыми версиями браузеров. Браузеры на основе Blink и WebKit нуждаются в префиксах, также как и Internet Explorer 10.

Рассмотрим отдельные опции, доступные при настройке возможностей шрифтов.

### Лигатуры и дискретные лигатуры

Это специально стилизованные сочетания определенных букв, например, “oo” или “th”.

```css
p {
    -webkit-font-feature-settings: "liga" 1, "dlig" 1;
    -moz-font-feature-settings: "liga" 1, "dlig" 1;
    -ms-font-feature-settings: "liga" 1, "dlig" 1;
    font-feature-settings: "liga" 1, "dlig" 1;
}
```

![текст без лигатур](/images/development/typography/1393232211dlig-before.png){: title="текст без лигатур"}

![текст с лигатурами](/images/development/typography/1393232209dlig-after.png){: title="текст с лигатурами"}

На этом изображении показан шрифт [Monarcha Book](http://fontdeck.com/font/monarcha/book) на Fontdeck с активированными дискретными лигатурами (`dlig`).

### Цифры, дроби и порядковые числительные

Существуют также отдельные опции для изменения вида цифра в шрифтах самыми разными способами. Например:

```css
p {
    -webkit-font-feature-settings: "onum" 1, "tnum" 1, "frac" 1;
    -moz-font-feature-settings: "onum" 1, "tnum" 1, "frac" 1;
    -ms-font-feature-settings: "onum" 1, "tnum" 1, "frac" 1;
    font-feature-settings: "onum" 1, "tnum" 1, "frac" 1;
}
```

Я снова использую шрифт Monarcha с Fontdeck, чтобы проверить возможные настройки.

Табличные цифры (`tnum`) и пропорциональные (`pnum`), как правило, очень похожи, также как и производимый эффект от этих настроек. Табличные цифры оптимизированы для отображения в таблицах они более равномерные, четкие, с равными отступами, а пропорциональные — пропорционального размера.

Цифры старого стиля (`onum`) выделяются меньшей стандартизированностью, многие из них не сидят на базовой линии, у них различается высота.

В следующих примерах вы можете видеть оригинальное представление цифр на первом изображении, пропорциональное (`pnum`) и табличное (`tnum`) на втором, а на третьем цифры старого стиля (`onum`).

![стандартные цифры pnum](/images/development/typography/1393232196numerals-before.png){: title="стандартные цифры pnum"}

![табличные цифры tnum](/images/development/typography/1393232206tnum-after.png){: title="табличные цифры tnum"}

![цифры старого стиля onum](/images/development/typography/1393232198onum-after.png){: title="цифры старого стиля onum"}

В некоторых шрифтах также есть специальные подстрочные глифы для для дробей — это активируется настройкой `frac`. Вот пример ее действия:

![дроби без frac](/images/development/typography/1393232188frac-before.png){: title="дроби без frac"}

![дроби с frac](/images/development/typography/1393232186frac-after.png){: title="дроби с frac"}

### Строчные прописные (капитель)

Капитель это  уменьшенные заглавные буквы, используемые в качестве строчных, в CSS для этого  есть опция `font-variant: small-caps`:

```css
p {
    -webkit-font-feature-settings: "smcp" 1;
    -moz-font-feature-settings: "smcp" 1;
    -ms-font-feature-settings: "smcp" 1;
    font-feature-settings: "smcp" 1;
}

p {
    -webkit-font-feature-settings: "pcap" 1;
    -moz-font-feature-settings: "pcap" 1;
    -ms-font-feature-settings: "pcap" 1;
    font-feature-settings: "pcap" 1;
}
```

![Обычный шрифт без капители](/images/development/typography/1393232201smcp-before.png){: title="обычный шрифт без капители"}

![Капитель smcp](/images/development/typography/1393232199smcp-after.png){: title="капитель smcp"}

Это изображение показывает уменьшенные прописные буквы  (`smcp`) на уже привычном шрифте Monarcha Book с Fontdeck.

### Кернинг

Кернинг это регулировка расстояний между отдельными парами символов, придающая им большую натуральность и читаемость. Это такие пары как “Wo”, “Na” и более угловатых символов. В некоторых шрифтах есть информация о кернинге, и, соответственно, он может быть активирован. Вот достаточно очевидный пример:

```css
p {
    -webkit-font-feature-settings: "kern" 1;
    -moz-font-feature-settings: "kern" 1;
    -ms-font-feature-settings: "kern" 1;
    font-feature-settings: "kern" 1;
}
```

![Кернинг отключен](/images/development/typography/1393232194kerning-before.png){: title="кернинг отключен"}

![Кернинг включен](/images/development/typography/1393232193kerning-after.png){: title="кернинг включен"}

Пример сделан с шрифтом Magneta Book Italic, доступным на Fontdeck.

### Стилевые наборы и прочие эффекты

И, наконец, перейдем к оставшимся, самым разным эффектам. Вы найдете шрифты с доступными в них различными написаниями букв, или с росчерками и формами букв, появляющимися лишь в определенном контексте.

```css
p {
    -webkit-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    -moz-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    -ms-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
}
```

* ss = стилевой набор.
* swsh = стилевой росчерк.
* cswh = контекстный росчерк.
* calt = контекстная альтернатива.

Существуют и другие настройки, но о них мы упомянем как-нибудь в другой раз.

Стилевые росчерки мы рассмотрим на примере шрифта  Trilogy Fatface Regular с Fontdeck:

```css
p {
    -webkit-font-feature-settings: "swsh" 1;
    -moz-font-feature-settings: "swsh" 1;
    -ms-font-feature-settings: "swsh" 1;
    font-feature-settings: "swsh" 1;
}
```

И получим следующий результат:

![Текст без росчерков ](/images/development/typography/1393232204swashes-before.png){: title="текст без росчерков"}

![Текст с росчерками swsh](/images/development/typography/1393232202swashes-after.png){: title="текст с росчерками swsh"}

Стилевые наборы еще интереснее. Шрифт [Majestic Mishmash](http://fontdeck.com/typeface/majesticmishmash) содержит совершенно различные стилевые наборы:

```css
p {
    /* standard font */
}
```

На изображении ниже показан этот шрифт в обычном виде (стандартном, без использования `font-feature-settings`):

![Текст в обычном виде](/images/development/typography/1393238773standard.png){: title="текст в обычном виде"}

Теперь добавим CSS:

```css
p {
    -webkit-font-feature-settings: "ss01" 1;
    -moz-font-feature-settings: "ss01" 1;
    -ms-font-feature-settings: "ss01" 1;
    font-feature-settings: "ss01" 1;
}
```

И вот результат:

![Текст с активированным стилевым набором ss01](/images/development/typography/1393238772ss01.png){: title="текст с активированным стилевым набором ss01"}

### Советы по использованию возможностей шрифтов

Чтобы полностью раскрыть тему, я дам несколько советов по использованию возможностей шрифтов.

##### Создавайте тестовые файлы

Когда вы  определяетесь с выбором шрифта, будет неплохо создать тестовый файл с различными разделами текста, которые вы можете стилизовать со всеми доступными в нем средствами. Затем вы можете точно также проверить на странице другой шрифт и проверить, как дополнительные возможности шрифта влияют на рендеринг.

##### Делайте специальные наборы с нужными вам возможностями шрифтов

Как правило, вы незаинтересованы в том, чтобы дополнительные возможности  шрифта применялись ко всей странице. Скорее всего, вы просто хотите заменить заголовки или отдельные участки текста. Во многих случаях вы можете сохранить трафик и ресурсы, используя небольшие выборки из шрифта, содержащие нужные символы и фичи.

```css
{
    font-family: 'my posh font subset';
    -webkit-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    -moz-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    -ms-font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
    font-feature-settings: "ss01" 1, "swsh" 1, "cswh" 1, "calt";
}
```


##### Дополнительные материалы

* [Демонстрация `font-feature-settings` с mozilla.org](https://people.mozilla.org/~jkew/feature-samples/opentype-feature-playground.html)
* [Полный список возможностей OTF от Microsoft](https://www.microsoft.com/typography/otspec/features_ae.htm)

