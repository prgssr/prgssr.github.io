---
layout: doc
title: "Дополнения"
description: "Дополнительные возможности Jekyll."
prism: yes
---
Существует достаточное количество фич, реализованных в Jekyll, их наличие зависит от ваших планов использования Jekyll.

### Поддержка математики

В Kramdown есть поддержка рендеринга LaTeX в PNG с помощью [MathJax](http://www.mathjax.org/). Подробно это описано в документации Kramdown  о [математических блоках](http://kramdown.gettalong.org/syntax.html#math-blocks) и [поддержке математики](http://kramdown.gettalong.org/converter/html.html#math-support). Для работы MathJax (и, соответственно, рендеринга LaTeX) необходимо подключать дополнительные скрипты и стили, например:

```markup
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
```

Больше об этом можно узнать из этой [замечательной статьи](http://gastonsanchez.com/opinion/2014/02/16/Mathjax-with-jekyll/).

### Альтернативные процессоры Markdown

Документация по подключению и настройке альтернативных процессоров есть на [странице конфигурирования](/documentation/06_configuration.html#markdown-options), также как и советы по созданию [собственных процессоров](/documentation/06_configuration.html#custom-markdown-processors).
