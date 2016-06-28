---
title: Лучшие практики кэширования
layout: post
categories: [development]
tags: [translation, performance]
prism: full
description: "Джейк Арчибальд о кэшировании — что хорошо, что плохо и что делать"
date: 2016-06-28 21:56:38 +0300
original: "https://jakearchibald.com/2016/caching-best-practices/"
original_title: "Caching best practices & max-age gotchas"
original_author: "Джейк Арчибальд"
thumbnail: "noimage"
style: "/css/chat.css"
---

Правильно настроенное кэширование дает огромный выигрыш  в производительности, экономит трафик и уменьшает затраты на  сервер, однако на многих сайтах кэширование реализовано неудачно, что создает [состояние гонки](https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5_%D0%B3%D0%BE%D0%BD%D0%BA%D0%B8), приводящее к рассинхронизации взаимосвязанных ресурсов.

Подавляющее большинство лучших практик кэширования относится к одному из двух паттернов:

## Паттерн №1: неизменяемый контент и долгий `max-age` кэша

```http
Cache-Control: max-age=31536000
```

* Содержимое по URL не меняется, следовательно...
* Браузер или CDN могут без проблем закэшировать ресурс на год
* Закэшированный контент, который младше, чем заданный max-age может использоваться без консультации с сервером

<div class="chat">
  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне нужны <span class="chat-nowrap">"/script-v1.js"</span>, <span class="chat-nowrap">"/styles-v1.css"</span> и <span class="chat-nowrap">"/cats-v1.jpg"</span>
    <span class="time">10:24</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    У меня пусто, как насчет тебя, Сервер?
    <span class="time">10:24</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    ОК, вот они. Кстати, Кэш, их стоит использовать в течение года, не больше.
    <span class="time">10:25</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Спс!
    <span class="time">10:25</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Ура!
    <span class="time">10:25</span>
  </p>

  <p class="chat-direction">Следующий день</p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне нужны <span class="chat-nowrap">"/script-<strong>v2</strong>.js"</span>, <span class="chat-nowrap">"/styles-<strong>v2</strong>.css"</span> и <span class="chat-nowrap">"/cats-v1.jpg"</span>
    <span class="time">08:14</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Картинка с котиками есть, остального нет. Сервер?
    <span class="time">08:14</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    Легко — вот новые CSS &amp; JS. Еще раз, Кэш: их срок годности не больше года.
    <span class="time">08:15</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Супер!
    <span class="time">08:15</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Спасибо!
    <span class="time">08:15</span>
  </p>

  <p class="chat-direction">Позднее</p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Хм, я не пользовался <span class="chat-nowrap">"/script-v1.js"</span> &amp; <span class="chat-nowrap">"/styles-v1.css"</span> достаточно долго. Пора их удалять.
    <span class="time">12:32</span>
  </p>
</div>

Используя этот паттерн, вы никогда не меняете контент определенного URL, вы меняете сам URL:

```markup
<script src="/script-f93bca2c.js"></script>
<link rel="stylesheet" href="/styles-a837cb1e.css">
<img src="/cats-0e9a2ef4.jpg" alt="…">

```

В каждом URL есть что-то, меняющееся одновременно с контентом. Это может быть номер версии, модифицированная дата или  хэш контента (этот вариант я и выбрал для своего блога).

