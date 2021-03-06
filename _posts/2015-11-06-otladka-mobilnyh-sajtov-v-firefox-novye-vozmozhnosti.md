---
layout: post
title: Отладка мобильных сайтов в Firefox - новые возможности
date: 2015-11-06 17:23:59
categories: [articles]
description: "Удаленная отладка c Web IDE в Firefox стала проще, чем когда-либо. А новым Firefox 42 можно подключать отлаживаемое устройство по WiFi!"
tags: [mobile, devtools]
prism: yes
thumbnail: "/images/development/browsertools/remote-debugging-android-attached.png"
redirect_from:
  - "/articles/otladka-mobilnyh-sajtov-v-firefox---novye-vozmozhnosti.html"
  - "/articles/otladka-mobilnyh-sajtov-v-firefox---novye-vozmozhnosti"
---

Летом я размещал перевод статьи [про отладку мобильных сайтов в Firefox](http://prgssr.ru/development/Otladka-mobilnyh-sajtov-v-Firefox.html), с тех пор многое поменялось, а с выходом на этой неделе Firefox 42 стало очевидно, что тот материал по большей части устарел. Советы по использованию отзывчивого режима остаются в силе, также как и часть статьи про активацию режима USB-отладки в Android, а в остальном все стало намного лучше

## Отладка по USB

Начиная с десктопного Firefox 36+  отладка по USB упростилась.

Для работы  нужны компьютер с Firefox 36+ и мобильное устройство с  Firefox 35+, соединенные между собой по USB-кабелю.

Запускаем  Web IDE (клавиша Shift+F8 или меню "Tools->Web Developer->Web IDE"). Для удаленной отладки необходимо дополнение ADB Helper версии 0.7.1+, оно устанавливается автоматически после первого запуска WebIDE. Проверить, какая версия установлена у вас, можно набрав в адресной строке `about:addons`.

![Экстра компоненты Web IDE](/images/development/browsertools/extra-components.png)

Если же ADB Helper отсутствует в списке дополнений, выберите в меню Web IDE пункт "Project->Manage Extra Components", найдите в списке ADB Helper и переустановите его (кликните "uninstall", а затем "install").

[Активируйте режим разработки на Android и режим отладки в мобильном Firefox](http://prgssr.ru/development/Otladka-mobilnyh-sajtov-v-Firefox.html#heading-section-3), если вы не сделали это раньше.

### Распознавание Android устройства

Теперь надо настроить распознавание вашего Android устройства в системе.

В  Windows для этого установите  USB драйвер для `adb` --- [вот инструкции по установке ссылки на драйверы](http://developer.android.com/tools/extras/oem-usb.html), на Mac все должно работать без каких-либо дополнительных манипуляций.

В Ubuntu Linux, как всегда, все просто и элегантно --- нужно всего лишь  добавить файл с правилами `udev` для каждого отлаживаемого USB устройства. У каждого устройства есть свой уникальный ID производителя, вот их [список на сайте Android](http://developer.android.com/tools/device.html#VendorIds). Если вашего устройства в списке нет, введите в консоли `lsusb` и вы получите список подключенного USB оборудования; в моем случае нужное устройство --- `Bus 002 Device 004: ID 0414:0c03 Giga-Byte Technology Co., Ltd`, искомый идентификатор, соответственно, `0414`.

Узнав идентификатор устройства, под рутом создаем файл `/etc/udev/rules.d/51-android.rules` и добавляем в него следующую строчку:

```markup
SUBSYSTEM=="usb", ATTR{idVendor}=="0414", MODE="0666", GROUP="plugdev"
```

`ATTR` это  вендорный идентификатор (в данном случае Giga-Byte), `MODE` это набор прав для чтения/записи, а `GROUP` это группа, у которой есть права на устройство.

Синтаксис этого правила может отличаться в вашей версии Linux --- ориентируйтесь на документацию `udev` вашей системы. Прочитать подробнее о [написании правил udev можно на reactivated.net](http://www.reactivated.net/writing_udev_rules.html).
{: .info}

Теперь выполните в консоли:

```bash
chmod a+r /etc/udev/rules.d/51-android.rules
```

Проверить подключение устройства можно консольной командой `adb devices` (в системе должен быть установлен пакет `android-tools-adb`).

Все, теперь можно переходить к следующему шагу.

### Использование Web IDE

Итак, устройство Android подключено и распознано, режим отладки активирован, а в браузере активирована удаленная отладка по USB --- запускаем Web IDE и [переходим в меню Runtimes](https://developer.mozilla.org/en-US/docs/Tools/WebIDE#Setting_up_runtimes) (расположено справа), вот как это будет выглядеть:

![меню Runtimes в WebIDE](/images/development/browsertools/remote-debugging-android-runtime.png)

Выбираем устройство, на нем появится модальное окно с вопросом, разрешать ли  отладку:

![Разрешение на отладку](/images/development/browsertools/remote-debugging-permission.png)

В меню Open App (расположено слева) выбираем нужную вкладку --- страницу, которая в текущий момент просматривается на мобильном браузере:

![меню Open App в WebIDE](/images/development/browsertools/remote-debugging-android-open-tabs.png)

И занимаемся непосредственно отладкой:

![Отладка в WebIDE](/images/development/browsertools/remote-debugging-android-attached.png){: itemprop="image"}

## Отладка по WiFi

А это уже самое свежее на текущий момент - в Firefox 42 появилась отладка по WiFi. Что для этого нужно? Разумеется, Firefox  42+ на десктопе и  Firefox  42+ на Android, подключенные к одной сети, а также приложение для сканирования штрих-кода.

В качестве такого приложения Mozilla предлагает установить [Barcode Scanner Android app by ZXing Team](https://play.google.com/store/apps/details?id=com.google.zxing.client.android) --- приложение небольшое и бесплатное. Затем надо активировать отладку по WiFi --- в меню "Инструменты разработки":

![Активация отладки по Wifi в телефоне](/images/development/browsertools/remote-debugging-wifi.png)

Далее открываем Web IDE (Shift+F8) и выбрать соответствующее устройство с WiFi

![выбор устройства в Web IDE](/images/development/browsertools/webide-wifi-runtime.png)

Web IDE предложит вам считать QR код:

![Сканирование QR кода](/images/development/browsertools/webide-qr-code.png)

На устройстве Android появится сообщение с предложением о подключении --- выберите “Scan” или “Scan and Remember” и сканируйте код с помощью сканнера. После сканирования QR кода это окно исчезнет, а иконка устройства в  WebIDE станет синей (это значит, что устройство подключено). Сканировать QR код надо один раз при первоначальном подключении, в дальнейшем устройство подключается автоматически.

Теперь у вас есть доступ ко всем вкладкам мобильного браузера из  панели  Web IDE и вы можете исследовать их с помощью  инструментов для разработки десктопного Firefox. Не забываем, кстати, что [третья версия Firebug будет не самостоятельным дополнением, а надстройкой над DevTools](https://hacks.mozilla.org/2015/10/firebug-devtools-integration/), то есть в перспективе к нативным инструментам разработки могут добавиться инструменты Firebug.

## Отладка в Chrome

Ну и добавлю совсем немного про Chrome, чтобы было с чем сравнивать

Отладки по WiFi в Chrome нет, но с [отладкой по USB все хорошо](https://developer.chrome.com/devtools/docs/remote-debugging). Итак, у вас активирована отладка по USB в Android устройстве, само устройство подключено к компьютеру. В адресной строке Chrome введите адрес `chrome://inspect`:

![Удаленная отладка в Chrome](/images/development/browsertools/chrome-inspect-devices.png)

Вы увидите подключенное устройство или список устройств и отображаемые на них в данный момент вкладки.

![Выбор отлаживаемой вкладки](/images/development/browsertools/chrome-inspect-tabs.png)

Нажимаете `inspect` под нужной вкладкой и все --- у вас открывается окно браузера с инструментами разработчика и экраном устройства (иконка  `toggle screencast` c изображением смартфона), вы можете прямо в этом окне нажимать на кнопки и скроллить страницу с помощью имитатора нажатий, ну и использовать любые другие доступные фичи devtools.
