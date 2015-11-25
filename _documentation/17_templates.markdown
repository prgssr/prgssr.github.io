---
layout: doc
title: "Шаблоны"
header: "Кастомизация"
description: "Шаблоны в Jekyll. Шаблонизатор Liquid, встроенные фильтры и теги. Подсветка кода с highlight."
prism: yes
---
Jekyll использует шаблонизатор [Liquid](https://github.com/Shopify/liquid/wiki) для обработки шаблонов. Поддерживаются все стандартные [теги](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#tags)  и [фильтры](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#standard-filters) Liquid. Jekyll также добавляет несколько удобных фильтров и тегов для упрощения решения распространенных задач.

### Фильтры

Описание| Фильтр и его результат
--------|-----------------------
`Date to XML Schema` Конвертирует дату в  формат XML Schema (ISO 8601).| {% raw %}`{{site.time | date_to_xmlschema}}` {% endraw %},  2008-11-07T13:07:54-08:00
`Date to RFC-822 Format` Конвертирует дату в  формат RFC-822 для RSS фидов. | {% raw %} `{{ site.time | date_to_rfc822 }}` {% endraw %}, Mon, 07 Nov 2008 13:07:54 -0800
`Date to String` Конвертирует дату в  короткий формат. | {% raw %}`{{ site.time | date_to_string }}`, 07 Nov 2008 {% endraw %}
`Date to Long String` Конвертирует дату в длинный формат. | {% raw %}`{{ site.time | date_to_long_string }}` , 07 November 2008 {% endraw %}
`Where` Выбирает все объекты в массиве по указанному значению ключа | {% raw %}`{{ site.members | where:"graduation_year","2014" }}` {% endraw %}
`Group By` Группирует элементы массива по заданному свойству. |{% raw %} `{{ site.members | group_by:"graduation_year" }}`,  [{"name"=>"2013", "items"=>[...]}, {"name"=>"2014", "items"=>[...]}]{% endraw %}
`XML Escape` Удаляет часть текста для использования в XML. | {% raw %}`{{ page.content | xml_escape }}`{% endraw %}
`CGI Escape` Очистка строки CGI для использования в URL. Заменяет все специальные символы на соответствующие коды %XX. | {% raw %}`{{ "foo,bar;baz?" | cgi_escape }}`, foo%2Cbar%3Bbaz%3F {% endraw %}
`URI Escape` Очистка строки URI. | {% raw %}`{{ "foo, bar \baz?" | uri_escape }}` , foo,%20bar%20%5Cbaz? {% endraw %}
`Number of Words` Возвращает количество слов в тексте. | {% raw %}`{{ page.content | number_of_words }}` , 1337 {% endraw %}
`Array to Sentence` Конвертирует массив в предложение. Полезно для тегов списков. | {% raw %}`{{ page.tags | array_to_sentence_string }}` ,foo, bar, and baz {% endraw %}
`Markdownify` Конвертирует строку Markdown в HTML. | {% raw %}`{{ page.excerpt | markdownify }}` {% endraw %}
`Converting Sass/SCSS`  Конвертирует строку Sass или SCSS в CSS. | {% raw %}`{{ some_scss | scssify }}` `{{ some_sass | sassify }}` {% endraw %}
`Slugify` Конвертирует строку в строчный URL "slug". Ниже показаны опции. | {% raw %}`{{ "The _config.yml file" | slugify }}` ,the-config-yml-file `{{ "The _config.yml file" | slugify: 'pretty' }}` , the-_config.yml-file {% endraw %}
`Data To JSON` Конвертирует хэш или массив в JSON.| {% raw %}`{{ site.data.projects | jsonify }}` {% endraw %}
`Sort` Сортирует массив. Опциональные элементы для хэшей: 1. Имя свойства 2. Место nil  (в начале или в конце). | {% raw %}`{{ page.tags | sort }}` , `{{ site.posts | sort: 'author' }}` , `{{ site.pages | sort: 'title', 'last' }} ` {% endraw %}

#### Опции для фильтра `slugify`

Фильтр `slugify` принимает опцию, определяющую, что фильтровать. Дефолтная --- `default`, а вот весь список:

* `none`: ничего не фильтровать
* `raw`: пробелы
* `default`: пробелы и все не буквенно-цифровые символы
* `pretty`: пробелы и все не буквенно-цифровые символы кроме ._~!$&'()+,;=@

### Теги

#### Вложения

Если у вас есть небольшие фрагменты, которые вы хотите использовать на многих страницах вашего сайта, вы можете использовать тег `include `.

{% raw %}
```liquid
{% include footer.html %}
```
{% endraw %}

Jekyll ищет все подключаемые файлы в подкаталоге `_includes` корневого каталога. Например, код в примере выше подключал файл `<source>/_includes/footer.html`.

###### Совет: используйте переменные в качестве имени файла
{: .protip}
Имя подключаемого файла может быть как обычным символьным, так и заданным в переменной, при этом используется синтаксис для переменных --- {% raw %}`{% include {{my_variable}} %}`.{% endraw %}
{: .protip}

Вы также можете передавать параметры подключаемому фрагменту:

{% raw %}
```liquid
{% include footer.html param="value" %}
```
{% endraw %}
Эти параметры доступны в фрагменте с помощью тега Liquid:

{% raw %}
```liquid
{{ include.param }}
```
{% endraw %}

#### Подключение файлов по относительному пути

Вы также можете подключить фрагмент к файлу, указав относительный путь от места подключения:

{% raw %}
```liquid
{% include_relative somedir/footer.html %}
```
{% endraw %}

В данном случае вам не обязательно держать подключаемый фрагмент в каталоге `_includes`, но нужно точно определять  путь из текущего файла. Например, если `_posts/2014-09-03-my-file.markdown` использует тег `include_relative`, подключаемый файл должен быть внутри `_posts` или размещенного в нем подкаталога; файлы из других локаций подключить нельзя.

Все остальные возможности тега `include`, такие как использование переменных, полностью  доступны в `include_relative`.

### Подсветка фрагментов кода

В Jekyll благодаря [Pygments](http://pygments.org/)реализована подсветка синтаксиса для [более чем 100 языков](http://pygments.org/languages/). Для использования Pygments вам надо установить в вашей системе Python  и задать в конфигурации сайта для настройки `highlighter` значение `pygments`.

В качестве альтернативы вы можете использовать для подсветки [ Rouge](https://github.com/jayferd/rouge). Он поддерживает не так много языков, как Pygments, но в большинстве случаев его возможностей хватает. А так как он написан на Ruby, вам не нужно устанавливать Python.

Для рендеринга фрагмента кода с подсветкой синтаксиса оберните его тегами как на примере:
{% raw %}
```liquid
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
```
{% endraw %}
Аргументом для тега `highlight ` (в нашем примере это `ruby`) является идентификатор языка. Правильный идентификатор нужно искать в [википедии Rouge](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers) или как “short name”  в [документации Pygments](http://pygments.org/docs/lexers/).

#### Нумерация строк

Это второй аргумент для `highlight` --- `linenos`, он опционален. Включение `linenos` задает нумерацию строк в подсвечиваемом фрагменте. Например, в следующем блоке кода каждая строка будет пронумерована:

{% raw %}
```liquid
{% highlight ruby linenos %}
def foo
  puts 'foo'
end
{% endhighlight %}
```
{% endraw %}

#### Стили для подсветки синтаксиса

Для того, чтобы подсветка работала, вам надо подключить специальные стили для подсветки. Например, [ syntax.css](https://github.com/mojombo/tpw/blob/master/css/syntax.css) --- эти стили использует GitHub и они свободны для использования на любом другом сайте. Если вы нумеруете строки с `linenos`, вам надо задать специальный класс `.lineno`, чтобы отделить номера строк от подсвечиваемого кода.

### Ссылка на пост
{: #post-url}

Если вы хотите подключить ссылку на пост, тег `post_url` сгенерирует правильную постоянную ссылку на нужный вам пост:

{% raw %}
```liquid
{% post_url 2010-07-21-name-of-post %}
```
{% endraw %}

Если вы группирует посты по подкаталогам, вам надо включить в путь подкаталог:

{% raw %}
```liquid
{% post_url /subdir/2010-07-21-name-of-post %}
```
{% endraw %}

Расширение файла при использовании `post_url` указывать не надо.

Вы также можете использовать этот тег для создания ссылок в разметке Markdown:

{% raw %}
```liquid
[Name of Link]({% post_url 2010-07-21-name-of-post %})
```
{% endraw %}

### Gist

Вы можете использовать тег `gist` для подключения гистов с GitHub, он работает с публичными и секретными гистами:

{% raw %}
```liquid
{% gist parkr/931c1c8d465a04042403 %}
```
{% endraw %}

Вы можете опционально указать для отображения название гиста:

{% raw %}
```liquid
{% gist parkr/931c1c8d465a04042403 jekyll-private-gist.markdown %}
```
{% endraw %}
