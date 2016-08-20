---
title: Мониторинг веб-приложений
layout: post
categories: [development]
tags: [javascript, translation, medium]
date: 2016-08-20 11:39:02 +0300
prism: yes
description: "Эрик Бидельман о современных API для мониторинга приложений"
original: "https://medium.com/dev-channel/observing-your-web-app-145ea1db3469#.1lkiybc2o"
original_title: "Observing your web app"
original_author: "Eric Bidelman"
notoc: "true"
thumbnail: "noimage"
---

В вебе есть множество API для информирования о том, что происходит в вашем приложении. Вы можете мониторить множество вещей и наблюдать практически любые типы изменений.

Эти изменения варьируются от простых вещей типа мутаций DOM и отлова ошибок на клиентской части до более сложных уведомлений типа разрядки батареи устройства пользователя. При этом остается постоянным набор способов взаимодействия с ними: функции обратного вызова, промисы, события.

Ниже показаны отдельные примеры их использования, которые я придумал. Этот список совсем не исчерпывающий. В основном это примеры мониторинга структуры приложения, его состояния и свойств устройства, на котором оно выполняется.

####  Прослушиваем события DOM (как нативные, так и кастомные):

```javascript
// user scrolls the page.
window.addEventListener('scroll', e => { ... });

el.addEventListener('focus', e => { ... }); // el is focused. img.addEventListener('load', e => { ... }); // img is done loading. 

// user types into input.
input.addEventListener('input', e => { ... }); 

// catch custom event fired on el.
el.addEventListener('custom-event', e => { ... });
```

#### Прослушиваем модификацию DOM:

```javascript
const observer = new MutationObserver(mutations => { ... }); observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});
```

#### Узнаем об изменении URL:

```javascript
window.onhashchange = e => console.log(location.hash); window.onpopstate = e => console.log(document.location, e.state);
```

#### Узнаем о работе приложения в полноэкранном режиме ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)):

```javascript
document.addEventListener('fullscreenchange', e => {
  console.log(document.fullscreenElement)
});
```

#### Узнаем о поступлении сообщений по WebRTC:

```javascript
// Cross-domain / window /worker.
window.onmessage = e => { ... }; 

// WebRTC
const dc = (new RTCPeerConnection()).createDataChannel(); dc.onmessage = e => { ... };
```

#### Узнаем об ошибках на клиентской стороне ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)):

```javascript
// Client-size error?
window.onerror = (msg, src, lineno, colno, error) => { ... };

// Unhandled rejected Promise?
window.onunhandledrejection = e => console.log(e.reason);
```

#### Отслеживаем изменение ориентации экрана устройства ([подробнее](https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange)):

```javascript
const media = window.matchMedia('(orientation: portrait)'); media.addListener(mql => console.log(mql.matches)); 

// Orientation of device changes.
window.addEventListener('orientationchange', e => {
  console.log(screen.orientation.angle)
});
```

#### Отслеживаем изменения в сетевом соединении ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)):

```javascript
// Online/offline events.
window.addEventListener('online', e => {
  console.assert(navigator.onLine)
});
window.addEventListener('offline', e => {
  console.assert(!navigator.onLine)
});

// Network Information API navigator.connection.addEventListener('change', e => {
  console.log(navigator.connection.type,
              navigator.connection.downlinkMax);
});
```

#### Отслеживаем состояние заряда батареи устройства ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)):

```javascript
navigator.getBattery().then(batt => { 
  batt.addEventListener('chargingchange', e => {
    console.log(batt.charging);
  });
  batt.addEventListener('levelchange',e => {
    console.log(batt.level);
  });
  batt.addEventListener('chargingtimechange', e => {
    console.log(batt.chargingTime);
  }); 
  batt.addEventListener('dischargingtimechange', e => {
    console.log(batt.dischargingTime);
  });
});


```

#### Узнаем о видимости/нахождении в фокусе вкладки или страницы ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)):

```javascript
document.addEventListener('visibilitychange', e => {
  console.log(document.hidden)
});
```

#### Узнаем о смене пользователем расположения:

```javascript
navigator.geolocation.watchPosition(pos => console.log(pos.coords));
```

#### Узнаем о изменении разрешений на использование нужного API ([подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)):

```javascript
const q = navigator.permissions.query({name: 'geolocation'}); q.then(permission => {
  permission.addEventListener('change', e => {
    console.log(e.target.state);
  });
});
```

#### Узнаем об обновлении другой вкладкой локального хранилища или хранилища сессии:

```javascript
window.addEventListener('storage', e => alert(e));
```

#### Узнаем о появлении или покидании элементом области видимости (то есть о видимости элемента, [подробнее](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)):

```javascript
const observer = new IntersectionObserver(changes => {
  ...
}, {threshold: [0.25]}); observer.observe(document.querySelector('#watchMe'));
```

#### Узнаем, когда браузер находится в "ленивом" режиме (и готов выполнить какую-нибудь дополнительную работу, [подробнее](https://developers.google.com/web/updates/2015/08/using-requestidlecallback?hl=en)):

```javascript
requestIdleCallback(deadline => { ... }, {timeout: 2000});
```

#### Узнаем о загрузке браузером ресурса или о записи метрики  [User Timing ](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) ([подробнее](https://developers.google.com/web/updates/2016/06/performance-observer?hl=en)):

```javascript
const observer = new PerformanceObserver(list => {
  console.log(list.getEntries());
});
observer.observe({entryTypes: ['resource', 'mark', 'measure']});
```

#### Узнаем об изменении свойств объекта (включая свойства DOM, [подробнее](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)):

```javascript
// Observe changes to a DOM node's .textContent.
// From gist.github.com/ebidel/d923001dd7244dbd3fe0d5116050d227 

const proxy = new Proxy(document.querySelector('#target'), { 
  set(target, propKey, value, receiver) {
    if (propKey === 'textContent') {
      console.log('textContent changed to: ' + value);
    }
    target[propKey] = value;
  }
});
proxy.textContent = 'Updated content!';
```

Круто! И, главное, что еще большее количество [API](https://www.chromestatus.com/features/5558926443544576) [находится](https://www.chromestatus.com/features/5768542523752448) в [разработке](https://www.chromestatus.com/features/5662847321243648).

Я предполагаю, что вы могли бы классифицировать некоторые из этих примеров как техники и паттерны (например, реагирование на события DOM). Однако многие совершенно новые API создавались с определенной целью: измерение производительности, информирование о заряде батареи, состояния онлайн или офлайн.

Это действительно впечатляет, к каким вещам у веб-разработчиков есть доступ в наши дни. API есть практически для всего.

