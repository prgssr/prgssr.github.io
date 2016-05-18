---
layout: doc
title: "Базовое использование"
description: "Основы использования Jekyll. Сборка сайта, каталог для сборки. Запуск локального сервера Jekyll."
prism: yes
---
Jekyll gem  позволяет работать с `jekyll` через терминал:

```bash
$ jekyll build
# => The current folder will be generated into ./_site

$ jekyll build --destination <destination>
# => The current folder will be generated into <destination>

$ jekyll build --source <source> --destination <destination>
# => The <source> folder will be generated into <destination>

$ jekyll build --watch
# => The current folder will be generated into ./_site,
#    watched for changes, and regenerated automatically.
```

###### Изменения в `_config.yml` не учитываются при автоматической регенерации
{: .info}
Глобальные настройки из `_config.yml` считываются лишь в момент запуска сервера, поэтому все изменения, внесенные в этот файл в ходе автоматической регенерации, будут применены лишь при следующем запуске. Изменения в [файлах с  данными](/documentation/14_data_files) вступают в силу и при регенерации.
{: .info}

###### Каталоги для сборки очищаются
{: .warning}
Каталог `<destination>` очищается автоматически после сборки сайта. Файлы и каталоги, созданные до этого удаляются, если вы хотите сохранить какие-либо из них, то их надо определить в конфигурационной директиве `<keep_files>`.
{: .warning}
Не используйте в качестве `<destination>`  важный для вас каталог, лучше скопируйте файлы.
{: .warning}

В Jekyll  есть встроенный сервер для разработки, который дает вам возможность локального предпросмотра сгенерированного сайта:

```bash
$ jekyll serve
# => A development server will run at http://localhost:4000/
# Auto-regeneration: enabled. Use `--no-watch` to disable.

$ jekyll serve --detach
# => Same as `jekyll serve` but will detach from the current terminal.
#    If you need to kill the server, you can `kill -9 1234` where "1234" is the PID.
#    If you cannot find the PID, then do, `ps aux | grep jekyll` and kill the instance. [Read more](http://unixhelp.ed.ac.uk/shell/jobz5.html).
```

###### Особенности поведения сервера по умолчанию
{: .info}
С версии 2.4 команда `serve` будет отслеживать изменения автоматически. Для отключения этого используйте команду `jekyll serve --no-watch`:
{: .info}

```bash
$ jekyll serve --no-watch
# => Same as `jekyll serve` but will not watch for changes.
```

Это далеко не все возможные [опции конфигурации](/documentation/06_configuration.html). Многие опции можно определять как флаги в командной строке или же в файле `_config.yml`, расположенном в корневом каталоге. Jekyll автоматически использует опции из этого файла при запуске. Например, если вы добавите в `_config.yml` следующие строчки:

```yaml
source:      _source
destination: _deploy
```

Это будет эквивалентно следующим командам:

```bash
$ jekyll build
$ jekyll build --source _source --destination _deploy
```

Если вас интересуют остальные опции, читайте о них в разделе [конфигурация](/documentation/06_configuration.html).

Англоязычная документация доступна в офлайне после установки модуля `jekyll-docs` и запуска команды `jekyll docs` в терминале.