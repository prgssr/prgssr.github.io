---
title: Политика безопасности контента&#58; ваш будущий лучший друг
layout: post
categories: [development]
tags: [security, translation, smashingmagazine]
date: 2016-09-14 20:54:05 +0300
prism: yes
description: "Введение в политику безопасности контента с примерами и большим количеством ссылок"
original: "https://www.smashingmagazine.com/2016/09/content-security-policy-your-future-best-friend/"
original_title: "Content Security Policy, Your Future Best Friend"
original_author: "Николя Хоффман"
thumbnail: "/images/development/security/csp_smashing1b-500.jpg"
---

Много лет  назад мой личный сайт был атакован. Я не знаю как, но это случилось. К счастью, вред от атаки был сравнительно небольшим: кусок кода JavaScript был вставлен в нижней части некоторых страниц. Я обновил пароль FTP и другие учетные данные, очистил несколько файлов и этого хватило.

Но один момент сводил меня с ума: тогда не было простого решения, сообщавшего бы мне о наличии проблемы и, что более важно, способного защитить посетителей сайта от этого кода.

Сейчас решение существует и решает обе задачи. Оно называется политика безопасности контента (content security policy — CSP).

## Что такое CSP?

Идея совершенно проста: отправляя с сайта заголовок CSP, вы говорите браузеру, что он может выполнить, а что должен блокировать.

Вот образец с PHP:

```php
<?php
    header("Content-Security-Policy: <your directives>");
?>
```

### Некоторые директивы

Вы можете задавать глобальные правила или правила для определенного типа ресурсов:

```php
default-src 'self' ;
     # self = тот же порт, тот же домен и тот же протокол => OK
```

Универсальное значение по умолчанию это `default-src`: если директива для какого-либо типа ресурсов не задана, браузер будет использовать это значение.

```php
script-src 'self' www.google-analytics.com ;
     # файлы JS с этого домена => OK
```


В этом примере, мы разрешили использовать доменное имя `www.google-analytics.com` как источник файлов JavaScript на нашем сайте. Мы добавили ключевое слово  `'self';` — если мы изменим значение директивы `script-src`, она будет переписывать правила `default-src`.

Если схема или порт не определены, то тогда используются  схема и порт текущей страницы. Это предотвращает смешивание контента. На странице `https://example.com`, вы не можете загрузить `http://www.google-analytics.com/file.js` — он будет заблокирован из-за несоответствия схеме. Однако есть исключение, позволяющее обновлять схему. Если `http://example.com` пытается загрузить `https://www.google-analytics.com/file.js`, то схему и порт можно менять для обновления схемы.

```php
style-src 'self' data: ;
     # Data-Uri в CSS => OK
```

В этом примере используется ключевое слово `data`: оно разрешает вложенный контент в файлах CSS.

Согласно спецификации CSP 1 уровня вы также можете задавать следующие правила:

* `img-src` — валидные источники изображений;
* `connect-src` — применяется к  XMLHttpRequest (AJAX), WebSocket или EventSource;
* `font-src` — валидные источники шрифтов;
* `object-src` — валидные источники плагинов (например, для `<object>`, `<embed>` или `<applet>`);
* `media-src` — валидные источники содержимого `<audio>` и `<video>`.


CSP 2 уровня включает следующее:

* `child-src` — валидные источники  веб-воркеров и элементов типа `<frame>` и `<iframe> `(заменяет устаревшее правило `frame-src` из CSP уровня 1);
* `form-action`  —  валидные источники, которые могут быть использованы как `action` в  `<form>`;
* `frame-ancestors`  —  валидные источники для подключения ресурсов, используя `<frame>`, `<iframe>`, `<object>`, `<embed>` или `<applet>`;
* `upgrade-insecure-requests`  —  инструктирует браузеры на изменение схем URL с заменой HTTP на HTTPS (для сайтов, в которых надо менять много старых URL).

Для лучшей обратной совместимости с устаревшими свойствами, вы можете просто скопировать содержимое действующей директивы и продублировать его в устаревшей. Например, продублировать содержимое `child-src` в `frame-src`.

