---
title: "Грид, флексбокс и выравнивание блоков: наша новая система раскладки"
layout: post
categories: [development]
tags: [css, grid, translation, smashingmagazine]
date: 2016-11-20 18:28:21 +0300
prism: yes
description: "Подробный анализ работы выравнивания блоков  в флексбоксе и гриде от Рейчел Эндрю"
original: "https://www.smashingmagazine.com/2016/11/css-grids-flexbox-and-box-alignment-our-new-system-for-web-layout/"
original_title: "CSS Grid, Flexbox And Box Alignment: Our New System For Web Layout"
original_author: "Рейчел Эндрю"
thumbnail: "/images/development/flex/10-grid-justify-items-preview-650px-opt.png"
scripts: codepen
---

Раскладка в вебе остается сложной. Причина этого состоит в том, что методы раскладки, которые мы  используем с того момента, как раскладка средствами CSS стала возможной, не предназначались для создания чего-то сложного. Хотя мы можем сделать достаточно много, пока работаем с фиксированной шириной и используем хаки типа искуственных колонок, но эти методы разваливаются при отзывчивом дизайне. К счастью, у нас есть надежда в виде флексбокса,  который многие уже знают и используют, а также менее известных технологий —  CSS3 Grid Layout (далее грид) и модуля выравнивания блоков.

В этой статье, я собираюсь объяснить, как они работают вместе, а вы откроете для себя, что понимание флексбокса очень близко приближает вас к пониманию грида.