В большинстве серверных фреймворков есть инструменты, позволяющие с легкостью делать подобные вещи (в  Django я использую [Manifest&#8203;Static&#8203;Files&#8203;Storage](https://docs.djangoproject.com/en/1.9/ref/contrib/staticfiles/#manifeststaticfilesstorage)); есть также совсем небольшие библиотеки в Node.js, решающие те же задачи, например,  [gulp-rev](https://github.com/sindresorhus/gulp-rev).

Однако этот паттерн не подходит для вещей типа статей и записей в блогах. Их URL нельзя версионировать, а их содержимое может измениться. Серьезно, у меня часто бывают грамматические и пунктуационные ошибки, в связи с чем нужна возможность быстрого обновления содержимого.

## Паттерн №2: изменяемый контент, всегда проходящий ревалидацию на сервере

```http
Cache-Control: no-cache
```

* Содержимое URL изменится, значит...
* Любая локальная закэшированная версия не может использоваться без указания сервера.


<div class="chat">
  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне нужно содержимое <span class="chat-nowrap">"/about/"</span> и <span class="chat-nowrap">"/sw.js"</span>
    <span class="time">11:32</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Ничем не могу помочь. Сервер?
    <span class="time">11:32</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    Есть такие. Кэш, держи их при себе, но перед использованием спрашивай у меня.
    <span class="time">11:33</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Так точно!
    <span class="time">11:33</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Спс!
    <span class="time">11:33</span>
  </p>

  <p class="chat-direction">На следующий день</p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне опять нужно содержимое <span class="chat-nowrap">"/about/"</span> и <span class="chat-nowrap">"/sw.js"</span>
    <span class="time">09:46</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Минутку. Сервер, с моими копиями все в порядке? Копия <span class="chat-nowrap">"/about/"</span> лежит с понедельника, а <span class="chat-nowrap">"/sw.js"</span> вчерашняя.
    <span class="time">09:46</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    <span class="chat-nowrap">"/sw.js"</span> не менялась…
    <span class="time">09:47</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Круто. Страница, держи <span class="chat-nowrap">"/sw.js"</span>.
    <span class="time">09:47</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    …но <span class="chat-nowrap">"/about/"</span> у меня новой версии. Кэш, держи ее, но как и в прошлый раз, не забудь сначала спросить меня.
    <span class="time">09:47</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Понял!
    <span class="time">09:47</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Отлично!
    <span class="time">09:47</span>
  </p>
</div>



Примечание: `no-cache` не значит "не кэшировать", это значит "проверять" (или ревалидировать) закэшированный ресурс у сервера. А не кэшировать совсем  браузеру приказывает  `no-store`. Также и `must-revalidate` означает не обязательную ревалидацию, а то, что закэшированный ресурс используется только, если он младше, чем заданный `max-age`, и только в ином случае он ревалидируется. Вот так все запущено с  ключевыми словами для кэширования.

В этом паттерне мы можете добавить к ответу [ETag](https://ru.wikipedia.org/wiki/HTTP_ETag) (идентификатор версии на ваш выбор) или заголовок `Last-Modified`. При следующем запросе содержимого со стороны клиента,  выводится `If-None-Match` или `If-Modified-Since` соответственно, позволяя серверу сказать "Используй то, что у тебя есть, твой кэш актуален", то есть вернуть HTTP 304.

Если отправка `ETag`/`Last-Modified` невозможна, сервер всегда отсылает содержимое полностью.

Этот паттерн всегда всегда требует обращений к сети, поэтому он не столь хорош, как первый паттерн, который может обходится без сетевых запросов.

Это не редкость, когда у нас нет инфраструктуры для первого паттерна, но точно также могут возникнуть проблемы с сетевыми запросами в паттерне 2. В итоге используется промежуточный вариант: короткий `max-age` и изменяемый контент. Это плохой компромисс.

## Использование `max-age` с изменяемым контентом это, как правило, неправильный выбор


И, к сожалению, он распространен, в качестве примера можно привести Github pages.

Представьте:

* `/article/`
* `/styles.css`
* `/script.js`

С серверным заголовком:

```http
Cache-Control: must-revalidate, max-age=600
```

* Содержимое URL меняется
* Если в браузере есть кэшированная версия свежее 10 минут, она используется без консультации с сервером
* Если такого кэша нет, используется запрос к сети, по возможности с If-`Modified-Since` или `If-None-Match`


<div class="chat">
  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне нужны <span class="chat-nowrap">"/article/"</span>, <span class="chat-nowrap">"/script.js"</span> и <span class="chat-nowrap">"/styles.css"</span>
    <span class="time">10:21</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    У меня ничего нет, как у тебя, Сервер?
    <span class="time">10:21</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    Без проблем, вот они. Но запомни, Кэш: их можно использовать в течение ближайших 10 минут.
    <span class="time">10:22</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Есть!
    <span class="time">10:22</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Спс!
    <span class="time">10:22</span>
  </p>

  <p class="chat-direction">6 minutes later</p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Эй, мне опять нужны <span class="chat-nowrap">"/article/"</span>, <span class="chat-nowrap">"/script.js"</span> и <span class="chat-nowrap">"/styles.css"</span>
    <span class="time">10:28</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Упс, я извиняюсь, но я потерял <span class="chat-nowrap">"/styles.css"</span>, но все остальное у меня есть, держи. Сервер, можешь подогнать мне <span class="chat-nowrap">"/styles.css"</span>?
    <span class="time">10:28</span>
  </p>

  <p class="chat-item server-chat">
    <span class="author">Сервер<span>:</span></span>
    Легко, он уже изменился с тех пор, как ты в прошлый раз забирал его. Ближайшие 10 минут можешь смело его использовать.
    <span class="time">10:29</span>
  </p>

  <p class="chat-item cache-chat">
    <span class="author">Кэш<span>:</span></span>
    Без проблем.
    <span class="time">10:29</span>
  </p>

  <p class="chat-item page-chat">
    <span class="author">Страница<span>:</span></span>
    Спасибо! Но, кажется, что-то пошло не так! Все поломалось! Что, вообще, происходит?
    <span class="time">10:29</span>
  </p>
</div>


Этот паттерн имеет право на жизнь при тестировании, но ломает все в реальном проекте и его очень сложно отслеживать. В примере выше, сервер обновил HTML, CSS и JS, но выведена страница  со старыми HTML и JS из кэша, к которым добавлен обновленный  CSS с сервера. Несовпадение версий все портит.

Часто при внесении значительных изменений в HTML, мы меняем и CSS, для правильного отражения новой структуры, и JavaScript, чтобы и он не отставал от контента и стилей. Все эти ресурсы независимы, но заголовки кэширования не могут выразить это. В итоге у пользователей может оказаться последняя версия одного/двух ресурсов и старая версия остальных.

`max-age` задается относительно времени ответа, поэтому если все ресурсы передаются как часть одного адреса, их срок истечет одновременно, но и здесь сохраняется небольшой шанс рассинхронизации. Если у вас есть страницы, не включающие JavaScript или включающие другие стили, сроки годности их кэша будут рассинхронизированы. И хуже того, браузер постоянно вытаскивает содержимое из кэша, не зная, что HTML, CSS, & JS взаимозависимы, поэтому он с радостью может вытащить что-то одно из списка и забыть про все остальное. Учитывая все эти факторы вместе, вы должны понять, что вероятность появления несовпадающих версий достаточно велика.

Для пользователя результатом может быть сломанная раскладка страницы или  иные проблемы. От небольших глюков до совершенно непригодного контента.

К счастью, у пользователей есть запасной выход...

###  Обновление страницы иногда спасает


Если страница загружена путем обновления, браузеры всегда проводят серверную ревалидацию, игнорируя `max-age`. Поэтому, если у пользователя что-то поломалось вследствие `max-age`, простое обновление страницы может все исправить. Но, разумеется, после того как ложки найдутся, осадок все равно останется и отношение к вашему сайту будет несколько иным.
{: .info}

### Сервис-воркер может продлить жизнь этих багов


Например, у вас есть такой сервис-воркер:

```javascript
const version = '2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll([
        '/styles.css',
        '/script.js'
      ]))
  );
});

self.addEventListener('activate', event => {
  // …delete old caches…
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

Этот сервис-воркер:

* кэширует скрипт и стили
* использует кэш при совпадении, иначе обращается к сети

Если мы меняем CSS/JS, мы также увеличиваем номер  `version`, что инициирует обновление. Однако, так как `addAll` обращается сначала к кэшу, мы можем попасть в состояние гонки из-за `max-age` и несоответствующих версий  CSS & JS.

После того как они закэшированы, у нас будут несовместимые  CSS & JS до следующего обновления сервис-воркера — и это если мы опять не попадем при  обновлении в состояние гонки.

Вы можете пропустить кэширование в сервис-воркере:

```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll([
        new Request('/styles.css', { cache: 'no-cache' }),
        new Request('/script.js', { cache: 'no-cache' })
      ]))
  );
});

