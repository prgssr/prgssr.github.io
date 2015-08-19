---
layout: doc
title: "Файлы с данными"
description: "Файлы с данными в Jekyll. Каталог _data. Использование данных через переменные."
prism: yes
---
В дополнение к [встроенным переменным](/documentation/12_variables.html), вы можете задавать свои собственные данные, доступные с помощью [шаблонизатора Liquid](https://wiki.github.com/shopify/liquid/liquid-for-designers).

Jekyll поддерживает загрузку данных в форматах [ YAML](http://yaml.org/), [JSON](http://www.json.org/) и [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) из файлов, расположенных в каталоге `_data`. Отметьте, чтов файлах CSV должен быть заголовок.

Возможность добавлять данные позволяет вам избегать повторения в ваших шаблонах, а также задавать отдельные опции сайта без изменений в `config.yml.`.

Плагины и темы также могут использовать файлы с данными для задания конфигурационных переменных.

### Каталог с данными

Как было сказано в разделе о [структуре каталогов](/documentation/05_directory_structure.html), каталог `_data` это место где вы можете хранить дополнительные данные, используемые Jekyll при генерации сайта. Это должны быть файлы  YAML (с расширениями `.yml`, `.yaml`, `.json` или `csv`), они доступны через `site.data`.

### Пример: список членов

Это простейший пример использования файлов с данными вместо многократного копирования больших фрагментов кода в шаблонах Jekyll.

В файле `_data/members.yml`:

```yaml
- name: Tom Preston-Werner
  github: mojombo

- name: Parker Moore
  github: parkr

- name: Liu Fengyun
  github: liufengyun
```

Или в `_data/members.csv`:

```markup
name,github
Tom Preston-Werner,mojombo
Parker Moore,parkr
Liu Fengyun,liufengyun
```

Эти данные доступны через `site.data.members`  (обратите внимание, что имя файла определяет название переменной).

Теперь вы можете вывести список членов в шаблоне:

```handlebars
{% raw %}
<ul>
{% for member in site.data.members %}
  <li>
    <a href="https://github.com/{{ member.github }}">
      {{ member.name }}
    </a>
  </li>
{% endfor %}
</ul>
{% endraw %}
```

### Пример: организации

Файлы с данными могут также располагаться в подкаталогах внутри `_data `. Каждый уровень подкаталогов добавляется к пространству имени переменной. В примере ниже показано, как организации GitHub определяются в отдельных файлах в каталоге `orgs `:

В файле `_data/orgs/jekyll.yml`:

```yaml
username: jekyll
name: Jekyll
members:
  - name: Tom Preston-Werner
    github: mojombo

  - name: Parker Moore
    github: parkr
```

В файле `_data/orgs/doeorg.yml`:

```yaml
username: doeorg
name: Doe Org
members:
  - name: John Doe
    github: jdoe
```

Данные организаций доступны через `site.data.orgs` через название соответствующего файла:

```handlebars
{% raw %}
<ul>
{% for org_hash in site.data.orgs %}
{% assign org = org_hash[1] %}
  <li>
    <a href="https://github.com/{{ org.username }}">
      {{ org.name }}
    </a>
    ({{ org.members | size }} members)
  </li>
{% endfor %}
</ul>
{% endraw %}
```