CSP 2 позволяет добавлять в белый список путь к файлам (в CSP 1 это можно было делать только с доменами). Поэтому вместо разрешения  всего `www.foo.com`, вы можете ограничиться `www.foo.com/some/folder`. Этот подход требует поддержки CSP 2 в браузере, но он очевидно более безопасен.

## Пример

Я сделал простой пример для конференции  Paris Web 2015, в которой я представил доклад “[CSP in Action](https://rocssti.net/en/example-csp-paris-web2015)”.

Без CSP страница бы выглядела так:


![вид демо страницы без CSP](/images/development/security/csp_smashing1b-500.jpg){: itemprop="image"}

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing1b.jpg)*


Не слишком хорошо. Что если добавить следующие директивы CSP?

```php
<?php
    header("Content-Security-Policy: 
      default-src 'self' ;
      script-src 'self' www.google-analytics.com stats.g.doubleclick.net ; 
      style-src 'self' data: ;
      img-src 'self' www.google-analytics.com stats.g.doubleclick.net data: ;
      frame-src 'self' ;");
?>
```

Что должен сделать браузер? Он должен (очень аккуратно) применить эти директивы согласно основному правилу CSP — **все что не разрешено в CSP, блокируется** (блокируется — значит, не выполняется, не выводится и не используется).

По умолчанию в CSP строчные скрипты и стили не разрешены, это означает, что каждый тег `<script>`,  атрибут `onclick` или `style` будет блокироваться. Вы можете разрешить строчный CSS  с помощью правила `style-src 'unsafe-inline';`.

В современном браузере с поддержкой CSP этот пример будет выглядеть так:

![вид демо страницы с CSP](/images/development/security/csp_smashing5-500.jpg)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing5.jpg)*

Что произошло? Браузер применил директивы и отключил все, что не разрешено. Уведомления об этом выведены в консоль:

![Уведомления в консоли о блокировке ресурсов из-за несоответствия CSP](/images/development/security/csp_smashing2-500.jpg)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing2.jpg)*

