---
layout: doc
title: "Плагины"
description: "Плагины в Jekyll. Плагины, совместимые с GitHub. Виды плагинов - генераторы, конвертеры, команды и теги. Список доступных плагинов Jekyll."
prism: yes
---
# Плагины

В Jekyll реализована система плагинов с хуками, позволяющая вам генерировать кастомный контент на вашем сайте. Вы можете запустить собственный код на своем сайте без модификации Jekyll как такового.

### Плагины на GitHub
***[GitHub Pages](http://pages.github.com/) работают на  Jekyll. Но так как по причинам безопасности все сайты на GitHub собираются с опцией `--safe`, а значит все кастомные плагины не будут работать***
***Вы по прежнему можете использовать GitHub Pages для публикации вашего сайта, но только путем локальной сборки и отправки в репозиторий готовых статических файлов***

На данный момент GitHub Pages [работает с 4 плагинами](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/):

* [Jemoji](https://help.github.com/articles/emoji-on-github-pages) - поддержка emoji в постах и страницах Jekyll.
* [Jekyll-mentions](https://help.github.com/articles/mentions-on-github-pages) - дает поддержку  @mentions в постах и страницах Jekyll.
* [Jekyll-redirect-from](https://help.github.com/articles/redirects-on-github-pages) - добавляет возможность редиректов при смене URL поста или страницы.
* [Jekyll-sitemap](https://help.github.com/articles/sitemaps-for-github-pages) - автоматически добавляет на сайт валидный файл sitemap.xml. Плагин необходим для нормальной работы поисковых систем.


### Установка плагина

Существует 3 способа установки плагинов в Jekyll:

 1. Создайте в корневом каталоге папку `_plugins` и поместите в нее плагины. Любой файл с расширением `*.rb` из этого каталога будет загружен до генерации сайта.
 2. В файле `_config.yml` создайте новый массив с ключом `gems` и названиями gem устанавливаемых плагинов, например:
```
 gems: [jekyll-test-plugin, jekyll-jsonify, jekyll-assets]
 # This will require each of these gems automatically.
```
 3. Добавьте нужные плагины в группу Bundler в `Gemfile`:

```yaml
 group :jekyll_plugins do
   gem "my-jekyll-plugin"
 end
```


###### Методы `_plugins`, `_config.yml` и `Gemfile` можно использовать одновременно
***Вы можете использовать все методики подклчения плагинов на одном сайте. Они не конфликтуют друг с другом***


Все плагины для Jekyll можно разделить на 4 основных категории:

1. [Генераторы](/documentation/20_plugins.html#generators)
2. [Конвертеры](/documentation/20_plugins.html#converters)
3. [Команды](/documentation/20_plugins.html#comands)
4. [Теги](/documentation/20_plugins.html#tags)

### [Генераторы](#generators)

Для создания дополнительного контента в Jekyll  вы можете создать плагин-генератор.

Генератор это подкласс `Jekyll::Generator`, определяющий метод `generate`, который получает экземпляр [ Jekyll::Site](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/site.rb). Возвращаемое значение `generate` игнорируется.

Генераторы запускаются после того, как Jekyll проверит имеющийся контент и перед сборкой сайта. Страницы с вводной  YAML сохраняются как экземпляры [Jekyll::Page ](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/page.rb) и доступны через `site.pages`. Статические файлы становятся экземплярами [Jekyll::StaticFile](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/static_file.rb) и доступны через `site.static_files`. Подробная информация на страницах документации о [переменных](/documentation/12_variables.html) и [Jekyll::Site](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/site.rb).

Например, генератор может вставить значения расчитанные в момент сборки для переменных шаблона. В следующем примере в `reading.html` есть две переменные, `ongoing` и `done`, которые мы заполняем в генераторе:

```ruby
module Reading
  class Generator < Jekyll::Generator
    def generate(site)
      ongoing, done = Book.all.partition(&:ongoing?)

      reading = site.pages.detect {|page| page.name == 'reading.html'}
      reading.data['ongoing'] = ongoing
      reading.data['done'] = done
    end
  end
end
```

А вот образец более сложного генератора, создающего новые страницы:

```ruby
module Jekyll

  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_index.html')
      self.data['category'] = category

      category_title_prefix = site.config['category_title_prefix'] || 'Category: '
      self.data['title'] = "#{category_title_prefix}#{category}"
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category_index'
        dir = site.config['category_dir'] || 'categories'
        site.categories.each_key do |category|
          site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
        end
      end
    end
  end

end
```

В этом примере наш генератор создаст серию файлов в каталоге `categories` для каждой категории и создаст список постов в каждой категории используя макет `category_index.html`.

Для работы генераторов достаточно одного метода:

Метод| Описание
-----|---------
`generate` | Генерирует контент

### [Конвертеры](#converters)

Если у вас есть новый язык разметки, который вы хотите использовать на сайте, вы можете подключить его, создав свой плагин-конвертер. Markdown и Textile подключены именно таким образом.

###### Не забывайте о вводной  YAML 
***Jekyll  обрабатывает только файлы с вводной, даже с использованием кастомных конвертеров***

Вот, например, конвертер, принимающий все посты заканчивающиейся `.upcase` и обрабатывающий их с помощью `UpcaseConverter`:

```ruby
module Jekyll
  class UpcaseConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /^\.upcase$/i
    end

    def output_ext(ext)
      ".html"
    end

    def convert(content)
      content.upcase
    end
  end
end
```

В конвертерах должны быть имплементированы 3 метода:

Метод| Описание
-----|---------
`matches` | Проверяет расширение файла на совпадение с принимаемыми конвертером значениями. Принимает один аргумент: расширение файла. Возвращает логическое значение ( `true ` при совпадении, иначе `false`).
`output_ext` |Определяет расширение итогового файла (с точкой), обычно это ".html".
`convert` | Метод реализующий саму конверсию. Принимает один аргумент: сырой контент (без вводной YAML). Возвращает строку. 

В нашем примере `UpcaseConverter#matches` ищет файл с расширением `.upcase` и рендерит его с использованием конвертера, если он существует. Для обработки используется метод `UpcaseConverter#convert`. В нашем простом конвертере мы просто делаем все символы заглавными и сохраняем файл с расширением `.html`.

### [Команды](#comands)

С версии 2.50 Jekyll может расширяться плагинами, добавляющими субкомманды. Это реализуется путем включения соответствующих файлов в группу `Gemfile` называемую `:jekyll_plugins`:

```ruby
group :jekyll_plugins do
  gem "my_fancy_jekyll_plugin"
end
```

Каждая команда (`Command`) это подкласс класса `Jekyll::Command`, она обязательно реализует метод `init_with_program`. Образец:

```ruby
class MyNewCommand < Jekyll::Command
  class << self
    def init_with_program(prog)
      prog.command(:new) do |c|
        c.syntax "new [options]"
        c.description 'Create a new Jekyll site.'

        c.option 'dest', '-d DEST', 'Where the site should go.'

        c.action do |args, options|
          Jekyll::Site.new_site_at(options['dest'])
        end
      end
    end
  end
end
```

Команды имплементируют единственный метод:

Метод| Описание
-----|---------
`init_with_program`| Метод принимает один параметр `Mercenary::Program`, это сам  Jekyll. Все команды в Jekyll добавляются только так, подробная документация на странице репозитория Mercenary на GitHub.com. 

### [Теги](#tags)

Если вы хотите использовать на своем сайте собственные теги liquid, вы можете сделать это с помощью хуков в системе тегов. Встроенные в Jekyll образцы включают теги `highlight` и `include`. Ниже показан пример собственного тега liquid, выводящего время рендеринга страницы:

```ruby
module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      "#{@text} #{Time.now}"
    end
  end
end

Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)
```

Теги должны имплементировать  один метод:

Метод| Описание
-----|---------
`render` | Выводит контент тега.

Вы также должны зарегистрировать кастомный тег в движке шаблонов Liquid:

```ruby
Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)
```

В примере выше, мы можем поместить наш тег на любой странице:
{% raw %}
```haml
<p>{% render_time page rendered at: %}</p>
```
{% endraw %}
В результате мы получим следующий вывод:

```haml
<p>page rendered at: Tue June 22 23:38:47 –0500 2010</p>
```

#### Фильтры Liquid

 Вы можете добавлять свои фильтры в систему шаблонов Liquid точно также как и теги. Фильтры это простые модули, экспортирующие свои методы в Liquid. Все методы принимают как минимум один параметр - входные данные для фильтра. Вовзращает фильтр обработанные данные.

```ruby
 module Jekyll
  module AssetFilter
    def asset_url(input)
      "http://www.example.com/#{input}?#{Time.now.to_i}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
```


###### Совет: доступ к объекту сайта через Liquid
***Jekyll  дает вам доступ к объекту `site` через объект Liquid `context.registers` - `context.registers[:site]`. Например, вы можете получить доступ к конфигурации `_config.yml` через `context.registers[:site].config`***

#### Флаги

При написании плагинов надо учитывать два флага:

Флаг| Описание
----|---------
`safe`| Логический флаг, сообщающий Jekyll, может ли этот плагин безопасно запускаться в среде, где запрещено выполнение произвольного кода.  Это используется на GitHub Pages для определения, какие базовые плагины будут использоваться, а какие запускать небезопасно . Если ваш плагин не допускает исполнение произвольного кода, задайте этот флаг как `true`. GitHub Pages по прежнему не будут загружать ваш плагин, но если вы захотите, чтобы этот плагин был включен в ядро, это поле должно быть заполнено правильно!
`priority` | Флаг определяет порядок загрузки плагина. Валидные значения: `:lowest`, `:low`, `:normal`, `:high` и`:highest`. Сначала загружаются плагины с высшим приоритетом, в конце - с низшим. 

Чтобы проиллюстрировать работу флагов, мы подготовили пример их использования:

```ruby
module Jekyll
  class UpcaseConverter < Converter
    safe true
    priority :low
    ...
  end
end
```

### Доступные плагины

Вот некоторые из доступных плагинов:

#### Генераторы


* [ArchiveGenerator by Ilkka Laukkanen](https://gist.github.com/707909): Использует [эту архивную страницу](https://gist.github.com/707020) для генерации архивов.
* [LESS.js Generator by Andy Fowler](https://gist.github.com/642739): Рендерит файлы LESS.js при сборке.
* [Version Reporter by Blake Smith](https://gist.github.com/449491): Создает файл version.html с указанием версии Jekyll.
* [Sitemap.xml Generator by Michael Levin](https://github.com/kinnetica/jekyll-plugins): Генерирует файл sitemap.xml, проходя через все доступные страницы и посты.
* [Full-text search by Pascal Widdershoven](https://github.com/PascalW/jekyll_indextank): Добавляет полнотекстовый поиск на ваш сайт Jekyll с помощью плагина и небольшого количества  JavaScript.
* [AliasGenerator by Thomas Mango](https://github.com/tsmango/jekyll_alias_generator): Генерирует страницы редиректа для постов, в которых псевдоним указан во ввводной YAML.
* [Pageless Redirect Generator by Nick Quinlan](https://github.com/nquinlan/jekyll-pageless-redirects): Генерирует редиректы на основе файлов в корневом каталоге Jekyll, поддерживает редирект в стиле htaccess.
* [RssGenerator by Assaf Gelber](https://github.com/agelber/jekyll-rss): Автоматически создает фид RSS 2.0 из ваших постов.
* [Monthly archive generator by Shigeya Suzuki](https://github.com/shigeya/jekyll-monthly-archive-plugin): Генератор и шаблон, создающий архивы месяцев в стиле MovableType, основан на работе Ilkka Laukkanen.
* [Category archive generator by Shigeya Suzuki](https://github.com/shigeya/jekyll-category-archive-plugin): Генератор и шаблон, создающий архивы категорий в стиле MovableType , основан на Monthly archive generator.
* [Emoji for Jekyll](https://github.com/yihangho/emoji-for-jekyll): Подключает  emoji ко всем постам и страницам.
* [Compass integration for Jekyll](https://github.com/mscharley/jekyll-compass): Интегрирует Compass и Sass на сайта Jekyll.
* [Pages Directory by Ben Baker-Smith](https://github.com/bbakersmith/jekyll-pages-directory): Определяет каталог  `_pages` для файлов страниц, маршрутизируя их вывод относительно корневого каталога.
* [Page Collections by Jeff Kolesky](https://github.com/jeffkole/jekyll-page-collections): Генерирует коллекцию страниц с функциональностью постов.
* [Windows 8.1 Live Tile Generation by Matt Sheehan](https://github.com/sheehamj13/jekyll-live-tiles): Генерирует config.xml для Internet Explorer 11  и плиточный шаблон для интеграции вашего сайта к Windows 8.1.
* [Jekyll::AutolinkEmail by Ivan Tse](https://github.com/ivantsepp/jekyll-autolink_email): Автоматические ссылки для email.
* [Jekyll::GitMetadata by Ivan Tse](https://github.com/ivantsepp/jekyll-git_metadata): Открывает метаданные Git для ваших шаблонов.
* [Jekyll Http Basic Auth Plugin](https://gist.github.com/snrbrnjna/422a4b7e017192c284b3): Плагин для управления базовой http аутентификацией для сгенерированных jekyll страниц и каталогов
* [Jekyll Auto Image by Merlos](https://github.com/merlos/jekyll-auto-image): Делает первое изображение в посте доступным для шаблонов в качестве переменной. Полезно для создания списка постов с изображениями или для добавления twitter-карт на ваш сайт.


#### Конвертеры


* [Textile converter](https://github.com/jekyll/jekyll-textile-converter): Конвертирует файлы  `.textile ` в HTML.Также включает фильтр Liquid `textilize`.
* [Slim plugin](https://github.com/slim-template/jekyll-slim): Конвертер Slim, включающий поддержку тегов Liquid
* [Jade plugin by John Papandriopoulos](https://github.com/snappylabs/jade-jekyll-plugin): Конвертер Jade дляJekyll.
* [HAML plugin by Sam Z](https://gist.github.com/517556): Конвертер HAML для Jekyll.
* [HAML-Sass Converter by Adam Pearson](https://gist.github.com/481456): Простой HAML-Sass конвертер для Jekyll. [Форк](https://gist.github.com/528642) от Sam X.
* [Sass SCSS Converter by Mark Wolfe](https://gist.github.com/960150): Конвертер Sass, использующий новый, CSS-совместимый синтаксисx, основан на предыдущем форке от Sam X.
* [LESS Converter by Jason Graham](https://gist.github.com/639920): Конвертер  LESS в CSS.
* [LESS Converter by Josh Brown](https://gist.github.com/760265): Простой конвертер LESS.
* [Upcase Converter by Blake Smith](https://gist.github.com/449463): Образец конвертера Jekyll.
* [CoffeeScript Converter by phaer](https://gist.github.com/959938): Конвертер CoffeeScript в Javascript.
* [Markdown References by Olov Lassus](https://github.com/olov/jekyll-references): Позволяет хранить все ссылки markdown в одном файле  _references.md.
* [Stylus Converter](https://gist.github.com/988201): Конвертер Stylus в css.
* [ReStructuredText Converter](https://github.com/xdissent/jekyll-rst): Конвертирует документы ReST в HTML с подсветкой Pygments.
* [Jekyll-pandoc-plugin](https://github.com/dsanson/jekyll-pandoc-plugin): Подключает pandoc для рендеринга markdown.
* [Jekyll-pandoc-multiple-formats by edsl](https://github.com/fauno/jekyll-pandoc-multiple-formats): Использует pandoc для генерации вашего сайта в различных форматах. Поддерживает pandoc-расширения markdown.
* [Transform Layouts](https://gist.github.com/1472645): Поддержка макетов HAML  (для работы нужен установленный конвертер HAML).
* [Org-mode Converter](https://gist.github.com/abhiyerra/7377603): Конвертер Org-mode для Jekyll.
* [Customized Kramdown Converter](https://github.com/mvdbos/kramdown-with-pygments): Подключает подсветку синтаксиса Pygments для блоков кода Kramdown-.
* [Bigfootnotes Plugin](https://github.com/TheFox/jekyll-bigfootnotes): Поддержка больших сносок в Kramdown.
* [AsciiDoc Plugin](https://github.com/asciidoctor/jekyll-asciidoc): Конвертер AsciiDoc , использующий Asciidoctor.


#### Фильтры


[Truncate HTML](https://github.com/MattHall/truncatehtml) от [Matt Hall](http://codebeef.com/): Фильтр  Jekyll, обрезающий HTML сохраняя структуру разметки.
* [Domain Name Filter отLawrence Woodman](https://github.com/LawrenceWoodman/domain_name-liquid_filter): Фильтрует URL, оставляя доменное имя.
* [Summarize Filter отMathieu Arnold](https://gist.github.com/731597): Удаляет разметку после тега `<div id="extended"> `.
* [i18n_filter](https://github.com/gacha/gacha.id.lv/blob/master/_plugins/i18n_filter.rb): Фильтр Liquid для использования локализации I18n.
* [Smilify](https://github.com/SaswatPadhi/jekyll_smilify) от [SaswatPadhi](https://github.com/SaswatPadhi): Заменяет текстовые смайлики в вашем контенте картинками.
* [Read in X Minutes](https://gist.github.com/zachleat/5792681) от [zachleat](https://github.com/zachleat): Выводит ожидаемое время чтения (для содержимого поста).
* [Jekyll-timeago](https://github.com/markets/jekyll-timeago): Конвертирует время из цифр в текст.
* [pluralize](https://github.com/bdesham/pluralize): Совмещает числа и слова с учетом множественного или единственного числа, например, “1 minute” или “2 minutes”.
* [reading_time](https://github.com/bdesham/reading_time): Подсчитывает слова и ожидаемое время чтения, игнорируя HTML-элементы не содержащие текст.
* [Table of Content Generator](https://github.com/dafi/jekyll-toc-generator): Генерирует HTML-код, содержащий оглавление, кастомизируется - можно указать страницы-исключения.
* [jekyll-humanize](https://github.com/23maverick23/jekyll-humanize): Это портированное приложение Django  `humanize`, с разнообразными методами для изменения вида дат и цифровых данных в "человекопонятном виде". Каждый метод это фильтр, который можно использовать в шаблонах Jekyll. Некоторые оригинальные методы не портированы (например, naturaltime).
* [Jekyll-Ordinal](https://github.com/PatrickC8t/Jekyll-Ordinal): Jekyll фильтр для конвертации количественных числительных в порядковые -  “st”, “nd”, “rd”, or “th”.
* [Deprecated articles keeper](https://github.com/kzykbys/JekyllPlugins) от [Kazuya Kobayashi](http://blog.kazuya.co/): Простой фильтр Jekyll для определения "старых статей".
* [Jekyll-jalali](https://github.com/mehdisadeghi/jekyll-jalali) от [Mehdi Sadeghi](http://mehdix.ir/): Простой конвертер из грегорианского в иранский календарь.
* [Jekyll Thumbnail Filter](https://github.com/matallo/jekyll-thumbnail-filter): Фильтр для миниатюр связанных постов.
* [Jekyll-Smartify](https://github.com/pathawks/jekyll-smartify): Фильтр SmartyPants. Делает кавычки фигурными.

#### Теги

* [Asset Path Tag](https://github.com/samrayner/jekyll-asset-path-plugin) от [Sam Rayner](http://www.samrayner.com/): Позволяет размещать подгружаемые файлы в подкаталогах, выводя путь к ним относительно текущего поста или страницы.
* [Delicious Plugin от Christian Hellsten](https://github.com/christianhellsten/jekyll-plugins): Обрабатывает и рендерит закладки из delicious.com.
* [Ultraviolet Plugin от Steve Alex](https://gist.github.com/480380): Тег Jekyll для подсветки кода Ultraviolet.
* [Tag Cloud Plugin от Ilkka Laukkanen](https://gist.github.com/710577): Генерирует облако тегов со ссылками на страницы тегов.
* [GIT Tag от Alexandre Girard](https://gist.github.com/730347): Добавляет список с данными активности Git.
* [MathJax Liquid Tags от Jessy Cowan-Sharp](https://gist.github.com/834610): Простые liquid теги для Jekyll, конвертирующие строки и блоки уравнений в соответствующие скрипт-теги MathJax.
* [Non-JS Gist Tag от Brandon Tilley](https://gist.github.com/1027674) Тег Liquid, подключающий гисты и показывающий код для браузеров и читалок с отключенным JavaScript.
* [Render Time Tag от Blake Smith](https://gist.github.com/449509): Показывает время генерации страницы Jekyll.
* [Status.net/OStatus Tag от phaer](https://gist.github.com/912466): Показывает уведомления в переданном  фиде status.net/ostatus.
* [Embed.ly client от Robert Böhnke](https://github.com/robb/jekyll-embedly-client): Автоматически подключает мультимедийный контент из URL, используя oEmbed.
* [Logarithmic Tag Cloud](https://gist.github.com/2290195): Гибкое облако тегов, с логарифмическим представлением и документацией.
* [oEmbed Tag от Tammo van Lessen](https://gist.github.com/1455726): Обеспечивает легкое подключение мультимедиа (например, с YouTube, Flickr, Slideshare) через oEmbed.
* [FlickrSetTag от Thomas Mango](https://github.com/tsmango/jekyll_flickr_set_tag): Генерирует галереи изображений из наборов Flickr.
* [Tweet Tag от Scott W. Bradley](https://github.com/scottwb/jekyll-tweet-tag): Тег Liquid для подключения твитов, используя  Twitter’s shortcodes.
* [Jekyll Twitter Plugin](https://github.com/rob-murray/jekyll-twitter-plugin): Тег Liquid, рендерящий твиты с  Twitter API. Поддерживает  oEmbed API.
* [Jekyll-contentblocks](https://github.com/rustygeldmacher/jekyll-contentblocks): Позволяет использовать в ваших шаблонах теги для контента в стиле  Rails, пропуская контент из постов в макеты.
* [Generate YouTube Embed ](https://gist.github.com/1805814) от [joelverhagen](https://github.com/joelverhagen): Плагин Jekyll позволяющий вставлять сидео с YouTube на вашу страницу указывая  YouTube ID. Опционально указываются размеры видео, плагин похож на “oEmbed Tag” , но работет только с YouTube.
* [Jekyll-beastiepress](https://github.com/okeeblow/jekyll-beastiepress): FreeBSD утилиты для сайтов на Jekyll.
* [Jsonball](https://gist.github.com/1895282): Читает файлы json и создает карты для использования в файлах Jekyll.
* [Bibjekyll](https://github.com/pablooliveira/bibjekyll): Рендерит формат BibTeX с библиографиями/цитатниками, подключая их в посты и страницы, используя bibtex2html.
* [Jekyll-citation](https://github.com/archome/jekyll-citation):Рендерит формат BibTeX с библиографиями/цитатниками, подключая их в посты и страницы, на чистом Ruby.
* [Jekyll Dribbble Set Tag](https://github.com/ericdfields/Jekyll-Dribbble-Set-Tag): Строит галереи изображений любого пользователя Dribbble.
* [Debbugs](https://gist.github.com/2218470): Позволяет постить ссылки на Debian BTS.
* [Refheap_tag](https://github.com/aburdette/refheap_tag): Тег Liquid, позволяющий включать контент с [refheap](https://www.refheap.com/).
* [Jekyll-devonly_tag](https://gist.github.com/2403522): Тег для подключения разметки, необходимой только на период разработки.
* [JekyllGalleryTag ](https://github.com/redwallhp/JekyllGalleryTag)by [redwallhp](https://github.com/redwallhp): Генерирует миниатюры из каталога изображений и отображает их сеткой.
* [Youku and Tudou Embed](https://gist.github.com/Yexiaoxing/5891929): Плагин Liquid для подключения видео с Youku и Tudou.
* [Jekyll-swfobject](https://github.com/sectore/jekyll-swfobject): Плагин Liquid для подключения файлов Adobe Flash  (.swf) с помощью SWFObject.
* [Jekyll Picture Tag](https://github.com/robwierzbowski/jekyll-picture-tag): Отзывчивые изображения для Jekyll. Основан на элементе `<picture>` element, использует [полифилл](https://github.com/scottjehl/picturefill)  Scott Jehl.
* [Jekyll Image Tag](https://github.com/robwierzbowski/jekyll-image-tag): Улучшение изображений для Jekyll. Сохраняет настройки изображений, изменяет размер, добавляет классы, описание и прочие атрибуты.
* [Ditaa Tag](https://github.com/matze/jekyll-ditaa) от [matze](https://github.com/matze): Рендерит  ASCII-арт в изображения PNG и вставляет тег figure.
* [Jekyll Suggested Tweet](https://github.com/davidensinger/jekyll-suggested-tweet) от [David Ensinger](https://github.com/davidensinger/): Тег Liquid для Jekyll, позволяющий вставлять твиты с помощью Intents API.
* [Jekyll Date Chart](https://github.com/GSI/jekyll_date_chart) от [GSI](https://github.com/GSI): Блок, рендерящий график с данными на основе таблиц в формате textile.
* [Jekyll Image Encode](https://github.com/GSI/jekyll_image_encode) от [GSI](https://github.com/GSI): Тег, извлекающий изображение из интернета и кодирующий его в base64.
* [Jekyll Quick Man](https://github.com/GSI/jekyll_quick_man) от [GSI](https://github.com/GSI): Тег, упрощающий генерацию ссылок на страницы документации.
* [jekyll-font-awesome](https://gist.github.com/23maverick23/8532525): Быстро и легко добавляет иконки Font Awesome в ваши посты.
* [Lychee Gallery Tag](https://gist.github.com/tobru/9171700) от [tobru](https://github.com/tobru): Подключает в пост [альбомы Lychee](http://lychee.electerious.com/). Для введения в вопрос - статья [Jekyll meets Lychee - A Liquid Tag plugin](https://tobrunet.ch/articles/jekyll-meets-lychee-a-liquid-tag-plugin/).
* [Image Set/Gallery Tag ](https://github.com/callmeed/jekyll-image-set)от [callmeed](https://github.com/callmeed): Рендерит  HTML для галереи изображений из каталога вашего сайта Jekyll. Просто передайте имя каталога и опции классов-тегов.
* [jekyll_figure](https://github.com/lmullen/jekyll_figure): Генерирует теги  `figure`  и заголовки к ним со ссылкой на фигуру в различных форматах.
* [Jekyll Github Sample Tag](https://github.com/bwillis/jekyll-github-sample): Тег liquid  для подключения образца репозитория github на ваш сайт Jekyll.
* [Jekyll Project Version Tag](https://github.com/rob-murray/jekyll-version-plugin): Плагин  Liquid рендерящий идентификатор версии вашего сайта Jekyll на основе кода из вашего репозитория git.
* [Piwigo Gallery](https://github.com/AlessandroLorenzi/piwigo_gallery) от [Alessandro Lorenzi](http://www.alorenzi.eu/): Плагин Jekyll для генерации миниатюр галереи Piwigo и отображения их тегом Liquid tag
* [mathml.rb](https://github.com/tmthrgd/jekyll-plugins) от Tom Thorogood: Плагин для конвертирования математики TeX в MathML.
* [webmention_io.rb](https://github.com/aarongustafson/jekyll-webmention_io) от [Aaron Gustafson](http://aaron-gustafson.com/): Плагин для интеграции [упоминаний](http://indiewebcamp.com/webmention), использующий [Webmention.io](http://webmention.io/). Включает опциональный JavaScript для автоматического обновления  между публикациями или в реальном времени через WebSockets.
* [Jekyll 500px Embed](https://github.com/lkorth/jekyll-500px-embed)  от Luke Korth. Тег  Liquid для подключения фото с 500px.
* [inline_highlight](https://github.com/bdesham/inline_highlight): Тег для строчной подсветки синтаксиса.
* [jekyll-mermaid](https://github.com/jasonbellamy/jekyll-mermaid): Упрощает создание блок-схем в ваших постах и страницах.
* [twa](https://github.com/Ezmyrelda/twa): Twemoji плагин для Jekyll. Тег Liquid позволяющий использовать twitter emoji на ваших страницах.
* [jekyll-files](https://github.com/x43x61x69/jekyll-files) от [Zhi-Wei Cai](http://vox.vg/): Выводит строки с относительными путями и прочей информации относительно указанных подключаемых файлов.

#### Коллекции


* [Jekyll Plugins by Recursive Design](https://github.com/recurser/jekyll-plugins): Плагины для генерации страниц проекта из файлов readme на GitHub, а также страницы категорий и карты сайта.
* [Company website and blog plugins](https://github.com/flatterline/jekyll-plugins) by Flatterline, a [Ruby on Rails development company](http://flatterline.com/): Генератор страниц портфолио/проект, страницы команды/автора, тег для биографии автора и несколько небольших плагинов.
* [Jekyll plugins by Aucor](https://github.com/aucor/jekyll-plugins): Плагин для обрезки пустых строк/пробелов и сортировки страниц по атрибуту weight .

#### Остальные


* [ditaa-ditaa  by Tom Thorogood](https://github.com/tmthrgd/ditaa-ditaa): Сильно измененный плагин jekyll-ditaa, рендерящий диаграммы с  ASCII-арт в изображения PNG.
* [Pygments Cache Path by Raimonds Simanovskis](https://github.com/rsim/blog.rayapps.com/blob/master/_plugins/pygments_cache_patch.rb): Плагин для кэширования кода, подсвечиваемого Pygments.
* [Draft/Publish Plugin by Michael Ivey](https://gist.github.com/49630): Сохранение постов как черновиков.
* [Growl Notification Generator by Tate Johnson](https://gist.github.com/490101): Пересылает уведомления Jekyll в Growl.
* [Growl Notification Hook by Tate Johnson](https://gist.github.com/525267): Улучшенная альтернатива предыдущему плагину, реализующая хуки.
* [Related Posts by Lawrence Woodman](https://github.com/LawrenceWoodman/related_posts-jekyll_plugin): Переписывает `site.related_posts` для использования категорий при определении связанных постов.
* [Tiered Archives by Eli Naeher](https://gist.github.com/88cda643aa7e3b0ca1e5): Создает многоуровневую переменную шаблона, позволяющую группировать архивы по годам и месяцам.
* [Jekyll-localization](https://github.com/blackwinter/jekyll-localization): Плагин Jekyll добавляющий к движку рендеринга возможности локализации.
* [Jekyll-rendering](https://github.com/blackwinter/jekyll-rendering): Плагин Jekyll предоставляющий альтернативные движки рендеринга.
* [Jekyll-pagination](https://github.com/blackwinter/jekyll-pagination): Плагин, расширяющий генерацию разбивки страниц.
* [Jekyll-tagging](https://github.com/pattex/jekyll-tagging): Плагин, автоматически генерирующий облако тегов и страницы тегов.
* [Jekyll-scholar](https://github.com/inukshuk/jekyll-scholar): Расширения Jekyll для учебных блогов.
* [Jekyll-asset_bundler](https://github.com/moshen/jekyll-asset_bundler): Упаковывает и минифицирует JavaScript and CSS.
* [Jekyll-assets](http://ixti.net/jekyll-assets/) by [ixti](https://github.com/ixti): Подключение ресурсов в стиле Rail ( CoffeeScript, Sass, LESS и т.д.; можно указывать зависимости простыми комментариями для  их автоматичского разрешения; минифицирует и сжимает; использует шаблоны JST; улушение кэширования и многое другое).
* [JAPR](https://github.com/kitsched/japr): Jekyll Asset Pipeline Reborn - Мощная система подключения ресурсов в Jekyll,  собирающая, конвертирующая и сжимающая  JavaScript и CSS ресурсы.
* [File compressor](https://gist.github.com/2758691) by [mytharcher](https://github.com/mytharcher): Сжатие HTML и JavaScript при сборке сайта.
* [Jekyll-minibundle](https://github.com/tkareine/jekyll-minibundle): Подключение ресурсов и улучшение кэширования с использованием внешних элементов минификации на ваш выбор. Не требует сторонних gem.
* [Singlepage-jekyll](https://github.com/JCB-K/singlepage-jekyll) от [JCB-K](https://github.com/JCB-K): Трансформирует  Jekyll в динамический одностраничный сайт.
* [generator-jekyllrb](https://github.com/robwierzbowski/generator-jekyllrb): Генератор  Jekyll для Yeoman, инструмента для сборки веб-проектов.
* [grunt-jekyll](https://github.com/dannygarcia/grunt-jekyll): Плагин Grunt для Jekyll.
* [jekyll-postfiles](https://github.com/indirect/jekyll-postfiles): Добавляет каталог `_postfiles` и тег  `{{ postfile }}`, для размещения файлов поста .
* [A layout that compresses HTML](http://jch.penibelst.de/): Совеместимый с  Github Pages способ сжатия HTML-файлов при сборке сайта.
* [Jekyll CO₂](https://github.com/wdenton/jekyll-co2): Генерирует HTML, показывающий ежемесячные изменения содержания CO₂  в воздухе по данным  Mauna Loa на Гавайях.
* [remote-include](http://www.northfieldx.co.uk/remote-include/): Подключает файлы с удаленных URL.
* [jekyll-minifier](https://github.com/digitalsparky/jekyll-minifier): Минифицирует HTML, XML, CSS и Javascript, как строчный, так и в виде отдельных файлов, используя  `yui-compressor` и `htmlcompressor`.

#### Редакторы

* [sublime-jekyll](https://github.com/23maverick23/sublime-jekyll): A Sublime Text пакет для сайтов на Jekyll. Упрощает создание постов и страниц в Jekyll, предоставляя доступ к тегам и фильтрам шаблонов, автодополнениие и т.д. Вы можете установить этот пакет вручную с GitHub или через Package Control.
* [vim-jekyll](https://github.com/parkr/vim-jekyll): Плагин для  vim, генерирующий новые посты и запускающий сервер jekyll без выхода из vim.
* [markdown-writer](https://atom.io/packages/markdown-writer): Пакет для Atom с поддержкой Jekyll. Может создавать новые посты/ черновики, управлять тегами/категориями, вставлять ссылки и изображения и добавляет полезные сочетания клавиш.
