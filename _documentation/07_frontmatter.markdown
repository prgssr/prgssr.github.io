---
layout: doc
title: "Вводные"
header: "Ваш контент"
description: "Вводные (frontmatter) Jekyll. Формат YAML. Предопределенные глобальные переменные и переменные для постов."
prism: yes
---
Вводные это одна из  сильных сторон Jekyll. Каждый файл, в котором есть вводная часть в формате [YAML](http://yaml.org/) будет обработан Jekyll как специальный файл. Вводная должна располагаться в начале файла и быть в форме валидного YAML, окруженного тройными дефисами с каждой стороны, как на примере:

```yaml
---
layout: post
title: Blogging Like a Hacker
---
```

Между этими тройными дефисами вы можете задавать значения переменных или создавать собственные переменные. Эти переменные будут доступны для вас через теги Liquid, причем не только в этом файле, но и в остальных подключаемых макетах и включениях.

###### Возможные проблемы с кодировкой UTF-8
{: .warning}
Если вы используете UTF-8, убедитесь, что заголовки `BOM` не используются в ваших файлах, иначе это вызовет проблемы с  Jekyll. Это особенно актуально для [windows версии](/documentation/29_windows).
{: .warning}

###### Задание переменных во вводных это опция!
{: .protip}
Если вы хотите использовать [теги и переменные Liquid](/documentation/12_variables.html), но не нуждаетесь в чем-то еще, просто оставьте вводную пустой. Набор из двух двойных дефисов заставит Jekyll обрабатывать ваш файл(это полезно для вещей  типа CSS и RSS).
{: .protip}

### Предопределенные глобальные переменные

Существует некоторое количество уже определенных глобальных переменных, при желании вы можете задавать их значения во вводных.

Переменная |Описание
-----------|--------
`layout` | Если задана, определяет используемый файл макета. Файл макета указывается без расширения, все файлы макетов должны размещаться внутри каталога  `_layouts`.
`permalink` | Если вы хотите, чтобы URL постов отличались от стандартных (дефолтное значение  `/год/месяц/день/название.html`), просто задайте эту переменную.
`published` | Установите в  `false`, если хотите скрыть пост из сгенерированного сайта.
`category`, `categories` | Вместо сортировки постов по каталогам, вы можете задать категории постов. После генерации сайта пост будет отражаться,  как будто он был создан с этими категориями. Категории могут быть определены в YAML как список  или как строка разделенная пробелами.
`tags` | Также как и категории к посту могут добавляться теги, они также могут задаваться в YAML как список  или как строка разделенная пробелами.

### Собственные переменные

Любые переменные во вводной, которые не были предопределены, смешиваются с данными, передаваемыми движку шаблонов Liquid  во время конверсии. Например, если вы задали переменную `title`, вы можете использовать ее в своем макете для вывода названия страницы:

{% raw %}
```markup

  <head>
    <title>{{ page.title }}</title>
  </head>
```
{% endraw %}

### Предопределенные переменные для постов

Эти переменные готовы к использованию во вводной поста "из коробки":

Переменная |Описание
-----------|--------
`date` | Дата во вводной переписывает дату из названия поста. Это можно использовать для обеспечения правильной сортировки постов. Дата определяется в формате `YYYY-MM-DD HH:MM:SS +/-TTTT`, при этом часы, минуты, секунды и сдвиг временной зоны являются опциональными.

###### Не повторяйтесь!
{: .protip}
Если вы не хотите повторять одни и те же переменные во вводных, просто задайте им  [значения по умолчанию](/documentation/06_configuration.html#front-matter-defaults) и переписывайте их при необходимости. Это одинаково работает как с предопределенными, так и с собственными переменными.
{: .protip}