```

К сожалению, опции для кэширования [не поддерживаются в Chrome/Opera](https://bugs.chromium.org/p/chromium/issues/detail?id=453190) и только-только добавлены в [ночную сборку Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1120715), но вы можете сделать это самостоятельно:

```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => Promise.all(
        [
          '/styles.css',
          '/script.js'
        ].map(url => {
          // cache-bust using a random query string
          return fetch(`${url}?${Math.random()}`).then(response => {
            // fail on 404, 500 etc
            if (!response.ok) throw Error('Not ok');
            return cache.put(url, response);
          })
        })
      ))
  );
});
```

В этом примере, я сбрасываю кэш с помощью случайного числа, но вы можете пойти дальше и добавлять хэш контента при сборке (это похоже на то, что делает [sw-precache](https://github.com/GoogleChrome/sw-precache)). Это своего рода реализация первого паттерна с помощью JavaScript, но работающая только с сервис-воркером, а не браузерами и CDN.

## Сервис-воркеры и HTTP-кэш отлично работают вместе, не заставляйте их воевать!

Как видите, вы можете обойти ошибки с кэшированием в вашем сервис-воркере, но правильней будет решить корень проблемы. Правильная настройка кэширования не только облегчает работу сервис-воркера, но и помогает браузерам, не поддерживающим сервис-воркеры  (Safari, IE/Edge), а также позволяет вам извлечь максимум из вашей CDN.

Правильные заголовки кэширования также могут значительно упростить обновление сервис-воркера.

```javascript
const version = '23';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll([
        '/',
        '/script-f93bca2c.js',
        '/styles-a837cb1e.css',
        '/cats-0e9a2ef4.jpg'
      ]))
  );
});
```

Здесь я закэшировал корневую страницу с паттерном №2 (серверная ревалидация) и все остальные ресурсы с паттерном №1 (неизменяемый контент). Каждое обновление сервис-воркера будет вызывать запрос к корневой странице, а все остальные ресурсы будут загружаться только, если их URL изменился. Это хорошо тем, что сохраняет трафик и улучшает производительность, независимо от того, обновляетесь ли вы с предыдущей или очень старой версии.

Здесь есть значительное преимущество над нативной реализацией, когда целый бинарник скачивается даже при небольшом изменении или вызывает комплексное сравнение двоичных файлов. Так мы можем обновить большое веб-приложение при сравнительно небольшой загрузке.

Сервис-воркеры работают лучше в качестве улучшения, а не временного костыля, поэтому работайте с кэшем вместо того, чтобы воевать с ним.

## При аккуратном использовании `max-age` и изменяемый контент могут быть очень хороши

`max-age` очень часто бывает неправильным выбором для изменяемого контента, но не всегда. Например, у [оригинала статьи](https://jakearchibald.com/2016/caching-best-practices/) `max-age` составляет три минуты. Состояние гонки не является проблемой, так как на странице нет зависимостей, использующих одинаковый паттерн кэширования ( CSS, JS & изображения используют паттерн №1 — неизменяемый контент), все остальное этот паттерн не использует.

Этот паттерн означает, что я спокойно пишу популярную статью, а мой CDN (Cloudflare) может снять нагрузку с сервера, если, конечно, я готов подождать три минуты, пока обновленная статья станет доступной пользователям.

Этот паттерн надо использовать без фанатизма. Если я добавил новый раздел в статью, и поставил на него ссылку с другой статьи, я создал зависимость, которую надо разрешать. Пользователь может кликнуть на ссылку и получить копию статьи без искомого раздела. Если я хочу избежать этого, я должен обновить статью, удалить кэшированный вариант статьи с Cloudflare, подождать три минуты и только после этого добавлять ссылку в другую статью. Да, этот паттерн требует осторожности.

При правильном использовании кэширование дает значительное улучшение производительности и экономию трафика. Передавайте неизменяемый контент, если вы можете легко изменить URL, или используйте серверную ревалидацию. Смешивайте  `max-age` и изменяемый контент, если вы достаточно смелы и уверены, что у вашего контента нет зависимостей, которые могут рассинхронизироваться.