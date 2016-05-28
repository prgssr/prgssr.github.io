---
title: Погружение в React&#58; роутер
layout: post
categories: [development]
tags: [javascript, translation, css-tricks]
prism: yes
date: 2016-05-28 10:58:05 +0300
description: "Первая статья из серии о React.js от Брэда Вестфолла. Роутер React — что это и зачем."
original: "https://css-tricks.com/learning-react-router/"
original_title: "Leveling Up With React: React Router"
original_author: "Брэд Вестфолл"
thumbnail: "/images/react.png"
scripts: codepen
---

Эта статья является первой в серии из трех статей о React от Брэда Вестфолла. Существует много руководств о том, как начать работать с React, но вопрос, что делать с этим дальше, освещен намного меньше. Если вы новичок в React, начните, например, с [этого видео](https://css-tricks.com/video-screencasts/147-starting-react-powered-comment-form/). Серия ориентирована на тех, кто уже знаком с основами.
{: .info}


Когда я только начинал изучать React, я нашел много курсов для начинающих ( [1](https://scotch.io/tutorials/learning-react-getting-started-and-concepts), [2](https://egghead.io/series/build-your-first-react-js-application), [3](https://css-tricks.com/productive-in-react/), [4](https://facebook.github.io/react/docs/getting-started.html)), показывающих, как создавать отдельные компоненты и выводить их в DOM. Они хороши для того, чтобы освоить основы вроде JSX и свойств, но мне хотелось выяснить, как React работает на более серьезном уровне, например, в рабочем одностраничном приложении (SPA). Так как моя серия статей охватывает много материала, я не буду объяснять [базовые вещи для начинающих](https://reactforbeginners.com/). Вместо этого я буду исходить из того, что у вас есть понимание как создать и вывести, как минимум, один компонент.

Такое понимание вы можете получить из любого из перечисленных руководств для начинающих:

* [React.js and How Does It Fit In With Everything Else?](http://www.funnyant.com/reactjs-what-is-it/)
* [Rethinking (Industry) Best Practices](https://www.youtube.com/watch?v=DgVS-zXgMTk)
* [React.js Introduction For People Who Know Just Enough jQuery To Get By](http://reactfordesigners.com/labs/reactjs-introduction-for-people-who-know-just-enough-jquery-to-get-by/)

## Образцы кода

Серия статей сопровождается  примерами кода, выложенными на [GitHub](https://github.com/bradwestfall/CSS-Tricks-React-Series). В ходе цикла мы будем делать одностраничное приложение, сфокусировавшись на пользователях и виджетах.

Чтобы все оставалось простым и кратким, в примерах кода будет подразумеваться, что React и React Router подключены с CDN. Поэтому в примерах вы не увидите их подключения с помощью `require()`  или `import`. Ближе к концу курса мы добавим  Webpack и Babel. И с этого момента ES6 неотвратим!

## Роутер React

React это не фреймворк, а библиотека и, следовательно, он не предназначен для решения всех потребностей приложения. Он отлично работает в создании компонентов и предоставляет систему для управления состоянием, но создание сложного SPA потребует [дополнительных модулей](https://github.com/reactjs). Первое, что мы рассмотрим это [React Router](https://github.com/reactjs/react-router).

Если вы ранее уже использовали какой-либо роутер на фронтенде, многие концепции покажутся вам знакомыми. Но в отличие от любого другого роутера, с которыми я работал, роутер React использует JSX, который на первый взгляд может показаться немного странным.

В качестве примера приведу код для рендеринга отдельного компонента:

```jsx
var Home = React.createClass({
  render: function() {
    return (<h1>Welcome to the Home Page</h1>);
  }
});

ReactDOM.render((
  <Home />
), document.getElementById('root'));
```

А вот рендеринг того же компонента `Home` с роутером React.

```jsx
...

ReactDOM.render((
  <Router>
    <Route path="/" component={Home} />
  </Router>
), document.getElementById('root'));
```

Отметьте, что `<Router>` и `<Route>` это две разные вещи. Технически это компоненты React, но сами они не создают DOM. Может показаться, что `<Router>` выводится в `'root'`, но на самом деле мы просто определяем правила работы нашего приложения. Продвигаясь дальше, вы часто будете сталкиваться с этой концепцией: временами компоненты существуют не для создания DOM, а для координации действий других компонентов.

В нашем примере, `<Route>` определяет правило, что при посещении домашней страницы `/` в `'root'` будет выводиться компонент `Home`.

### Множественные маршруты

В предыдущем примере есть только один маршрут и это очень просто. Такой роутер не имеет особого смысла, так как мы  вывести компонент `home` и без него. 

Мощь роутера React проявляется, когда мы используем много маршрутов, определяющих на основе текущего пути, какой компонент будет выводится:

```jsx
ReactDOM.render((
  <Router>
    <Route path="/" component={Home} />
    <Route path="/users" component={Users} />
    <Route path="/widgets" component={Widgets} />
  </Router>
), document.getElementById('root'));
```

Каждый `<Route>` при совпадении URL будет выводить соответствующий компонент. Одномоментно  в `'root'` будет выводиться лишь один из трех компонентов. С такой стратегией мы монтируем роутер в  DOM `'root'` только один раз, а затем уже сам роутер переключает компоненты в соответствии с изменениями маршрута.

Также стоит отметить, что роутер переключает маршруты без запросов на сервер,  при этом каждый компонент может быть самостоятельной новой страницей.


### Многократно используемая раскладка

Пока мы видим  скромное начало создания одностраничного приложения. Однако оно по-прежнему не решает никаких реальных проблем. Конечно, мы могли бы сделать эти три компонента полноценными страницами HTML, но как насчет многократного использования кода? Есть шансы, что у этих компонентов есть общие элементы типа хедера и боковой колонки. Так можем ли мы обойтись без повторения одной и той же разметки внутри каждого компонента?

Представьте, что мы делаем приложение на основе следующего макета:

![Простой макет приложения](/images/development/javascript/brad-westfall-1.svg)

*Простой макет приложения*

Если вы подумаете о том, что из этого макета можно вынести в многократно используемые фрагменты, вы придете к следующей идее:

![Макет, разделенный на части](/images/development/javascript/brad-westfall-2.svg)

*Макет, разделенный на части*

Подход на основе вкладываемых компонентов и раскладок позволяет нам создать многократно используемые фрагменты.

Внезапно отдел дизайна хочет добавить в приложение страницу для поиска виджетов, которая напоминает страницу поиска пользователей. Поиск в  списке пользователей и в списке виджетов выглядят одинаково, поэтому логично сделать раскладку для поиска как отдельный компонент:

![поиск виджетов использует ту же основу, что и поиск пользователей](/images/development/javascript/brad-westfall-3.svg)

*Поиск виджетов использует ту же основу, что и поиск пользователей*

Раскладка для поиска может быть родительским шаблоном для всех видов поисковых страниц. Соответственно, у нас получаются две базовых раскладки: поисковая и основная.

![Основная раскладка](/images/development/javascript/brad-westfall-4.svg)
*Основная раскладка*

Это обычная стратегия и если вы использовали какую-либо систему шаблонов, то вы скорее всего уже делали что-то похожее. Начнем с разметки, напишем статический HTML без учета JavaScript:

```markup
<div id="root">

  <!-- Main Layout -->
  <div class="app">
    <header class="primary-header"><header>
    <aside class="primary-aside"></aside>
    <main>

      <!-- Search Layout -->
      <div class="search">
        <header class="search-header"></header>
        <div class="results">

          <!-- User List -->
          <ul class="user-list">
            <li>Dan</li>
            <li>Ryan</li>
            <li>Michael</li>
          </ul>

        </div>
        <div class="search-footer pagination"></div>
      </div>

    </main>
  </div>

</div>
```

Запомните, элемент `'root'` всегда будет присутствовать, так как это единственный элемент,  который выполняет роль исходного HTML Body до запуска JavaScript. Слово "root" в данном случае уместно, так как все приложение React будет выводиться в него. Но никаких "правильных имен" и соглашений по именованию нет, я лично выбрал "root" и буду использовать это название в остальных примерах. Не монтируйте ничего непосредственно в `body`, это крайне [не приветствуется](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375#.rslb7a2jp).
{: .info}

После создания статического HTML конвертируем его в компоненты React:

```jsx
var MainLayout = React.createClass({
  render: function() {
    // Note the `className` rather than `class`
    // `class` is a reserved word in JavaScript, so JSX uses `className`
    // Ultimately, it will render with a `class` in the DOM
    return (
      <div className="app">
        <header className="primary-header"><header>
        <aside className="primary-aside"></aside>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});

var SearchLayout = React.createClass({
  render: function() {
    return (
      <div className="search">
        <header className="search-header"></header>
        <div className="results">
          {this.props.children}
        </div>
        <div className="search-footer pagination"></div>
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    return (
      <ul className="user-list">
        <li>Dan</li>
        <li>Ryan</li>
        <li>Michael</li>
      </ul>
    );
  }
});
```

Не обращайте особого внимания на то, что в названии я использовал не только термин "Component", но и "Layout". Разумеется, это все компоненты, просто два из них я назвал "Layout" исходя из той роли, которую они выполняют.

Мы будем использовать вложенные маршруты для размещения `UserList` внутри `SearchLayout` и далее внутри `MainLayout`. Но сначала обратите внимание, что при помещении `UserList` в родительский компонент `SearchLayout`, последний будет использовать `this.props.children` для определения местоположения `UserList`. У всех компонентов есть свойство `this.props.children`, но только после вложения компонентов React автоматически заполняет это свойство у родительского компонента. Для компонентов, которые не являются родительскими, свойство `this.props.children` будет равно `null`.


###  Вложенные маршруты

Так как нам вложить эти компоненты? Это сделает роутер, когда сделаем  вложенные маршруты:

```jsx
ReactDOM.render((
  <Router>
    <Route component={MainLayout}>
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
      </Route> 
    </Route>
  </Router>
), document.getElementById('root'));
```

Компоненты будут вложены друг в друга  соответственно тому, как вложены маршруты. Когда пользователь переходит по адресу `/users`, роутер разместит компонент `UserList` внутри `SearchLayout`,  а `SearchLayout` внутри `MainLayout`. В итоге при переходе `/users` будут выведены три вложенных компонента внутри `'root'`.

Заметьте, что в коде нет правил для случаев, когда пользователь посещает домашнюю страницу (`/`)  или поиск по виджетам. Они были пропущены для простоты, но мы вставим их в новый роутер:

```jsx
ReactDOM.render((
  <Router>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
        <Route path="widgets" component={WidgetList} />
      </Route> 
    </Route>
  </Router>
), document.getElementById('root'));
```

Вы, возможно, заметили, что JSX следует правилам XML в том плане, что компонент `Route` может быть записан как один самозакрывающийся тег: `<Route/>`  или как два тега `<Route>...</Route>`. Это касается всего JSX, включая пользовательские компоненты и нормальные узлы DOM. Например, запись `<div/>` это валидный JSX, который будет рендериться в стандартный `<div></div>`.
{: .info}

Для краткости просто представьте `WidgetList` похожим на `UserList`.

Так как у `<Route component={SearchLayout}>` есть два дочерних маршрута, пользователь может посетить `/users` или `/widgets` и соответствующий `<Route>` загрузит нужный компонент внутрь компонента `SearchLayout`.

Также обратите внимание, как компонент `Home` размещается непосредственно внутри `MainLayout` без задействования `SearchLayout`. Вы можете представить, насколько легко  можно изменять вложенность раскладок и компонентов, переставляя маршруты.

### Маршрут с `IndexRoute`

Роутер React очень выразителен и часто дает возможность сделать одно и то же разными способами. Например, мы можем написать наш роутер так:

```jsx
ReactDOM.render((
  <Router>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
        <Route path="widgets" component={WidgetList} />
      </Route> 
    </Route>
  </Router>
), document.getElementById('root'));
```

Несмотря на внешнее отличие, он делает то же, что и предыдущий.

### Дополнительные атрибуты маршрутов

Временами у `<Route>` бывает только атрибут `component`, а атрибут `path` отсутствует (как у маршрута `SearchLayout` примером выше). Бывает и наоборот. Чтобы выяснить почему так, рассмотрим пример:

```jsx
<Route path="product/settings" component={ProductSettings} />
<Route path="product/inventory" component={ProductInventory} />
<Route path="product/orders" component={ProductOrders} />

```

Фрагмент маршрута `/product` повторяется. Мы можем убрать повторение, обернув все три маршрута новым `<Route>`:

```jsx
<Route path="product">
  <Route path="settings" component={ProductSettings} />
  <Route path="inventory" component={ProductInventory} />
  <Route path="orders" component={ProductOrders} />
</Route>
```

Мы опять убедились в выразительности роутера React. Вопрос:а вы заметили проблему в обоих вариантах? Ведь на данный момент у нас нет никаких правил для случаев, когда пользователь переходит по маршруту `/product`.

Для решения этого мы можем добавить `IndexRoute`:

```jsx
<Route path="product">
  <IndexRoute component={ProductProfile} />
  <Route path="settings" component={ProductSettings} />
  <Route path="inventory" component={ProductInventory} />
  <Route path="orders" component={ProductOrders} />
</Route>
```

### Используйте `<Link>` вместо `<a>`

При создании ссылок для маршрутов вам надо использовать `<Link to="">` вместо `<a href="">`. Не беспокойтесь по этому поводу, при использовании компонента `<Link>` роутер React создаст для вас обычную ссылку в DOM. Используйте `<Link>`, так как это важно для того, чтобы роутер React сделал часть своей магии.

Добавим ссылку в наш `MainLayout`:

```jsx
var MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">
        <header className="primary-header"></header>
        <aside className="primary-aside">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/widgets">Widgets</Link></li>
          </ul>
        </aside>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});
```

Атрибуты в `<Link>` будут передаваться через создаваемые ими ссылки. Вот JSX:

```jsx
<Link to="/users" className="users">
```

Он даст следующую разметку:

```markup
<a href="/users" class="users">
```

Если вам надо создать ссылку, не относящуюся к роутеру, например, за пределы сайта, тогда используйте обычные ссылки как всегда. Больше информации можно найти в документации о [IndexRoute и Link](https://github.com/reactjs/react-router/blob/master/docs/guides/IndexRoutes.md).

### Активные ссылки

Компоненты `<Link>` могут отслеживать свое нахождение в активном состоянии:

```jsx
<Link to="/users" activeClassName="active">Users</Link>
```

Если пользователь перешел на URL `/users`, роутер будет искать совпадающие  ссылки в `<Link>` и добавлять им класс `active`, вот [здесь](https://github.com/reactjs/react-router-tutorial/tree/master/lessons/05-active-links) это описано подробно.

### История браузера

Чтобы избежать путаницы, я еще не упоминал об одной важной детали. `<Router>` должен знать какая стратегия отслеживания [истории](https://github.com/reactjs/react-router/blob/master/docs/guides/Histories.md) используется. Документация роутера React [рекомендует browserHistory](https://github.com/reactjs/react-router/blob/master/docs/guides/Histories.md#browserhistory), это делается так:

```jsx
var browserHistory = ReactRouter.browserHistory;

ReactDOM.render((
  <Router history={browserHistory}>
    ...
  </Router>
), document.getElementById('root'));
```

В предыдущих версиях роутера React, атрибут `history` был не обязательным и по умолчанию использовал [hashHistory](https://github.com/reactjs/react-router/blob/master/docs/guides/Histories.md#hashhistory). Как видно из названия, в URL использовался хэш  (`#`) для управления маршрутизацией в SPA, так как вы могли бы ожидать после опыта использования роутера Backbone.js.

С `hashHistory` URL будут выглядеть так:

* `example.com`
* `example.com/#/users?_k=ckuvup`
* `example.com/#/widgets?_k=ckuvup`

А зачем нам эти  [уродливые строки запросов в URL](https://css-tricks.com/learning-react-router/)?

При имплементации `browserHistory` адреса выглядят более органичными:

* `example.com`
* `example.com/users`
* `example.com/widgets`

Но при использовании на фронтенде `browserHistory` есть один нюанс на серверной стороне. Если пользователь начинает посещение с `example.com` и затем переходит на `/users` и `/widgets`, роутер React работает как и ожидается. Однако, если пользователь начинает посещение сразу с `example.com/widgets` или же обновляет `example.com/widgets`, то браузер делает запрос к серверу по адресу `/widgets`. И при отсутствии роутера на стороне сервера мы получим ошибку 404:

![Осторожнее с URL, на сервере тоже нужен роутер](/images/development/javascript/browserhistory.gif)

*Осторожнее с URL, на сервере тоже нужен роутер*

Для решения проблемы с ошибкой 404 из-за сервера, в документации роутера React рекомендуется использовать [подстановочный роутер](https://github.com/reactjs/react-router/blob/master/docs/guides/Histories.md#configuring-your-server) (wildcard router). С этой стратегией не имеет значения, какой адрес запрашивается на сервере — сервер всегда возвращает тот же файл HTML. Затем, даже если пользователь сразу начинает с `example.com/widgets` и сервер возвращает тот же HTML, роутер React сам загрузит нужный компонент.

Пользователь не заметит ничего странного, но вы должны озаботиться постоянной отправкой того же файла HTML. В примерах кода в рамках серии мы будем продолжать использовать стратегию "подстановочного роутера", но вы можете обрабатывать маршрутизацию на сервере так, как считаете нужным.

Можно ли [изоморфно использовать](https://strongloop.com/strongblog/node-js-react-isomorphic-javascript-why-it-matters/) роутер React на серверной и клиентской стороне? Можно, но эта тема находится за пределами нашей серии.

### Редирект с `browserHistory`

Объект `browserHistory` это синглтон, поэтому вы можете включать его в любой из своих файлов. Если вам нужно вручную перенести пользователя на другой URL, вы можете использовать метод `push`:

```javascript
browserHistory.push('/some/path');
```

## Сопоставление маршрутов

Роутер React обрабатывает [сопоставление маршрутов](https://github.com/reactjs/react-router/blob/master/docs/guides/RouteMatching.md) так же, как и другие роутеры:

```jsx
<Route path="users/:userId" component={UserProfile} />
```

Этот маршрут срабатывает, когда пользователь посещает один из адресов начинающихся с `users/`, независимо от последующих символов. Это будет  /`users/1`, `/users/143` и даже `/users/abc`  — но их валидация лежит на ваших плечах.

Роутер React передаст значение `:userId` в качестве свойства `UserProfile`, внутри `UserProfile` оно будет доступно как `this.props.params.userId`.

## Демо роутера

Итак, у нас уже достаточно кода для первой демонстрации:

<p data-height="265" data-theme-id="0" data-slug-hash="reaWYL" data-default-tab="result" data-user="bradwestfall" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/bradwestfall/pen/reaWYL/">React-Router Demo</a> by Brad Westfall (<a href="http://codepen.io/bradwestfall">@bradwestfall</a>) on <a href="http://codepen.io">CodePen</a>.</p>

Если вы кликните на один из маршрутов в примере, вы заметите, что кнопки браузера "вперед" и "назад" работают с роутером. Это одна из основных причин выбора этой стратегии работы с историей. Также учитывайте, что при посещении всех адресов не делаются запросы к серверу, за исключением самого первого для получения начального HTML. Круто же?

## ES6

В нашем примере на CodePen, `React`, `ReactDOM` и `ReactRouter` являются глобальными переменными с CDN. Внутри объекта `ReactRouter` есть все, что нам нужно типа компонентов `Router` и `Route`. Поэтому мы можем использовать `ReactRouter` вот так:

```jsx
ReactDOM.render((
  <ReactRouter.Router>
    <ReactRouter.Route ... />
  </ReactRouter.Router>
), document.getElementById('root'));
```

В этом примере у всех компонентов есть префикс в виде их родительского объекта `ReactRouter`. Мы можем использовать новый [реструктуризующий синтаксис](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```javascript
var { Router, Route, IndexRoute, Link } = ReactRouter
```

Таким образом мы "выделяем" части `ReactRouter` в обычные переменные для прямого доступа к ним.

Начиная с этого момента, в наших примерах будет активно использоваться синтаксис ES6 включая реструктуризацию, [оператор расширения](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_operator), [импорт](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)/[экспорт](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) и прочее. В каждом случае будет краткое разъяснение нового синтаксиса с примерами из репозитория GitHub.

## Сборка с webpack и Babel

Как уже было сказано, в дополнение к серии статей есть репозиторий с кодом на GitHub. Посколько мы собираемся делать реальное одностраничное приложение, мы будем использовать серьезные инструменты типа [webpack](https://webpack.github.io/) и [Babel](https://babeljs.io/).

* **webpack** объединяет для браузера несколько файлов JavaScript в один.
* **Babel**  конвертирует код ES6 (ES2015) в ES5, так как большинство браузеров не понимают ES6. Со временем браузеры поймут ES6 и Babel будет не нужен.

Если вы чувствуете себя неуверенно с этими инструментами, не переживайте. В [образцах кода](https://github.com/bradwestfall/CSS-Tricks-React-Series)  они полностью настроены и вы можете сфокусироваться на React. В README.md репозитория есть дополнительная документация по рабочему процессу.

## Будьте осторожны с устаревшим синтаксисом

Поиск информации в Google по роутеру React может привести вас на одну из многих страниц StackOverflow, написанных в то время, когда версия роутера была до релиза 1.0. Многие возможности из пре-релиза 1.0 признаны устаревшими, вот их краткий список:

* `<Route name="" />` устарел. Используйте вместо него `<Route path="" />`. 
* `<Route handler="" />` устарел. Используйте вместо него `<Route component="" />`.
* `<NotFoundRoute />` устарел. Теперь [Alternative](https://github.com/reactjs/react-router/blob/b60d6c0351ff91cf04bccdac8c4b6e976aec94ec/upgrade-guides/v1.0.0.md#notfound-route)
* `<RouteHandler />` устарел.
* `willTransitionTo` устарел. Теперь [onEnter](https://github.com/reactjs/react-router/blob/b60d6c0351ff91cf04bccdac8c4b6e976aec94ec/upgrade-guides/v1.0.0.md#willtransitionto-and-willtransitionfrom)
* `willTransitionFrom` устарел. Теперь [onLeave](https://github.com/reactjs/react-router/blob/b60d6c0351ff91cf04bccdac8c4b6e976aec94ec/upgrade-guides/v1.0.0.md#willtransitionto-and-willtransitionfrom)
* `"Locations"` называются `"histories"`.

Полный список версий [1.0.0](https://github.com/reactjs/react-router/blob/b60d6c0351ff91cf04bccdac8c4b6e976aec94ec/upgrade-guides/v1.0.0.md) и [2.0.0](https://github.com/reactjs/react-router/blob/b60d6c0351ff91cf04bccdac8c4b6e976aec94ec/upgrade-guides/v2.0.0.md).

## Заключение

В роутере React больше возможностей, чем мы увидели, можете убедиться из [документации](https://github.com/reactjs/react-router/blob/master/docs/API.md). Создатели роутера  сделали [пошаговый учебник по роутеру React](https://github.com/reactjs/react-router-tutorial), также обратите внимание на видео о разработке роутера React.

В статье использовано оформление от Линн Фишер [@lynnandtonic](http://twitter.com/lynnandtonic).