Если вы по-прежнему не уверены в значимости CSP, ознакомьтесь со статьей Аарона Густафсона [“More Proof We Don’t Control Our Web Pages”](https://www.aaron-gustafson.com/notebook/more-proof-we-dont-control-our-web-pages/).

Конечно, вы можете использовать и более строгие директивы, чем те, что были в примере выше:

* задать `default-src` значение `'none'`,
* определить, что вам нужно для каждого правила,
* явно указать пути к файлам,
* и т.д.

## Дополнительная информация о CSP

### Поддержка

CSP уже не является экспериментальной возможностью, требующей для работы активации нескольких флагов в настройках браузера.  CSP уровня 1 и 2 это кандидаты в рекомендации.[ Поддержка спецификации первого уровня](http://caniuse.com/#feat=contentsecuritypolicy) в браузерах великолепна!

![Поддержка в браузерах CSP уровня 1](/images/development/security/csp_smashing3-500.jpg)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing3.jpg)*

Спецификация второго уровня более свежая, поэтому [поддерживается хуже](http://caniuse.com/#feat=contentsecuritypolicy2).

![Поддержка в браузерах CSP уровня 2](/images/development/security/csp_smashing4-500.jpg)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing4.jpg)*

Спецификация CSP  3 уровня пока находится в стадии черновика и поэтому не поддерживается, но вы можете делать многое и с помощью возможностей первого и второго уровня спецификации.

### Прочие размышления

CSP создавался для уменьшения риска [межсайтового скриптинга (XSS)](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3), именно поэтому не рекомендуется разрешать строчные скрипты директивой `script-src`.  Firefox отлично иллюстрирует эту проблему: нажмите в нем `Shift + F2` и наберите `security csp`, вы увидите все директивы и совет. Вот, например, Twitter:

![security csp в Firefox на примере Twitter](/images/development/security/csp_smashing6b-500.jpg)

*[Увеличенная версия](https://www.smashingmagazine.com/wp-content/uploads/2016/09/csp_smashing6b.jpg)*

Другой способ решить проблему со строчными скриптами и стилями это создать для них хэш. Например, вам нужен следующий скрипт:

```html
<script>alert('Hello, world.');</script>
```

Вам надо добавить `'sha256-qznLcsROx4GACP2dm0UCKCzCG-HiZ1guq6ZZDob_Tng='` как валидный источник в директиву `script-src`. Сгенерированный хэш это результат следующего кода в PHP:

```php
<?php
    echo base64_encode(hash('sha256', "alert('Hello, world.');", true));
?>
```

Я уже говорил, что CSP создавался для уменьшения рисков XSS — и я должен добавить "и уменьшения рисков незапрашиваемой информации". С CSP вы знаете, какие у вас источники контента и что они делают на фронтенде (строчные стили  и т.д.). CSP также может помочь заставить авторов, разработчиков и всех остальных уважать ваши правила, касающиеся источников контента.

Теперь вы спросите: "ОК, это все круто, но как нам это использовать на продакшене"?

## Как использовать CSP на реальных проектах

Самый простой способ расстроиться при первом использовании CSP на тестировании в реальном окружении это считать, что все будет легко, ведь ваш код в полном порядке. Не делайте так — я сам так делал и это глупо, поверьте мне.

Как я объяснял, директивы CSP активируются в заголовке CSP и у нас нет золотой середины. Вы являетесь слабым звеном здесь. Вы можете забыть разрешить что-либо или забыть про какой-то код на своем сайте. CSP не простит вам ваших ошибок. Однако, пара возможностей в CSP может здорово облегчить проблему.

### report-uri 

Помните уведомления, которые CSP посылает в консоль? Директива `report-uri` может быть использована, чтобы браузер отправлял их по определенному адресу. Отчеты посылаются в формате JSON.

```php
report-uri /csp-parser.php ;
```

Так в файле `csp-parser.php` мы можем обрабатывать данные, отправленные браузером. Вот самый простой пример на PHP:

```php
$data = file_get_contents('php://input');

    if ($data = json_decode($data, true)) {
     $data = json_encode(
      $data,
      JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
      );
     mail(EMAIL, SUBJECT, $data);
    }
```

Это уведомление будет трансформировано в email. В ходе разработки вам может не понадобиться ничего более сложного, чем этот пример.

Для рабочего окружения  (или просто более посещаемого окружения для разработки), вам лучше использовать отличный от email способ сохранения информации, ведь у нас нет никаких ограничений по выводу данных и CSP может быть излишне шумной. Просто представьте страницу, генерирующую 100 уведомлений CSP (например, скрипт выводящий изображения из не разрешенного источника) и просматриваемую по 100 раз в день — вы получите 10000 уведомлений ежедневно.

Сервис типа [report-uri.io](https://report-uri.io/) можно использовать для упрощения управления отчетами. [Другие простые примеры использования report-uri](https://github.com/nico3333fr/CSP-useful/tree/master/report-uri) ( с базой данных и прочими оптимизациями) вы можете рассмотреть на GitHub.

### report-only

Как было сказано, самая большая проблема в том, что  между включением и отключением CSP нет никаких промежуточных значений. Однако с помощью `report-only` вы можете отправлять немного отличающийся заголовок:

```php
<?php
    header("Content-Security-Policy-Report-Only: <your directives>");
?>
```

В принципе, она говорит браузеру: "Действуй так, как будто все эти директивы применены, но ничего не блокируй, просто отправляй мне уведомления". Это отличный способ тестировать директивы без риска блокировать нужные ресурсы.

С `report-only` и `report-uri`, вы можете тестировать директивы CSP без риска и мониторить все, что связано с активностью CSP на сайте. Эта и предыдущая возможности прекрасно справляются с развертыванием и поддержкой CSP.

## Заключение

### Почему CSP это круто

Политика безопасности контента  наиболее значима для посетителей вашего сайта: они не будут страдать от незапрашиваемых скриптов и контента или от XSS-уязвимостей вашего сайта.

Самое важное преимущество CSP для разработчиков сайтов это осведомленность. Если вы задали строгие правила для источников изображений и какие-то хакеры из школы попробуют вставить изображение из неавторизованного источника, это изображение будет блокировано и вы будете немедленно уведомлены об этом.

Разработчики тем временем должны точно  знать, что делает их фронтенд код и CSP поможет управлять этим. Им будет предложено провести рефакторинг части кода (избегая строчных скриптов и стилей) и следовать лучшим практикам.

### Как CSP может стать еще круче

Смешно, но CSP излишне эффективна в некоторых браузерах — она создает баги с букмарклетами. Поэтому не обновляйте ваши директивы CSP, разрешая букмарклеты. Мы даже не можем обвинять какой-то один браузер, этой проблемой грешат все:

* [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=866522)
* [Chrome (Blink)](https://bugs.chromium.org/p/chromium/issues/detail?id=233903)
* [WebKit](https://bugs.webkit.org/show_bug.cgi?id=149000)

Большую часть времени баги проявляются как ложные срабатывания на заблокированных уведомлениях. Все производители браузеров работают над этими проблемами, поэтому мы можем ожидать исправления в скором будущем. В любом случае, это не должно останавливать вас от использования CSP.

## Остальные ресурсы и статьи

### Общая информация

* [Content Security Policy Quick Reference Guide](http://content-security-policy.com/), Foundeo
* “[Content Security Policy Level 2](http://www.w3.org/TR/CSP/),” W3C
* “[An Introduction to Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/),” HTML5 Rocks
* [SecurityHeaders.io](https://securityheaders.io/), Scott Helme
* [CSP Useful, a Collection of Scripts, Thoughts About CSP](https://github.com/nico3333fr/CSP-useful), Nicolas Hoffmann, GitHub
* [CSP Validator](https://cspvalidator.org/)
* “[Upgrade Insecure Requests](https://www.w3.org/TR/upgrade-insecure-requests/),” W3C
* “[CSP Cheat Sheet](https://scotthelme.co.uk/csp-cheat-sheet/),” Scott Helme

### Серия статей о реализации CSP на Dropbox

* “[[CSP] On Reporting and Filtering](https://blogs.dropbox.com/tech/2015/09/on-csp-reporting-and-filtering/)”
* “[[CSP] Unsafe-Inline and Nonce Deployment](https://blogs.dropbox.com/tech/2015/09/unsafe-inline-and-nonce-deployment/)”
* “[[CSP] The Unexpected Eval](https://blogs.dropbox.com/tech/2015/09/csp-the-unexpected-eval/)”
* “[[CSP] Third Party Integrations and Privilege Separation](https://blogs.dropbox.com/tech/2015/09/csp-third-party-integrations-and-privilege-separation/)”

### CSP GitHub

* [“GitHub’s CSP journey”](http://githubengineering.com/githubs-csp-journey/)

### Остальные компании

* “[We Said We’d Be Transparent: WIRED’s First Big HTTPS Snag](https://www.wired.com/2016/05/wired-first-big-https-rollout-snag/),” Wired
* “[Content Security Policy for Single Page Web Apps](https://corner.squareup.com/2016/05/content-security-policy-single-page-app.html),” Square

### Об отчетах

* “[Twitter’s CSP Report Collector](https://oreoshake.github.io/csp/twitter/2014/07/25/twitters-csp-report-collector-design.html),” Neil Matatall, GitHub

### Примеры директив

* [Collection of Examples](https://github.com/nico3333fr/CSP-useful/tree/master/csp-for-third-party-services), Nicolas Hoffmann, GitHub

### Будущее CSP

* “[Making CSP Great Again!](https://speakerdeck.com/mikispag/making-csp-great-again-michele-spagnuolo-and-lukas-weichselbaum)” (slides), Michele Spagnuolo и Lukas Weichselbaum
* “[Content Security Policy Level 3](https://www.w3.org/TR/CSP3/),” W3C
* “[Content Security Policy](https://github.com/w3c/webappsec-csp/),” W3C, GitHub

### Статьи на русском

* "[Как мы сделали чтение писем безопаснее: Content Security Policy в Яндекс.Почте](https://habrahabr.ru/company/yandex/blog/206508/)"
* "[Улучшение сетевой безопасности с помощью Content Security Policy ](https://habrahabr.ru/company/nixsolutions/blog/271575/)" (перевод [статьи с Sitepoint](https://www.sitepoint.com/improving-web-security-with-the-content-security-policy/))
* "[Введение в Content Security Policy](https://romka.eu/blog/vvedenie-v-content-security-policy)" (перевод [статьи с Html5 Rocks](http://www.html5rocks.com/en/tutorials/security/content-security-policy/))