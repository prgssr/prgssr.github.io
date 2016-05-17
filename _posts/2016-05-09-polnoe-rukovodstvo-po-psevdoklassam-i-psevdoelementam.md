---
title: "Полное руководство по псевдоклассам и псевдоэлементам"
layout: long-post
categories: [development]
tags: [css, translation, smashingmagazine]
prism: yes
date: 2016-05-09 21:49:03 +0300
toc-title: "Справочник по псевдоклассам и псевдоэлементам в CSS:"
description: "Полный перечень псевдоклассов и псевдоэлементов от Рикардо Зеа с большим количеством примеров"
original: "https://www.smashingmagazine.com/2016/05/an-ultimate-guide-to-css-pseudo-classes-and-pseudo-elements/"
original_title: "An Ultimate Guide To CSS Pseudo-Classes And Pseudo-Elements"
original_author: "Рикардо Зеа"
thumbnail: noimage
scripts: codepen
---

Всем привет. В самом начале своей работы  в веб-дизайне, я изучал все тяжелым способом: методом проб и ошибок. Тогда не было Smashing Magazine, Can I Use, CodePen  и прочих волшебных вещей, окружающих нас сегодня. Если бы раньше  кто-либо  показал мне азы веб дизайна, особенно по части CSS, это было бы невероятно полезно.

Теперь я намного более опытен и хочу поделиться своим простым, понятным и не догматическим руководством по псевдоклассам и псевдоэлементам.

