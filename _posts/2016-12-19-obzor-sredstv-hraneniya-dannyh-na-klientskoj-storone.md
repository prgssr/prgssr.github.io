---
title: "Обзор средств хранения данных на клиентской стороне"
layout: post
categories: [development]
tags: [translation, javascript]
date: 2016-12-19 23:11:38 +0300
prism: yes
description: "Краткий обзор средств хранения данных в браузере от Ире Адеринокун"
original: "https://bitsofco.de/an-overview-of-client-side-storage/"
original_title: "An Overview of Client-Side Storage"
original_author: "Ире Адеринокун"
thumbnail: "noimage"
---

Хранение данных непосредственно в браузере обладает множеством преимуществ, основное из которых это быстрый и независимый от сети доступ к "базе данных". На данный момент есть 4 активных метода для этого (плюс один устаревший):

1. Куки
2. Локальное хранилище
3. Сессионное хранилище
4. IndexedDB
5. WebSQL (устаревшее)

## Куки

Куки это классический способ хранения простых строчных данных внутри документа. Обычно куки отсылаются с сервера на клиент, который может сохранять их, а затем отправлять обратно на сервер в ответ на последующие запросы. Это может быть использовано для таких вещей, как управление сессиями аккаунта или отслеживание пользовательской информации.

Дополнительно куки можно использовать и  для простого хранения данных на клиентской стороне. Поэтому они также часто используются для хранения общих данных типа пользовательских настроек.


### Базовые CRUD-операции с куки

Мы можем создавать, читать и удалять куки, используя следующий синтаксис:

```javascript
// Create
document.cookie = "user_name=Ire Aderinokun";  
document.cookie = "user_age=25;max-age=31536000;secure";

// Read (All)
console.log( document.cookie );

// Update
document.cookie = "user_age=24;max-age=31536000;secure"; 

// Delete
document.cookie = "user_name=Ire Aderinokun;expires=Thu, 01 Jan 1970 00:00:01 GMT";  

```

### Преимущества куки

* Их можно использовать для коммуникации с сервером
* Мы можем определить для куки срок их автоматического окончания вместо того, чтобы удалять вручную.

### Недостатки куки

* Они добавляются к загрузке страницы документа
* Они могут хранить небольшое количество данных
* Они могут содержать только строки.
* Потенциальные проблемы с безопасностью.
* Это метод не рекомендуется для хранения данных на клиенте с момента появления Web Storage API (локальное  и сессионное хранилище).

### Поддержка в браузерах

У куки есть базовая поддержка во всех больших браузерах.

## Локальное хранилище

Локальное хранилище это одна из разновидностей [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), специального API для хранения данных в браузере в формате ключ-значение. Этот API был создан как решение для проблем с куки и является более интуитивным и безопасным способом хранения простых данных внутри браузера.

Хотя технически мы можем хранить  в локальном хранилище только строки, это обходится за счет преобразования в JSON. Таким образом мы можем сохранять в локальном хранилище более сложные данные по сравнению с куки.

### Базовые CRUD-операции с локальным хранилищем

Мы можем создавать, читать и удалять данные в локальном хранилище, используя следующий синтаксис:

```javascript
// Create
const user = { name: 'Ire Aderinokun', age: 25 }  
localStorage.setItem('user', JSON.stringify(user));

// Read (Single)
console.log( JSON.parse(localStorage.getItem('user')) ) 

// Update
const updatedUser = { name: 'Ire Aderinokun', age: 24 }  
localStorage.setItem('user', JSON.stringify(updatedUser));

// Delete
localStorage.removeItem('user');  

```

### Преимущества локального хранилища

* Предлагает более простой и интуитивный интерфейс хранения данных .
* Более безопасно для хранения данных на клиенте.
* Позволяет хранить больше данных (все 3 пункта — в сравнении с куки). 

### Недостатки локального хранилища

* Позволяет хранить только строки

### Поддержка в браузерах

