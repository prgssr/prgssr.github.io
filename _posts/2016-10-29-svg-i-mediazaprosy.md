---
title: "SVG и медиазапросы"
layout: post
categories: [development]
tags: [translation, svg]
date: 2016-10-29 22:57:27 +0300
prism: yes
description: "Джейк Арчибальд о применении медиазапросов к SVG — кроссбраузерность, вложение в img, iframe и canvas"
original: "https://jakearchibald.com/2016/svg-media-queries/"
original_title: "SVG & media queries"
original_author: "Джейк Арчибальд"
thumbnail: "/images/pr.png"
style: "/css/test-svg.css"
---

Одним из достоинств SVG является то, что вы можете использовать медазапросы для добавления изображениям отзывчивости:

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <style>
    circle {
      fill: green;
    }
    @media (min-width: 100px) {
      circle {
        fill: blue;
      }
    }
  </style>
  <circle cx="50" cy="50" r="50"/>
</svg>

```

Но когда круг станет синим? Спецификация говорит, что свойство `min-width` должно [соответствовать ширине области видимости](https://drafts.csswg.org/mediaqueries-3/#width), но...

Какой именно области видимости?

```html
<img src="circle.svg" width="50" height="50">
<img src="circle.svg" width="100" height="100">
<iframe src="circle.svg" width="50" height="50"></iframe>
<svg width="50" height="50">
  …as above…
