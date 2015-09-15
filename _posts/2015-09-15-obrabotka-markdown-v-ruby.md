---
layout: post
title: Обработка Markdown в Ruby
date: 2015-09-15 18:07:51
categories: [development]
tags: [markdown, translation,sitepoint]
description: "Краткое сравнение 4-х основных парсеров markdown в Ruby. Redcarpet быстрее всех."
prism: yes
original: "http://www.sitepoint.com/markdown-processing-ruby/"
original_author: "Jesse Herrick"
thumbnail: "/images/development/markdown-test.png"
---
{% include translate.html %}

{% include toc.md %}

Markdown это фантастический язык разметки, компилируемый  в HTML. Хотя [изначально он написан](http://daringfireball.net/projects/markdown/) на Perl, Markdown портирован на многие языки с различными функциями. В этой статье мы рассмотрим 4 имплементации Markdown на Ruby: [kramdown](http://kramdown.gettalong.org/), [maruku](https://github.com/bhollis/maruku), [rdiscount](https://github.com/davidfstr/rdiscount) и [redcarpet](https://github.com/vmg/redcarpet).

## Обработка Markdown в Ruby

Очевидно, что сначала надо установить нужные модули - `gem install kramdown maruku rdiscount redcarpet`. Это может занять время, так как RDiscount и Redcarpet используют расширения C для ускорения парсинга.

Также это означает то, что если ваш интерпретатор Ruby не поддерживает расширения C, вы не сможете использовать RDiscount или Redcarpet (это актуально при использовании JRuby).

Для нашего теста мы будем использовать [тестовый файл в Markdown со страницы Джона Грубера](http://daringfireball.net/projects/markdown/syntax.text), сохранив его под именем `markup.md`.

В каждой имплементации для обработки Markdown достаточно одной строчки кода.

```ruby
markdown = File.read('markup.md')

# kramdown
require 'kramdown'
Kramdown::Document.new(markdown).to_html

# maruku
require 'maruku'
Maruku.new(markdown).to_html

# rdiscount
require 'rdiscount'
RDiscount.new(markdown).to_html

# redcarpet
require 'redcarpet'
Redcarpet::Markdown.new(Redcarpet::Render::HTML.new).render(markdown)
```

Отлично! Мы видим, что в каждом фреймворке (за исключением Redcarpet) есть простое API для обработки Markdown.

## Функционал

Оригинальная имплементация Markdown была хороша, но люди всегда хотят большего. Например, в оригинальном Markdown есть поддержка изображений и блоков с кодом, но многие пользователи были заинтересованы в другом синтаксисе и в лучшей расширяемости этих функций. Таким образом, функционал различных имплементаций Markdown может значительно расширяться.

Рассмотрим несколько наиболее популярных расширений и их поддержку в Ruby-имплементациях Markdown.

### Блоки кода

Синтаксис блоков кода изначально предусматривал выделение кода отступами:

```ruby
   if foo == bar
       "Markdown is awesome."
     end
```

Улучшенный синтаксис называется `fenced code blocks` - огороженные блоки кода. Он выглядит так:

```ruby
	```ruby
		if foo == bar
  			"Markdown is awesome."
		end
	```
```

Язык (в данном случае Ruby) указывается сразу после окончания первой ограды. Это опционально, но позволяет парсеру Markdown реализовывать подсветку кода с учетом синтаксиса языка.

### Зачеркивание

Зачеркивание это еще одна добавленная фича в Markdown, оно реализуется путем оборачивания нужного слова или фразы тильдами`~`.

```markdown
~~Something outdated~~
```

### Таблицы

Таблицы это добавленная в Markdown возможность. Разметка таблиц в Markdown напоминает упрощенный вариант таблиц в простом тексте.

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Foo      | Bar      | Baz      |
```

На выходе мы получаем простую HTML-таблицу.

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Foo      | Bar      | Baz      |

Хотя такой синтаксис удобен для создания простых таблиц, он кажется неудобным при создании более сложных таблиц, с различным размером контента в ячейках. Но это на самом деле не имеет значения, так как достаточно только подчеркнуть заголовок и разделять ячейки таблиц вертикальными чертами.

```markdown
| Header 1      | Header 2|Header 3 |
|-------|----|----------|
|Foo|Bar|Baz|
```

| Header 1      | Header 2|Header 3 |
|-------|----|----------|
|Foo|Bar|Baz|

### Идентификаторы заголовков

Эта возможность позволяет добавлять анкеры в HTML (`http://something.com/document.html#id-ref`) в документы markdown. Это делается автоматически в заголовках и подзаголовках. Однако в каждой из имплементаций этот механизм отличен от других, поэтому лучше будет начать с документации.

### Улучшенная типографика (расширение “SmartyPants”)

Одним из самых востребованных расширений является еще один проект Daring Fireball  под названием SmartyPants.  Оно позволяет заменять традиционную ASCII пунктуацию на правильную, типографскую. Например:

```markdown
"Ruby", the programming language.
Превращается в: “Ruby”, the programming language.
```

Кроме изменения внешнего вида кавычек, двойной дефис заменяется на м-тире, а тройной на н-тире.

### Сравнение

Теперь посмотрим на поддержку этих расширений в имлементациях Markdown в Ruby:

 Процессор|Fenced Code |	Зачеркивание |	Таблицы |	 ID для заголовков| 	Улучшенная типографика |
 ------------|---------------|----------|---------------------|----------------------------|
Kramdown |	Да |	Нет |	Да |	Да 	|Да
Maruku |	Да |	Нет |	Да |	Да |	Да
Redcarpet |	Да |	Да 	|Да 	|Да |	Да
RDiscount |	Да |	Да |	Да |	Нет |	Да

## Производительность

Я протестировал все процессоры Markdown, использовав [этот файл](https://gist.github.com/JesseHerrick/fb2749ce94e343afdceb). В Ruby это делается достаточно легко с помощью [модуля Benchmark](http://ruby-doc.org/stdlib-2.2.0/libdoc/benchmark/rdoc/Benchmark.html). Вот мои настройки:

```ruby
require 'benchmark'

markdown = File.read('TestDoc.md')

Benchmark.bm(15) do |x|
  x.report('Kramdown') {
    require 'kramdown'
    Kramdown::Document.new(markdown.dup).to_html
  }

  x.report('Maruku') {
    require 'maruku'
    Maruku.new(markdown.dup).to_html
  }

  x.report('RDiscount') {
    require 'rdiscount'
    RDiscount.new(markdown.dup).to_html
  }

  x.report('RedCarpet') {
    require 'redcarpet'
    Redcarpet::Markdown.new(Redcarpet::Render::HTML.new).render(markdown.dup)
  }
end
```

Чтобы избежать случайности в результатах, я запускал бенчмарк 5 раз (MacbookPro образца конца 2013 - 2.4 GHz Intel Core i5 с Ruby 2.2.0) и публикую средние результаты:

  Процессор	|Среднее время (в секундах)
Kramdown |	.1054152
Maruku 	| .1226444
RDiscount |	.0131436
RedCarpet |	.007233

Цифры достаточно выразительные, но для большей наглядности  посмотрим на график (чем короче полоса, тем быстрее)

![Сравнение производительности процессоров Markdown](/images/development/markdown-test.png){: itemprop="image"}


Ну что? Очевидно преимущество Redcarpet, хотя rDiscount отстает совсем ненамного. С учетом возможностей Redcarpet, я рекомендую использовать имено его.

Взглянем на разницу с другой стороны. В следующей таблице показано количество документов, обрабатываемых redcarpet за то время, когда другие процессоры обрабатывают 1.

Процессор |	Количество обработанных документов
Maruku |	17 документов
Kramdown |	15 документов
RDiscount |	2 документа

Да, Redcarpet это чертовски быстро.

## Продвинутое использование Redcarpet

Преимущество Redcarpet не только в скорости, но и в расширяемости. Давайте попробуем сделать действительно крутую настройку Redcarpet.

Для начала определимся с дополнительными возможностями, которые нужны нам в markdown. Составим список того, что нам нужно ([полный перечень](https://github.com/vmg/redcarpet))

* Таблицы (`:tables`)
* Огороженные блоки кода (`:fenced_code_blocks`)
* Автогенерация ссылок (`:autolink`)
* Зачеркивание (`:strikethrough`)

Также в Redcarpet есть дополнительные настройки рендерера HTML - это именно часть рендерера, а не процессора markdown. Большая часть этих опций относятся к безопасности (типа `:safe_links_only ` или `:filter_html`), в нашей настройке они не используются, но об их существовании стоит знать.

Итак, использовав наши настройки создадим свой процессор Markdown.

```ruby
# our markdown extensions
md_options = {
  tables: true,
  fenced_code_blocks: true,
  autolink: true,
  strikethrough: true
}

# our markdown processor
processor = Redcarpet::Markdown.new(Redcarpet::Render::HTML, md_options)
```

Теперь вы можем парсить наш Markdown простой командой:

```ruby
processor.render(some_markdown_string).
```

## Заключение

Markdown это очень удобный язык разметки. Эта статья тоже была написана в Markdown.

Его синтаксис становится все более универсальным, поддержка Markdown реализована уже во [многих языках](http://www.w3.org/community/markdown/wiki/MarkdownImplementations). Когда речь идет о производительности и расширяемости, Redcarpet опережает всех, но не стоит воспринимать это ультимативно и отказываться от остальных процессоров Markdown. Удачного рендеринга!
