#CODENAME EXODUS  
_Web App Scaffolding using Gulp, Less and other little tricks._

##Colaborators

* [@brunoramalho](http://github.com/brunoramalho)
* [@laurindo](http://github.com/laurindo)
* [@itumoraes](http://github.com/itumoraes)
* [@pisandelli](http://github.com/pisandelli)

**Please** fork it if you want to use! :)  
**Issues:** [github.com/pisandelli/exodus/issues](https://github.com/pisandelli/exodus/issues)

#Unboxing
##Features
* `gulp` - Task Runner
* `gulp-less` - Less Compiler for Gulp
* `stream-combiner` - Better error handler
* `gulp-sourcemaps` - CSS & JS sourcemaps
* `gulp-autoprefixer` - For legacy browsers
* `gulp-inject` - CSS and JS injection on the fly
* `gulp-file-include` - Inlude components into templates
* `gulp-sftp` - Deploy directly into your server
* `Normalize` - CSS reset
* `Modernizr` - Essential
* `HTML5shiv` - For IE7 HTML5 compatibility
* `Respond.js` - Good choice
* `Foundation 5 Grid System` - Not a bower dependencie.

##Installing
1. Clone this repository
2. Using a terminal, access the project's folder
3. Type `bower install && npm install`
5. Type `gulp start`

The `gulp start` command will perform the first compilation and will create the necessary folders. It also triggers the `watch` task and opens the browsers with a nice "Hello World!".  
**Note** that we are using sample files (_dummy_). You can safely delete them. But before doing this, just take a look at the reasons they exist and how they work inside the workflow.

##The _app_ Folder Structure
The idea behind this scaffolding is allow you to build HTML pages easier and faster, using components, templates... and other nice features. :)  

    app  
    +-- components  
    |   +-- dummy-component.html  
    |   +-- your components files  
    +-- templates  
    |   +-- index.html  
    |   +-- your templates files  
    +-- fonts  
    |   +-- your font files  
    +-- images  
    |   +-- assets  
    |   |   +-- your image assets like: logo, background, etc  
    |   +-- other images  
    +-- scripts  
    |   +-- plugins  
    |   |   +-- dummy-plugin.js  
    |   +-- main.js  
    +-- styles  
    |   +-- less  
    |   |   +-- components  
    |   |   |   +-- dummy-component.less  
    |   |   |   +-- your components LESS files  
    |   |   +-- templates  
    |   |   |   +-- dummy-templates.less  
    |   |   |   +-- your templates LESS files  
    |   |   +-- globals.less  
    |   |   +-- utils.less  
    |   +-- foundation.css  
    +-- .htaccess  
    +-- favicon.ico  
    +-- robots.txt  

###The _templates_ folder
Into this folder you should provide all your templates files. Above, we have a great template code sample.

```html
<!doctype html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <title>Dummy</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

    <!-- build:css styles/libs.css -->
    <!-- bower:css -->
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css styles/main.css -->
    <!-- inject:css -->
    <!-- endinject -->
    <!-- endbuild -->

    <!--[if lt IE 8]>
    
    <![endif]-->

    <!-- build:js scripts/vendor/modernizr.js -->
    <script src="bower_components/modernizr/modernizr.js"></script>
    <!-- endbuild -->
</head>
<body>

    <section>
        @@include('../components/component-dummy.html')
    </section>

<!-- build:js scripts/vendor/libs.js -->
<!-- bower:js -->
<!-- endbower -->
<!-- endbuild -->

<!-- build:js scripts/main.js -->
<!-- inject:js -->
<!-- endinject -->
<!-- endbuild -->
</body>
</html>

```

Take a look inside the `<section>`. This is the component call (we'll talk about it later). When we create/change any file, our task runner will perform some (fast) tasks and create, inside our _app_ folder, a file called _index.html_ with the dummy component included. Very handy!  

**IMPORTANT:** Don't change/delete any build blocks, like:  

```html
<!-- build:css styles/libs.css -->
<!-- bower:css -->
<!-- endbower -->
<!-- endbuild -->

<!-- build:css styles/main.css -->
<!-- inject:css -->
<!-- endinject -->
<!-- endbuild -->
```
They will be automatically populated with the right dependencies when compiling the template.  

1. Inside the `<!-- bower:css -->` and `<!-- bower:js -->` blocks, the `wiredep` task will populate it with the bower dependencies. You can check them into _bower.json_ file.
2. Inside the `<!-- inject:css -->` and `<!-- inject:js -->` blocks, our _magic tasks_ will populate _on the fly_ all the _CSS_ and _JS_ as soon as you create/save any of them.
3. The `<!-- build:css [...] -->` and `<!-- build:js [...] -->` will concatenate and minify all the files inside it, into a sigle file saved into the specified folder inside the block. Feel free to change this folders, but we bet the way we provided is _awesome_! **Note:** this will happen only when performing the `build` task.       

Important to notice that the `<!-- build:js scripts/vendor/modernizr.js -->` block is already populated. This is not wrong and you should never, ever, worry about this. :)  

###The _components_ folder
Here you can add your components files. Above, the `component-dummy.html` sample code.  

```html
<h1>Hello World!!</h1>
```

Yep! Just it. This code will be injected into the right place inside the template file (inside the `<section>` tag in our template example), and then be compilated into a single file into the _app_ folder (with the same name of the template). Once you change the component code, EVERY dependent template will be updated. Clever! :)  
This is only possible through the `gulp-file-inlcude` plugin. You can learn how to create more flexible components and templates, reading [these docs](https://github.com/coderhaoxin/gulp-file-include). It's short! :)

###The _styles_ folder
First time you open this folder, it will contain a child folder called `less` and two `.less` files.

####utils.less and globals.less
These two files are very important to keep the compilation process like a charm. They only reflects our way of organization. They are not required, but very usefull.

* `utils.less` - It's a file that _could_ contain all [variables](http://lesscss.org/features/#variables-feature) and [parametrics mixins](http://lesscss.org/features/#mixins-parametric-feature) ie **_do not generate CSS rules_**. Should be referenced into other files everytime you use something defined in it, so it's not obligatory, but necessary sometimes. To do the import, use the `@import (reference)` rule right on the top of your file ([See LESS documentation](http://lesscss.org/features/#import-options)). It will be used just for reference, and won't be compiled to CSS. **Note:** You should never add mixins without '()' because they will never be compiled while in `utils.less`. Avoid add CSS rules too... for the same reasons.  
For example, let's create a new file that uses the `@blue` variable defined in `utils.less`. This new file will be at `styles/less/components`.  

```css
//UTILS
@import (reference) "../utils.less";

h2 {
  color: @blue;
}
```

* `globals.less` - Unlike `utils.less`, this file contains global settings that will be used by all components and pages. **Note:** This file _will be_ compiled into CSS code. So feel free to define anything you want to be global. Eg.: Font Face, Vertical Rhythm, etc. Remember to reference `utils.less` if necessary (We bet it will be).

####The _less_ Folder
You can add any less files here. There are two folders inside, but they are just for get things organized. If you have something better, use it!  
Remember, when you save any file here, _gulp_ will compile it to _CSS_ and save at `styles/` folder. If you save a file inside `components/` folder, it will be saved into `styles/components`... and so on.  
After create/change/remove any file inside these folders, `gulp` will inject/remove it into the HTML files on `app/` folder. So just watch your browser refresh automaticaly.

##Understanding some features

###Foundation 5
We think [Foundation](http://foundation.zurb.com/) is **awesome**. But we just added the compiled grid system just for fun. You can use ANY CSS framework you want, but if you want to do so, install it using the command `bower install package_name --save`. This will install the package and add the right files in the right places of every HTML file. You should just watch this beauty works. :)

###AutoPrefixer
You shouldn´t worry about vendor prefixes. Well, not anymore! The `gulp-autoprefixer` [plugin](https://github.com/postcss/autoprefixer) do the dirty job for you. It parses CSS and add vendor prefixes to rules by [Can I Use](http://caniuse.com/).  
It is already configured to add prefixes to IE7, IE8, >1% marketshare browsers and the last 2 versions of all browsers.  

We can write and save the file:  
```css
*, *:before, *:after {
    box-sizing: border-box;
}
```
It will be automaticaly compiled to:
```css
*,
*:before,
*:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
```

###Injection e Sourcemaps
All CSS and JS files will be injected automaticaly in all HTML files into `app/`. Their respective sourcemaps files will be stored at a safe place! Don't worry about this! :)
The great news here is that once you inspect your code, it will show exactly the `.less` or `.js` file, not the compiled (and big and confusing) files! Very handy!

##Build e Deploy
###Generating Builds
When you are done, probably you want to sharp more you work before deploying it to a homologation/production server. It's time to build!  
Just type the command `gulp build`. It will create a _dist_ folder. It's a replica of _app_ folder, but with some little differences.  

1. It will concatenate and compile every CSS and JS files into the `<!-- build: -->` blocks.
2. It will clean up some unecessary comentaries.
3. Will optimize all images

You can generate builds everytime you want. If you want to clean up an old build, type `gulp clean`.  
If you use [Sublime Text](http://www.sublimetext.com) it's easy to do your builds.  

1. Go to `tools > Build System > New Build System`
2. Change the command `make` to `gulp build`
3. Save the file as `gulp.sublime-build`.
4. Uncheck the option `Save All on Build` and check the build system `gulp`
5. Now everytime you want to do a build, just press `ctrl+B`

###Deploy
You can upload your builds automaticaly to a remote server using an SSH conecction. First, let's do these steps:  

* Open your `gulpfile.js` and search for the lines
```js
host: '_HOST_',
user: '_USER',
pass: '_PASSWORD_',
remotePath: '_REMOTE_'
```
* Change the variables to the right values.
**NOTE:** This only works for SFTP connections.  

Now if you want to upload your build, just type `gulp deploy`.