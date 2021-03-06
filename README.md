# Description

This application is a test task for FunBox.
Site: [https://nikita2090.github.io/](https://nikita2090.github.io/)

## Instructions

1. npm install<br>
2. npm start

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs project dependencies from package.json.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `serve build`

Serves build folder with a static server.
Open address from console to view app in the browser.


# Теоретическая часть тестового задания для FunBox.

## Вопрос №1:
Расскажите, чем, на ваш взгляд, отличается хорошее клиентское приложение от<br>
плохого с точки зрения<br>

- пользователя;
- менеджера проекта;
- дизайнера;
- верстальщика;
- серверного программиста.

### Ответ:
- Для пользователя это приложение с интуитивно понятным, красивым интерфейсом,<br>
  которое позволяет быстро и удобно выполнять возложенные на него задачи.
- Для менеджера проекта хорошее приложение то, которое сдано в установленные сроки.<br>
  Кроме того оно качественное, его удобно поддерживать и расширять, и оно полностью<br>
  удовлетворяет запросам заказчика.
- Для дизайнера хорошее приложение то, где правильно подобраны шрифты, цвета,<br>
  использованы только качественные изображения, элементы приложения совместно<br>
  друг с другом образуют единую визуальную композицию, а так же грамотно расставлены<br>
  акценты для управления вниманием пользователя.
- Для верстальщика хорошее приложение – это приложение, которое одинаково хорошо<br>
  отображается на всех устройствах и во всех браузерах. Все элементы верстки<br>
  разделены на компоненты со своими стилями, что позволяет удобно искать и изменять<br>
  их при необходимости.
- Для серверного программиста это приложение, посылающее на сервер данные, закодированные<br>
  в формате, который сервер поймет, отсылающее правильные заголовки, использующее свежую<br>
  версию серверного API<br>



## Вопрос №2:
Опишите основные особенности разработки крупных многостраничных сайтов,<br>
функциональность которых может меняться в процессе реализации и поддержки.<br>
Расскажите о своем опыте работы над подобными сайтами: какие подходы, инструменты и<br>
технологии вы применяли на практике, с какими проблемами сталкивались и как их решали.

### Ответ:
Опыта работы над подобными сайтами нет, но главным, на мой взгляд, должно быть<br>
применение единых стандартов и технологий, чтобы все члены команды использовали единый<br>
стиль написания кода. Применение компонентного подхода поможет проще изменять тот или <br>
иной элемент и его функциональность.<br>
Так же, поскольку сайт многостраничный, пользователю не нужно загружать на свое устройство<br>
код сразу для всех страниц, достаточно загружать код лишь код той, на которую он зашел.<br>
Остальные же можно подключать по необходимости с помощью динамических импортов.


## Вопрос №3:
При разработке интерфейсов с использованием компонентной архитектуры часто используются<br>
термины Presentational Сomponents и Сontainer Сomponents. Что означают данные термины?<br>
Зачем нужно такое разделение, какие у него есть плюсы и минусы?

### Ответ:
- Presentational Сomponents – это компоненты приложения, которые отвечают лишь за то<br>
  как выглядит компонент. Принимают необходимые данные от компонентов-контейнеров.<br>
- Сontainer Сomponents – это компоненты приложения, содержащие бизнес логику и <br>
  передающие презентационным компонентам нужные данные. Обычно в этих компонентах<br>
  подключают Redux.<br>

Плюсы такого разделения в том, что презентационные компоненты можно переиспользовать<br>
и передавать им разные данные от разных компонентов-контейнеров.


## Вопрос №4:
Как устроено наследование в JS? Расскажите о своем опыте реализации JS-наследования<br>
без использования фреймворков.

### Ответ:
Допустим объект А прототипно наследует от объекта Б. Тогда, если мы обращаемся к какому<br>
то свойству/методу объекта А и его не оказывается в этом объекте, то это свойство/метод<br>
будет искаться в объекте Б, а если и там нет искомого, то поиск проводится в прототипе<br>
объекта Б. И так далее по цепочке прототипов.<br>

Здесь можно посмотреть код приложения, которое я писал на чистом JS и использовал<br>
прототипное наследование: https://github.com/nikita2090/Summator.<br>
Каждая страница (MainPage, LoginPage, OperationsPage) наследует от базового класса<br>
страницы Page.


## Вопрос №5:
Какие библиотеки можно использовать для написания тестов end-to-end во фронтенде?<br>
Расскажите о своем опыте тестирования веб-приложений.

### Ответ:
Пока что написанием тестов не занимался. Но, надеюсь, скоро изучить и это.


## Вопрос №6:
Вам нужно реализовать форму для отправки данных на сервер, состоящую из нескольких шагов.<br>
В вашем распоряжении дизайн формы и статичная верстка, в которой не показано, как форма<br>
должна работать в динамике. Подробного описания, как должны вести себя различные поля в<br>
зависимости от действий пользователя, в требованиях к проекту нет. Ваши действия?

### Ответ:
Спросил бы у дизайнера, и, если нужно, придумал бы свой вариант и согласовал с ним.


## Вопрос №7:
Расскажите, какие инструменты помогают вам экономить время в процессе написания,<br>
проверки и отладки кода.

### Ответ:
Использую IDE WebStorm, ESLint  и плагины для браузера ReactDeveloperTools, ReduxDevTools.


## Вопрос №8:
Какие ресурсы вы используете для развития в профессиональной сфере? Приведите несколько<br>
конкретных примеров (сайты, блоги и так далее). Какие ещё области знаний, кроме тех, что<br>
непосредственно относятся к работе, вам интересны?

### Ответ:
Официальная документация React, Redux. Учебник Ильи Кантора по JS. Статьи на Habr, Medium,<br>
Tproger.<br>

Интересы помимо front-end’a: игра на гитаре, спортзал. Еще хочу улучшить знание английского.


## Вопрос №9:
Расскажите нам немного о себе и предоставьте несколько ссылок на последние работы, выполненные вами.

### Ответ:
Закончил музыкальную школу по классу саксофона, сейчас немного играю на гитаре.<br>
Люблю бильярд, настольный теннис, велопрогулки. Посещаю спортзал.<br>
Позитивный, ответственный, с чувством юмора. Быстро учусь, вредных привычек нет.<br>

Ссылка на работы: https://github.com/nikita2090.



