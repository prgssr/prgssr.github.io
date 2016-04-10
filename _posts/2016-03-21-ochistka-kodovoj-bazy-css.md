---
title: "Очистка кодовой базы CSS"
layout: post
categories: [development]
tags: [sass, css, translation, sitepoint]
date: 2016-03-21 22:38:21 +0300
prism: yes
description: "Хьюго Жирадель о способах расчистки кода CSS в запущенных случаях"
original: "http://www.sitepoint.com/cleaning-up-a-css-codebase/"
original_title: "Cleaning Up a CSS Codebase"
original_author: "Хьюго Жирадель"
thumbnail: "noimage"
---

Вы только что присоединились к существующему проекту для замены уходящего разработчика. А может просто занялись  своим старым проектом спустя несколько лет. Вы ощущаете ужас и отвращение при взгляде на код. Вы можете сделать только одно: расчистить весь этот бардак. Вы уже сталкивались с чем-то подобным? Почти наверняка, рано или поздно с этим сталкиваются все.

Вы знаете, что очистка кода CSS это объемная задача. Нужно сделать многое за ограниченное время — особенно, когда  клиенты/начальники/коллеги настойчиво советуют не трогать то, что работает. Вы даже не знаете с чего начать.

Но сегодня удача на вашей стороне — я готов поделиться с вами своими решениями по очистке кода и дать вам советы по их использованию. На самом деле все сводится к простейшим вещам.

## Линтинг это наше все

