---
title: "Способы подчеркивания в CSS"
layout: post
categories: [development]
tags: [css, translation, css-tricks]
date: 2016-10-12 22:41:29 +0300
prism: yes
description: "Подробный обзор способов подчеркивания текста, от традиционных до экзотичных"
original: "https://css-tricks.com/styling-underlines-web/"
original_title: "Styling Underlines on the Web"
original_author: "Джон Джэймсон"
thumbnail: "/images/development/typography/familiar-768x724.png"
scripts: "codepen"
---

Существует куча разных способов оформления подчеркивания. Возможно, вы вспомните статью Марсина Вичари ["Crafting link underlines"](https://medium.com/design/7c03a9274f9) на Medium. Разработчики Medium не пытаются сделать что-то [безумное](http://tympanus.net/Development/InlineAnchorStyles/), они просто хотят создать красивую линию под текстом.

![Правильное подчеркивание текста в увеличении](/images/development/typography/1372dd76-784d-11e6-80ad-cdbcb93668ff.png)

Это самое простое подчеркивание, но у него правильный размер и оно не перекрывает [выносные элементы букв](https://ru.wikipedia.org/wiki/%D0%92%D1%8B%D0%BD%D0%BE%D1%81%D0%BD%D0%BE%D0%B9_%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82_(%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0)). И оно однозначно лучше дефолтного подчеркивания в большинстве браузеров.  Medium пришлось столкнуться со сложностями для достижения своего стиля в вебе. Два года спустя, нам все также сложно сделать красивое подчеркивание.

## Цели

Что не так с привычным `text-decoration: underline`? Если речь идет об идеальном сценарии, подчеркивание должно делать следующее:

* позиционироваться ниже базовой линии;
* пропускать выносные элементы;
* изменять цвет, толщину и стиль линии;
* работать с многострочным текстом;
* работать на любом фоне.

Я считаю, что это все разумные требования, но насколько я знаю, не существует интуитивного способа добиться этого с помощью CSS.

## Подходы

Так что это за различные способы, которыми мы можем реализовать подчеркивание в вебе?

Вот те, которые я рассматриваю:

* `text-decoration`;
* `border-bottom`;
* `box-shadow`;
* `background-image`;
* фильтры SVG;
* Underline.js (canvas);
* `text-decoration-*`.

Разберем эти способы один за другим и поговорим о плюсах и минусах каждого из них.

### text-decoration

`text-decoration` это самый очевидный способ подчеркивания текста. Вы применяете одно свойство и этого достаточно. На небольших размерах шрифта это может выглядеть вполне прилично, но увеличьте размер шрифта и такое подчеркивание начинает выглядеть неуклюже.

<p data-height="465" data-theme-id="0" data-slug-hash="QEzLAJ" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/QEzLAJ/">Underlines 1: text-decoration</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Самая большая проблема с `text-decoration`  это отсутствие настроек. Вы ограничены цветом и размером шрифта текста и у вас нет кроссбраузерного способа изменить это. Мы еще поговорим об этом подробнее.

Плюсы:

* легко использовать;
* позиционируется ниже базовой линии;
* по умолчанию пропускает нижние выносные элементы в Safari и iOS;
* подчеркивает многострочный текст;
* работает на любом фоне.

Минусы:

* не пропускает нижние выносные элементы во всех остальных браузерах;
* не позволяет изменять цвет, толщину или стиль линии.

### border-bottom

`border-bottom` предлагает хороший баланс между простотой и настраиваемостью. Этот подход использует старое доброе свойство CSS для границы, это значит, что вы можете легко изменять цвет, толщину и стиль.

Вот так `border-bottom` выглядит у строчных элементов.

<p data-height="405" data-theme-id="0" data-slug-hash="VKPZEZ" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/VKPZEZ/">Underlines 2: border-bottom</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Главный недостаток — это расстояние линии подчеркивания от текста, она целиком ниже выносных элементов. Вы можете исправить это, задав элементам свойство `inline-block` и уменьшив `line-height`, но тогда вы потеряете возможность оборачивать текст. Хорошо для отдельных строчек, но больше нигде непригодно.

<p data-height="265" data-theme-id="0" data-slug-hash="kkgPAz" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/kkgPAz/">Underlines 3: border-bottom (inline-block)</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Дополнительно, мы можете использовать `text-shadow`, чтобы перекрыть часть линии рядом с подстрочными элементами, имитируя это при помощи того же цвета, что и фон. То есть эта техника работает только на простом одноцветном фоне, без градиентов, паттернов или изображений.

<p data-height="265" data-theme-id="0" data-slug-hash="LkqowG" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/LkqowG/">Underlines 4: border-bottom (text-shadow)</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

На данный момент мы уже используем целых четыре свойства для оформления одной строчки. Это намного больше работы, чем просто добавить `text-decoration`.

Плюсы:

* может пропускать выносные элементы с помощью `text-shadow`;
* может изменять цвет, жирность и стиль линии;
* позволяет использовать переходы и анимации цвета и жирности;
* работает с многострочным текстом, если не применено значение `inline-block`;
* работает на любом фоне, если не использовать `text-shadow`.

Минусы:

* позиционируется слишком низко и перемещается сложным способом;
* используется много дополнительных свойств для правильной работы;
* при использовании `text-shadow` выделение текста выглядит уродливо.

### box-shadow

`box-shadow` рисует подстрочную линию за счет двух внутренних теней: одна создает прямоугольник, а вторая скрывает его часть. Это значит, что вам нужен однотонный фон для того, чтобы это работало.

<p data-height="365" data-theme-id="0" data-slug-hash="NAokqB" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/NAokqB/">Underlines 5: box-shadow</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Вы можете использовать тот же трюк с  `text-shadow` для заполнения пропусков между подчеркиванием и выносными элементами. Но если цвет подчеркивания отличается от цвета текста — или он просто достаточно тонкий, линия не будет сталкиваться с выносными элементами так, как при использовании `text-decoration`.

Плюсы:

* может позиционироваться ниже базовой линии;
* может пропускать выносные элементы за счет `text-shadow`;
* позволяет изменять цвет и толщину линии;
* работает с многострочным текстом.

Минусы:

* не позволяет изменять стиль подчеркивания;
* работает не на любом фоне.

### background-image

Метод с `background-image` наиболее близок к нашим желанием и обладает минимумом недостатков. Идея состоит в использовании `linear-gradient` и `background-position` для создания изображения, повторяющегося под строчками текста.

Для работы этого подхода необходимо, чтобы текст был в стандартном режиме `display: inline;`.

<p data-height="405" data-theme-id="0" data-slug-hash="NAkgQY" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/NAkgQY/">Underlines 6: background-image</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Следующий вариант обходится без `linear-gradient`, для эффектов вы можете добавить свое фоновое изображение.

<p data-height="405" data-theme-id="0" data-slug-hash="zKAKQP" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/zKAKQP/">Underlines 7: background-image (External)</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Плюсы:

* может позиционироваться ниже базовой линии;
* может пропускать выносные элементы за счет `text-shadow`;
* допускает изменение цвета, толщины и стиля линии;
* работает с кастомными изображениями;
* обертывает несколько строчек текста;
* работает на любом фоне, если не применять `text-shadow`.

Минусы:

* размер изображения может изменяться в зависимости от разрешения экрана, браузера и увеличения.

### Фильтры SVG

Я достаточно много поиграл с этим способом. Вы можете создать строчный фильтр SVG, который рисует линию и затем расширяет текст для маскировки части линии, которую мы хотим сделать прозрачной. Затем вы можете задать фильтру `id` и ссылаться на него в CSS примерно так `filter: url(‘#svg-underline’)`.

Преимущество этого подхода в том, что прозрачность достигается без применения `text-shadow`, то есть мы пропускаем выносные элементы на любом фоне, включая градиенты и фоновые изображения! Это работает только на отдельной строке текста, учитывайте это.

<p data-height="365" data-theme-id="0" data-slug-hash="JXZrqy" data-default-tab="result" data-user="johndjameson" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/johndjameson/pen/JXZrqy/">Underlines 8: SVG Filters</a> by John D. Jameson (<a href="http://codepen.io/johndjameson">@johndjameson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Вот как это выглядит в Chrome и Firefox:

![Подчеркивание текста при помощи фильтров SVG](/images/development/typography/underlines-768x414.png)

Поддержка в  IE, Edge и Safari проблематична. Сложно тестировать поддержку фильтра SVG в CSS. Вы можете использовать директиву `@supports` с `filter`, но это проверит лишь работу ссылки на фильтр, но не работу самого фильтра. Мои попытки завершились  муторным определением возможностей браузера, это ощутимый недостаток метода.

Плюсы:

* может позиционироваться ниже базовой линии;
* может пропускать выносные элементы;
* допускает изменение цвета, толщины и стиля линии;
* работает на любом фоне.

Минусы:

* не работает с многострочным текстом;
* не работает в  IE, Edge и Safari, но вы можете использовать  `text-decoration` в качестве запасного варианта, в Safari он смотриться достойно.


### Underline.js (Canvas)

Underline.js завораживает. Я считаю впечатляющим то, что сделала Вентин Жанг за счет владения JavaScript и внимания к деталям. Если вы не видели [техническое демо](http://underlinejs.org/) Underline.js, бросайте читать и уделите ему минуту времени. Есть также ее девятиминутный доклад о том, как [это работает](http://embed.wirewax.com/8013554/7bafa8/), но я опишу кратко: подчеркивание рисуется с помощью элементов `<canvas>`. Это новый подход, который работает на удивление хорошо.

Несмотря броское название,  Underline.js это всего лишь техническое демо. Это значит, что вы не можете просто взять и подключить это в свой проект без изменения кода.

Я решил упомянуть об этом в доказательство концепции, что `<canvas>` обладает потенциалом создания прекрасных интерактивных подчеркиваний, но чтобы это заработало, вам надо писать свой JavaScript.

## Новые свойства text-decoration

Вы помните, что я обещал подробнее поговорить о `text-decoration`. Время пришло.

Само по себе это свойство отлично работает, но вы можете добавить несколько экспериментальных свойств для настройки внешнего вида подчеркивания.

* `text-decoration-color`
* `text-decoration-skip`
* `text-decoration-style`

Но слишком сильно не радуйтесь... Поддержка в браузерах — как всегда. Такие дела.

### text-decoration-color

Свойство `text-decoration-color` позволяет вам изменять цвет подчеркивания отдельно от цвета текста. Поддержка этого свойства лучше, чем можно было ожидать — оно работает в Firefox и с префиксом в Safari. Вот в чем загвоздка: если у вас есть выносные элементы, Safari поместит подчеркивание поверх текста.

Firefox:

![изменение цвета подчеркивания в Firefox](/images/development/typography/firefox-768x163.png)

Safari:

![изменение цвета подчеркивания в Safari](/images/development/typography/safari-768x162.png)

### text-decoration-skip

Свойство `text-decoration-skip` включает пропуск выносных элементов в подчеркиваемом тексте.

![подчеркивание с text-decoration-skip в Safari](/images/development/typography/text-decoration-skip-768x217.png)

Это свойство нестандартное и работает сейчас только в Safari, с префиксом `-webkit-`. Safari по умолчанию активирует это свойство, поэтому выносные элементы всегда не перечеркиваются.

Если вы используете Normalize, то учтите, что последние версии отключают это свойство ради последовательного поведения браузеров. И если вы хотите, чтобы подчеркивание не затрагивало выносные элементы, вам надо вручную активировать его.

### text-decoration-style

Свойство `text-decoration-style` предлагает такие же возможности оформления, что и у свойства `border-style`, добавляя кроме этого стиль `wavy`.

Вот список доступных значений:

* `dashed`
* `dotted`
* `double`
* `solid`
* `wavy`

Сейчас свойство `text-decoration-style` работает только в Firefox, вот скриншот из него:

![образец работы text-decoration-style](/images/development/typography/familiar-768x724.png){: itemprop="image"}

### Чего не хватает

Серия свойств `text-decoration-*` намного более интуитивна в использовании, чем остальные свойства CSS для оформления подчеркивания. Но если взглянуть внимательнее, то для удовлетворения наших запросов не хватает способов задать толщину или позицию линии.

После небольшого исследования, я нашел еще пару свойств:

* `text-underline-width`
* `text-underline-position`

Судя по всему, они относятся к ранним черновикам CSS, но их так и не реализовали в браузерах из-за отсутствия интереса.

## Выводы

Так какой же способ подчеркивания лучший?

[Смотря по обстоятельствам](https://codepen.io/rachsmith/details/YweZbG/).

Для небольшого текста я рекомендую использовать `text-decoration` с оптимистичным добавлением `text-decoration-skip`. Это выглядит немного безвкусно в большинстве браузеров, но подчеркивание в браузерах было таким всегда и люди просто не обратят внимания. Плюс всегда есть шанс, что при наличии у вас терпения, это подчеркивание  когда-нибудь будет выглядеть хорошо без необходимости для вас что-то менять, так как это сделают в браузерах.

Для основного текста имеет смысл использовать `background-image`. Этот подход работает, выглядит замечательно и для него есть [миксины Sass](https://codepen.io/jimmynotjim/pen/EabQjV). Вы, в принципе, можете пропустить `text-shadow`, если подчеркивание тонкое или отличается цветом от текста.

Для отдельных строк текста используйте `border-bottom` вместе с любыми дополнительными свойствами.

А если  вам нужен пропуск выносных элементов на фоне градиента или изображения, попробуйте использовать фильтры SVG. Или просто избегайте использовать подчеркивание.

В будущем, когда поддержка в браузерах станет лучше, единственным ответом будет набор свойств `text-decoration-*`.

Также рекомендую обратить внимание на статью Бенджамина Вудроффа [ CSS Underlines Suck](http://benjam.info/blog/posts/2015-01-31-css-underline/), в которой рассматриваются те же вопросы.