[![Поддержка в браузерах localStorage](/images/development/javascript/caniusewebstorage.png)](http://caniuse.com/#search=web%20storage)

## Сессионное хранилище

Сессионное хранилище это вторая разновидность  [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Оно точно такое же как и локальное хранилище за исключением того, что данные хранятся только для сессии вкладки браузера. Как только пользователь уходит со страницы и закрывает браузер, данные очищаются.

### Базовые CRUD-операции с сессионным хранилищем

Мы можем создавать, читать и удалять данные в сессионном хранилище, используя следующий синтаксис:

```javascript
// Create
const user = { name: 'Ire Aderinokun', age: 25 }  
sessionStorage.setItem('user', JSON.stringify(user));

// Read (Single)
console.log( JSON.parse(sessionStorage.getItem('user')) ) 

// Update
const updatedUser = { name: 'Ire Aderinokun', age: 24 }  
sessionStorage.setItem('user', JSON.stringify(updatedUser));

// Delete
sessionStorage.removeItem('user');  
```

Достоинства, недостатки и поддержка в браузерах точно такие же как и у локального хранилища.

## IndexedDB

IndexedDB это намного более сложное и проработанное решение для хранения данных в браузере, так как это низкоуровневый API  для  хранения на клиенте значительного количества структурированных данных. По своей сути это объектно-ориентированная база данных, основанная  на JavaScript, которая позволяет нам легко сохранять и извлекать данные, проиндексированные по ключу.

В моей статье [ Building a Progressive Web Application](https://bitsofco.de/bitsofcode-pwa-part-2-instant-loading-with-indexeddb/) я более детально рассмотрела как использовать IndexedDB для создания offline-first приложения.

### Базовые CRUD-операции с IndexedDB

Примечание: во всех примерах используется библиотека Джейка Арчибальда  [IndexedDB Promised library](https://github.com/jakearchibald/idb), предлагающая работу с IndexedDB при помощи методов на основе промисов.
{: .info}

Использование IndexedDB является более сложным в сравнении с остальными методами хранения данных в браузере. Перед тем как мы сможем создавать/читать/обновлять/удалять какие-либо данные, нам надо сначала открыть базу данных и создать хранилища (аналогичные таблицам в базе данных).

```javascript
function OpenIDB() {  
    return idb.open('SampleDB', 1, function(upgradeDb) {
        const users = upgradeDb.createObjectStore('users', {
            keyPath: 'name'
        });
    });
}

```

Для создания (или обновления) данных в хранилище нам надо проделать следующие шаги:

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read/write transaction with the store within the database
    const transaction = db.transaction(dbStore, 'readwrite');
    const store = transaction.objectStore(dbStore);

    // 3. Add the data to the store
    store.put({
        name: 'Ire Aderinokun',
        age: 25
    });

    // 4. Complete the transaction
    return transaction.complete;
});

```

А вот действия для извлечения данных:

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read-only transaction with the store within the database
    const transaction = db.transaction(dbStore);
    const store = transaction.objectStore(dbStore);

    // 3. Return the data
    return store.get('Ire Aderinokun');
}).then((item) => {
    console.log(item);
})

```

И наконец, образец кода для удаления данных:

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read/write transaction with the store within the database
    const transaction = db.transaction(dbStore, 'readwrite');
    const store = transaction.objectStore(dbStore);

    // 3. Delete the data corresponding to the passed key
    store.delete('Ire Aderinokun');

    // 4. Complete the transaction
    return transaction.complete;
})

```

Если вы заинтересованы в том, чтобы узнать больше об использовании IndexedDB, вы можете прочитать мою [статью](https://bitsofco.de/bitsofcode-pwa-part-2-instant-loading-with-indexeddb/) о том, как я использовала это в своем PWA (прогрессивном веб-приложении).

### Преимущества IndexedDB

* Могут обрабатывать более сложные структурированные данные.
* Может работать с разными "базами данными" и "таблицами" внутри каждой "базы данных".
* Больше объем хранения.
* Больше контроля по взаимодействию с хранилищем.

### Недостатки IndexedDB

* Более сложное по сравнению с Web Storage API.

### Поддержка в браузерах

[![Поддержка в браузерах indexedDB](/images/development/javascript/caniuseindexeddb.png)](http://caniuse.com/#search=indexeddb)

## WebSQL

WebSQL это API для реляционной базы на клиенте, сходное с SQLite. С 2010  рабочая группа W3C прекратила работу над этой спецификацией и этот API больше не является частью спецификации HTML и не должен использоваться.

## Сравнение


|-|-|-|-|-
|  |  Cookies  |   Local Storage |  Session Storage  |   IndexedDB
|-|-|-|-|-
Лимит хранимых данных |  ~4KB  |   ~5MB  |   ~5MB  |   До половины жесткого диска
Постоянное хранение |    Да  |    Да |     Нет |   Да
Тип данных  |    Строка |  Строка  |  Строка |  Любые структурированные данные
Индексируемость |  Нет |  Нет |  Нет |  Да