В этом разделе я буду исходить из того, что вы используете [Sass](http://sass-lang.com/). И не только потому, что это разумное предположение в нынешних условиях, но также по причине того, что неправильное использование Sass часто является причиной загрязнения кодовой базы. Хотя эта статья будет полезна и тем, кто не пользуется препроцессорами, поэтому вам стоит дочитать ее до конца.

Первое, что я привык делать, когда мне надо разобраться с кодовой базой это  [линтинг]({% post_url 2015-09-22-pristupaem-k-rabote-s-scss-lint %}). Линтинг это процесс выполнения программы, осуществляющей поиск потенциальных ошибок и плохих практик. Я верю, что делая код чистым мы делаем  первый шаг к хорошему коду. С этимологией слова линтинг можно ознакомится [в этом треде в StackOverflow](http://stackoverflow.com/questions/8503559/what-is-linting).

В Sass есть написанный на Ruby линтер, называемый [SCSS-lint](https://github.com/brigade/scss-lint). Вы можете настроить его самостоятельно или скачать конфигурацию, [рекомендованную Sass-Guidelines](http://sass-guidelin.es/#scss-lint), чтобы начать прямо сейчас. Также в Node.js есть  [sass-lint](https://github.com/sasstools/sass-lint), они не на 100% совместимы и могут работать по-разному.

Попробуйте запустить SCSS-Lint  в своем каталоге с файлами Sass для выявления ошибок. Очень высоки шансы на то, что на вас вывалится тонна ошибок. Обычно после этого хочется прекратить эксперименты по очистке кода. Наберитесь терпения. Сейчас вы можете попытаться сделать конфигурацию  менее строгой в отношении правил, не очень важных для вас (типа формата задания цвета) или взять быка за рога и использовать всю мощь линтинга.

## Исправление найденных ошибок

Пришло время исправить, то, что нужно исправить. Это можно сделать двумя способами. Первый — это проверить по очереди все файлы и исправить все ошибки и недочеты типа неудачного именования переменных, излишней вложенности селекторов и плохо отформатированного кода. Второй (предпочитаемый мною) — это использование поиска и замены. Не знаю, как вы, но я обожаю регулярные выражения и мне всегда нравится использовать их в  работе.

Предположим, вы хотите добавить отсутствующий ноль во всех числах с плавающей запятой (то есть от 0 до 1), ошибки такого типа выявляются с помощью правила [LeadingZero](https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md#leadingzero) в SCSS-lint. Для этого надо использовать для поиска регулярное выражение `\s+\.(\d+)` (все цифры, следующие за пробелом с точкой), а для замены `\ 0.$1` (пробел, ноль, точка и найденное число). А если вы озаботились правилом линтера [BorderZero](https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md#borderzero), то вы можете заменить в вашем редакторе с помощью поиска/ замены все правила `border: none` на `border: 0`. Проще простого!

Я недавно создал на GitHub репозиторий  [scss-lint-regex](https://github.com/HugoGiraudel/scss-lint-regex), чтобы собрать все регулярные выражения для линтинга в одном месте. Обязательно взгляните на него, если у вас проблемы с линтингом в большом проекте. И будьте аккуратны с поиском/заменой, временами он приводит к неожиданным побочным эффектам. После каждой замены выполняйте `git diff`, чтобы выявить, что изменилось, это гарантирует, что вы не добавите багов в свой код.

После того, как вы закончите с  редактированием поиском/заменой, вам не удастся избежать ручного редактирования, в тех местах, которые надо облагородить (неправильные отступы, отсутствие или избыток пустых строк, пропущенные пробелы и т.п.). Это занимает много времени, но это здорово поможет вам на следующем этапе, поэтому важно сделать это до перехода к нему.

##### Примечание переводчика

Некоторые из этих вещей можно сделать с помощью плагинов SassBeautify в текстовых редакторах, например, [sublime](https://github.com/badsyntax/SassBeautify) или [atom](https://atom.io/packages/sassbeautify).
{: .info}

## Пересмотр структуры проекта

Вот что меня действительно часто тревожит, когда я присоединяюсь к существующему проекту, так это отсутствие надлежащей архитектуры проекта. Возможно, в самом начале работы и был какой-то проект, но со временем вещи выходят из под контроля и первоначальный замысел теряется. Но это все равно невероятно важно.

Не столь значим выбор методологии проекта, главное, чтобы она у вас была и не вызывала у вас дискомфорт. Это может быть [SMACSS](https://smacss.com/), [7-1](http://sass-guidelin.es/#the-7-1-pattern) или [ITCSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss) — выбор за вами. Попытайтесь реструктурировать свой код в соответствии с выбранной методикой. Я, как правило, использую паттерн 7-1, который мы разработали в Sass Guidelines, поэтому я дам вам несколько советов, которые помогут, если вы выбрали этот путь.

Начните с создания [каталога vendor](http://sass-guidelin.es/#vendors-folder), этот шаг обычно не вызывает вопросов. Перенесите в него все дополнительные библиотеки от сторонних разработчиков (библиотеки, не являющиеся зависимостями для [npm](https://www.npmjs.com/) или [Bundler](http://bundler.io/)).

Затем перейдем к [каталогу abstracts](http://sass-guidelin.es/#abstracts-folder). Все переменные, миксины, функции и плейсхолдеры должны находиться здесь. Вы вольны упорядочивать их как пожелаете, пока вы не разберетесь со всеми переменными и миксинами в вашей кодовой базе. Я на этой стадии также выявляю необязательные переменные (и миксины), ведь часто приходиться  сталкиваться  с переменными, используемыми один или два раза.

После того как вы разобрались с этим, вам придется принять решение, какой из двух следующих шагов сделать раньше. Вы можете попытаться обеспечить, чтобы все содержимое [каталога base](http://sass-guidelin.es/#base-folder) составляли  действительно основные стили, а не стили компонентов. Или проверить, что в [каталоге layout](http://sass-guidelin.es/#layout-folder) находится все, что относится к раскладке страниц и что этот код правильно документирован.

И, наконец, в завершение вам надо заняться компоновкой каталога [components](http://sass-guidelin.es/#components-folder) и обычно это  колоссальная задача. Я советую делать компоненты как можно меньшего размера и ориентироваться на их многократное использование. Не имеет значения, если вы увеличите их количество — главное, чтобы они не зависели от контекста и были простыми для чтения, понимания и обновления.

В качестве примера правильного и небольшого компонента могу привести следующий:

```css
.quote {
  padding: 10px;
}

.quote__attribution {
  font-size: 80%;
}

.quote > :first-child {
  margin-top: 0;
}

.quote > :last-child {
  margin-bottom: 0;
}
```

Старайтесь мыслить модулями. Меньше. Проще. Независимее.

## Удаление лишнего

Я считаю, что самая большая разница между плохим и хорошим CSS это количество кода. CSS очень легко разрастается. Кто-то может делать почти каждую раскладку методом проб и ошибок. Способность делать что-либо, используя минимум CSS требует работы, а сохранение минималистичного подхода является настоящим вызовом.

Прошло уже 3 года, но [этот твит Николаса Галахера](https://twitter.com/necolas/status/251089236873338881) остается моим любимым вопросом о CSS:

[![Within 'bad' CSS, it's very hard to write 'good' CSS. Within 'good' CSS, it's very easy to bolt on 'bad' CSS and initiate code rot.](/images/development/sass/ScreenShot2016-03-15at15-08-20.png)](https://twitter.com/necolas/status/251089236873338881)

Устаревание  это настоящая чума CSS. При написании стилей мы часто ходим туда и обратно, пробуя новые правила — в итоге мы, как правило, оставляем несколько совершенно ненужных деклараций. Например,  `overflow: hidden`, потерявший необходимость или `font-size`, не изменяющий размер шрифта. Оставляя их, мы увеличиваем [технический долг](https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B4%D0%BE%D0%BB%D0%B3).  В этом нет ничего хорошего.

При написании CSS я привык открывать инструменты разработчика в браузера и поочередно отключать каждую декларацию CSS перед отправкой готового кода, чтобы проверить, на что они влияют. Если они не на что не влияют, то я в первую очередь спрашиваю себя: "Зачем они здесь?". Если они оказываются бесполезными, я удаляю их. С такой простой методикой как эта, я гарантирую отправку в репозиторий только полезного кода без мусора.

Очистка кодовой базы CSS это та же техника. Определите компонент, который вы хотите очистить, откройте инструменты разработчика и попытайтесь найти бесполезные декларации. Иногда для удаления кода CSS, нам надо передвинуть эти стили вверх по дереву, чтобы воспользоваться возможностями каскада. Рассмотрим это на следующем лаконичном примере:

```css
.parent {
  /* ...stuff here... */
}

.child-A {
  color: red;
}

.child-B {
  color: red;
}
```

Очевидным способом оптимизации является перемещение декларации `color: red` в родительский селектор, после чего каскадирование сделает за нас остальное. Конечно, реальные примеры обычно более сложны, но и этот пример показывает о том, что не стоит забывать возможности „C“ в аббревиатуре *CSS*{: title="Cascading Style Sheets"}.

## CSS умный и вы должны быть не хуже

Также очень часто встречается нехватка понимания значений `inherit`, `initial` и `currentcolor`. Предположим, вы хотите, чтобы ссылки были того же цвета, что и основной текст (они уже достаточно выделены подчеркиванием). Вот как не надо это делать:

```css
a {
  color: black; /* Nope */
}
```

Причина того, что это решение является неудачным, очевидна: если вы измените цвет `body`, цвет ссылки будет рассинхронизирован с ним. Если вы думаете об использовании переменной, то это лишь сделает все излишне сложным. И, наконец, если ссылка будет размещена внутри элемента с собственным стилем (например, в цитате), она не будет совпадать с ним по цвету.

В CSS есть встроенный способ решения этой проблемы, это значение `inherit`:

```css
a {
  color: inherit; /* Yay! */
}
```

Вот так просто. Благодаря этому ссылки будут наследовать цвет родительского элемента. Который в свою очередь также может наследовать цвет своих предков и так далее. 

Точно также при возвращении свойству дефолтного значения будет плохой идеей задание фиксированного значения. В CSS для таких случаев есть значение `initial`. Обычно оно не имеет отличий от задания фиксированных значений, но есть случаи, когда  действительно играет свою роль, например, при определении направления текста в свойстве `text-align`. При сбросе  `text-align`, значение `left` может испортить текст на RTL-языках (направленных справа налево), выходом будет именно `initial` (еще лучше `start`, но это значение не поддерживается в IE9)/.

Последнее в списке, но не последнее по важности значение это `currentcolor`, очень многие разработчики о нем не знают. Если вы относитесь к их числу, не переживайте, просто спросите у себя: "Если вы не задавали цвет границы элементы, то почему он автоматически совпадает с цветом шрифта элемента?". Да, это происходит потому, что по умолчанию свойству `border-color` задано значение `currentcolor` ([спецификация](https://www.w3.org/TR/css3-background/#the-border-color)). Согласитесь, все очевидно из названия.

На мой взгляд, если вы хотите использовать цвет шрифта элемента, надо использовать `currentcolor` вместо фиксированного значения или переменной Sass.

```css
.element {
  color: deeppink;
  border: 1px solid; /* Color is implicit with `currentcolor` */
}

.element svg {
  fill: currentcolor; /* Fill color will be same as text */
}
```

Это все базовые возможности CSS. Они делают CSS таким как есть. И эти возможности используются на удивление редко. Поэтому, если вы решили улучшить код компонента, не стоит пренебрегать ими.

## Ваш Git должен быть в порядке

Рефакторинг кодовой базы CSS это большая по объему работа. Вам придется обновлять десятки файлов. И вполне вероятно, что вы что-нибудь сломаете в процессе. Давайте будем честны — все делают ошибки и было бы нереально круто, если вам удастся завершить такую работу без какой-нибудь маленькой оплошности.

Поэтому я настойчиво рекомендую вам старательно работать с системой контроля версий (логично предположить, что в этой роли выступает [Git](https://git-scm.com/)). Это значит, что все коммиты делают одну единственную вещь — обеспечивать возвращение на шаг назад от кода с багом без мучений с конфликтами.

![Образец коммитов в Git](/images/development/sass/1456982094gitcommits.png)

Я знаю, что многим людям Git кажется сложным и тяжелым для восприятия, а способы легко освоить его находятся за пределами этой статьи. Поверьте мне: история вашего Git должна быть похожей на поэму, если вы не хотите, чтобы у вас выкипел мозг.

## Заключение

Итак, кратко сформулирую основные тезисы статьи для тех кому лень читать весь текст:

Очистка проекта CSS/Sass сложна потому, что трудно сразу оценить все последствия изменения или удаления строки CSS. Это все в основном из-за плохой тестируемости CSS. Поэтому вам надо быть внимательными.

Начните с линтинга и ваш код станет симпатичнее. Сделайте это потому, что это облегчит вашу жизнь в будущем. Это также хороший способ обзора состояния вашего кода без особого риска (исправление синтаксической грязи не должно стать причиной каких-то проблем).

Затем структурируйте свой проект в соответствии с выбранной вами методологией. Не важно какую вы выберете, важно, чтобы вы ей следовали. Если в вашем проекте не слишком много компонентов, то структурирование будет хорошим началом. Найдите многократно используемые фрагменты интерфейса и перенесите их стили в отдельные файлы. Не стесняйтесь писать  документацию, таким образом процесс пойдет проще и вы почувствуете как двигаетесь вперед.

После того, как вы очистили проект и разложили все компоненты по полочкам, пришло время улучшить CSS. Сначала проверьте, что вы можете удалить, ведь мы всегда пишем слишком много кода. Затем попробуйте оптимизировать его так, чтобы он меньше повторялся. Не перестарайтесь! Ваша задача состоит в том, чтобы уменьшить сложность, а не увеличить. Не забывайте комментировать все, что будет неочевидным для первого взгляда.

И, наконец, ваши коммиты должны быть регулярными и логичными. Объединяйте изменения в небольшие коммиты, каждый из которых делает одну простую вещь — так вам будет проще откатить изменения, если вы что-то сделаете не так.

Последнее, но не менее важное — не забудьте отпраздновать, когда все закончится. Удачи!