Если вы опытный веб-дизайнер или разработчик, то вы должны знать большинство обсуждаемых здесь псевдоклассов и псевдоэлементов. Однако я рекомендую вам ознакомиться с [содержанием](#ref-header), возможно, вы встретите что-то незнакомое для себя.

Перед тем как погрузиться в вопрос, разберемся с терминами — если в названии есть псевдоклассы и псевдоэлементы, то что значит часть слова "псевдо"? Вот что говорит [dictionary.com](http://dictionary.reference.com/browse/pseudo):

>*прилагательное*
>1. Ненастоящий, но похожий внешне; притворяющийся; ложный или мнимый
>2. Почти такой же или пытающийся быть таким же

Не перегружаясь техническим определением W3C, псевдокласс можно определить, как фантомное состояние или специфическую характеристику элемента, которая может быть выделена с помощью CSS. Наиболее распространенные псевдоклассы это `:link`, `:visited`, `:hover`, `:active`, `:first-child` и `:nth-child`. Существуют и другие псевдоклассы, им мы тоже уделим внимание.

Псевдоклассы в стилях всегда выделяются предшествующим двоеточием  (`:`), затем идет название псевдокласса и иногда значение в скобках.

Псевдоэлементы похожи на виртуальные элементы, которые мы можем обрабатывать как обычные HTML-элементы. Но они не существуют в дереве документа или в DOM, мы создаем их с помощью CSS.

Наиболее распространенные псевдоэлементы это `:after`, `:before` и `:first-letter`, мы рассмотрим их в конце статьи.

## Одно или два двоеточия ставить перед псевдоэлементами?

Короткий ответ для большинства случаев — без разницы.

Двойное двоеточие  (`::`) было добавлено в CSS3, чтобы дифференцировать для различения псевдоэлементов типа `::before` и `::after` от псевдоклассов, таких как `:hover` и `:active`. Все браузеры поддерживают двойное двоеточие, кроме Internet Explorer (IE) 8 и ниже.

При этом некоторые псевдоэлементы, например, `::backdrop` работают только с двойным двоеточием.

Лично я использую одно двоеточие ради совместимости с устаревшими браузерами, разумеется, кроме тех случаев, когда псевдоэлементам требуется двойное двоеточие.

Вы можете выбрать любой вариант, здесь нет однозначного "за" или "против".

Однако спецификация на момент написания статьи [рекомендует использовать одно двоеточие](https://www.w3.org/community/webed/wiki/Advanced_CSS_selectors#CSS3_pseudo-element_double_colon_syntax), по уже упомянутой здесь причине — обратной совместимости.

>Не забывайте, что в CSS3 псевдоэлементы выделяются двойным двоеточием, типа `a::after { … }`, для их отличия от псевдоклассов. Вы можете иногда это видеть в CSS. При этом CSS3 также позволяет использовать одно двоеточие ради обратной совместимости и в настоящее время мы рекомендуем придерживаться этого синтаксиса.

В заголовках этой статьи, псевдоэлементы, поддерживающие оба синтаксиса будут показаны в обоих вариантах, а, соответственно, псевдоэлементы работающие только с двойным двоеточием будут показаны с ним.

## Когда использовать и не использовать генерируемый контент в CSS

Генерируемый контент в CSS  реализуется с помощью комбинации свойства `content` с псевдоэлементами `:before` или `:after`.

Контентом может быть простой текст или контейнер, которым мы манипулируем при помощи CSS, чтобы выводить [графическую форму или декоративный элемент](http://codepen.io/ricardozea/pen/sdlvu). Здесь я буду говорить о первом типе контента — тексте.

Генерируемый контент не стоит использовать для важного текста по следующим причинам:

* Он будет недоступен скрин-ридерам;
* Он будет невыделяем;
* Если генерируемый контент использует излишнее содержание для украшения, скрин-ридеры будут читать его, что ухудшит впечатления пользователей.

Используйте генерируемый контент для декорации и незначительного текста, но убедитесь, что он правильно обрабатывается скрин-ридерами, чтобы использующие эту технологию не отвлекались на него. Основывайтесь на методике "прогрессивного улучшения", когда собираетесь использовать генерируемый контент.

На  Smashing Magazine есть отличная статья Габриеля Романато об использовании генерируемого контента.

## Экспериментальные псевдоклассы и псевдоэлементы

Экспериментальными называют те псевдоклассы и псевдоэлементы, чья спецификация еще не стабильна и не окончательна. Их синтаксис и поведение еще могут измениться.

Однако мы можем использовать экспериментальные псевдоклассы и псевдоэлементы с помощью вендорных префиксов; о поддержке вы можете узнать с помощью [Can I Use](http://caniuse.com/), а для удобства работы есть такие инструменты как [-prefix-free](https://www.smashingmagazine.com/2011/10/prefixfree-break-free-from-css-prefix-hell/) или [Autoprefixer](https://autoprefixer.github.io/).

В этой статье у всех экспериментальных псевдоклассов и псевдоэлементов будет соответствующая пометка.

## Псевдоклассы

Мы начнем с псевдоклассов для определенных состояний.

### Псевдоклассы состояний

Псевдоклассы состояний обычно применяются после  действий пользователя. При этом "действием" может считаться и отсутствие действия, например, в случае с непосещенной ссылкой.

Итак, рассмотрим их.

#### :link


Псевдокласс `:link` представляет нормальное состояние ссылок и используется для выделения ссылок, которые до сих пор не посещены. В стилях рекомендуется объявлять этот псевдокласс перед всеми остальными классами этой категории. Полный порядок псевдоклассов такой: `:link`, `:visited`, `:hover` и `:active`.

```css
a:link {
    color: orange;
}
```

Этот псевдокласс можно  пропустить:

```css
a {
    color: orange;
}
```

#### :visited

Псевдокласс `:visited` используется для стилизации ссылок, уже посещенных пользователем. В стилях он указывается вторым, после псевдокласса `:link`:

```css
a:visited {
    color: blue;
}
```

#### :hover

Псевдокласс `:hover` используется для стилизации элемента, на который в данный момент наведен курсор. Это может быть любой элемент, хотя применение этого псевдокласса для ссылок является самым распространенным случаем.

```css
a:hover {
    color: orange;
}

```

<p data-height="466" data-theme-id="0" data-slug-hash="vGEzJK" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/vGEzJK/">CSS :hover pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>


#### :active

Псевдокласс `:active` используется для стилизации "активированных" элементов, путем нажатия мыши или касания к экрану. Активация также может производиться и с клавиатуры, также как в случае с псевдоклассом `:focus`.

Он и работает аналогично `:focus`, с единственной разницей, что псевдокласс `:active` фиксирует событие между нажатием и отпусканием клавиши мыши.

Оно следует четвертым в стилях (после `:hover`).

```css
a:active {
    color: rebeccapurple;
}
```

#### :focus

Псевдокласс `:focus` используется для стилизации элемента, получившего фокус с помощью курсора, касания или нажатия на клавиатуре. Он часто используется в элементах форм.

```css
a:focus {
    color: green;
}

```

Или:

```css
input:focus {
    background: #eee;
}

```

### Бонус: миксин Sass для ссылок

Если вы используете препроцессоры CSS, типа Sass, этот раздел должен заинтересовать вас. Если вы их не используете (не бойтесь, это нормально), вы можете пропустить его.

Итак, в духе оптимизации нашего рабочего процесса, ниже показан миксин Sass, позволяющий создать базовый набор ссылок.

Идея миксина состоит в отсутствии настроек по умолчанию в качестве аргументов, мы просто декларируем все 4 состояния ссылок.

Псевдоклассы `:focus` и `:active` обычно декларируются вместе, но при желании вы можете разделить их.

Учтите, этот миксин может быть применен к любому элементу HTML, не только к ссылкам. Вот он:

```scss
@mixin links ($link, $visited, $hover, $active) {
    & {
        color: $link;
        &:visited {
            color: $visited;
        }
        &:hover {
            color: $hover;
        }
        &:active, &:focus {
            color: $active;
        }
    }
}

```

Использование:

```scss
a {
    @include links(orange, blue, yellow, teal);
}

```

Скомпилированный результат:

```css
a {
  color: orange;
}
a:visited {
  color: blue;
}
a:hover {
  color: yellow;
}
a:active, a:focus {
  color: teal;
}
```

Демо:

<p data-height="466" data-theme-id="0" data-slug-hash="wMyZQe" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/wMyZQe/">Sass Mixin for Links</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Структурные псевдоклассы

Структурные псевдоклассы направлены на дополнительные данные в дереве документа или DOM и не могут быть заменены другим типом селекторов или их комбинацией.

#### :first-child

Псевдокласс `:first-child` выделяет элемент, который является первым потомком своего родительского элемента.

В следующем примере только первый элемент `li` будет выделен оранжевым текстом.

```markup
<ul>
    <li>This text will be orange.</li>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
</ul>
```

```css
li:first-child {
    color: orange;
}

```

#### :first-of-type

Псевдокласс `:first-of-type` выделяет первый элемент своего типа в  указанном родительском контейнере.

В следующем примере первый элемент `li` и первый элемент `span` будут выделены оранжевым цветом.

```markup
<ul>
    <li>This text will be orange.</li>
    <li>Lorem ipsum dolor sit amet. <span>This text will be orange.</span></li>
    <li>Lorem ipsum dolor sit amet.</li>
</ul>

```

```css
ul :first-of-type {
    color: orange;
}

```

#### :last-child

Псевдокласс `:last-child` выделяет элемент, которыя является последним дочерним элементом в родительском контейнере.

В следующем примере, последний элемент `li` будет выделен оранжевым цветом.

```markup
<ul>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>This text will be orange.</li>
</ul>
```

```css
li:last-child {
    color: orange;
}
```

#### :last-of-type

Псевдокласс `:last-of-type` выделяет последний элемент своего типа в родительском контейнере.

В следующем примере, текст в последнем `li`  и последнем `span` будет оранжевым.

```markup
<ul>
    <li>Lorem ipsum dolor sit amet. <span>Lorem ipsum dolor sit amet.</span> <span>This text will be orange.</span></li>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>This text will be orange.</li>
</ul>
```

```css
ul :last-of-type {
    color: orange;
}
```

#### :not

Псевдокласс `:not` также известен как псевдокласс-отрицание. Он принимает в скобках аргумент — другой селектор. Этим аргументом может быть и другой псевдокласс. Аргументы могут составлять цепочку, но сам `:not` не может в этой цепочке передаваться в качестве аргумента.

В следующем примере, псевдокласс `:not` выберет все элементы, не подпадающее под селектор-аргумент. Оранжевым будет весь текст, кроме элемента `li` с классом `.first-item`:

```markup
<ul>
    <li class="first-item">Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
</ul>
```

```css
li:not(.first-item) {
    color: orange;
}

```

Теперь попробуем сделать цепочку из двух псевдоклассов `:not`. У всех элементов будет черный цвет и желтый фон, кроме элемента `li` с классом `.first-item` и последнего `li` в списке.

```css
li:not(.first-item):not(:last-of-type) {
    background: yellow;
    color: black;
}
```

**Демо**

<p data-height="466" data-theme-id="0" data-slug-hash="dGmqbg" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true"  class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/dGmqbg/">CSS :not pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :nth-child

Псевдокласс `:nth-child` выделяет один или более элементов в зависимости от их порядкового номера в разметке.

Это один из самых универсальных и надежных псевдоклассов в CSS.

Все псевдоклассы `:nth` принимают аргумент в виде формулы в скобках. Формула может быть просто целым числом, может структурироваться в виде `an+b` или использовать ключевое слово `odd` или `even`.

В формуле `an+b`:

* `a` это целое число;
* `n` это литерал (т.е. мы просто используем букву `n` внутри формулы);
* `+` это оператор (это может быть как `+`, так и `-`);
* `b` это целое число, используемое только при использовании оператора.

Вот список с греческим алфавитом, на базе которого мы сделаем несколько примеров:

```markup
<ol>
    <li>Alpha</li>
    <li>Beta</li>
    <li>Gamma</li>
    <li>Delta</li>
    <li>Epsilon</li>
    <li>Zeta</li>
    <li>Eta</li>
    <li>Theta</li>
    <li>Iota</li>
    <li>Kappa</li>
</ol>
```

Выделим второй элемент в списке, только "Beta" будет оранжевой:

```css
ol :nth-child(2) {
    color: orange;
}
```

Теперь выделим все элементы с порядковыми номерами, кратными двум. Оранжевыми будут “Beta,” “Delta,” “Zeta,” “Theta” и “Kappa”:

```css
ol :nth-child(2n) {
    color: orange;}
```

Те же самые четные элементы можно выделить и с помощью ключевого слова `even`:

```css
ol :nth-child(2n+6) {
    color: orange;
}
```

А теперь выберем все элементы кратные двум, начиная с шестого. Итак, оранжевыми будут “Zeta,” “Theta” и “Kappa”.

```css
ol :nth-child(2n+6) {
    color: orange;
}
```

**Демо**

<p data-height="466" data-theme-id="0" data-slug-hash="adYaER" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/adYaER/">CSS :nth-child() pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :nth-last-child

Псевдокласс `:nth-last-child`  работает аналогично `:nth-child`, но выбирает элементы не с начала, а с конца.

Продолжим мучать греческий алфавит. Выберем второй элемент с конца — оранжевой у нас будет только “Iota”:

```css
ol :nth-last-child(2) {
    color: orange;
}
```

Теперь выберем все дочерние элементы по порядковому номеру с конца, кратному двум. Это будут Iota,” “Eta,” “Epsilon,” “Gamma” и “Alpha”:

```css
ol :nth-last-child(2n) {
    color: orange;
}
```

Теперь выделим их же с помощью ключевого слова:

```css
ol :nth-last-child(even) {
    color: orange;
}
```

И, наконец. выберем все элементы с конца кратные двум начиная с шестого. “Epsilon,” “Gamma” и “Alpha”!

```css
ol :nth-last-child(2n+6) {
    color: orange;
}
```

#### :nth-of-type

Псевдокласс `:nth-of-type` схож с `:nth-child` с той разницей, что он обладает большей специфичностью, так как выбирает конкретный тип элемента внутри родительского контейнера.

В следующем примере, оранжевый цвет будет у второго параграфа.

```markup
<article>
    <h1>Heading Goes Here</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <a href=""><img src="images/rwd.png" alt="Mastering RWD"></a>
    <p>This text will be orange.</p>
</article>
```

```css
p:nth-of-type(2) {
    color: orange;
}
```

#### :nth-last-of-type

Псевдокласс `:nth-last-of-type` делает то же, что и `:nth-of-type`, но отсчитывая с конца.

В следующем примере мы будем выбирать второй параграф с конца (это будет первый параграф в статье):

```markup
<article>
    </h1>Heading Goes Here</article>/h1>
    </p>This text will be orange.</p>
    </a href="#"><img src="images/rwd.png" alt="Mastering RWD"></a>
    </p>Lorem ipsum dolor sit amet.</p>
</article>
```

```css
p:nth-last-of-type(2) {
    color: orange;
}

```

**Дополнительные ресурсы по классам семейства `:nth`**

* “[CSS3 Structural Pseudo-Class Selector Tester](http://lea.verou.me/demos/nth.html)”, Ли Веру;
* “[:nth Tester](https://css-tricks.com/examples/nth-child-tester/)”, CSS-Tricks

#### :only-child

Псевдокласс `:only-child` выбирает  единственного потомка родительского элемента.

В следующем примере, в первом `ul` есть только один элемент, который будет выделен оранжевым. В следующем `ul` несколько потомков, поэтому их этот селектор не затронет.

```markup
<ul>
    <li>This text will be orange.</li>
</ul>

<ul>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
</ul>
```

```css
ul :only-child {
    color: orange;
}
```


#### :only-of-type

Псевдокласс `:only-of-type` выбирает элемент, у которого нет соседних элементов того же типа. Он похож на `:only-child`, но более осмыслен за счет указания конкретного элемента.

В следующем примере в первом `ul` только один элемент списка, который и будет выделен оранжевым.

```markup
<ul>
    <li>This text will be orange.</li>
</ul>

<ul>
    <li>Lorem ipsum dolor sit amet.</li>
    <li>Lorem ipsum dolor sit amet.</li>
</ul>
```

```css
li:only-of-type {
    color: orange;
}
```


#### :target

Псевдокласс `:target` выбирает элемент, ID которого используется в качестве  хэша в URL.

В следующем примере, статья с ID `target` будет выделяться, когда URL в адресной строке будет завершаться на `#target`.

**URL:`http://awesomebook.com/#target`**

```markup
<article id="target">
    <h1><code>:target</code> pseudo-class</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
</article>
```

```css
:target {
    background: yellow;
}
```

Совет: короткая запись `background` в стилях успешно заменяет `background-color`.

### Псевдоклассы валидации

Формы всегда были ядом веб-дизайна и веб-разработки. С помощью псевдоклассов валидации, мы можем сделать процесс заполнения форм более плавным и приятным.

Заметьте, что несмотря на то, что большинство псевдоклассов этого раздела работают с элементами форм, некоторые из них могут работать и с другими элементами HTML.

#### :checked

Псевдокласс `:checked` выбирает радиокнопки, чекбоксы и опции, которые были отмечены пользователем.

В следующем примере, при выделении пользователем чекбокса, его метка подсвечивается, что улучшает интерфейс.

**Демо**

<p data-height="466" data-theme-id="0" data-slug-hash="wMYExY" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true"  class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/wMYExY/">CSS :checked pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :default

Псевдокласс `:default` выбирает элемент, заданный в качестве дефолтного в группе похожих элементов.

В случае, если вам надо выбрать кнопку по умолчанию в форме с незаданным классом, вы можете использовать псевдокласс `:default`.

Учитывайте, что наличие кнопки “Reset” или “Clear” в форме создает проблемы с юзабилити. Подробнее об этом можно прочитать в следующих статьях.

* “[Reset and Cancel Buttons](http://www.nngroup.com/articles/reset-and-cancel-buttons/)”, Nielsen Norman Group (2000)
* “[Killing the Cancel Button on Forms for Good](http://uxmovement.com/forms/killing-the-cancel-button-on-forms-for-good/)”, UX Movement (2010)

**Демо**

<p data-height="466" data-theme-id="0" data-slug-hash="WrzJKO" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/WrzJKO/">CSS :default pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :disabled

Псевдокласс `:disabled` выбирает отключенный элемент формы (элемент, который пользователь не может выделить, отметить, активировать или перенести на него фокус).

В следующем примере поле ввода `name`, поэтому оно будет выведено наполовину прозрачным.

```markup
<input type="text" id="name" disabled>
```

```css
:disabled {
    opacity: .5;
}
```

**Совет:** в разметке не обязательно писать `disabled="disabled"`, того же результата можно достичь просто использовав атрибут `disabled`. Однако полная запись необходима в  XHTML.

**Демо:**

<p data-height="266" data-theme-id="0" data-slug-hash="NxOLZm" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/NxOLZm/">CSS :disabled pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :empty

Псевдокласс `:empty` выбирает элементы, в которых нет никакого содержимого. Если в элемент есть другой элемент HTML, символ или пробел, элемент не считается пустым.

Вот более полные определения:

Пустой элемент

: Нет содержимого или каких-либо символов. Комментарии HTML содержимым не считаются.

Не пустой элемент

: В элементе есть какие-либо символы, даже невидимые, например, пробел.

В следующем примере:

* В верхнем контейнере есть текст, поэтому у него  будет оранжевый фон;
* Во втором контейнере есть пробел, который считается контентом, его фон также будет оранжевым;
* В третьем контейнере нет ничего — он пустой и поэтому у него желтый фон.
* В последнем контейнере есть комментарий HTML, который не считается контентом и поэтому у контейнера желтый фон.

```markup
<div>This box is orange</div>
<div> </div>
<div></div>
<div><!-- This comment is not considered content --></div>
```

```css
div {
  background: orange;
  height: 30px;
  width: 200px;
}

div:empty {
  background: yellow;
}

```

**Демо:**

<p data-height="266" data-theme-id="0" data-slug-hash="rxqqaM" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/rxqqaM/">CSS :empty pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :enabled

Псевдокласс `:enabled` выбирает элементы, включенные для пользователя; по умолчанию все элементы  формы включены, если в разметке им не задан атрибут `disabled`.

Мы можем использовать комбинацию `:enabled` и `:disabled`, чтобы обеспечить визуальную обратную связь, улучшая тем самым пользовательский опыт.

В следующем примере, ранее отключенное поле ввода `name` включено, к нему добавлена однопиксельная граница зеленого цвета и полная непрозрачность.

```css
:enabled {
    opacity: 1;
    border: 1px solid green;
}
```

**Совет:** использование в разметке `enabled="enabled"` не требуется, достаточно просто `enabled`; исключением является только  XHTML.

**Демо:**

<p data-height="466" data-theme-id="0" data-slug-hash="zqYQxq" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/zqYQxq/">CSS :enabled pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :in-range

Псевдокласс `:in-range` выбирает элементы,  которым задан диапазон и  значение, которых входит в этот диапазон.

В следующем примере поле ввода поддерживает диапазон между 5 и 10, все значения между ними вызовут измение цвета границы поля на зеленый.

```markup
<input type="number" min="5" max="10">
```

```css
input[type=number] {
    border: 5px solid orange;
}

input[type=number]:in-range {
    border: 5px solid green;
}
```

**Демо:**

<p data-height="466" data-theme-id="0" data-slug-hash="XXOKwq" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/XXOKwq/">CSS :in-range and :out-of-range pseudo-classes</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :out-of-range

Псевдокласс `:out-of-range` выбирает элемент, у которого есть диапазон и значение которого не входит в этот диапазон

В следующем примере поле ввода поддерживает диапазон от 1 до 12 — для всех остальных значений будет задан оранжевый цвет границы поля.

```markup
<input id="months" name="months" type="number" min="1" max="12">
```

```css
input[type=number]:out-of-range {
    border: 1px solid orange;
}

```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="XXOKwq" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/XXOKwq/">CSS :in-range and :out-of-range pseudo-classes</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>



#### :indeterminate

Псевдокласс `:indeterminate` выбирает элементы ввода типа радиокнопок и чекбоксов, которые не выделены или выделение которых снято после загрузки страницы.

Образцом этого можно назвать загрузку страницы с радиокнопками, ни одна из которых не выбрана по умолчанию или ситуацию, когда свойство `indeterminate` задается чекбоксу с помощью JavaScript.

```markup
<ul>
    <li>
        <input type="radio" name="list" id="option1">
        <label for="option1">Option 1</label>
    </li>
    <li>
        <input type="radio" name="list" id="option2">
        <label for="option2">Option 2</label>
    </li>
    <li>
        <input type="radio" name="list" id="option3">
        <label for="option3">Option 3</label>
    </li>
</ul>
```


```css
:indeterminate + label {
    background: orange;
}
```

**Демо:**

<p data-height="466" data-theme-id="0" data-slug-hash="adXpQK" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/adXpQK/">CSS :indeterminate pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :valid

Псевдокласс `:valid` выбирает элемент формы, если она заполнена корректно в соответствии с требуемым форматом.

В следующем примере поле ввода `email` отформатировано правильно, поэтому оно будет считаться валидным и, соответственно, получит однопиксельную зеленую границу.

```css
input[type=email]:valid {
    border: 1px solid green;
}
```


#### :invalid

Псевдокласс `:invalid` выбирает элемент формы, если она заполнена некорректно в соответствии с требуемым форматом.

В следующем примере, поле ввода `email` отформатировано неправильно, поэтому оно будет считаться невалидным и, соответственно, получит однопиксельную оранжевую границу.

**Демо:**

<p data-height="466" data-theme-id="0" data-slug-hash="bEzqVg" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/bEzqVg/">CSS :valid and :invalid pseudo-classes</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :optional

Псевдокласс `:optional` выбирает поля ввода, которые не являются обязательными. Другими словами, любой элемент `input` без атрибута `required` будет выбран псевдоклассом `:optional`.

В следующем примере поле ввода опционально — у него нет атрибута `required`  и поэтому текст в этом поле будет серым.

```markup
<input type="number">
```

```css
:optional {
    color: gray;
}
```

#### :read-only

Псевдокласс `:read-only` выбирает элемент, которые не может быть отредактирован пользователем. Он похож на `:disabled` — и выбор между ними зависит от использованного атрибута в разметке.

Этот псевдокласс может быть полезен, например, в форме с предварительно заполненной информацией, которую нельзя изменить, но которую надо показать пользователю.

В следующем примере у элемента `input` есть атрибут `readonly`. Мы выделим этот элемент серым цветом благодаря псевдоклассу `:read-only`.

```markup
<input type="text" value="I am read only" readonly>
```

```css
input:read-only {
    color: gray;
}
```

**Демо:**

<p data-height="466" data-theme-id="0" data-slug-hash="Nxopbj" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/Nxopbj/">CSS :read-only pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :read-write

Псевдокласс `:read-write` выбирает элементы, которые могут редактироваться пользователем. Он может  работать со всеми элементами  HTML с атрибутом `contenteditable`.

Этот псевдокласс можно сочетать с псевдоклассом `:focus` для улучшения пользовательского опыта в определенных ситуациях.

В следующем примере, пользователь может после щелчка мышью редактировать содержимое элемента `div`. Мы облегчим пользователю понимание этого, добавив стили, отличающие редактируемую часть контента от всего остального.

```markup
<div class="editable" contenteditable>
    <h1>Click on this text to edit it</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</p>
</div>
```

```css
:read-write:focus {
    padding: 5px;
    border: 1px dotted black;
}
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="LGqWxK" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/LGqWxK/">CSS :read-write pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :required

Псевдокласс `:required` выбирает поля ввода, которым задан атрибут `required`.

В дополнение к традиционному астериску  (*), которым обычно отмечают обязательные поля, мы можем добавить стили CSS, таким образом мы берем лучшее из двух миров.

В следующем примере, у поля ввода есть атрибут `required`. Мы можем улучшить впечатления пользователя, соответствующим стилем показав обязательность поля.

```markup
<input type="email" required>
```

```css
:required {
    color: black;
    font-weight: bold;
}
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="KVJWmZ" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/KVJWmZ/">CSS :required pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :scope (эксп.)

Псевдокласс `:scope` имеет смысл, когда он привязан к HTML-атрибуту [scoped](http://html5doctor.com/the-scoped-attribute/) тега `style`.

Если этого атрибута у тега `style` нет в разделе страницы, значит этот псевдокласс выберет элемент `html`, который является зоной видимости для стилей по умолчанию.

В следующем примере, у блока HTML есть стили с атрибутом `scoped`, поэтому весь текст второго элемента `section` будет выделен курсивом.

```markup
<article>
    <section>
        <h1>Lorem ipsum dolor sit amet</h1>
        <p>Lorem ipsum dolor sit amet.</p>
    </section>
    <section>
        <style scoped>
                        :scope {
                            font-style: italic;
                        }
                  </style>
        <h1>This text will be italicized</h1>
        <p>This text will be italicized.</p>
    </section>
</article>
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="ZQobzz" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/ZQobzz/">CSS :scope pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Псевдоклассы, связанные с языком страницы

Языковые псевдоклассы связаны с текстом, содержащимся на странице. Они не работают с медиа-контентом типа изображений или видео.

#### :dir (эксп.)

Псевдокласс `:dir` выбирает элемент, направленность текста в котором определена в документе. Другими словами, чтобы использовать этот псевдокласс, нам надо в разметке у соответствующего элемента добавить атрибут `dir`.

На данный момент поддерживается два направления текста: `ltr `(слева направо) и `rtl` (справа налево).

На момент написания статьи только Firefox (с префиксом `-moz-dir()`)  поддерживается псевдокласс `:dir`. В будущем префикс, скорее всего, будет не нужен, поэтому в примерах селектор задан как с префиксом, так и без него.

**Примечание:** Сочетание префиксной и безпрефиксной версий в одном правиле не работает. Надо создавать два отдельных правила.

В следующем примере оранжевым цветом будет выделен параграф на арабском (как известно, текст в нем пишется справа налево).

```markup
<article dir="rtl">
    <p>التدليك واحد من أقدم العلوم الصحية التي عرفها الانسان والذي يتم استخدامه لأغراض الشفاء منذ ولاده الطفل.</p>
</article>
```

```css
/* prefixed */
article :-moz-dir(rtl) {
    color: orange;
}

/* unprefixed */
article :dir(rtl) {
    color: orange;
}

```

В англоязычном параграфе (слева направо) текст будет синим.

```markup
<article dir="ltr">
    <p>If you already know some HTML and CSS and understand the principles of responsive web design, then this book is for you.</p>
</article>
```

```css
/* prefixed */
article :-moz-dir(ltr) {
    color: blue;
}

/* unprefixed */
article :dir(ltr) {
    color: blue;
}
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="adrxJy" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/adrxJy/">CSS :dir() pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### :lang

Псевдокласс `:lang` выбирает элемент с указанным языком. Язык может быть задан с помощью атрибута `lang=""`, соответствующего элемента `meta` или же в HTTP-заголовках.

Атрибут `lang=""` обычно используется с тегом `html`, но он также может применяться и к любому другому тегу.

Для чего этом можно использовать? Например, общей практикой является использование традиционных для каждого языка кавычек  с помощью свойства CSS `quotes`. Однако большинство браузеров (включая IE9 и выше) способны добавлять нужные кавычки автоматически, если они не объявлены в CSS.

В зависимости от обстоятельств, это может помогать или мешать, так как есть разница между кавычками, автоматически добавляемыми браузером по умолчанию и обычно используемыми кавычками, добавленными в CSS.

Вот, например, немецкие кавычки, добавленные браузером:

>„Lorem ipsum dolor sit amet.“

Однако, в большинстве случаев, немецкие кавычки добавленные в CSS выглядят так:

>»Lorem ipsum dolor sit amet.«

Верными являются оба варианта. Поэтому решение остается за вами — отдать ли выбор кавычек на усмотрение браузера или использовать псевдокласс `:lang` и свойство CSS `quotes`.

Давайте добавим кавычки с помощью CSS.

```markup
<article lang="en">
    <q>Lorem ipsum dolor sit amet.</q>
</article>
<article lang="fr">
    <q>Lorem ipsum dolor sit amet.</q>
</article>
<article lang="de">
    <q>Lorem ipsum dolor sit amet.</q>
</article>

```


```css
:lang(en) q { quotes: '“' '”'; }
:lang(fr) q { quotes: '«' '»'; }
:lang(de) q { quotes: '»' '«'; }
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="gPJyvJ" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/gPJyvJ/">CSS :lang() pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Остальные псевдоклассы

Теперь перейдем к оставшемся псевдоклассам и их функциональности

#### :root

Псевдокласс `:root` ссылается на высший родительский элемент в документе.

Виртуально во всех случаях в роли `:root` будет элемент `html`. Однако это может быть и другой элемент, если используется другой язык разметки, такой как SVG или XML.

Давайте добавим фоновый цвет к элементу `html`.

```css
:root {
    background: orange;
}

```

**Примечание:** мы можем добиться того же эффекта, использовав в качестве селектора `html`. Но так как `:root` псевдокласс у него большая специфичность, чем у селектора элемента.

#### :fullscreen (эксп.)

Псевдоклассс `:fullscreen` выбирает элемент, выведенный на всю ширину экрана.

Однако, он не рассчитан на работу при нажатии пользователем F11 и переходе браузера в полноэкранный режим. Он скорее ориентирован на работу с JavaScript Fullscreen API, предназначенном для изображений, видео и игр, выполняющихся в родительском контейнере.

О переходе в полноэкранный режим выводится сообщение в верхней части браузера, вернуться из него можно нажав клавишу `Escape`. Мы сталкиваемся с этим при просмотре видео в максимальном размере на YouTube или Vimeo.

Если вы собираетесь использовать псевдокласс `:fullscreen`, учитывайте, что стили браузеров в этом режиме очень различны. И вам придется использвать браузерные префиксы не только в CSS, но и в JavaScript. Я рекомендую использовать библиотеку Эрнан Райчерта [screenfull.js](https://github.com/sindresorhus/screenfull.js/), решающую большую часть проблем с кроссбраузерными глюками.

Рассмотрение Fullscreen API  находится за пределами этой статьи, вот сниппет, который будет работать в браузерах на движках WebKit и Blink.

```markup
<h1 id="element">This heading will have a solid background color in full-screen mode.</h1>
<button onclick="var el = document.getElementById('element'); el.webkitRequestFullscreen();">Trigger full screen!</button>
```

```css
h1:fullscreen {
    background: orange;
}
```


**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="ZQNZqy" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/ZQNZqy/">CSS :fullscreen pseudo-class</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Псевдоэлементы

Как упоминалось в начале статьи, псевдоэлементы можно сравнить с виртуальными элементами, которые можно обрабатывать как обычные элементы HTML. Они не существуют в дереве документа или в DOM, это значит, что мы их создаем с помощью CSS.

Также напомню, что разница между двойным и одиночным доветочиями это просто визуальное различие между псевдоэлементами стандартов CSS 2.1 и CSS3, вы можете свободно использовать любой вариант.

#### ::before/:before

Псевдоэлемент `:before`, также как и его сосед `:after` добавляет содержимое (текст или форму) к другому элементу HTML. Еще раз отмечу, что этого контента нет в DOM, но им можно манипулировать, как будто он есть. Свойство `content` надо добавлять в CSS.

Запомните, что добавленный в псевдоэлемент текст нельзя выделить.

```markup
<h1>Ricardo</h1>
```

```css
h1:before {
    content: "Hello "; /* Note the space after the word Hello. */
}
```

В результате будет выведено:

>Hello Ricardo!

**Примечание:** Обратили внимание на пробел после “Hello ”? Да, о пробелах надо позаботиться самостоятельно.

#### ::after/:after

Псевдоэлемент `:after` также используется для добавления содержимого (текста или формы) к другому элементу HTML. Этот контент отсутствует в DOM, но им можно манипулировать, как будто он есть; свойство `content` надо добавлять в CSS. Текст, добавленный в псевдоэлемент, нельзя выделить.

```markup
<h1>Ricardo</h1>
```

```css
h1:after {
    content: ", Web Designer!";
}
```

В результате будет выведено:

>Ricardo, Web Designer!

#### ::backdrop (эксп.)

Псевдоэлемент `::backdrop` это бокс, генерируемый перед полноэкранным элементом, расположенным над всем остальным контентом. Он используется в сочетании с псевдоклассом `:fullscreen` для изменения цвета фона максимизированного окна — если вас не устраивает дефолтный черный.

**Примечание:** для псевдоэлемента `::backdrop` обязательно двойное двоеточие, иначе он не работает.

Разовьем наш пример с псевдоклассом `:fullscreen`:

```markup
<h1 id="element">This heading will have a solid background color in full-screen mode.</h1>
<button onclick="var el = document.getElementById('element'); el.webkitRequestFullscreen();">Trigger full screen!</button>
```

```css
h1:fullscreen::backdrop {
    background: orange;
}
```

**Демо:**

<p data-height="465" data-theme-id="0" data-slug-hash="bEPEPE" data-default-tab="result" data-user="ricardozea" data-embed-version="2" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/ricardozea/pen/bEPEPE/">CSS ::backdrop pseudo-element</a> by Ricardo Zea (<a href="http://codepen.io/ricardozea">@ricardozea</a>) on <a href="http://codepen.io">CodePen</a>.</p>

#### ::first-letter/:first-letter

Псевдоэлемент `:first-letter` выбирает первый символ на строке текста. Если перед текстом есть элемент типа изображения, видео или таблицы, он не влияет на текст и первая буква по-прежнему выбирается из текста.

Это отличная вещь для использования в параграфах, для повышения типографской привлекательности без использования изображений и внешних ресурсов.

**Совет:** этот псевдоэлемент способен захватывать первую букву, сгенерированного контента в `:before`, несмотря на его отсутствие в DOM.

```css
h1:first-letter  {
    font-size: 5em;
}

```


#### ::first-line/:first-line

Псевдоэлемент `:first-line` выбирает первую строку в элементе. Он  не работает со строчными элементами, только с блочными.

При использовании в параграфе, например, только первая строка будет стилизована, даже если текст обтекает другой элемент.

```css
p:first-line {
    background: orange;
}
```

#### ::selection

Псевдоэлемент `::selection` используется для стилизации выделенного текста. Браузеры на движке Gecko пока используют версию с префиксом `::-moz-selection`.

**Примечание:** сочетание в одном правиле синтаксиса с префиксом и без префикса не работает, надо создавать два отдельных правила.

```css
::-moz-selection {
    color: orange;
    background: #333;
}

::selection  {
    color: orange;
    background: #333;
}
```

#### ::placeholder (эксп.)

Псевдоэлемент `::placeholder` выбирает текст, добавленный в качестве заглушки в элементы формы с помощью атрибута `placeholder`.

Его также можно указывать как `::input-placeholder`, этот синтаксис фактически и используется в CSS.

**Примечание:** этот элемент еще не является частью стандарта, с большой вероятностью его имплементация изменится в будущем, поэтому используйте его с осторожностью.

В некоторых браузерах (IE 10 и Firefox до версии 18), псевдоэлемент `::placeholder` реализован как псевдокласс, но во всех остальных браузерах это псевдоэлемент, поэтому если вы не поддерживаете старые версии Firefox и  IE 10, вы будете писать примерно такой код:

```markup
<input type="email" placeholder="name@domain.com">
```

```css
input::-moz-placeholder {
    color:#666;
}

input::-webkit-input-placeholder {
    color:#666;
}

/* IE 10 only */
input:-ms-input-placeholder {
    color:#666;
}

/* Firefox 18 and below */
input:-moz-input-placeholder {
    color:#666;
}

```

## Заключение

Итак, похоже, это все.

Псевдоклассы и псевдоэлементы CSS однозначно удобны, не так ли? Они дают такое количество возможностей, что вы чувствуете себя перегруженными. Но в этом все жизнь веб-дизайнеров и разработчиков.

Тщательно тестируйте код. Хорошо реализованные псевдоклассы и псевдоэлементы должны пройти долгий путь.
