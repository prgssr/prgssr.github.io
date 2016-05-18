---
layout: doc
title: "Jekyll в Windows"
description: "Настройка Jekyll в Windows."
prism: yes
---

Хотя Windows не относится  к числу официально поддерживаемых платформ, в ней можно использовать Jekyll при некоторой хитрости. На этой странице собраны основные вещи, необходимые для пользователей Windows.

### Установка

Джулиан Тило написал инструкцию об [установке Jekyll в Windows](http://jekyll-windows.juthilo.com/) и для большинства случаев она подходит. Хотя это писалось для Ruby 2.0.0, но работает и для [более поздних версий до 2.2](https://github.com/copiousfreetime/hitimes/issues/40).

Также есть совет от Дэвида Бурелы об [установке Jekyll с помощью Chocolatey в 3 команды в терминале.](https://davidburela.wordpress.com/2015/11/28/easily-install-jekyll-on-windows-with-3-command-prompt-entries-and-chocolatey/) (для Jekyll 3 достаточно двух команд).

### Кодировка

Если вы используете кодировку UTF-8, убедитесь, что в ваших файлах нет [заголовков BOM](https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%80_%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B1%D0%B0%D0%B9%D1%82%D0%BE%D0%B2), иначе вы столкнетесь с большими неприятностями в Jekyll в Windows.

Дополнительно вам может понадобиться изменить кодовую страницу в консоли на  UTF-8, если вы получаете  ошибку `“Liquid Exception: Incompatible character encoding” `при генерации сайта. Это можно сделать следующей командой:

```bash
$ chcp 65001
```

### Авторегенерация

Начиная с версии 1.30 Jekyll использует гем `listen` для отслеживания изменений с флагом `--watch` при сборке или работе локального сервера. У `listen` встроенная поддержка в операционных системах на основе UNIX, а для работы в  Windows необходим дополнительный модуль. Добавьте в Gemfile своего сайта следующую строку:

```ruby
gem 'wdm', '~> 0.1.0' if Gem.win_platform?
```