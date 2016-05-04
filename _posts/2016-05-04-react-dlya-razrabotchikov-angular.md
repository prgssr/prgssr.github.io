---
title: "React для Angular-разработчиков"
layout: post
categories: [development]
tags: [javascript, translation, sitepoint]
date: 2016-05-04 21:50:37 +0300
description: "Краткое сравнение React и Angular с примерами решения одинаковых задач"
prism: yes
original: "http://www.sitepoint.com/react-for-angular-developers/"
original_title: "React for Angular Developers"
original_author: "Марк Браун"
thumbnail: "noimage"
scripts: codepen
---

Эта статья предназначена  для разработчиков, знакомых с Angular первой версии и желающих узнать больше о React. Мы рассмотрим различие подходов, применяемых для построения веб-приложений, перекрывающуюся функциональность, а также пробелы, которые React не пытается заполнить.

После прочтения статьи у вас будет понимание круга проблем, которые решает React, достаточное для того, чтобы начать использовать React в ваших проектах.

## Фреймворки против библиотек

[Angular](https://angularjs.org/) это фреймворк, а [React](https://facebook.github.io/react/) — библиотека, сфокусированная исключительно на представлениях. Свои плюсы и минусы есть как при использовании фреймворков, так и при использовании библиотек.

Фреймворки стараются предложить полное решение и они могут помочь организовать код с помощью паттернов и соглашений, если вы работаете в большой команде. Однако у них объемный API, поэтому для работы с  фреймворками вам придется потратить много времени на чтение документации и запоминание паттернов, особенно, когда вы только начинаете их изучать.

Использование набора библиотек, не связанных жесткими зависимостями, проще в изучении и овладении, но требует от вас большего количества кода или подключения сторонних библиотек при столкновении с какими-либо проблемами.

## Возможности из коробки

Angular предоставляет вам богатый набор возможностей для создания веб-приложений, среди них есть следующее:

* шаблоны HTML с динамическими выражениями в фигурных скобках {% raw %}`{{  }}` {% endraw %} 
* встроенные директивы типа `ng-model`, `ng-repeat` и `ng-class` для расширения возможностей HTML
* контроллеры для группирования логики и передачи данных в представление
* двухстороннее связывание как простой способ синхронизации контроллера и представления
* большая коллекция модулей, таких как `$http` для коммуникации с сервером и `ngRoute` для маршрутизации
* кастомные директивы для создания собственного синтаксиса HTML
* инъекция зависимостей для ограничения доступа объектов к отдельным частям приложения
* сервисы для общей бизнес-логики
* фильтры для хелперов, форматирующих представления

С другой стороны, вот  арсенал React:

* синтаксис JSX для шаблонов с выражениями JavaScript в одиночных скобках `{ }`
* компоненты, напоминающие директивы элементов в Angular

React не предъявляет требований к структуре вашего приложения и рекомендует использовать стандартный API JavaScript поверх абстракций фреймворка. Здесь нет аналога [$http](http://www.sitepoint.com/api-calls-angularjs-http-service/) — вы можете использовать для коммуникации с сервером [fetch()](http://www.sitepoint.com/introduction-to-the-fetch-api/). Вы свободны в конструировании сервисов и фильтров, но React не предоставляет никакого слоя абстракции для управления ими. Вы можете поместить их в модули JavaScript и подключать по необходимости в своих компонентах.

Итак, Angular дает вам абстракции для распространенных задач, а React, наоборот, избегает этого, ориентируя вас на написание стандартного JavaScript и использование при необходимости внешних зависимостей.

## Инициализация

Для инициализации приложения Angular требуется модуль, список зависимостей и корневой элемент.

```javascript
let app = angular.module('app', [])
let root = document.querySelector('#root');
angular.element(root).ready(function() {
  angular.bootstrap(root, ['app']);
});

```

Входной точкой для React является рендеринг компонента в корневом узле, возможно использование нескольких корневых компонентов.

```javascript
let root = document.querySelector('#root');
ReactDOM.render(<App />, root)
```

## Шаблоны

Анатомия представлений Angular сложна и многофункциональна, шаблоны HTML содержат смесь директив и выражений, связывающих вместе представления и соответствующие контроллеры. Данные передаются через множественные контексты с помощью `$scope`.

В компонентах React данные всегда передаются в одном направлении: от вершины дерева компонента вниз к узлам. [JSX](http://www.sitepoint.com/getting-started-react-jsx/) является самым распространенным синтаксисом для написания компонентов, трансформирующим структуру XML в JavaScript. Несмотря на сходство с  синтаксисом шаблонов, это компилируется в вызовы вложенных функций.

```jsx
const App = React.createClass({
  render: function() {
    return (
      <Component>
        <div>{ 2 + 1 }</div>
        <Component prop="value" />
        <Component time={ new Date().getTime() }>
          <Component />
        </Component>
      </Component>
    )
  }
})

```


Показанный ниже скомпилированный код помогает уяснить, как наши выражения JSX  выглядят в вызовах функции `createElement(component, props, children)`.

```javascript
var App = React.createClass({
  render: function render() {
    return React.createElement(
      Component,
      null,
      React.createElement("div", null, 2 + 1),
      React.createElement(Component, { prop: "value" }),
      React.createElement(
        Component,
        { time: new Date().getTime() },
        React.createElement(Component, null)
      )
    );
  }
});

```

## Директивы шаблонов

Рассмотрим, как можно реализовать некоторые наиболее используемые директивы шаблонов Angular с помощью компонентов React. Так как в React нет шаблонов, в наших примерах мы взглянем на код JSX, расположенный внутри функции `render` компонента, как здесь:

```javascript
class MyComponent extends React.Component {
  render() {
    return (
      // здесь находится JSX
    )
  }
}

```

### Директива `ng-repeat`


```markup
<ul>
  <li ng-repeat="word in words">{ word }</li>
</ul>

```


Мы можем использовать стандартные механизмы цикла в JavaScript, чтобы получить массив элементов в JSX.

```jsx
<ul>
  { words.map((word)=> <li>{ word }</li> )}
</ul>
```

### Директива `ng-class`

```markup
<form ng-class="{ active: active, error: error }">
</form>
```

В React мы своими силами создаем  списки классов для свойства `className`. Обычно для этого используется какая-нибудь готовая функция типа [classNames](https://github.com/JedWatson/classnames) от Джеда Уотсона.

```jsx
<form className={ classNames({active: active, error: error}) }>
</form>

```

Атрибуты в JSX стоит рассматривать как непосредственное присваивание атрибутов узлу. Именно поэтому функция называется `className`, а не по названию атрибута `class`

```javascript
formNode.className = "active error";
```

### Директива `ng-if`

```markup
<div>
  <p ng-if="enabled">Yep</p>
</div>

```

Условия `if-else` не работают внутри JSX, так как JSX это всего лишь синтаксический сахар для вызова функции и создания объекта. Поэтому для этого используются тернарные операторы или условная логика выносится за пределы JSX в  метод рендеринга.

```javascript
// ternary
<div>
  { enabled ? <p>Enabled</p> : null }
</div>

// if/else outside of JSX
let node = null;
if (enabled) {
  node = <p>Enabled</p>;
}
<div>{ node }</div>

```

### Директивы `ng-show` / `ng-hide`

```markup
<p ng-show="alive">Living</p>
<p ng-hide="alive">Ghost</p>

```

В React вы можете задавать стили непосредственно или путем добавления служебного класса в CSS типа `.hidden { display: none }`, чтобы скрывать элементы (на самом деле Angular обрабатывает их тем же самым образом).

```jsx
<p style={ display: alive ? 'block' : 'none' }>Living</p>
<p style={ display: alive ? 'none' : 'block' }>Ghost</p>

<p className={ classNames({ hidden: !alive }) }>Living</p>
<p className={ classNames({ hidden: alive }) }>Ghost</p>

```

Вам надо потратить время и потренироваться с этим. Вместо использования специального синтаксиса шаблонов и атрибутов надо добиваться того же результата с помощью  JavaScript.

## Сравнение на примере компонента слайдшоу


Компоненты React во многом напоминают директивы Angular, они используются в первую очередь для абстрагирования сложных структур DOM в переиспользуемые фрагменты. Ниже показан образец компонента слайд-шоу в Angular, принимающего массив со слайдами, выводящего список изображений с элементами навигации и отслеживающего состояние `activeIndex` для выделения активного слайда.

```markup
<div ng-controller="SlideShowController">
  <slide-show slides="slides"></slide-show>
</div>
```

```javascript
app.controller("SlideShowController", function($scope) {
  $scope.slides = [{
    imageUrl: "allan-beaver.jpg",
    caption: "Allan Allan Al Al Allan"
  }, {
    imageUrl: "steve-beaver.jpg",
    caption: "Steve Steve Steve"
  }];
});

app.directive("slideShow", function() {
  return {
    restrict: 'E',
    scope: {
      slides: '='
    },
    template: `
      <div class="slideshow">
        <ul class="slideshow-slides">
        <li ng-repeat="slide in slides" ng-class="{ active: $index == activeIndex }">
          <figure>
            <img ng-src="{{ slide.imageUrl }}" />
            <figcaption ng-show="slide.caption">{{ slide.caption }}</figcaption>
          </figure>
        </li>
        </ul>
        <ul class="slideshow-dots">
          <li ng-repeat="slide in slides" ng-class="{ active: $index == activeIndex }">
            <a ng-click="jumpToSlide($index)">{{ $index + 1 }}</a>
          </li>
        </ul>
      </div>
    `,
    link: function($scope, element, attrs) {
      $scope.activeIndex = 0;

      $scope.jumpToSlide = function(index) {
        $scope.activeIndex = index;
      };
    }
  };
});
```

**Слайдшоу в Angular**

<p data-height="400" data-theme-id="0" data-slug-hash="QyNJxO" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href="http://codepen.io/SitePoint/pen/QyNJxO/">Angular Slideshow</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

В  React этот компонент  должен выводится внутри другого компонента и передавать данные слайдов через  [props](https://medium.com/react-tutorials/react-properties-ef11cd55caa0#.cbg8xkxpe).


```javascript
let _slides = [{
  imageUrl: "allan-beaver.jpg",
  caption: "Allan Allan Al Al Allan"
}, {
  imageUrl: "steve-beaver.jpg",
  caption: "Steve Steve Steve"
}];

class App extends React.Component {
  render() {
    return <SlideShow slides={ _slides } />
  }
}
```

У компонентов React есть локальное пространство `this.state`, которое вы можете модифицировать, вызывая {% raw %}`this.setState({ key: value })`{% endraw %}. Все изменения состояния влекут новый рендеринг компонента.

```javascript
class SlideShow extends React.Component {
  constructor() {
    super()
    this.state = { activeIndex: 0 };
  }
  jumpToSlide(index) {
    this.setState({ activeIndex: index });
  }
  render() {
    return (
      <div className="slideshow">
        <ul className="slideshow-slides">
          {
            this.props.slides.map((slide, index) => (
              <li className={ classNames({ active: index == this.state.activeIndex }) }>
                <figure>
                  <img src={ slide.imageUrl } />
                  { slide.caption ? <figcaption>{ slide.caption }</figcaption> : null }
                </figure>
              </li>
            ))
          }
        </ul>
        <ul className="slideshow-dots">
          {
            this.props.slides.map((slide, index) => (
              <li className={ (index == this.state.activeIndex) ? 'active': '' }>
                <a onClick={ (event)=> this.jumpToSlide(index) }>{ index + 1 }</a>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

```

[События в React](https://facebook.github.io/react/docs/events.html) выглядят как олдскульные строчные обработчики событий типа `onClick`. Не заморачивайтесь по этому поводу, под капотом там работают высокопроизводительные делегированные обработчики событий.

**Слайдшоу в React**

<p data-height="400" data-theme-id="0" data-slug-hash="ZQWmoj" data-default-tab="js,result" data-user="SitePoint" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/SitePoint/pen/ZQWmoj/">React SlideShow</a> by SitePoint (<a href="http://codepen.io/SitePoint">@SitePoint</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## Двухстороннее связывание

 В Angular `ng-model` и `$scope` формируют связь, по которой данные перетекают вперед и назад между элементом формы и объектом JavaScript в контроллере.

```javascript
 app.controller("TwoWayController", function($scope) {
  $scope.person = {
    name: 'Bruce'
  };
});
```

```markup
 <div ng-controller="TwoWayController">
  <input ng-model="person.name" />
  <p>Hello {{ person.name }}!</p>
</div>
```

React специально избегает этого паттерна, используя вместо этого односторонний поток данных. Идентичные представления можно с одинаковым успехом делать с обоими паттернами.


```javascript
class OneWayComponent extends React.Component {
  constructor() {
    super()
    this.state = { name: 'Bruce' }
  }
  change(event) {
    this.setState({ name: event.target.value });
  }
  render() {
    return (
      <div>
        <input value={ this.state.name } onChange={ (event)=> this.change(event) } />
        <p>Hello { this.state.name }!</p>
      </div>
    );
  }
}

```

`<input>` в данном случае это "контролируемый input", то есть его значение меняется только при вызове функции рендеринга (в примере выше это делается при каждом нажатии клавиш). Компонент сам отслеживает свое состояние, то есть управляет своими данными. Это не рекомендуется делать для большинства компонентов, в идеале компоненты не должны отслеживать свое состояние, данные должны передаваться через `props`.

<p data-height="268" data-theme-id="0" data-slug-hash="BjKGPW" data-default-tab="result" data-user="SitePoint" class='codepen'>See the Pen <a href='http://codepen.io/SitePoint/pen/BjKGPW/'>One-Way Data Flow in React</a> by SitePoint (<a href='http://codepen.io/SitePoint'>@SitePoint</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Обычно отслеживающий [компонент-контейнер](https://medium.com/@learnreact/container-components-c0e67432e005#.osha0yxns) или [контроллер представления](http://blog.andrewray.me/the-reactjs-controller-view-pattern/) располагается вверху дерева, а не отслеживающие дочерние компоненты располагаются ниже, более подробная информация есть в разделе документации [What Components Should Have State?](https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html#what-components-should-have-state)

### Вызов методов родительского элемента

В то время как поток данных движется в одном направлении, есть возможность вызывать методы у родительского элемента через функции обратного вызова, обычно это делается в ответе на какой-либо пользовательский ввод. Эта гибкость дает вам больше контроля при рефакторинге компонентов в сторону их упрощения. Если у компонентов нет состояния, при рефакторинге их можно переписать как функции.

```jsx
// A presentational component written as a pure function
const OneWayComponent = (props)=> (
  <div>
    <input value={ props.name } onChange={ (event)=> props.onChange(event.target.value) } />
    <p>Hello { props.name }!</p>
  </div>
);

class ParentComponent extends React.Component {
  constructor() {
    super()
    this.state = { name: 'Bruce' };
  }
  change(value) {
    this.setState({name: value});
  }
  render() {
    return (
      <div>
        <OneWayComponent name={ this.state.name } onChange={ this.change.bind(this) } />
        <p>Hello { this.state.name }!</p>
      </div>
    )
  }
}

```

На первый взгляд это похоже на круговое движение, если вы знакомы с двухсторонним связыванием. Плюс от использования небольших и простых презентационных компонентов в том, что они просто принимают данные как `props` и выводят их — они по умолчанию проще, а значит в них меньше багов. Это также предотвращает пользовательский интерфейс от несогласованного состояния, которое может быть вызвано нахождением  данных, которые надо поддерживать отдельно, в разных местах.

## Инъекция зависимостей, сервисы и фильтры

Модули JavaScript это намного лучший способ обработки зависимостей, вы можете их использовать с помощью [Webpack](https://github.com/webpack/webpack), [SystemJS](https://github.com/systemjs/systemjs) или [Browserify](http://browserify.org/).

```javascript
// An Angular directive with dependencies
app.directive('myComponent', ['Notifier', '$filter', function(Notifier, $filter) {
  const formatName = $filter('formatName');

  // use Notifier / formatName

}]

// ES6 Modules used by a React component
import Notifier from "services/notifier";
import { formatName } from "filters";

class MyComponent extends React.Component {

  // use Notifier / formatName

}

```

## Звучит отлично, дайте две

Да. Мы можем выводить компоненты React внутри существующего приложения Angular, у Бена Надела есть [хороший пост со скринкастом о рендеринге компонентов React внутри директивы Angular.](http://www.bennadel.com/blog/2902-rendering-reactjs-components-in-angularjs-using-angularjs-directives.htm) Также есть модуль Angular [ngReact](https://github.com/ngReact/ngReact), предоставляющий директиву `react-component`, действующую как клей между  React и Angular.

Если вы столкнулись с проблемами производительности рендеринга в определенных частях вашего приложения Angular, вы можете улучшить производительность, перекинув часть рендеринга на React. Но как было сказано, подключение двух больших библиотек JavaScript, решающих одинаковые проблемы, далеко от идеала, даже с учетом того, что React работает только со слоем преставлений, ее размер такой же как у Angular, в некоторых ситуациях это может быть неприемлимым.

Хотя React и Angular решают схожие задачи, они делают это очень по-разному. React реализует функциональный декларативный подход, в котором компоненты это чистые функции, свободные от побочных эффектов. Этот функциональный стиль программирования проще для понимания и ведет к уменьшению количества багов.

## Как насчет Angular 2?

Компоненты в  Angular 2 во многом напоминают компоненты React. У [образцов компонентов в документации](https://angular.io/docs/ts/latest/guide/displaying-data.html#!#showing-component-properties-with-interpolation) есть аналогичные класс и шаблон, похожими выглядят события, в документации показано как строить представления используя [иерархию компонентов](https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html#the-injector-tree)  так, как если бы вы это делали в React, а для инъекции зависимостей используются модули ES6.

```javascript
// Angular 2
@Component({
  selector: 'hello-component',
  template: `
    <h4>Give me some keys!</h4>
    <input (keyup)="onKeyUp($event)" />
    <div>{{ values }}</div>
  `
})
class HelloComponent {
  values='';
  onKeyUp(event) {
    this.values += event.target.value + ' | ';
  }
}

// React
class HelloComponent extends React.Component {
  constructor(props) {
    super()
    this.state = { values: '' };
  }
  onKeyUp(event) {
    const values = `${this.state.values + event.target.value} | `;
    this.setState({ values: values });
  }
  render() {
    return (
      <div>
        <h4>Give me some keys!</h4>
        <div><input onKeyUp={ this.onKeyUp.bind(this) } /></div>
        <div>{ this.state.values }</div>
      </div>
    );
  }
}

```

Большая часть работы над Angular 2 заключалась в повышении эффективности обновления DOM. Старый синтаксис шаблонов и сложность зоны видимости влекли множество проблем с производительностью в больших приложениях.

## Полное приложение

В этой статье я сфокусировался на шаблонах, директивах и формах, но если вы делаете целое приложение, вам потребуются и другие вещи, как минимум, для управления моделью данных, коммуникацией с сервером и маршрутизаций. Когда я только начинал изучать Angular и React, я создал тестовое приложение Gmail, чтобы понять, как они работают и оценить свои ощущения как разработчика, прежде чем начать использовать их в настоящих приложениях.

Возможно, вас заинтересует этот образец, чтобы сравнить различия в  React и Angular, пример React  написан на CoffeeScript с [CJSX](https://github.com/jsdf/coffee-react), который мне нравится до сих пор (декабрь 2015). Сообщество React ориентируется на  [ES6 с Babel и Webpack](http://www.2ality.com/2015/04/webpack-es6.html), поэтому сейчас я рекомендую использовать именно их.

* <https://github.com/markbrown4/gmail-react>
* <https://github.com/markbrown4/gmail-angular>

А вот для сравнения образцы простого приложения TodoMVC:

* <http://todomvc.com/examples/react/>
* <http://todomvc.com/examples/angularjs/>

## Ресурсы для изучения

Изучение React было захватывающим, React научил меня многому в функциональном программировании, а активное сообщество вокруг него создает свои дополнения к экосистеме React. Эндрю Рэй написал несколько отличных вводных постов по  React и Flux, официальный курс по React также является отличной стартовой отметкой.

* [React for stupid people – Andrew Ray](http://blog.andrewray.me/reactjs-for-stupid-people/)
* [Flux for stupid people – Andrew Ray](http://blog.andrewray.me/flux-for-stupid-people/)
* [React Tutorial – Facebook](https://facebook.github.io/react/docs/tutorial.html)
* [React Router – Ryan Florence](https://github.com/rackt/react-router)
* [Redux – Video series by Dan Abramov](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree)
