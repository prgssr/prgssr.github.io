---
layout: doc
title: "Плагины"
description: "Плагины в Jekyll. Плагины, совместимые с GitHub. Виды плагинов - генераторы, конвертеры, команды и теги. Список доступных плагинов Jekyll."
prism: yes
---
В Jekyll реализована система плагинов с хуками, позволяющая вам генерировать кастомный контент на вашем сайте. Вы можете запустить собственный код на своем сайте без модификации Jekyll как такового.

###### Плагины на GitHub
{: .info}
[GitHub Pages](http://pages.github.com/) работают на  Jekyll. Но так как по причинам безопасности все сайты на GitHub собираются с опцией `--safe`, а значит все кастомные плагины не будут работать
{: .info}
Вы по прежнему можете использовать GitHub Pages для публикации вашего сайта, но только путем локальной сборки и отправки в репозиторий готовых статических файлов
{: .info}

На данный момент GitHub Pages [работает с 5 плагинами](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/):

* [Jemoji](https://help.github.com/articles/emoji-on-github-pages) --- поддержка emoji в постах и страницах Jekyll.
* [Jekyll-mentions](https://help.github.com/articles/mentions-on-github-pages) --- дает поддержку  @mentions в постах и страницах Jekyll.
* [Jekyll-redirect-from](https://help.github.com/articles/redirects-on-github-pages) --- добавляет возможность редиректов при смене URL поста или страницы.
* [Jekyll-sitemap](https://help.github.com/articles/sitemaps-for-github-pages) --- автоматически добавляет на сайт валидный файл sitemap.xml. Плагин необходим для нормальной работы поисковых систем.
* [Jekyll-feed ](https://help.github.com/articles/atom-rss-feeds-for-github-pages) --- автоматически генерирует трансляцию в формате [atom](https://en.wikipedia.org/wiki/Atom_%28standard%29) для вашего блога.


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
{: .info}
Вы можете использовать все методики подключения плагинов на одном сайте. Они не конфликтуют друг с другом
{: .info}

Все плагины для Jekyll можно разделить на 4 основных категории:

1. [Генераторы](#generators)
2. [Конвертеры](#converters)
3. [Команды](#commands)
4. [Теги](#tags)
5. [Хуки](#hooks)

### Генераторы
{: #generators}

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

В этом примере наш генератор создаст серию файлов в каталоге `categories` для каждой категории и создаст список постов в каждой категории, используя макет `category_index.html`.

Для работы генераторов достаточно одного метода:

Метод| Описание
-----|---------
`generate` | Генерирует контент

### Конвертеры
{: #converters}

Если у вас есть новый язык разметки, который вы хотите использовать на сайте, вы можете подключить его, создав свой плагин-конвертер. Markdown и Textile подключены именно таким образом.

###### Не забывайте о вводной  YAML
{: .info}
Jekyll  обрабатывает только файлы с вводной, даже при использовании кастомных конвертеров
{: .info}

Вот, например, конвертер, принимающий все посты заканчивающиеся `.upcase` и обрабатывающий их с помощью `UpcaseConverter`:

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

### Команды
{: #commands}

С версии 2.5.0 Jekyll может расширяться плагинами, добавляющими субкоманды. Это реализуется путем включения соответствующих файлов в группу `Gemfile` называемую `:jekyll_plugins`:

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

### Теги
{: #tags}

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
```liquid
<p>{% render_time page rendered at: %}</p>
```
{% endraw %}
В результате мы получим следующий вывод:

```liquid
<p>page rendered at: Tue June 22 23:38:47 –0500 2010</p>
```

#### Фильтры Liquid

 Вы можете добавлять свои фильтры в систему шаблонов Liquid точно также как и теги. Фильтры это простые модули, экспортирующие свои методы в Liquid. Все методы принимают как минимум один параметр --- входные данные для фильтра. Возвращает фильтр обработанные данные.

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
{: .protip}
Jekyll  дает вам доступ к объекту `site` через объект Liquid `context.registers` --- `context.registers[:site]`. Например, вы можете получить доступ к конфигурации `_config.yml` через `context.registers[:site].config`
{: .protip}

#### Флаги

При написании плагинов надо учитывать два флага:

Флаг| Описание
----|---------
`safe`| Логический флаг, сообщающий Jekyll, может ли этот плагин безопасно запускаться в среде, где запрещено выполнение произвольного кода.  Это используется на GitHub Pages для определения, какие базовые плагины будут использоваться, а какие запускать небезопасно . Если ваш плагин не допускает исполнение произвольного кода, задайте этот флаг как `true`. GitHub Pages по прежнему не будут загружать ваш плагин, но если вы захотите, чтобы этот плагин был включен в ядро, это поле должно быть заполнено правильно!
`priority` | Флаг определяет порядок загрузки плагина. Валидные значения: `:lowest`, `:low`, `:normal`, `:high` и`:highest`. Сначала загружаются плагины с высшим приоритетом, в конце --- с низшим.

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

### Хуки
{: #hooks}

Используя хуки, ваш плагин получает точный контроль над различными аспектами процесса сборки. Если в вашем плагине заданы хуки, Jekyll будет вызывать их в заданные моменты.

Хуки регистрируются с указанием контейнера и названия события. Для регистрации надо вызвать `Jekyll::Hooks.register` и передать контейнер, название событие и исполняемый код при запуске хука. Например, если вы хотите добавит какой-либо функционал при каждом рендеринге поста, вам нужно зарегистрировать хук типа этого:

```ruby
Jekyll::Hooks.register :posts, :post_render do |post|
  # code to call after Jekyll renders a post
end
```

В Jekyll есть хуки для `:site`, `:pages`, `:posts` и `:documents`. Во всех случаях  Jekyll вызывает ваши хуки с объектом контейнера в качестве первого параметра обратного вызова. Но в случае с `:pre_render` ваш хук будет принимать хэш с полезной нагрузкой в качестве второго параметра, что дает полный контроль над переменными, доступными при рендеринге.

Вот полный список доступных хуков:

Контейнер | Событие |Момент вызова
----------|---------|-------------
`:site` | `:after_init` |Сразу после инициализации сайта, но перед настройкой и рендерингом. Подходит для модификации конфигурации сайта.
`:site` | `:after_reset` | После сброса сайта.
`:site` | `:post_read` | После чтения данных сайта с диска.
`:site` | `:pre_render `| Прямо перед рендерингом всего сайта.
`:site` | `:post_render` | После рендеринга сайта, но до записи каких-либо файлов.
`:site` | `:post_write` | После записи всего сайта на диск.
`:pages` | `:post_init` | При инициализации страницы.
`:pages` | `:pre_render` | Прямо перед рендерингом страницы.
`:pages` | `:post_render` | После рендеринга страницы, но до записи на диск.
`:pages` | `:post_write` | После записи страницы на диск.
`:posts` | `:post_init` | При инициализации поста.
`:posts` | `:pre_render` | Прямо перед рендерингом поста.
`:posts` | `:post_render` | После рендеринга поста, но до записи на диск.
`:posts` | `:post_write` | После записи поста на диск.
`:documents` | `:post_init` | При инициализации документа.
`:documents` | `:pre_render` | Прямо перед рендерингом документа.
`:documents` | `:post_render` | После рендеринга документа, но до записи на диск
`:documents` | `:post_write` | После записи документа на диск.

### Доступные плагины

Вот некоторые из доступных плагинов:

#### Генераторы


* [ArchiveGenerator от Ilkka Laukkanen](https://gist.github.com/707909): Использует [эту архивную страницу](https://gist.github.com/707020) для генерации архивов.
* [LESS.js Generator от Andy Fowler](https://gist.github.com/642739): Рендерит файлы LESS.js при сборке.
* [Version Reporter от Blake Smith](https://gist.github.com/449491): Создает файл version.html с указанием версии Jekyll.
* [Sitemap.xml Generator от Michael Levin](https://github.com/kinnetica/jekyll-plugins): Генерирует файл sitemap.xml, проходя через все доступные страницы и посты.
* [Full-text search от Pascal Widdershoven](https://github.com/PascalW/jekyll_indextank): Добавляет полнотекстовый поиск на ваш сайт Jekyll с помощью плагина и небольшого количества  JavaScript.
* [AliasGenerator от Thomas Mango](https://github.com/tsmango/jekyll_alias_generator): Генерирует страницы редиректа для постов, в которых псевдоним указан во ввводной YAML.
* [Pageless Redirect Generator от Nick Quinlan](https://github.com/nquinlan/jekyll-pageless-redirects): Генерирует редиректы на основе файлов в корневом каталоге Jekyll, поддерживает редирект в стиле htaccess.
* [RssGenerator от Assaf Gelber](https://github.com/agelber/jekyll-rss): Автоматически создает фид RSS 2.0 из ваших постов.
* [Monthly archive generator от Shigeya Suzuki](https://github.com/shigeya/jekyll-monthly-archive-plugin): Генератор и шаблон, создающий архивы месяцев в стиле MovableType, основан на работе Ilkka Laukkanen.
* [Category archive generator от Shigeya Suzuki](https://github.com/shigeya/jekyll-category-archive-plugin): Генератор и шаблон, создающий архивы категорий в стиле MovableType , основан на Monthly archive generator.
* [Emoji for Jekyll](https://github.com/yihangho/emoji-for-jekyll): Подключает  emoji ко всем постам и страницам.
* [Compass integration for Jekyll](https://github.com/mscharley/jekyll-compass): Интегрирует Compass и Sass на сайта Jekyll.
* [Pages Directory от Ben Baker-Smith](https://github.com/bbakersmith/jekyll-pages-directory): Определяет каталог  `_pages` для файлов страниц, маршрутизируя их вывод относительно корневого каталога.
* [Page Collections от Jeff Kolesky](https://github.com/jeffkole/jekyll-page-collections): Генерирует коллекцию страниц с функциональностью постов.
* [Windows 8.1 Live Tile Generation от Matt Sheehan](https://github.com/sheehamj13/jekyll-live-tiles): Генерирует config.xml для Internet Explorer 11  и плиточный шаблон для интеграции вашего сайта к Windows 8.1.
* [Jekyll::AutolinkEmail от Ivan Tse](https://github.com/ivantsepp/jekyll-autolink_email): Автоматические ссылки для email.
* [Jekyll::GitMetadata от Ivan Tse](https://github.com/ivantsepp/jekyll-git_metadata): Открывает метаданные Git для ваших шаблонов.
* [Jekyll Http Basic Auth Plugin](https://gist.github.com/snrbrnjna/422a4b7e017192c284b3): Плагин для управления базовой http аутентификацией для сгенерированных jekyll страниц и каталогов
* [Jekyll Auto Image от Merlos](https://github.com/merlos/jekyll-auto-image): Делает первое изображение в посте доступным для шаблонов в качестве переменной. Полезно для создания списка постов с изображениями или для добавления twitter-карт на ваш сайт.
* [Jekyll Portfolio Generator от Shannon Babincsak](https://github.com/codeinpink/jekyll-portfolio-generator): Генерирует страницы проекта и вычисляет связанные проекты из файлов с данными проекта.
* [Jekyll-Umlauts от Arne Gockeln](https://github.com/webchef/jekyll-umlauts): Этот генератор заменяет все умляуты (äöüß) корректными эквивалентами в юникоде.
* [Jekyll Flickr Plugin](https://github.com/lawmurray/indii-jekyll-flickr) от [Lawrence Murray](http://www.indii.org/): Генерирует посты на основе альбомов фотографий, загруженных на Flickr.
* [Jekyll::Paginate::Category](https://github.com/midnightSuyama/jekyll-paginate-category): Разбивка на страницы категорий в Jekyll.
* [AMP-Jekyll от Juuso Mikkonen](https://github.com/juusaw/amp-jekyll): Генерирует [ускоренные мобильные страницы (AMP)](https://www.ampproject.org/) для постов в Jekyll.

#### Конвертеры


* [Textile converter](https://github.com/jekyll/jekyll-textile-converter): Конвертирует файлы  `.textile ` в HTML.Также включает фильтр Liquid `textilize`.
* [Slim plugin](https://github.com/slim-template/jekyll-slim): Конвертер Slim, включающий поддержку тегов Liquid
* [Jade plugin от John Papandriopoulos](https://github.com/snappylabs/jade-jekyll-plugin): Конвертер Jade дляJekyll.
* [HAML plugin от Sam Z](https://gist.github.com/517556): Конвертер HAML для Jekyll.
* [HAML-Sass Converter от Adam Pearson](https://gist.github.com/481456): Простой HAML-Sass конвертер для Jekyll. [Форк](https://gist.github.com/528642) от Sam X.
* [Sass SCSS Converter от Mark Wolfe](https://gist.github.com/960150): Конвертер Sass, использующий новый, CSS-совместимый синтаксисx, основан на предыдущем форке от Sam X.
* [LESS Converter от Jason Graham](https://gist.github.com/639920): Конвертер  LESS в CSS.
* [LESS Converter от Josh Brown](https://gist.github.com/760265): Простой конвертер LESS.
* [Upcase Converter от Blake Smith](https://gist.github.com/449463): Образец конвертера Jekyll.
* [CoffeeScript Converter от phaer](https://gist.github.com/959938): Конвертер CoffeeScript в Javascript.
* [Markdown References от Olov Lassus](https://github.com/olov/jekyll-references): Позволяет хранить все ссылки markdown в одном файле  _references.md.
* [Stylus Converter](https://gist.github.com/988201): Конвертер Stylus в css.
* [ReStructuredText Converter](https://github.com/xdissent/jekyll-rst): Конвертирует документы ReST в HTML с подсветкой Pygments.
* [Jekyll-pandoc-plugin](https://github.com/dsanson/jekyll-pandoc-plugin): Подключает pandoc для рендеринга markdown.
* [Jekyll-pandoc-multiple-formats от edsl](https://github.com/fauno/jekyll-pandoc-multiple-formats): Использует pandoc для генерации вашего сайта в различных форматах. Поддерживает pandoc-расширения markdown.
* [Transform Layouts](https://gist.github.com/1472645): Поддержка макетов HAML  (для работы нужен установленный конвертер HAML).
* [Org-mode Converter](https://gist.github.com/abhiyerra/7377603): Конвертер Org-mode для Jekyll.
* [Customized Kramdown Converter](https://github.com/mvdbos/kramdown-with-pygments): Подключает подсветку синтаксиса Pygments для блоков кода Kramdown-.
* [Bigfootnotes Plugin](https://github.com/TheFox/jekyll-bigfootnotes): Поддержка больших сносок в Kramdown.
* [AsciiDoc Plugin](https://github.com/asciidoctor/jekyll-asciidoc): Конвертер AsciiDoc , использующий Asciidoctor.
* [Lazy Tweet Embedding](https://github.com/takuti/jekyll-lazy-tweet-embedding): Автоматически конвертирует URL Твиттера в твиттер-карты, т.е. красиво выводит содержимое твита на месте ссылки.
* [jekyll-commonmark](https://github.com/pathawks/jekyll-commonmark): Конвертер Markdown, использующий [libcmark](https://github.com/jgm/CommonMark), стандартный парсер CommonMark.

#### Фильтры


* [Truncate HTML](https://github.com/MattHall/truncatehtml) от [Matt Hall](http://codebeef.com/): Фильтр  Jekyll, обрезающий HTML сохраняя структуру разметки.
* [Domain Name Filter от Lawrence Woodman](https://github.com/LawrenceWoodman/domain_name-liquid_filter): Фильтрует URL, оставляя доменное имя.
* [Summarize Filter от Mathieu Arnold](https://gist.github.com/731597): Удаляет разметку после тега `<div id="extended"> `.
* [i18n_filter](https://github.com/gacha/gacha.id.lv/blob/master/_plugins/i18n_filter.rb): Фильтр Liquid для использования локализации I18n.
* [Smilify](https://github.com/SaswatPadhi/jekyll_smilify) от [SaswatPadhi](https://github.com/SaswatPadhi): Заменяет текстовые смайлики в вашем контенте картинками.
* [Read in X Minutes](https://gist.github.com/zachleat/5792681) от [zachleat](https://github.com/zachleat): Выводит ожидаемое время чтения (для содержимого поста).
* [Jekyll-timeago](https://github.com/markets/jekyll-timeago): Конвертирует время из цифр в текст.
* [pluralize](https://github.com/bdesham/pluralize): Совмещает числа и слова с учетом множественного или единственного числа, например, “1 minute” или “2 minutes”.
* [reading_time](https://github.com/bdesham/reading_time): Подсчитывает слова и ожидаемое время чтения, игнорируя HTML-элементы не содержащие текст.
* [Table of Content Generator](https://github.com/dafi/jekyll-toc-generator): Генерирует HTML-код, содержащий оглавление, кастомизируется --- можно указать страницы-исключения.
* [jekyll-humanize](https://github.com/23maverick23/jekyll-humanize): Это портированное приложение Django  `humanize`, с разнообразными методами для изменения вида дат и цифровых данных в "человекопонятном виде". Каждый метод это фильтр, который можно использовать в шаблонах Jekyll. Некоторые оригинальные методы не портированы (например, naturaltime).
* [Jekyll-Ordinal](https://github.com/PatrickC8t/Jekyll-Ordinal): Jekyll фильтр для конвертации количественных числительных в порядковые ---  “st”, “nd”, “rd”, or “th”.
* [Deprecated articles keeper](https://github.com/kzykbys/JekyllPlugins) от [Kazuya Kobayashi](http://blog.kazuya.co/): Простой фильтр Jekyll для определения "старых статей".
* [Jekyll-jalali](https://github.com/mehdisadeghi/jekyll-jalali) от [Mehdi Sadeghi](http://mehdix.ir/): Простой конвертер из грегорианского в иранский календарь.
* [Jekyll Thumbnail Filter](https://github.com/matallo/jekyll-thumbnail-filter): Фильтр для миниатюр связанных постов.
* [Jekyll-Smartify](https://github.com/pathawks/jekyll-smartify): Фильтр SmartyPants. Делает кавычки фигурными.
* [liquid-md5](https://github.com/pathawks/liquid-md5): Возвращает хэш MD5. Полезен для генерации [граватаров](https://ru.gravatar.com/) в шаблонах.
* [jekyll-roman](https://github.com/paulrobertlloyd/jekyll-roman): Фильтр  liquid для Jekyll, конвертирующий цифры в Римские.
* [jekyll-typogrify](https://github.com/myles/jekyll-typogrify): Плагин  Jekyll с функционалом [typogruby](http://avdgaag.github.io/typogruby/).
* [Jekyll Email Protect](https://github.com/vwochnik/jekyll-email-protect): Фильтр  liquid для защиты адресов электронной почты от спама.


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
* [Jekyll-devonly_tag](https://gist.github.com/2403522): Тег для подключения разметки, необходимой только на период разработки.
* [JekyllGalleryTag ](https://github.com/redwallhp/JekyllGalleryTag) от [redwallhp](https://github.com/redwallhp): Генерирует миниатюры из каталога изображений и отображает их сеткой.
* [Youku and Tudou Embed](https://gist.github.com/Yexiaoxing/5891929): Плагин Liquid для подключения видео с Youku и Tudou.
* [Jekyll-swfobject](https://github.com/sectore/jekyll-swfobject): Плагин Liquid для подключения файлов Adobe Flash  (.swf) с помощью SWFObject.
* [Jekyll Picture Tag](https://github.com/robwierzbowski/jekyll-picture-tag): Отзывчивые изображения для Jekyll. Основан на элементе `<picture>` element, использует [полифилл](https://github.com/scottjehl/picturefill)  Scott Jehl.
* [Jekyll Image Tag](https://github.com/robwierzbowski/jekyll-image-tag): Улучшение изображений для Jekyll. Сохраняет настройки изображений, изменяет размер, добавляет классы, описание и прочие атрибуты.
* [Jekyll Responsive Image](https://github.com/wildlyinaccurate/jekyll-responsive-image): Отзывчивые изображения для Jekyll. Автоматическое изменение размеров изображений,поддержка всех методов внедрения отзывчивости (<picture>, srcset, Imager.js, etc) и гибкая настройка.
* [Ditaa Tag](https://github.com/matze/jekyll-ditaa) от [matze](https://github.com/matze): Рендерит  ASCII-арт в изображения PNG и вставляет тег figure.
* [Jekyll Suggested Tweet](https://github.com/davidensinger/jekyll-suggested-tweet) от [David Ensinger](https://github.com/davidensinger/): Тег Liquid для Jekyll, позволяющий вставлять твиты с помощью Intents API.
* [Jekyll Date Chart](https://github.com/GSI/jekyll_date_chart) от [GSI](https://github.com/GSI): Блок, рендерящий график с данными на основе таблиц в формате textile.
* [Jekyll Image Encode](https://github.com/GSI/jekyll_image_encode) от [GSI](https://github.com/GSI): Тег, извлекающий изображение из интернета и кодирующий его в base64.
* [Jekyll Quick Man](https://github.com/GSI/jekyll_quick_man) от [GSI](https://github.com/GSI): Тег, упрощающий генерацию ссылок на страницы документации.
* [jekyll-font-awesome](https://gist.github.com/23maverick23/8532525): Быстро и легко добавляет иконки Font Awesome в ваши посты.
* [Lychee Gallery Tag](https://gist.github.com/tobru/9171700) от [tobru](https://github.com/tobru): Подключает в пост [альбомы Lychee](http://lychee.electerious.com/). Для введения в вопрос --- статья [Jekyll meets Lychee --- A Liquid Tag plugin](https://tobrunet.ch/articles/jekyll-meets-lychee-a-liquid-tag-plugin/).
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
* [Fetch remote file content](https://github.com/dimitri-koenig/jekyll-plugins) от [Dimitri König](https://www.dimitrikoenig.net/): Используя тег `remote_file_content` вы можете извлекать содержимое файла с другого сервера и включать его непосредственно в свой файл  markdown. Очень удобно  подключать кода из репозиториев github с постоянным выводом актуальной версии  из репозитория.
* [jekyll-asciinema](https://github.com/mnuessler/jekyll-asciinema): Тег для подключения сессий в терминале, созданных с помощью  [asciinema ](https://asciinema.org/).
* [Jekyll-Youtube](https://github.com/dommmel/jekyll-youtube) Тег Liquid, подключающий видео с  Youtube с отзывчивой разметкой (при желании вы можете использовать свою разметку, подключив соответствующий фрагмент).
* [Jekyll Flickr Plugin](https://github.com/lawmurray/indii-jekyll-flickr) от [Lawrence Murray](http://www.indii.org/): Подключает альбомы Flickr  в виде галереи с иконками и встроенным лайтбоксом для просмотра увеличенного изображения.
* [jekyll-figure](https://github.com/paulrobertlloyd/jekyll-figure): Тег liquid, генерирующий элемент `<figure>`. 
* [Jekyll Video Embed](https://github.com/eug/jekyll-video-embed): Плагин предоставляет несколько тегов для подключаения на страницу видео с разных источников (Youtube, Vimeo, UStream и Ted Talks).
* [jekyll-i18n_tags](https://github.com/KrzysiekJ/jekyll-i18n_tags): Тег для переводов.
* [Jekyll Ideal Image Slider](https://github.com/xHN35RQ/jekyll-ideal-image-slider): Тег Liquid для создания слайдеров с изображениями на основе [Ideal Image Slider](https://github.com/gilbitron/Ideal-Image-Slider).

#### Коллекции


* [Jekyll Plugins от Recursive Design](https://github.com/recurser/jekyll-plugins): Плагины для генерации страниц проекта из файлов readme на GitHub, а также страницы категорий и карты сайта.
* [Company website and blog plugins](https://github.com/flatterline/jekyll-plugins) от Flatterline, a [Ruby on Rails development company](http://flatterline.com/): Генератор страниц портфолио/проект, страницы команды/автора, тег для биографии автора и несколько небольших плагинов.
* [Jekyll plugins от Aucor](https://github.com/aucor/jekyll-plugins): Плагин для обрезки пустых строк/пробелов и сортировки страниц по атрибуту weight .

#### Остальные


* [ditaa-ditaa  от Tom Thorogood](https://github.com/tmthrgd/ditaa-ditaa): Сильно измененный плагин jekyll-ditaa, рендерящий диаграммы с  ASCII-арт в изображения PNG.
* [Pygments Cache Path от Raimonds Simanovskis](https://github.com/rsim/blog.rayapps.com/blob/master/_plugins/pygments_cache_patch.rb): Плагин для кэширования кода, подсвечиваемого Pygments.
* [Draft/Publish Plugin от Michael Ivey](https://gist.github.com/49630): Сохранение постов как черновиков.
* [Growl Notification Generator от Tate Johnson](https://gist.github.com/490101): Пересылает уведомления Jekyll в Growl.
* [Growl Notification Hook от Tate Johnson](https://gist.github.com/525267): Улучшенная альтернатива предыдущему плагину, реализующая хуки.
* [Related Posts от Lawrence Woodman](https://github.com/LawrenceWoodman/related_posts-jekyll_plugin): Переписывает `site.related_posts` для использования категорий при определении связанных постов.
* [Tiered Archives от Eli Naeher](https://gist.github.com/88cda643aa7e3b0ca1e5): Создает многоуровневую переменную шаблона, позволяющую группировать архивы по годам и месяцам.
* [Jekyll-localization](https://github.com/blackwinter/jekyll-localization): Плагин Jekyll добавляющий к движку рендеринга возможности локализации.
* [Jekyll-rendering](https://github.com/blackwinter/jekyll-rendering): Плагин Jekyll предоставляющий альтернативные движки рендеринга.
* [Jekyll-pagination](https://github.com/blackwinter/jekyll-pagination): Плагин, расширяющий генерацию разбивки страниц.
* [Jekyll-tagging](https://github.com/pattex/jekyll-tagging): Плагин, автоматически генерирующий облако тегов и страницы тегов.
* [Jekyll-scholar](https://github.com/inukshuk/jekyll-scholar): Расширения Jekyll для учебных блогов.
* [Jekyll-asset_bundler](https://github.com/moshen/jekyll-asset_bundler): Упаковывает и минифицирует JavaScript and CSS.
* [Jekyll-assets](http://ixti.net/jekyll-assets/) от [ixti](https://github.com/ixti): Подключение ресурсов в стиле Rail ( CoffeeScript, Sass, LESS и т.д.; можно указывать зависимости простыми комментариями для  их автоматичского разрешения; минифицирует и сжимает; использует шаблоны JST; улушение кэширования и многое другое).
* [JAPR](https://github.com/kitsched/japr): Jekyll Asset Pipeline Reborn --- Мощная система подключения ресурсов в Jekyll,  собирающая, конвертирующая и сжимающая  JavaScript и CSS ресурсы.
* [File compressor](https://gist.github.com/2758691) от [mytharcher](https://github.com/mytharcher): Сжатие HTML и JavaScript при сборке сайта.
* [Jekyll-minibundle](https://github.com/tkareine/jekyll-minibundle): Подключение ресурсов и улучшение кэширования с использованием внешних элементов минификации на ваш выбор. Не требует сторонних gem.
* [Singlepage-jekyll](https://github.com/JCB-K/singlepage-jekyll) от [JCB-K](https://github.com/JCB-K): Трансформирует  Jekyll в динамический одностраничный сайт.
* [generator-jekyllrb](https://github.com/robwierzbowski/generator-jekyllrb): Генератор  Jekyll для Yeoman, инструмента для сборки веб-проектов.
* [grunt-jekyll](https://github.com/dannygarcia/grunt-jekyll): Плагин Grunt для Jekyll.
* [jekyll-postfiles](https://github.com/indirect/jekyll-postfiles): Добавляет каталог `_postfiles` и тег  `{{ postfile }}`, для размещения файлов поста .
* [A layout that compresses HTML](http://jch.penibelst.de/): Совеместимый с  Github Pages способ сжатия HTML-файлов при сборке сайта.
* [Jekyll CO₂](https://github.com/wdenton/jekyll-co2): Генерирует HTML, показывающий ежемесячные изменения содержания CO₂  в воздухе по данным  Mauna Loa на Гавайях.
* [remote-include](http://www.northfieldx.co.uk/remote-include/): Подключает файлы с удаленных URL.
* [jekyll-minifier](https://github.com/digitalsparky/jekyll-minifier): Минифицирует HTML, XML, CSS и Javascript, как строчный, так и в виде отдельных файлов, используя  `yui-compressor` и `htmlcompressor`.
* [Jekyll views router](https://bitbucket.org/nyufac/jekyll-views-router): Простой роутер между плагинами-генераторами и шаблонами.
* [Jekyll Language Plugin](https://github.com/vwochnik/jekyll-language-plugin): Совместимый с  Jekyll 3.0 мультиязычный плагин для постов, страниц и фрагментов.
* [Jekyll Deploy](https://github.com/vwochnik/jekyll-deploy): Добавляет подкоманду для развертывания.
* [Official Contentful Jekyll Plugin](https://github.com/contentful/jekyll-contentful-data-import): Добавляет подкоманду `contentful` для импорта данных из Contentful.
* [jekyll-paspagon](https://github.com/KrzysiekJ/jekyll-paspagon): Добавляет возможность продажи постов в различных форматах за криптовалюты.
* [Hawkins](https://github.com/awood/hawkins): Добавляет в Jekyll подкоманду `liveserve`, инкорпорирующую `LiveReload` для предпросмотра страниц в браузере в реальном времени без нажатия на F5!
* [Jekyll Autoprefixer](https://github.com/vwochnik/jekyll-autoprefixer): Интеграция в Jekyll автопрефиксера. 
* [Jekyll-breadcrumbs](https://github.com/git-no/jekyll-breadcrumbs): Создает "хлебные крошки" в Jekyll 3.x, с учетом СЕО-оптимизациии, поддержки переводов и прочего.


#### Плагины для редакторов

* [sublime-jekyll](https://github.com/23maverick23/sublime-jekyll): A Sublime Text пакет для сайтов на Jekyll. Упрощает создание постов и страниц в Jekyll, предоставляя доступ к тегам и фильтрам шаблонов, автодополнениие и т.д. Вы можете установить этот пакет вручную с GitHub или через Package Control.
* [vim-jekyll](https://github.com/parkr/vim-jekyll): Плагин для  vim, генерирующий новые посты и запускающий сервер jekyll без выхода из vim.
* [markdown-writer](https://atom.io/packages/markdown-writer): Пакет для Atom с поддержкой Jekyll. Может создавать новые посты/ черновики, управлять тегами/категориями, вставлять ссылки и изображения и добавляет полезные сочетания клавиш.
* [Wordpress2Jekyll](https://wordpress.org/plugins/wp2jekyll/): Плагин для Wordpress, позволяющий использовать  Wordpress в качестве редактора и автоматически экспортировать контент в Jekyll. WordPress2Jekyll сближает эти две системы управления контентом и облегчает управление сайтом с любого устройства.
