---
layout: doc
title: "Конфигурация"
description: "Конфигурация Jekyll. Файл _config.yml. Опции при сборке в командной строке. Опции команд для сервера. Значения вводных по умолчанию. Дефолтные настройки."
prism: yes
---
# Конфигурация

Jekyll позволяет вам свободно создавать сайты в соответствии с вашими идеями и все это благодаря конфигурационным опциям. Эти опции можно задать в файле `_config.yml`, расположенном в корне сайта или путем установки нужных флагов при выполнении команд `jekyll` в терминале.

### Настройки конфигурации

#### Глобальная конфигурация

В таблице ниже перечислены доступные настройки для Jekyll, в виде опций конфигурационного файла и флагов в командной строке:

Настройка |Опции и флаги
----------|-------------
`Site Source` Изменяет каталог, из которого Jekyll считывает файлы |`source: DIR -s`,` --source DIR`
`Site Destination` Изменяет каталог, в который Jekyll записывает файлы | `destination: DIR -d`, `--destination DIR`
`Safe Disable` custom plugins, and ignore symbolic links. |`safe: BOOL ` `--safe`
`Exclude` Исключает каталоги/файлы из обработки. Все каталоги указываются относительно каталога с исходниками сайта и не могут находиться за его пределами. | `exclude: [DIR, FILE, ...]`
`Include` Подключает каталоги/файлы в обработку. Хороший пример - `.htaccess` , т.к. файлы, начинающиеся с точки по умолчанию не обрабатываются |`include: [DIR, FILE, ...]`
`Keep files` Сохраняет указанные файлы при очистке каталога назначения. Полезно для файлов, не генерируемых Jekyll, например,  сгенерированных системой сборки. Пути указываются относительно каталога назначения. |`keep_files: [DIR, FILE, ...]`
`Time Zone` Настройка временной зоны для сгенерированного файла. Задает значение переменной TZ окружения, которую Rubyиспользует для операций с временем и датами. Валидным является любое значение из [IANA Time Zone Database](http://en.wikipedia.org/wiki/Tz_database), например, America/New_York. Список возможных значений доступен [здесь](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Дефолтным является значение вашей операционной системы. |`timezone: TIMEZONE`
`Encoding` Задает дефолтную кодировку для имен файлов, доступно с Ruby 1.9+. Дефолтное значение `-utf-8` начиная с Ruby 2.0.0, и nil для версий старше, чем 2.0.0 ( дефолтная кодировка Ruby -  ASCII-8BIT). Доступные кодировки можно просмотреть командой: `ruby -e 'puts Encoding::list.join("\n")'`.|`encoding: ENCODING`
`Defaults` Дефолтные значения для вводной YAML.  | См. [ниже](/documentation/06_configuration.html#front-matter-defaults)

##### *Каталог назначение очищается после сборки*

***Содержимое каталога, в котором собирается сайт по умолчанию автоматически очищается в процессе сборки. Все файлы и каталоги, не созданные Jekyll удаляются. Некоторые файлы можно оставить, используя директиву `<keep_files>`. Не используйте важный каталог в качестве каталога назначения; взамен этого копируйте из него  нужные файлы.***

####  Опции при сборке в командной строке (build)

Настройка |Опции и флаги
----------|-------------
`Regeneration` Авто-регенерация сайта при модификации файлов|`-w, --watch`
`Configuration` Определяет конфигурационный файл вместо `_config.yml`. Настройки в более позднем файле имеют приоритет перед более ранними. | `--config FILE1[,FILE2,...]`
`Drafts` Обработка и рендеринг черновиков. |`--drafts`
`Future` Публикация постов с датой из будущего.| `future: BOOL` `--future`
`LSI` Создание индекса связанных постов. | `lsi: BOOL` `--lsi`
`Limit Posts` Лимит постов для парсинга и публикации | `limit_posts: NUM` `--limit_posts NUM`
`Force polling` Принудительный мониторинг обновлений файлов для сервера.| `--force_polling`
`Verbose output` Вывод сообщений. | `-V, --verbose`
`Silence Output` Отключение сообщений при сборке|` -q, --quiet`

#### Опции команд для сервера

В дополнение к  указанным опциям, подкоманда `serve ` может принимать опции подкоманды  `build`.

Настройка |Опции и флаги
----------|-------------
`Local Server Port` Указывает порт для локального сервера. | `port: PORT`, `--port PORT`
`Local Server Hostname` Указывает имя для локального сервера. | `host: HOSTNAME` , `--host HOSTNAME`
`Base URL` Работает с указанным базовым URL| `baseurl: URL` , `--baseurl URL`
`Detach` Отключает сервер от терминала| `detach: BOOL` , `-B, --detach`
`Skips the initial site build.` Пропускает первоначальную сборку, проходящую перед стартом сайта. | `--skip-initial-build`

###### Не используйте табуляцию в конфигурационных файлах
***Это влечет ошибки парсинга или сброс всех настроек на дефолтные значения. Используйте пробелы.***

### [Значения вводных по умолчанию](#front-matter-defaults)

Использование [вводной YAML](/documentation/07_frontmatter.html) это один из способов настройки страниц и постов на вашем сайте. Настройка таких вещей как макет по умолчанию, кастомизация заголовка или определение более точных даты и времени поста - все это делается через вводную.

Очень часто одни и те же  настройки повторяются. Назначение одного макета каждому файлу, добавление категории каждому посту и.д. И даже кастомные настройки могут повторяться многократно, такие как имя автора, например.

Вместо повторения этой конфигурации постоянно при создании новых страниц/постов Jekyll дает возможность настроить это все по умолчанию в конфигурации сайта. Для этого вам надо задать глобальные опции с помощью ключа `defaults` в файле `_config.yml `, расположенном в корневом каталоге.

Ключ `defaults`  содержит массив из пар `scope/values`, определяющих какие умолчания должны использоваться к определенным файлам/каталогам или типам файлов в каталогах.

Предположим, вы хотите добавить макет ко всем страницам и постам на сайте. Вы добавите следующие строки в файл `_config.yml`:

```yaml
defaults:
  -
    scope:
      path: "" # an empty string here means all files in the project
    values:
      layout: "default"
```

В этом примере мы применяем заданные значения (`values`) к любому файлу, расположенному по указанному пути. Так как путь указан пустой, эти значения применяются ко всем файлам в проекте. Возможно, вы не хотите назначать макет всем файлам (например, файлам CSS) - вы можете задать тип файла `type` в ключе `scope`:

```yaml
defaults:
  -
    scope:
      path: "" # an empty string here means all files in the project
      type: "posts" # previously `post` in Jekyll 2.2.
    values:
      layout: "default"
```

Теперь мы задаем макет только для файлов типа `posts`. К числу доступных типов относятся `pages`, `posts`, `drafts`, а также любые коллекции на сайте. Указание `type ` является опциональным, а `path` обязательным.

Как упоминалось раннее, вы можете задать множественные пары `scope/values` для `defaults`.

```yaml
defaults:
  -
    scope:
      path: ""
      type: "posts"
    values:
      layout: "my-site"
  -
    scope:
      path: "projects"
      type: "pages" # previously `page` in Jekyll 2.2.
    values:
      layout: "project" # overrides previous default layout
      author: "Mr. Hyde"
```

С такими настройками все посты будут по умолчанию использовать макет `my-site `. А любые страницы в каталоге `projects/` будут использовать макет `project`. также в этих страницах  [переменной liquid](/documentation/12_variables.html/) `page.author`  будет задано значение `Mr. Hyde`.

```yaml
collections:
  - my_collection:
    output: true

defaults:
  -
    scope:
      path: ""
      type: "my_collection" # a collection in your site, in plural form
    values:
      layout: "default"
```

В этом примере [коллекции](/documentation/13_collections.html/) с названием `my_collection` задан макет `default`.

#### Приоритеты

Jekyll применит все настройки заданные вами в секции `defaults` файла `_config.yml`. Однако вы можете переписать эти настройки, указав более специфичный путь.

Вы можете увидеть это в последнем примере. Сначала мы задаем в качестве дефолтного макет `my-site`. Затем, используя более специфичный путь, мы задаем макет `project` для файлов в каталоге `projects/`. Так можно переписать любое значение во вводной поста или страницы.

Наконец, если вы задаете дефолтные настройки, добавляя секцию `defaults` в файле `_config.yml` , то вы можете изменить их в любом посте или странице. Вам нужно просто переписать эти настройки во вводной страницы:

```yaml
# In _config.yml
...
defaults:
  -
    scope:
      path: "projects"
      type: "pages"
    values:
      layout: "project"
      author: "Mr. Hyde"
      category: "project"
...
```

```yaml
# In projects/foo_project.md
---
author: "John Smith"
layout: "foobar"
---
The post text goes here...
```


В результате после сборки файлу `projects/foo_project.md `  будет задан макет `foobar ` вместо `project` и автор `John Smith` вместо `Mr. Hyde`.

### Конфигурация по умолчанию

Jekyll по умолчанию запускается со следующими настройками. Альтернативные настройки этих опций могут быть заданы в файле конфигурации или в командной строке.

###### Две опции kramdown не поддерживаются
***На данный момент опции `remove_block_html_tags ` и `remove_span_html_tags` не поддерживаются, так как не включены в конвертер kramdown ->HTML ***
 
```yaml
# Расположение
source:      .
destination: ./_site
plugins:     ./_plugins
layouts:     ./_layouts
data_source: ./_data
collections: null
```
  
```yaml
# Обработка текста
safe:         false
include:      [".htaccess"]
exclude:      []
keep_files:   [".git", ".svn"]
encoding:     "utf-8"
markdown_ext: "markdown,mkdown,mkdn,mkd,md"
```
 
```yaml
# Фильтрация контента
show_drafts: null
limit_posts: 0
future:      true
unpublished: false
```
 
```yaml
# Плагины
whitelist: []
gems:      []
```

```yaml
# Конверсия
markdown:    kramdown
highlighter: rouge
lsi:         false
excerpt_separator: "\n\n"
``` 
 
```yaml
# Сервер
detach:  false
port:    4000
host:    127.0.0.1
baseurl: "" # does not include hostname
```
 
```yaml
# Обратная совместимость
relative_permalinks: false
```
 
```yaml
# Вывод
permalink:     date
paginate_path: /page:num
timezone:      null

quiet:    false
defaults: []
```
 
```yaml
# Процессоры Markdown 
maruku:
  use_tex:    false
  use_divs:   false
  png_engine: blahtex
  png_dir:    images/latex
  png_url:    /images/latex
  fenced_code_blocks: true

rdiscount:
  extensions: []

redcarpet:
  extensions: []

kramdown:
  auto_ids:       true
  footnote_nr:    1
  entity_output:  as_char
  toc_levels:     1..6
  smart_quotes:   lsquo,rsquo,ldquo,rdquo
  enable_coderay: false

  coderay:
    coderay_wrap:              div
    coderay_line_numbers:      inline
    coderay_line_number_start: 1
    coderay_tab_width:         4
    coderay_bold_every:        10
    coderay_css:               style
```
 
### [Опции Markdown ](#markdown-options)

Jekyll  поддерживает различные движки рендеринга Markdown, некоторые опции в них можно изменить.

#### Redcarpet

Redcarpet можно конфигурировать с помощью настройки `extensions`, указав значением массив со строками. Каждая строка должна быть одним из расширений класса `Redcarpet::Markdown`, ее наличие в массиве автоматически присваивает этому расширению значение `true`.

Jekyll поддерживает два расширения Redcarpet:

* `no_fenced_code_blocks` - по умолчанию  Jekyl подключает расширение `fenced_code_blocks` (для выделения блоков кода тройными или тройными обратными кавычками), вероятно потому как они используются на GitHub. Расширение Redcarpet `fenced_code_blocks` инертно при работе с Jekyll; вы можете отключить выделение блоков кода этим способом и вернуть обычное выделение четырьмя пробелами.
Вы также можете определить используемый язык, указав его после первого ограничителя:

```markdown
  ```ruby
    # ...ruby code
    ```
```

При активации подсветки код будет подсвечиваться, при отсутствии подсветчика к элементу ` <code>` будет добавляться  атрибут `class="LANGUAGE"`, который может быть использован библиотеками JavaScript для подсветки кода.

* `smart` - это псевдорасширение активирует SmartyPants, конвертирующее обычные кавычки в фигурные и дефисы в тире.

Все остальные расширения Redcarpet сохраняют свои обычные расширения и никаких других опций для них в Jekyll нет, полный список расширений [здесь](https://github.com/vmg/redcarpet/blob/v2.2.2/README.markdown#and-its-like-really-simple-to-use). Убедитесь, что вы используете нужную версию Redcarpet - в Jekyll на данный момент используется версия 2.2, а такие расширения как `footnotes` и `highlight` работают начиная с версии 3.0. Наиболее популярные следующие расширения:

* `tables`
* `no_intra_emphasis`
* `autolink`

### Kramdown

Вы можете включить распознавание  Github Flavored Markdown, передав опции `input ` значение `GFM`.

Например, так это делается в `_config.yml`:

```yaml
kramdown:
  input: GFM
```

### [Собственные процессоры Markdown ](#custom-markdown-processors)

Если вы заинтересованы в создании собственного процессора markdown вы можете создать новый класс в пространстве имен `Jekyll::Converters::Markdown`:

```ruby
class Jekyll::Converters::Markdown::MyCustomProcessor
  def initialize(config)
    require 'funky_markdown'
    @config = config
  rescue LoadError
    STDERR.puts 'You are missing a library required for Markdown. Please run:'
    STDERR.puts '  $ [sudo] gem install funky_markdown'
    raise FatalException.new("Missing dependency: funky_markdown")
  end

  def convert(content)
    ::FunkyMarkdown.new(content).convert
  end
end
```

После создания собственного класса и его правильной настройки в каталоге `_plugins ` или как gem, укажите его в `_config.yml`:

```yaml
markdown: MyCustomProcessor
```