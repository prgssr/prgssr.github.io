---
layout: doc
title: "Разбивка на страницы"
description: "Пагинация в Jekyll. Объект `paginator` и его атрибуты. Образцы кода с разбивкой на страницы."
prism: yes
---
Разбитие списка постов на страницы применяется на многих сайтах, и в особенности блогах. В Jekyll есть плагин для разбивки на страницы и вы можете автоматически генерировать необходимые для этого каталоги и файлы.

В Jekyll версии 2 разбивка на страницы была встроенной, начиная с версии 3 надо подключать плагин `jekyll-paginate` в Gemfile  и в `_config.yml`.

###### Разбивка на страницы работает только с HTML -файлами
{: .protip}
Разбивка на страницы  не работает с файлами Markdown или Textile, только HTML. Но это вряд ли будет проблемой, так как вы используете разбивку для списка постов
{: .protip}

### Активация разбивки

Для активации разбивки на страницы в вашем блоге надо добавить в `_config.yml` следующий параметр, определяющий количество записей на странице:

```yaml
paginate: 5
```

Вы также можете определить место назначения для страниц с разбивкой:

```yaml
paginate_path: "/blog/page:num/"
```

Это будет считываться в `blog/index.html`,  каждая страница с разбивкой будет доступна как переменная liquid `paginator`, а вывод будет записываться в `blog/page:num/`, где `num` номер страницы с разбивкой, начиная с 2. Если на сайте 12 постов и задано `paginate: 5`, Jekyll создаст `blog/index.html` с первыми 5 постами, `blog/page2/index.html ` со следующими 5 постами и `blog/page3/index.html` с двумя последними постами.

###### Не задавайте постоянную ссылку
{: .warning}
Задание постоянной ссылки во вводной вашего блога может нарушить разбивку на страницы.
{: .warning}

### Доступные атрибуты Liquid

Плагин разбивки на страницы делает доступным объект `paginator` и его атрибуты:

Атрибут |Описание
--------|--------
`page` | номер текущей страницы
`per_page` |количество постов на странице
`posts` | список постов для текущей страницы
`total_posts` | общее количество постов на сайте
`total_pages` | количество страниц с разбивкой
`previous_page` | номер предыдущей страницы с разбивкой, `nil` если она отсутствует
`previous_page_path` | путь к предыдущей страницы с разбивкой, `nil` если она отсутствует
`next_page` | номер следующей страницы с разбивкой, `nil` если она отсутствует
`next_page_path` | путь к следующей страницы с разбивкой, `nil` если она отсутствует

###### Разбивка на страницы не поддерживает теги и категории
{: .protip}
Разбивка перебирает все посты в переменной `posts`, независимо от наличия других переменных во вводных постов. Поэтому на данный момент нет возможности для разбивки постов, связанных тегами или категориями. По этой же причине не поддерживается разбивка коллекций.
{: .protip}

### Рендеринг  страниц с разбивкой

Следующая вещь, которую вам надо сделать это непосредственно вывести список постов, используя доступную вам переменную `paginator`. Скорее всего, вы захотите это сделать на одной из основных страниц своего сайта. Вот образец простого рендеринга разбитых на страниц постов в файле HTML:
{% raw %}
```liquid
---
layout: default
title: My Blog
---

<!-- Цикл по списку постов, разбитых на страницы-->
{% for post in paginator.posts %}
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
  <p class="author">
    <span class="date">{{ post.date }}</span>
  </p>
  <div class="content">
    {{ post.content }}
  </div>
{% endfor %}

<!-- Ссылки на страницы с разбивкой-->
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="previous">Previous</a>
  {% else %}
    <span class="previous">Previous</span>
  {% endif %}
  <span class="page_number ">Page: {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="next">Next</a>
  {% else %}
    <span class="next ">Next</span>
  {% endif %}
</div>
```
{% endraw %}
###### Остерегайтесь страницы №1
{: .warning}
Jekyll не создает каталог `page1`, поэтому код из примера не сможет работать со ссылкой на  `/page1 `. Ниже указан способ решения этой проблемы
{: .warning}

Этот фрагмент кода способен обрабатывать страницу один и выводить список со ссылками всех страниц, кроме текущей.

{% raw %}
```liquid
{% if paginator.total_pages > 1 %}
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}">&laquo; Prev</a>
  {% else %}
    <span>&laquo; Prev</span>
  {% endif %}

  {% for page in (1..paginator.total_pages) %}
    {% if page == paginator.page %}
      <em>{{ page }}</em>
    {% elsif page == 1 %}
      <a href="{{ '/index.html' | prepend: site.baseurl | replace: '//', '/' }}">{{ page }}</a>
    {% else %}
      <a href="{{ site.paginate_path | prepend: site.baseurl | replace: '//', '/' | replace: ':num', page }}">{{ page }}</a>
    {% endif %}
  {% endfor %}

  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}">Next &raquo;</a>
  {% else %}
    <span>Next &raquo;</span>
  {% endif %}
</div>
{% endif %}
```
{% endraw %}
