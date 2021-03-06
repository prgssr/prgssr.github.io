---
layout: post
title: "Техники префетчинга для улучшения производительности сайтов"
categories: [development]
tags: [performance, translation, css-tricks]
description: "Префетчинг DNS и ресурсов в браузерах: prefetch, subresource, preconnect, prerender"
date: 2015-09-09 19:21:41
prism: yes
original: "https://css-tricks.com/prefetching-preloading-prebrowsing/"
original_author: "Робин Рендл"
original_title: "Prefetching, preloading, prebrowsing"
thumbnail: noimage
---

Когда мы говорим о производительности на фронтенде, мы обычно думаем о таких вещах как конкатенация, минификация, кэширование и сжатие ресурсов на сервере, позволяющих загрузить страницу быстрее и помочь пользователям быстрее достигнуть своих целей.

Предварительная выборка ресурсов (префетчинг) это еще одна техника, улучшающая производительность. Мы можем использовать ее, чтобы сообщить браузеру, какие ресурсы могут понадобиться пользователю в ближайшем будущем, прежде чем пользователь их реально запросит.

[Патрик Хаманн это объясняет ](https://twitter.com/patrickhamann)так:

>Префетчинг это способ предупреждения браузера о ресурсах, которые, скорее всего, будут использованы в будущем, некоторые предупреждения касаются текущей страницы, некоторые касаются будущих страниц.
Как разработчики мы знаем, что наши приложения лучше, чем браузер. И мы можем передать эту информацию браузеру.

Практика предугадывания потребностей пользователей в ресурсах называется пребраузинг. Это составной термин, сюда относится целый набор разных техник --- `dns-prefetch`, `subresource`, `preconnect`, `the standard prefetch` и `prerender`.

## DNS-prefetch

Эта техника уведомляет браузер, что на странице используются ресурсы с другого адреса и браузер может заранее преобразовать URL в IP-адрес. Например, нам нужен ресурс типа изображения или аудио с URL `example.com`. Нам надо добавить в `<head>` следующую запись:

```markup
<link rel="dns-prefetch" href="//example.com">
```

Затем, когда мы будем запрашивать файлы с этого ресурса, нам не надо будет тратить время на поиск DNS. Это особенно полезно при использовании кода от третьих сторон или подключении виджетов социальных сетей.

В своем [эпическом тексте о производительности фронтенда](http://csswizardry.com/2013/01/front-end-performance-for-web-designers-and-front-end-developers/#section:dns-prefetching) Гарри Робертс предлагает использовать эту технику:

>Эта простая строчка дает команду поддерживающим браузерам начать поиск DNS для указанного домена до того, как это действительно понадобиться. Это означает, что процесс поиска DNS будет завершен к тому моменту, когда он потребуется, то есть браузер получает небольшую фору при загрузке ресурсов с "префетченного URL".

Может показаться, что такой небольшой прирост производительности  не имеет особого значения, но [браузер Chrome делает так постоянно](https://docs.google.com/presentation/d/18zlAdKAxnc51y_kj-6sWLmnjl6TLnaru_WH0LJTjP-o/present?slide=id.g120f70e9a_041). Он автоматически ищет DNS, когда вы вводите URL в адресную строку (и иногда даже делает пререндеринг страницы) и сохраняет миллисекунды при каждом запросе.

## preconnect

Этот метод очень похож на префетчинг DNS, но кроме разрешения DNS данный метод начинает TCP-соединение и согласование TLS при защищенном соединении.

```markup
<link rel="preconnect" href="http://css-tricks.com">
```

Подробно этот метод описан в [недавней статье ](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/)Ильи Григорика:

>Современные браузеры стараются предвидеть, какие соединения потребуются сайту до совершения запросов. Инициируя ранние "предсоединения", браузер может настроить необходимые сокеты заранее и удалить все затратные работы с  DNS, TCP и TLS из критического пути текущего запроса. Но как бы не были продвинуты современные браузеры, они не смогут выделить подходящие цели предсоединения для всех сайтов.
Хорошая новость состоит в том, что теперь мы можем подсказать браузеру, какие сокеты надо открыть перед инициацией запроса благодаря технологии предсоединения, реализованной в Firefox 39 и Chrome 46!

## prefetch

Если мы уверены, что определенный файл обязательно понадобиться через некоторое время, мы можем попросить браузер заранее скачать его и сохранить в кэше для дальнейшего использования. Это может быть изображение или скрипт, или что-либо еще, кэшируемое браузером.

```markup
<link rel="prefetch" href="image.png">
```

В отличие от префетчинга DNS, браузер запрашивает и скачивает искомый ресурс и сохраняет его в кэше. Однако, это зависит от некоторых условий, префетчинг может быть и проигнорирован браузером. Например, если запрашивается большой файл со шрифтами при медленном интернет-соединении. А Firefox предзагружает ресурсы только находясь в [ленивом режиме](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ).

[Брэм Стейн](http://www.bramstein.com/writing/preload-hints-for-web-fonts.html) в своем посте по этому вопросу пишет, что это может дать заметное улучшение производительности при загрузке веб-шрифтов. На данный момент файлы со шрифтами перед загрузкой ждут построения DOM и CSSOM. Префетчинг позволяет обойти вызванные этим проблемы с производительностью.

>Примечание: последние версии Chrome и Firefox показывают, какие из ресурсов были предзагружены на вкладке "Сеть" в инструментах разработчика. Также полезно  помнить, что для префетчинга нет ограничений "same-origin", то есть вы можете задать предзагрузку ресурсов с любого домена.

## subresource

Еще одна техника префетчинга помогает идентифицировать ресурсы с максимальным приоритетом, которые должны запрашиваться в первую очередь. Например, в Chrome и Opera мы можем добавить в `head` следующую запись:

```markup
<link rel="subresource" href="styles.css">
```

Согласно [документации Chrome](https://www.chromium.org/spdy/link-headers-and-server-hint/link-rel-subresource) эта запись работает следующим образом:

>"LINK rel=subresource" предоставляет новый тип связи ссылок с отличной от `LINK rel=prefetch` семантикой. В то время как `rel=prefetch` задает приоритет для загрузки ресурсов для других страниц, `rel=subresource` дает раннюю загрузку ресурсов для текущей страницы.

Итак, если ресурс потребуется на текущей странице или же потребуется максимально скоро, лучше использовать `subresource`, а в остальных случаях `prefetch`.

## prerender

Эта совершенно атомная опция --- `prerender` позволяет превентивно загрузить все файлы и ресурсы для определенного документа:

```markup
<link rel="prerender" href="http://css-tricks.com">
```

Стив Судерс прекрасно [описал эту технику](http://www.stevesouders.com/blog/2013/11/07/prebrowsing/):

>Это как открытие URL в скрытой вкладке --- все ресурсы скачиваются, строится DOM, раскладывается макет страницы, применяются стили и исполняются скрипты.  И если пользователь переходит по указанному адресу, страница открывается мгновенно. Google Search использует этот механизм уже несколько лет (Instant Pages). Microsoft реализовал пререндеринг в Bing в IE11.

Но будьте осторожны. Вы должны быть уверены, что пользователь перейдет по нужному линку, иначе клиент зря скачает  все ресурсы для рендеринга страницы.

Судерс продолжает:

>Как и с любой упреждающей работой, существует риск, что она окажется напрасной. И если она затратна (отбирает много ресурсов процессора, разряжает батарею или забирает много трафика), то осторожность необходима. Угадывание намерений пользователя может показаться сложным, но наиболее распространенными являются следующие сценарии:
* Если это результат поиска и он очевиден, то эта страница скорее всего будет загружена.
* Если пользователь перешел на страницу логина, то на следующей странице будет подтверждение логина.
* Если пользователь читает статью, разбитую на несколько страниц, он скорее всего перейдет на страницу, следующую за текущей.

Наконец, [Page Visibility API](http://www.w3.org/TR/page-visibility/) может использоваться для защиты от запуска скриптов до их рендеринга на странице.

Му уже обсудили все текущие разновидности префетчинга, пришло время заняться возможностями, которые будут реализованы в будущем.

## Будущая возможность: preload

В новой спецификации, [предзагрузка](https://w3c.github.io/preload/) используется для тех ресурсов, которые скачиваются *всегда*, независимо от браузера. Если префетчинг может быть проигнорирован браузером, ресурсы в  предзагрузке запрашиваются браузером в любом случае.

```markup
<link rel="preload" href="image.png">
```

Несмотря на то, что предзагрузка пока не поддерживается ни одним из браузеров, эта идея, безусловно, интересна.

## Заключение

Предугадывание того, что будут делать пользователи, требует планирования и тестирования, но выгоды в производительности стоят того. И если мы хотим улучшить производительность, нам стоит поэкспериментировать с этими техниками.

## Дополнительная литература

* [Слайды с выступления Ильи Григорика "Preconnect, prerender, prefetch"](https://docs.google.com/presentation/d/18zlAdKAxnc51y_kj-6sWLmnjl6TLnaru_WH0LJTjP-o/present?slide=id.p19)
* [Документация Mozilla о префетчинге](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ)
* [Спецификация предзагрузки W3C](https://w3c.github.io/preload/)
* [Статья Гарри Робертса о префетчинге DNS](http://csswizardry.com/2013/01/front-end-performance-for-web-designers-and-front-end-developers/#section:dns-prefetching)
* [HTML5 префетчинг](https://medium.com/@luisvieira_gmr/html5-prefetch-1e54f6dda15d)
* [Советы по предзагрузке шрифтов](http://www.bramstein.com/writing/preload-hints-for-web-fonts.html)
* [Поддержка  prefetch в браузерах](http://caniuse.com/#feat=link-rel-prefetch)
* [Поддержка prerender в браузерах](http://caniuse.com/#feat=link-rel-prerender)