</svg>
```

Какой код из приведенного примера  нарисует синий круг (возможно, обрезанный) в документе? И какая область видимости будет использована? Есть следующие варианты:

* размеры  основного документа
* размеры, заданные  атрибутами ширина/высота/viewBox  `<svg>`
* размеры, заданные  атрибутами ширина/высота `<img>`
* заданный раскладкой CSS размер  `<img>`

Вот результат этого кода:

<figure class="full-figure trans-tile">
<div class="img-row">
<img src="/images/development/svg/fixed100.svg" width="50" height="50" alt="">
<img src="/images/development/svg/fixed100.svg" width="100" height="100" alt="">
<iframe src="/images/development/svg/fixed100.svg" width="50" height="50"></iframe>
<svg width="50" height="50">
  <style>
    .inline-svg-circle {
      fill: green;
    }
    @media (min-width: 100px) {
      .inline-svg-circle {
        fill: blue;
      }
    }
  </style>
  <circle class="inline-svg-circle" cx="50" cy="50" r="50"></circle>
</svg>
</div>
</figure>

## Область видимости в большинстве браузеров

В  `<img>` SVG масштабируется до заполнения размеров всего элемента, соответственно, областью видимости SVG являются CSS размеры `<img>`. Так  у первого `<img>` ширина задана 50, а у второго 100. Это значит, что второй элемент `<img>` подхватит медиазапрос для синего цвета, а первый — нет.

Для `<iframe>` областью видимости SVG является область видимости `<iframe>`. Поэтому в примере выше область видимости равна 50 пикселям, так как это ширина элемента `<iframe>`.

В строчном `<svg>` у SVG нет собственной области видимости, это часть родительского документа, а, значит, `<style>` берется из родительского документа, а не из SVG. Это показалось мне странным, когда я впервые использовал строчный SVG, но это разумно и [это прекрасно описано в спецификации](https://svgwg.org/svg2-draft/styling.html#StyleSheetsInHTMLDocuments).

###  А что с Firefox?

У этого браузера другой подход. Поведение идентично, за исключением следующего:

У элемента `<img>` область видимости это полученный в пикселях размер изображения , то есть область видимости зависит от плотности пикселей на  устройстве. Первое изображение в демо раскрашивается в зеленый цвет на экранах с плотностью 1x и в синий на экранах 2x. Проблема в том, что у некоторых компьютеров и у многих телефонов плотность пикселей больше 1.

Это похоже на баг, особенно с учетом того, что Firefox не применяет ту же логику к `iframe`, но мы простим этот косяк, так как спецификации нет точного указания, как должен масштабироваться SVG внутри тега `<img>`, не говоря уже об обработке медиазапросов.

Я [сообщил об этой проблеме в спецификации](https://github.com/w3c/svgwg/issues/289) и, надеюсь, что это будет решено.

Но в следующей теме все становится еще более запутанным.

## Рисование SVG в canvas

У вас также есть возможность вывести  `<img>` внутри холста `<canvas>`:

```javascript
canvas2dContext.drawImage(img, x, y, width, height);
```

Но когда круг станет синим? Наш выбор областей видимости значительно расширился, список вариантов следующий:

* Размеры окна документа
* Атрибуты ширины/высоты/viewBox в `<svg>`
* Атрибуты ширины/высоты `<img>`
* CSS размеры `<img>`
* Пиксельные размеры `<canvas>`
* CSS размеры `<canvas>`
* Ширина/высота, заданные в `drawImage`
* Ширина/высота, заданные в `drawImage` с учетом трансформаций 2d context 

Так на что же рассчитывать? Опять, в спецификации нет ясности по этому поводу и на данный момент каждый браузер определяет это по-своему.


<form action="" class="svg-test-form">
  <div class="fields">
    <fieldset>
      <legend>SVG size</legend>
      <div><label><input name="img-type" value="50" checked="" type="radio"> 50x50</label></div>
      <div><label><input name="img-type" value="100" type="radio"> 100x100</label></div>
      <div><label><input name="use-viewbox" type="checkbox"> Use viewBox</label></div>
    </fieldset>
    <fieldset>
      <legend><code>&lt;img&gt;</code> size</legend>
      <div><label><input name="img-size" value="0" checked="" type="radio"> Unset</label></div>
      <div><label><input name="img-size" value="50" type="radio"> 50x50</label></div>
      <div><label><input name="img-size" value="100" type="radio"> 100x100</label></div>
    </fieldset>
    <fieldset>
      <legend><code>&lt;img&gt;</code> CSS size</legend>
      <div><label><input name="img-css-size" value="0" checked="" type="radio"> Unset</label></div>
      <div><label><input name="img-css-size" value="50" type="radio"> 50x50</label></div>
      <div><label><input name="img-css-size" value="100" type="radio"> 100x100</label></div>
      <div><label><input name="add-to-dom" type="checkbox"> Add to &lt;body&gt;</label></div>
    </fieldset>
    <fieldset>
      <legend><code>&lt;canvas&gt;</code> size</legend>
      <div><label><input name="canvas-size" value="50" checked="" type="radio"> 50x50</label></div>
      <div><label><input name="canvas-size" value="100" type="radio"> 100x100</label></div>
    </fieldset>
    <fieldset>
      <legend><code>drawImage</code> size</legend>
      <div><label><input name="drawimage-size" value="50" checked="" type="radio"> 50x50</label></div>
      <div><label><input name="drawimage-size" value="100" type="radio"> 100x100</label></div>
    </fieldset>
    <fieldset>
      <legend>Context transform</legend>
      <div><label><input name="context-transform" value="0.5" type="radio"> 0.5x</label></div>
      <div><label><input name="context-transform" value="1" checked="" type="radio"> 1x</label></div>
      <div><label><input name="context-transform" value="2" type="radio"> 2x</label></div>
      <div><label><input name="context-transform" value="5" type="radio"> 5x</label></div>
    </fieldset>
  </div>
  <div class="svg-test-output trans-tile"><canvas width="50" height="50"></canvas></div>
</form>

<script>
function loadImg(url, width, height) {
  return new Promise(function(resolve, reject) {
    var img = new Image();

    if (width) {
      img.width = width;
    }

    if (height) {
      img.height = height;
    }

    img.src = url;
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject(Error('Image load failed'))
    };
  });
}

(function() {
  var svgImgs = {
    fixed50: '/images/development/svg/fixed50.svg',
    fixed100: '/images/development/svg/fixed100.svg',
    viewbox50: '/images/development/svg/viewbox50.svg',
    viewbox100: '/images/development/svg/viewbox100.svg',
  };

  function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function drawImgOnCanvas(canvas, img, width, height, scale) {
    var context = canvas.getContext('2d');
    context.scale(scale, scale);
    context.drawImage(img, 0, 0, width, height);
  }

  var svgTestForm = document.querySelector('.svg-test-form');
  var svgTestOutput = document.querySelector('.svg-test-output');

  function processForm() {
    var svgSize = svgTestForm.querySelector('[name=img-type]:checked').value;
    var imgSize = Number(svgTestForm.querySelector('[name=img-size]:checked').value);
    var imgCssSize = Number(svgTestForm.querySelector('[name=img-css-size]:checked').value);
    var addImgToDom = !!svgTestForm.querySelector('[name=add-to-dom]:checked');
    var useViewbox = !!svgTestForm.querySelector('[name=use-viewbox]:checked');
    var canvasSize = Number(svgTestForm.querySelector('[name=canvas-size]:checked').value);
    var drawImageSize = Number(svgTestForm.querySelector('[name=drawimage-size]:checked').value);
    var contextTransform = Number(svgTestForm.querySelector('[name=context-transform]:checked').value);
    var imgUrl;

    if (useViewbox) {
      imgUrl = svgImgs['viewbox' + svgSize];
    }
    else {
      imgUrl = svgImgs['fixed' + svgSize];
    }

    svgTestOutput.innerHTML = '';

    loadImg(imgUrl, imgSize, imgSize).then(img => {
      var el = img;

      if (imgCssSize) {
        img.style.width = img.style.height = imgCssSize + 'px';
      }

      if (addImgToDom) {
        document.body.appendChild(img);
      }

      el = createCanvas(canvasSize, canvasSize);
      drawImgOnCanvas(el, img, drawImageSize, drawImageSize, contextTransform);

      if (addImgToDom) {
        document.body.removeChild(img);
      }

      svgTestOutput.appendChild(el);
    });
  }

  processForm();

  svgTestForm.addEventListener('change', function() {
    processForm();
  });
}());
</script>

Попробую описать, что делают браузеры.

### Chrome

Chrome использует атрибуты ширины и высоты, заданные в SVG. Это значит, что если в документе SVG задано `width="50"`, медиазапросы дадут область видимости в 50 пикселей. Если вы хотели вывести такой SVG с медиазапросом для ширины в 100 пикселей, то вам не повезло — независимо от размеров холста, он всегда будет выводится, исходя из ширины в 50 пикселей.

Однако, если в SVG также задан атрибут `viewBox`, а не фиксированные размеры, Chrome использует пиксельную ширину `<canvas>` в качестве ширины области видимости. Вы можете поспорить, что это похоже на то, как  работают медиазапросы в строчном SVG, когда областью видимости является все окно, но такое изменение поведения на основе `viewBox` достаточно странно.

В общем, Chrome выиграл первый приз по части причудливости.

### Safari

Как и Chrome, Safari использует размер, заданный в документе SVG со всеми его минусами. Но если SVG использует `viewBox` вместо фиксированной ширины, то ширина рассчитывается на основе  `viewBox`, поэтому у SVG с `viewBox="50 50 200 200"` ширина будет равна 150.

Менее причудливое поведение, чем у Chrome, но не менее ограничивающее.

### Firefox

Firefox использует ширину/высоту, заданные в вызове `drawImage`, с учетом всех трансформаций контекста. Это значит, что если вы нарисуете SVG с шириной холста 300 пикселей, область видимости будет равна этим 300 пикселям.

Это в какой-то степени продолжает странное поведение `<img>` — оно основано на количестве задействованных пикселей. Это значит, что поведение будет различаться, если вы будете манипулировать холстом с помощью `devicePixelRatio` и масштабировать обратно с помощью CSS — это делается, чтобы избежать "замыливания" на экранах с высокой плотностью пикселей:

<figure class="full-figure">
<div class="img-row">
<img class="text-image" src="/images/development/svg/helloworld.svg" width="150" height="60" alt="">
<canvas width="150" height="60" class="text-canvas"></canvas>
<canvas width="150" height="60" class="text-canvas-sharp" style="width: 150px; height: 60px;"></canvas>
</div>
<figcaption>&lt;img&gt;, &lt;canvas&gt;,  &lt;canvas&gt; с учетом плотности пикселей (без этого canvas будет замыленным на retina-дисплеях)</figcaption>
</figure>

<script>
(function() {
  loadImg('/images/development/svg/helloworld.svg').then(function(img) {
    var canvas = document.querySelector('.text-canvas');
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
  });
  loadImg('/images/development/svg/helloworld.svg').then(function(img) {
    var canvas = document.querySelector('.text-canvas-sharp');
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width = canvas.width * devicePixelRatio;
    canvas.height = canvas.height * devicePixelRatio;
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
}());
</script>

В поведении Firefox есть логика, но все ваши медиазапросы привязаны к задействованным пикселям.

### Microsoft Edge

В  Edge для определения области видимости используется размер `<img>`, заданный раскладкой. Если у `<img>` нет раскладки (отсутствует в дереве документа или применено свойство `display:none`), тогда используются атрибуты `width`/`height`, при их отсутствии используются внутренние размеры `<img>`.

Это значит, что вы можете нарисовать SVG размером 1000x1000, но если у изображения задано  `<img width="100">`, область видимости будет равна 100px.

На мой взгляд, это идеально. Это значит, что вы можете активировать медиазапросы для ширины независимо от нарисованной ширины. Когда вы рисуете на холсте `<img srcset="…" sizes="…">`, все браузеры согласятся, что в качестве нарисованного изображения должно быть то, которое выбрано  `<img>`.

## Заключение

Итак, при написании статьи я[ добавил сообщение о проблеме в спецификации для адаптации поведения Edge](https://github.com/whatwg/html/issues/1880) и [предложил дополнение к createImageBitMap, чтобы область видимости можно было задавать в скрипте](https://github.com/whatwg/html/issues/1881). Надеюсь, что поведение браузеров станет более единообразным в этом вопросе.

Ну и для полноты материала — вот [тест, использованный для получения материала](http://jsbin.com/gefaju/2/edit?js,output) и [таблица со всеми итоговыми данными](https://docs.google.com/spreadsheets/d/15IkG42KrEWgv_FbrgfGBSM_PYRi22Vj_uGrcp4LxyMU/edit#gid=0).