###### Примечание о поддержке в браузерах
{: .info}
На данный момент грид поддерживается при активации флага, а также в ночных сборках и сборках для разработчиков в   Firefox, Safari, Chrome и Opera. Все, что вы увидите в статье, можно увидеть в работе, если вы активируете флаг или используете соответствующие сборки браузеров. Я стараюсь поддерживать в актуальном состоянии [список поддержки грида в браузерах](http://gridbyexample.com/browsers/).
{: .info}

## Новые значения свойства `display`

И `grid`, и `flexbox` являются новыми значениями для свойства `display`. Чтобы сделать элемент флекс-контейнером, мы используем `display: flex`, аналогично, чтобы сделать грид-контейнер, мы используем `display: grid`.

Как только мы это сделаем, непосредственные потомки нашего флекс- или грид-контейнера станут флекс- или грид-элементами, также они получат начальные значения флекс- или грид-элементов.

### display: flex

В первом примере у нас есть три элемента в контейнере, которому задано `display: flex`. Это все, что на нужно, чтобы начать использовать флекбокс.

Пока мы не добавим другие значения свойств, начальные значения свойств флекс-контейнера следующие:

* `flex-direction: row`
* `flex-wrap: no-wrap`
* `align-items: stretch` 
* `justify-content: flex-start`

Начальные значения для флекс-элементов:

* `flex-grow: 0`
* `flex-shrink: 1`
* `flex-basis: auto`

Мы взглянем на работу этих свойств и значений позднее. Сейчас нам достаточно задать родительскому элементу `display: flex` и флексбокс будет работать.

<p data-height="465" data-theme-id="0" data-slug-hash="ZOpOqB" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox Defaults" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/ZOpOqB/">Flexbox Defaults</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>



### display: grid

Для раскладки элементов по сетке  мы используем  `display: grid`. Чтобы увидеть поведение грида, в примере будет использована раскладка с пятью картами.

Добавление `display: grid` не вносит драматических изменений, однако дочерние элементы теперь стали грид-элементами. Они расположились в одноколоночной полосе сетки, один под другим, сетка создала неявные строки для каждого элемента.

<p data-height="465" data-theme-id="0" data-slug-hash="QEKGNm" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid Defaults" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/QEKGNm/">Grid Defaults</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Мы можем сделать шаг вперед и сделать раскладку более похожей на сетку за счет добавления колонок. Для этого мы используем свойство `grid-template-rows`.

В следующем примере, я создала три колонки равной высоты используя новую единицу измерения в CSS, созданную специально для грида — `fr`. Это сокращение от fraction (доля), в данном случае это доля доступного пространства, которую должна занять колонка. Вы можете видеть, как наши грид-элементы сразу же расположились по сетке в каждой из клеток наших явно определенных столбцов. В сетке по-прежнему создаются незадаваемые явно строки: по мере заполнения доступных ячеек в колонках, строки добавляются для размещения оставшихся элементов.

<p data-height="465" data-theme-id="0" data-slug-hash="LZRbRV" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid Columns" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/LZRbRV/">Grid Columns</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Опять-таки, у нас есть определенное поведение по умолчанию. Мы не позиционировали какие-либо из этих грид-элементов, они сами размещали себя по нашей сетке, каждый в отдельную ячейку. Начальные значения для грид-контейнера следующие:

* `grid-auto-flow: row`
* `grid-auto-rows: auto`
* `align-items: stretch`
* `justify-items: stretch`
* `grid-gap: 0`

Эти начальные значения означают, что наши грид-элементы расположены каждый в отдельной ячейке сетки, работающей поперек рядов. Так как у нас трехколоночная сетка, после заполнения третьей колонки создается новый ряд для размещения оставшихся элементов. Элементы растягиваются по вертикали и горизонтали для заполнения площади сетки.

## Выравнивание блоков

В этих двух примерах мы уже встретились со значениями, определенными в модуле выравнивания блоков.  “[Box Alignment Module Level 3](https://www.w3.org/TR/css-align-3/)” по сути отвечает за все выравнивания и распределения пространства, определенные в спецификации флексбокса и делает их доступными для других модулей. Поэтому, если вы уже используете флексбокс, то вы используете и выравнивание блоков.

Посмотрим, как выравнивание блоков работает в флексбоксе и гриде, а также на те проблемы, которые мы решаем с его помощью.

### Колонки одинаковой высоты

Это то, что очень просто делалось во времена табличной раскладки, но чертовски сложно делать при помощи позиционирования и обтекания. Ниже, в примере с обтеканием, наши карты содержат разное количество контента. У нас нет способа указать другим картам, что они должны визуально соответствовать по высоте первой карте — так как у карт нет никаких связей друг с другом.

<p data-height="365" data-theme-id="0" data-slug-hash="YWGrPy" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Floated Columns" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/YWGrPy/">Floated Columns</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Как только мы задаем свойство `display` родительского элемента в значение `grid` или `flex`, мы устанавливаем отношения между его потомками. Эти отношения активируют работу свойств выравнивания блоков, делая создание колонок равной высоты простым.

В примере с флексбоксом в наших элементах находится разное количество контента. Фон каждого из них выравнивается по линии, а не сидит за контентом, как это должно быть у плавающих элементов. Так как эти элементы выведены в ряд, их поведение контролируется свойством `align-items`. А для того, чтобы колонки были одинаковой высоты, значением этого свойства должно быть `stretch` — это начальное значение этого свойства.

<p data-height="465" data-theme-id="0" data-slug-hash="ZOpXEM" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox Equal Height Columns" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/ZOpXEM/">Flexbox Equal Height Columns</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

То же самое мы видим и с раскладкой на гриде. Ниже показана простейшая из раскладок — две колонки (основной контент и боковая). Я опять использую единицы измерения `fr`: боковая колонка получит значение 1, а основной контент — 3. Фоновый цвет в боковой колонке доходит до того же края, что и контент в основной колонке. Опять, дефолтным значением для `align-items` является  `stretch`.

<p data-height="465" data-theme-id="0" data-slug-hash="GqjMJj" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid Equal Height Columns" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/GqjMJj/">Grid Equal Height Columns</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Выравнивание в флексбоксе

Мы увидели, что значением по умолчанию для `align-items` в флексбоксе и гриде является `stretch`.

В флексбоксе при использовании `align-items`, мы выравниваем элементы внутри флекс-контейнера на пересекающихся осях. Основная ось определяется свойством `flex-direction`. В первом примере основной осью является ряд (горизонталь): мы растягиваем элементы на противоположной оси до высоты флекс-контейнера. В свою очередь высота флекс-контейнера это высота флекс-элемента с наибольшим количеством контента.

![Высота контейнера определяется высотой самой длинной колонки](/images/development/flex/01-flex-row-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/01-flex-row-opt.png)*

Я могу задать высоту контейнеру и в этом случае его высота будет определяться заданным значением.

![Высота контейнера явно задана](/images/development/flex/02-flex-row-height-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/02-flex-row-height-opt.png)*

Вместо дефолтного значения `stretch` мы можем использовать и другие варианты:

* `flex-start`
* `flex-end`
* `baseline`
* `stretch`

Для управления выравниванием по основной оси, используйте свойство `justify-content`. Его значение по умолчанию `flex-start`, поэтому все элементы выровнены по левому краю. У нас есть выбор из следующих значений:

* `flex-start`
* `flex-end`
* `center`
* `space-around`
* `space-between`

Ключевые слова `space-between` и `space-around` особенно интересны. В случае со `space-between`, пространство оставшееся после укладки флекс-элементов равномерно распределяется между ними.

![Распределение пространства между элементами со space-between](/images/development/flex/03-flex-space-between-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/03-flex-space-between-opt.png)*

Использование `space-around` аналогично, за исключением того, что распределяется пространство, оставшееся с обеих сторон от элементов, а половинные промежутки помещаются в начало и конец.

![Распределение пространства между элементами со space-around](/images/development/flex/04-flex-space-around-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/04-flex-space-around-opt.png)*

Вы можете увидеть работу этих свойств и значений в демо:

<p data-height="465" data-theme-id="0" data-slug-hash="PzGJzm" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox Alignment flex-direction: row" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/PzGJzm/">Flexbox Alignment flex-direction: row</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Мы также можем вывести флекс-элементы как колонку, а не как ряд. Если мы изменим значение  `flex-direction` на `column`, то основной осью станет колонка, а ряд станет поперечной осью —  `align-items` по-прежнему в значении `stretch`, а элементы растягиваются на ширину ряда.

![Все флекс-элементы выведены в одну колонку](/images/development/flex/05-flex-column-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/05-flex-column-opt.png)*

Если мы захотим выровнять их по началу флекс-контейнера, мы используем `flex-start`.

![Флекс-элементы выровнены по началу контейнера](/images/development/flex/06-flex-column-start-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/07-flex-column-space-between-opt.png)*

<p data-height="465" data-theme-id="0" data-slug-hash="JKRrvY" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox Alignment flex-direction: column" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/JKRrvY/">Flexbox Alignment flex-direction: column</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Выравнивание в гриде

В грид-раскладке поведение похоже, за исключением того, что мы выравниваем элементы внутри заданной области сетки. В флексбоксе мы говорим об основной и поперечной осях; в случае с гридом мы используем термины "блочная" или " колоночная ось" для описания осей, определяющих наши колонки, а термины "строчная" и "рядная ось" для описания осей, определяющих наши ряды, как это [задано спецификацией](https://www.w3.org/TR/css-grid-1/#grid-concepts).

Мы можем выровнять контент внутри области грида, используя свойства и значения, описанные в спецификации выравнивания блоков.

Область грида это одна или более ячеек. В примере ниже, у нас есть четырехколоночная и четырехрядная сетка. Ряды отделены отступами в 10 пикселей и у нас есть три области грида, созданные с использованием позиционирования на основе линий. Мы позднее подробно рассмотрим такое позиционирование, сейчас скажу, что значение перед `/` это линия, с которой начинается контент, а значение после это место, где контент завершается.

<p data-height="465" data-theme-id="0" data-slug-hash="EygpMv" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid Alignment: align-items and justify-items" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/EygpMv/">Grid Alignment: align-items and justify-items</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Точечная граница фонового изображения помогает нам увидеть заданные области. Так в первом примере, каждая область использует дефолтное значение `stretch` для `align-items` на оси колонки и  `justify-items` на оси ряда. Это значит, что контент растягивается для полного заполнения области.

![Образец выравнивания в гриде](/images/development/flex/08-grid-default-align-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/08-grid-default-align-opt.png)*

Во втором примере, я изменила значение `align-items` в грид-контейнере на `center`. Мы также можем изменить это значение в отдельном грид-элементе при помощи свойства `align-self`. В этом случае, я задала значение `center` всем элементам , кроме второго, которому задано `stretch`.

![Выравнивание в гриде с center](/images/development/flex/09-grid-align-items-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/09-grid-align-items-opt.png)*

В третьем примере, я снова поменяла значения `justify-items` и `justify-self` , задав соответственно `center` и `stretch`.

![Выравнивание в гриде с justify-items](/images/development/flex/10-grid-justify-items-preview-650px-opt.png){: itemprop="image"}

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/10-grid-justify-items-opt.png)*

Во всех этих примерах контент выравнивался в областях грида, области определялись началом и окончанием линии грида.

Мы также можем выравнивать всю сетку внутри контейнера, если наши полосы занимают меньше пространства, чем контейнер, которому задано `display: grid`. В этом случае мы можем использовать свойства `align-content` и `justify-content`, как и в случае с флексбоксом.

<p data-height="465" data-theme-id="0" data-slug-hash="aZBozX" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid Alignment: aligning the grid" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/aZBozX/">Grid Alignment: aligning the grid</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

В первом примере мы видим выравнивание по умолчанию, при котором колонки и ряды задаются в абсолютных величинах и занимают меньше пространства, чем позволяет их контейнер фиксированной ширины. Дефолтное значение для обоих `start`.

![выравнивание с align-content start](/images/development/flex/11-grid-align-start-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/11-grid-align-start-opt.png)*

Чтобы сдвинуть полосы вправо вниз, мы изменим значение на `end`.

![выравнивание с align-content end](/images/development/flex/12-grid-align-end-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/12-grid-align-end-opt.png)*

Также как и с флексбоксом, мы можем использовать `space-around` и `space-between`. Это может повлечь поведение, которое может быть нежелательным для нас, так как отступы в сетке станут шире. Однако, как вы можете видеть на изображении ниже и в третьем примере на Codepen, мы получаем те же отступы между полосами, которые у нас были с флексбоксом.

![выравнивание со space-around](/images/development/flex/13-grid-align-space-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/13-grid-align-space-opt.png)*

Полосы фиксированного размера получают дополнительное пространство, если они охватывают больше одной полосы. Элементы #2 и #4 в нашем примере шире, а #3 выше, так как они получили дополнительное пространство, которое предназначалось промежутку между полосами.

Мы можем полностью центрировать грид, задав `align-content` и `justify-content` значение `center`, как показано в последнем примере.

![выравнивание с align-conten](/images/development/flex/14-grid-align-center-preview-650px-opt.png)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/06/14-grid-align-center-opt.png)*

У нас есть отличные возможности выравнивания в флексбоксе и гриде и в целом они работают согласованно. Мы можем выровнять отдельные элементы и группы элементов так, чтобы они были отзывчивыми и не накладывались друг на друга — этого и не хватало вебу до настоящего времени.

## Отзывчивость по умолчанию

В последнем разделе мы рассмотрели выравнивание. Свойства выравнивания блоков, используемые в раскладках на основе флексбокса и грида это одна из областей, где мы видим, что эти спецификации возникли в мире, где отзывчивый дизайн является общим принципом. Значения типа `space-between`, `space-around` и `stretch` позволяют добиться отзывчивости и равного распределения содержимого между элементами.

Однако здесь есть нечто большее. Отзывчивый дизайн часто заключается в сохранении пропорций. Когда мы рассчитываем колонки для отзывчивого дизайна, используя подход `target ÷ context`, представленный в статье Этана Маркотта ["Fluid Grids"](http://alistapart.com/article/fluidgrids), мы поддерживаем пропорции оригинального дизайна в абсолютных величинах. Флексбокс и грид дают нам более простые способы работы с пропорциями в нашем дизайне.

Флексбокс дает нам путь к гибкости на основе приоритета контента. Мы видели это при использовании ключевого слова  `space-between` для задания равномерных отступов между элементами. Сначала рассчитывается количество пространства между элементами, а затем оставшееся пространство в контейнере делится и используется для равномерного размещения элементов. Мы можем добиться большего контроля над распределением контента за счет свойств, которые мы можем применять к самим флекс-элементам:

* `flex-grow`
* `flex-shrink`
* `flex-basis`

Эти три свойства чаще указываются в короткой записью свойства `flex`. Если мы добавляем элементу `flex: 1 1 300px`, мы указываем, что свойство  `flex-grow `равно `1`, то есть этот элемент может расширяться; `flex-shrink` равно `1`, это позволит элементам уменьшаться, а `flex-basis` равен 300 пикселям. Применение этих правил к нашей карточной раскладке даст следующий результат:

<p data-height="465" data-theme-id="0" data-slug-hash="gMLrEG" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: flex properties" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/gMLrEG/">Flexbox: flex properties</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Наш `flex-basis` равен 300 пикселям и у нас три карты в ряду. Если флекс-контейнер шире 900 пикселей, тогда оставшееся пространство делится на три и распределяется поровну между элементами. Это потому что мы задали  `flex-grow` равный `1` и наши элементы могут расти больше, чем задано `flex-basis`. Мы также задали `flex-shrink` равный `1`, а это значит, что если у нас не хватит места для трех колонок по 300 пикселей, их размер будет уменьшаться в равных долях.

Если мы хотим, чтобы эти элементы росли в разных пропорциях, тогда нам нужно изменить значение `flex-grow` у одного или нескольких элементов. Если мы захотим, чтобы первый элемент занял втрое больше доступного пространства, то мы зададим `flex-grow: 3`.

<p data-height="465" data-theme-id="0" data-slug-hash="NrbNmz" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: flex properties" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/NrbNmz/">Flexbox: flex properties</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Доступное пространство распределяется после того, как выделено место в соответствии с заданным `flex-basis`. Именно поэтому наш первый элемент не стал в три раза больше остальных, а просто занял три части оставшегося пространства. Вы увидите большее изменение, если зададите `flex-basis:0`, в таком случае у нас не будет стартового значения, которое мы вычитаем из ширины контейнера. Соответственно, вся ширина контейнера будет распределена между элементами пропорционально.

<p data-height="465" data-theme-id="0" data-slug-hash="jrVqoQ" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: flex properties" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/jrVqoQ/">Flexbox: flex properties</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Очень полезным инструментом, помогающим вам понять эти значения является [Flexbox Tester](https://madebymike.com.au/demos/flexbox-tester/). Передавайте ему различные значения и он рассчитает  для вас итоговые значения, а также объяснит, почему они получились.

Если вы используете `auto` в качестве значения `flex-basis`, то в роли последнего будет использоваться любой доступный размер флекс-элемента. Если размеры не указаны, тогда в качестве дефолтного будет использовано значение  `content`, то есть ширина контента. Поэтому использование `auto` очень полезно для многократно используемых компонентов, которым может понадобиться  задание размера элемента. Вы можете использовать `auto` и быть уверенными, что если элемент должен быть определенного размера, то флексбокс обеспечит этот размер.

В следующем примере, я задала всем картам `flex-basis: auto`, а затем первой из них ширину в 350 пикселей. Таким образом `flex-basis` этой первой карты теперь равен 350 пикселям, у двух других он определяется шириной контента.

<p data-height="465" data-theme-id="0" data-slug-hash="mEOPZM" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: flex properties" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/mEOPZM/">Flexbox: flex properties</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Если мы вернемся к нашему оригинальному `flex: 1 1 300px`, добавим еще элементов  и зададим `flex-wrap: wrap`  контейнеру, элементы будут укладываться настолько близко, насколько это можно при заданном значении `flex-basis`. Если у нас 5 изображений и 3 из них укладываются в один ряд, тогда оставшиеся 2 будут выведены на следующем. Так как элементам позволено расширяться, оба перенесенных элемента вырастут в равной мере и мы получим 2 равных увеличенных элемента снизу и 3 равных элемента сверху.

<p data-height="465" data-theme-id="0" data-slug-hash="QEGNeZ" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: wrapping" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/QEGNeZ/">Flexbox: wrapping</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Часто возникает следующий вопрос: а как сделать так, чтобы элементы в нижнем ряду были такими же, как и в верхнем, оставляя после себя пустое пространство? С флексбоксом никак. Для такого поведения нужна раскладка на гриде.

## Сохранение пропорций с помощью грид-раскладки

Грид, как мы уже видели  обладает концепцией создания полос  колонок и рядов, в которых позиционируются элементы. Когда мы создаем гибкую грид-раскладку, мы задаем пропорции при задании полос в грид-контейнере — именно полос, а не элементов, как в флексбоксе. Мы уже сталкивались со специальной единицей `fr`, когда создавали раскладку на гриде. Эта единица работает примерно также как `flex-grow` при `flex-basis:0`. Она распределяет доли доступного пространства в грид-контейнере.

В следующем примере кода, первой полосе колонок было задан `2fr`, двум другим  `1fr`. Таким образом, мы делим пространство на четыре части и даем две части первой полосе и по одной двум оставшимся.

<p data-height="465" data-theme-id="0" data-slug-hash="xOROVO" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Simple grid show fraction units" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/xOROVO/">Simple grid show fraction units</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Смешивание абсолютных единиц измерения и `fr` валидно. В следующем примере у нас будет полоса `2fr`, полоса `1fr` и полоса в  300 пикселей. Сначала вычитается абсолютная величина для третьей полосы, а затем оставшееся пространство делится на три, две части идут в первую полосу, а оставшаяся во вторую.

<p data-height="465" data-theme-id="0" data-slug-hash="rLWLLa" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: Mixing absolute and  fraction units" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/rLWLLa/">Grid: Mixing absolute and  fraction units</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>


Также из этого примера вы можете заметить, что наши элементы заполняют указанные полосы — они не распределяются по всему ряду, как в флексбоксе. Это потому, что в гриде мы создаем двумерную раскладку, а затем помещаем туда элементы. В флексбоксе мы берем наш контент и укладываем его столько, сколько помещается в одном измерении,  в колонке или в ряду, обрабатывая дополнительные ряды или колонки как совершенно новые флекс-контейнеры.


Хорошо то, что у нас по-прежнему есть способ создать столько колонок определенной величины, сколько влезет в контейнер. Мы можем сделать это с помощью синтаксиса `grid` и `repeat`.

В следующем примере я буду использовать синтаксис `repeat` для создания максимального количества двухсотпиксельных колонок, помещающегося в контейнере. Я использую синтаксис `repeat` для перечисления полос с ключевым словом `auto-fill`  и задаваемым им размером.

На момент написания это не было имплементировано в Chrome, но работало в версии Firefox для разработчиков.
{: .info}

<p data-height="465" data-theme-id="0" data-slug-hash="Pzbzze" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: As many 200 pixel tracks as will fit" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/Pzbzze/">Grid: As many 200 pixel tracks as will fit</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Мы можем продвинуться еще на один шаг и скомбинировать долевые и абсолютные единицы, чтобы грид создавал максимум двухсотпиксельных полос, помещающихся в контейнер и поровну распределил между ними оставшееся место.

<p data-height="465" data-theme-id="0" data-slug-hash="EyNyNK" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: As many 200 pixel tracks as will fit, distribute remain space evenly" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/EyNyNK/">Grid: As many 200 pixel tracks as will fit, distribute remain space evenly</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>


Таким образом мы совместим преимущества двумерной раскладки с гибким количеством полос — и все это без медиазапросов. Дальше мы рассмотрим расширение спецификаций флексбокса и грида. Там, где флексбокс прекращает распределять элементы в одном измерении, грид только начинает это делать.

## Разделение порядка в разметке и визуального порядка элементов

С флексбоксом мы можем делать многое в плане позиционирования флекс-элементов. Мы можем выбрать направления, в котором они обтекают, задав `flex-direction` в значение  `row`, `row-reverse` или `column`, `column-reverse` и мы можем задать порядок, контролирующий порядок вывода элементов.

<p data-height="465" data-theme-id="0" data-slug-hash="YWpWVE" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Flexbox: order" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/YWpWVE/">Flexbox: order</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

С грид-раскладкой, нам надо правильно расположить дочерние элементы по сетке, которую мы определили. В большинстве примеров мы полагаемся на автоматическое размещение по сетке; правила, которые определяют размещение непозиционированных нами элементов. В следующем примере я использую позиционирование на основе линий, чтобы позиционировать элементы грида.

Свойства `grid-column` и `grid-row` являются краткой записью следующего набора свойств: `grid-column-start`, `grid-row-start`, `grid-column-end` и `grid-row-end`.  Значение перед `/` это линия, с которой начинается контент, а значение после — линия, на которой контент заканчивается.

<p data-height="465" data-theme-id="0" data-slug-hash="rLWLwO" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: line-based positioning" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/rLWLwO/">Grid: line-based positioning</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Вы также можете именовать свои линии. Это пригодиться, когда вы создаете свою сетку в грид-контейнере. Имена линий указываются в квадратных скобках, а позиционирование осуществляется также как и в предыдущем примере, только вместо индекса линии указывается ее имя.

<p data-height="465" data-theme-id="0" data-slug-hash="aZBZEB" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: line-based positioning, named lines" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/aZBZEB/">Grid: line-based positioning, named lines</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

У вас может быть несколько линий с одним именем и вы можете указывать их с помощью имени и индекса.

Вы можете использовать ключевое слово `span`, охватывая указанное число линий, например, до третьей линии с именем `col`. Этот тип позиционирования полезен для использования компонентов, размещающихся в разных местах раскладки. В примере ниже, я хочу чтобы некоторые элементы разместились на 6 полосах колонок, а оставшиеся заняли бы три полосы. Я использую авторазмещение для раскладки элементов, но когда грид встречает элемент с классом `wide`, стартовое значение будет `auto`, а конечное `span 2`; таким образом он начнется там, где и должен начать автоматически, но затем охватит две линии.

<p data-height="465" data-theme-id="0" data-slug-hash="LZbZdj" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: multiple lines with the same name" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/LZbZdj/">Grid: multiple lines with the same name</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Использование авторазмещения с несколькими подобными правилами может оставить пробелы в вашей стеке, также в сетке могут появится элементы требующие двух полос при наличии только одной. По умолчанию грид продвигает вперед, поэтому как только она оставит пробел, она не будет возвращаться, чтобы заполнить его — если мы только не зададим `grid-auto-flow: dense`, в этом случае грид будет возвращаться для заполнения пробелов, беря контент в DOM-порядке.

<p data-height="465" data-theme-id="0" data-slug-hash="beBeKJ" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: grid-auto-flow: dense" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/beBeKJ/">Grid: grid-auto-flow: dense</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Также есть отдельный метод позиционирования элементов в грид-раскладке — путем создания визуального представления раскладки напрямую в свойстве `grid-template-areas`. Для этого вам сначала надо присвоить имена всем прямым потомкам грид-контейнера, которые вы хотите позиционировать.

Затем мы располагаем элементы в манере ASCII-арта, указывая значение `grid-template-areas`. Если вы хотите полностью изменять раскладку с помощью медиазапросов, вам достаточно изменить только это свойство.

<p data-height="465" data-theme-id="0" data-slug-hash="oLYLMo" data-default-tab="result" data-user="rachelandrew" data-embed-version="2" data-pen-title="Grid: template areas" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/rachelandrew/pen/oLYLMo/">Grid: template areas</a> by rachelandrew (<a href="http://codepen.io/rachelandrew">@rachelandrew</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Как вы можете видеть из примера, чтобы оставить ячейку пустой, мы используем точку или серию точек без пустого пространства между ними. Чтобы вызвать охват элементом нескольких полос, мы повторяем его имя.

### Последствия переупорядочения для доступности.

В флексбоксе, а еще больш в гриде, нам нужно с огромной осторожностью использовать методы для переупорядочения контента. Вот что говорит [спецификация флексбокса](https://drafts.csswg.org/css-flexbox/#order-accessibility):

>Авторы должны изменять только визуальный, а не логический порядок. Таблицы стилей не должны производить логическое переупорядочивание.

И  предупреждение в [спецификации грида](https://drafts.csswg.org/css-grid/#order-accessibility):

>Грид-раскладка дает авторам возможность перестановки по всему документу. Однако это не является заменой корректной разметке исходников документа. Свойства упорядочивания и размещения по сетке не затрагивают невизуальные медиа (такие как речь). Кроме того, визуальное изменение порядка грид-элементов не влияет порядок прохода по ним в режиме последовательной навигации (например, по ссылкам).

В обоих случаях, как определено на данный момент, переупорядочивание является исключительно визуальным. Оно не меняет логический порядок документа. Дополнительно нам надо особо позаботиться о слабовидящих пользователях с клавиатурой. Очень легко сделать так, что при проходе табом по документу мы будем перескакивать из навигации сверху вниз документа из-за того, что грид-элемент в источнике находится раньше, чем позиционируется визуально.

## Новая система для раскладки

Я не рассматривала каждый аспект флексбокса и грида в этой статье — моя цель состояла в том, чтобы показать сходства и различия в спецификациях и заодно рассказать о выравнивании блоков. Для демонстрации того, что  эти спецификации принесли нам новую систему раскладки, соответствующую нуждам сайтов и приложений, которые мы создаем сейчас.

В настоящий момент флексбокс работает во всех основных браузерах, в то время как грид под флагом работает в Chrome, Opera, Safari и Firefox. Флексбокс изначально работал с префиксной версией, которая использовалась разработчиками, но затем он изменился, оставив нас с ощущением, что мы не можем полагаться на него. Грид разрабатывался под флагом и если вы посмотрите примеры в статье с активированным флагом, вы заметите, что имплементации уже очень совместимы. На данный момент спецификация находится в статусе кандидата в рекомендации. Поэтому когда грид выйдет в работу (это ожидается в начале следующего года) у него будет солидная кроссбраузерная поддержка.

Можете поиграть с примерами из статьи, а также ознакомиться с остальными ресурсами, которые приведены в списке ниже.

## Ресурсы

Вот некоторые ресурсы, которые помогут вам глубже исследовать спецификации:

* “[The Flexbox Reading List: Techniques and Tools](https://www.smashingmagazine.com/2016/02/the-flexbox-reading-list/),” Cosima Mielke, Smashing Magazine
* [Grid by Example](http://gridbyexample.com/), Rachel Andrew
* “[Grid Resources](http://gridbyexample.com/resources)” (список), Grid by Example, Rachel Andrew
* “[CSS Grid Layout Examples](http://igalia.github.io/css-grid-layout/),” Igalia
* “[A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/),” CSS-Tricks
* “[Laying Out The Future With Grid And Flexbox](https://www.youtube.com/watch?v=ibeF6rbzD70)” (видео), Rachel Andrew, Mozilla Hacks
* [The Experimental Layout Lab of Jen Simmons](http://labs.jensimmons.com/)
* [Полное руководство по Flexbox](http://frontender.info/a-guide-to-flexbox/)
* [Подробно о размещении элементов в грид-раскладке (CSS Grid Layout)](http://css-live.ru/articles/podrobno-o-razmeshhenii-elementov-v-grid-raskladke-css-grid-layout.html)