---
title: Трюки с псевдоклассом &#58;target
layout: post
categories: [development]
tags: [translation, css]
date: 2016-07-19 20:23:21 +0300
prism: yes
description: "Псевдокласс &#58;target как неожиданная замена JavaScript&#58; выдвигающаяся навигация, модальное окно и другие примеры"
original: "https://bitsofco.de/the-target-trick/"
original_title: "The &#58;target Trick"
original_author: "Ире Адеринокун"
thumbnail: "noimage"
style: "/css/mark.css"
---

Псевдокласс `:target` (цель)  выбирает тот элемент в документе, на который указывает фрагмент URL. Например, <mark id="target-test">этот фрагмент текста</mark> обернут элементом `<mark>` с ID  `#target-test`. Если вы перейдете по ссылке [#target-test](#target-test), то этот элемент станет целью и стили псевдокласса `:target` начнут действовать.

В прошлом году я уже писала о псевдоклассе `:target` в статье [5 малоиспользуемых селекторов CSS (и их применение)](https://bitsofco.de/5-lesser-used-css-selectors/). Первым примером было использование псевдокласса `:target` для подсветки раздела страницы, на который совершен переход. Это может быть, например, добавление фонового цвета или границы, как в примере с [#target-test](#target-test).

Но недавно я пришла к выводу, что мы можем использовать псевдокласс `:target` с большей пользой, создавая на странице интерактивные элементы без JavaScript.

## Пример №1: скрытие и показ содержимого

Простым примером использования псевдокласса `:target` будет скрытие и показ содержимого, на которое мы нацелились. В блоге мы можем таким образом показывать раздел с комментариями после клика пользователя. Это делается простым скрытием элемента до тех пор, пока тот не подпадает под `:target`.

```html
<a href="#comments">Show Comments</a>

<section id="comments">  
    <h3>Comments</h3>
    <!-- Comments here... -->
    <a href="#">Hide Comments</a>
</section>  
```

```css
#comments:not(:target) {
    display: none;
}
#comments:target {
    display: block;
}
```

![Показ комментариев по клику](/images/development/css/Target_hide_show.gif)

[*Демонстрация примера*](http://demo.bitsofco.de/the-target-trick/hide-show.html)
{: style="text-align:center"}

## Пример №2: выдвигающаяся навигация

Следующий пример это создание выдвигающейся панели навигации. Мы помещаем панель навигации фиксированно относительно области видимости, чтобы обеспечить отсутствие скачков после клика пользователя.

```css
#nav {
    position: fixed;
    top: 0;
    height: 100%;
    width: 80%;
    max-width: 400px;
}

#nav:not(:target) {
    right: -100%;
    transition: right 1.5s;
}

#nav:target {
    right: 0;
    transition: right 1s;
}

```

![Выдвигающаяся навигация](/images/development/css/Target_Slideout_drawer.gif)

[*Демонстрация примера*](http://demo.bitsofco.de/the-target-trick/slide-out.html)
{: style="text-align:center"}

## Пример №3: всплывающее модальное окно

Развивая эту идею, мы можем создать модальное окно, заполняющее страницу целиком.

```css
#modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    width: 70%;
    background: #fff;
    padding: 20px;
    text-align: center;
}

#modal-container:not(:target) {
    opacity: 0;
    visibility: hidden;
    transition: opacity 1s, visibility 1s;
}

#modal-container:target {
    opacity: 1;
    visibility: visible;
    transition: opacity 1s, visibility 1s;
}
```

![Модальное окно](/images/development/css/Target_modal.gif)

[*Демонстрация примера*](http://demo.bitsofco.de/the-target-trick/modal.html)
{: style="text-align:center"}

## Пример №4: изменение глобальных стилей

Последний пример нельзя назвать верным в плане семантики, это применение псевдокласса `:target` к элементу `<body>` с последующей  заменой стилей или раскладки страницы.

```scss
#body:not(:target) {
    main { width: 60%; }
    aside { width: 30%; }
    .show-sidebar-link { display: none; }
}

#body:target {
    main { width: 100%; }
    aside { display: none; }
    .hide-sidebar-link { display: none; }
}
```

![Скрытие боковой колонки с помощью target](/images/development/css/Target_body.gif)

[*Демонстрация примера*](http://demo.bitsofco.de/the-target-trick/body.html)
{: style="text-align:center"}

## Как насчет семантики и доступности?

Как я уже упоминала в статье  ["Ссылки или кнопки"](https://bitsofco.de/anchors-vs-buttons/), при использовании элемента `<a>` браузер ожидает переход на другую страницу или другой раздел страницы. В моих примерах (кроме последнего) именно это и происходит. Трюк только в том, что в обычном состоянии стилизуемый элемент скрыт, он динамически появлется  только  в нацеленном состоянии.

Насколько я могу сказать, у этого метода есть два потенциальных недостатка:

1. Меняется URL, что влияет на историю браузера. Это значит, что при переходе пользователя "назад", он может непреднамеренно перейти к целевому элементу.
2. Для закрытия целевого элемента пользователю надо перейти к другому элементу или просто к `#`. Последний вариант (который я использую в своих примерах) не является семантичным и может перенаправить пользователя к началу статьи, к чему пользователь может быть не готов.

Тем не менее, при корректном использовании этот метод можно использовать, как минимум, в качестве запасного варианта взаимодействия для пользователей с отключенным JavaScript. В некоторых случаях, как в первом примере, это даже может быть предпочтительнее и проще, чем использование JavaScript. Как всегда, это зависит от каждого конкретного случая.


