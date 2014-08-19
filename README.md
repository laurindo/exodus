#CODENAME EXODUS  
_Scaffolding para aplicações web usando gulp e Foundation._

##Recursos em Destaque
* `gulp` - Task Runner
* `gulp-less` - Gulp Less Compiler
* `stream-combiner` - Melhor report de erros sem derrubar o Gulp
* `gulp-sourcemaps` - Sourcemaps para CSS e JS
* `gulp-autoprefixer` - Ajustado para IE7 e IE8
* `gulp-inject` - Injeta automaticamente qualquer CSS e JS criado
* `gulp-file-include` - Gerencia os includes de componentes
* `gulp-sftp` - YAY!! `gulp deploy` e tudo estará lá no servidor! ;)
* `Normalize` - CSS reset like a Boss
* `Modernizr` - Essencial..
* `HTML5shiv` - ...para compatibilidade...
* `Respond.js` - ...e esse também...
* `Foundation 5` - Somente a grid

##Instalando
1. Clone o repositório
2. Em um terminal navegue até a pasta de trabalho
3. Digite `bower install && npm install`
5. Digite `gulp start`

##Utils e Globals
Dentro da pasta `app/styles/less` existem dois arquivos importantes.

1. `utils.less` - É um arquivo que contem todas as variáveis e mixins que __não geram CSS__. É inserido em outros arquivos através de um `@import (reference)` e serve apenas como referência para outros arquivos. Ele não é obrigatório, exceto quando você necessita de alguma variável ou mixin que esteja definido nele.  
__NÃO ADICIONE NENHUM MIXIN sem '()' OU SELETOR NESSE ARQUIVO! ELE NÃO SERÁ COMPILADO PARA CSS.__
2. `globals.less` - Ao contrário do `utils.less`, este arquivo contem definições globais que serão usadas por todos os componentes e páginas. Ex.: Font Face, Vertical Rythm, etc. __ESTE ARQUIVO SERÁ COMPILADO PARA CSS!__  

##A Pasta app/styles
A pasta app/styles está organizada de forma a refletir a divisão entre componentes e templates, melhorando a organização. Lembrar sempre de chamar o arquivo `utils.less` usando: `@import (reference) '../utils'`.

##AutoPrefixer
Não é necessário usar nenhum _vendor prefixer_ nos seletores. O plugin `autoprefixer` já está configurado para buscar os prefixos necessários para IE7, IE8, Browsers com Marketshare >1%, e em todos os browsers a partir da ante-penúltima versão.  
`$.autoprefixer(['last 2 version', '> 1%', 'ie 7', 'ie 8'], {cascade: true})`  
Essa configuração para o seguinte código:  
```
*, *:before, *:after {
    box-sizing: border-box;
}
```
Compila para:  
```
*,
*:before,
*:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
```

##Injection e Sourcemaps
Todos os arquivos CSS e JS são automaticamente injetados em todos os arquivos HTML. Seus respectivos sourcemaps são gerados em pastas específicas.

##~~Bootstrap~~
~~O Bootstrap está completo dentro das dependências do Bower, contudo, no arquivo `utils.less` está filtrado apenas a grid.~~

~~1. O bootstrap não é inserido via `gulp wiredep`;~~  
~~2. Caso necessário o uso de mais recursos (tabelas?), utilize o espaço específico para os filtros do Bootstrap em `utils.less`, exemplo:~~  

~~//GRID BOOTSTRAP~~  
~~@basePath: '../../bower_components/bootstrap/less';~~  
~~@~~~~import (reference) '@{basePath}/mixins/grid-framework';~~  
~~@~~~~import (reference) '@{basePath}/caminho/do/arquivo';~~  

~~Lembrando que não é necessário colocar a extensão `.less` no endereço dos arquivos.~~

##Foundation
Será usada a GRID do [Foundation 5](http://foundation.zurb.com/develop/download.html) para compor a estrutura das páginas.  
Ele não será instalado pelo `bower` pois o pacote não é dividido pelas funcionalidades, ou seja, é composto pelo framework completo. Para o projeto é necessário apenas as definições de GRID.  
O arquivo `foundation.css` se encontra na pasta `app/styles` e será injetado automaticamente ou chamando a _task_ `gulp inject`.  
Algumas partes desse arquivo foram movidas para o arquivo `global.less` para que ficassem mais evidentes evitando escrita desnecessária de código.

##Workflow
Vamos usar o Git Workflow, trabalhando dentro da Branch Develop e criando os hotfixes, features e releases necessários.

##Componentes
Nesse Reboot do Projeto vamos usar os componentes HTML de maneira a facilitar nosso trabalho. Para usá-los é muito simples usando o plugin [gulp-file-include](https://www.npmjs.org/package/gulp-file-include).  

###Criando os componentes
Salve somente o trecho de código HTML referente ao componente dentro da pasta `app/componentes`.  
Dentro da pasta `app/templates` serão armazenados os templates das páginas. No template que você utilizará o componente, faça uma referência ao mesmo usando a notação `@@include('../componentes/nome_do_componente.html')`.  Ex.:  

index.html  
```
<!DOCTYPE html>
<html>
  <body>
  @@include('../componentes/section.html')
  @@include('../componentes/var.html', {
    "name": "bradesco",
    "class": "azul"
  })
  </body>
</html>
```

section.html  
```
<h1>Hello World!</h1>
```

var.html  
```
<label class="@@class">@@name</label>
```

Esse código vai gerar a página `index.html` na raíz do projeto com o seguinte conteúdo.

```
<!DOCTYPE html>
<html>
  <body>
  <h1>Hello World!</h1>
  <label class="azul">Bradesco</label>
  </body>
</html>
```

A segunda notação é muito útil para enviarmos classes específicas para os componentes.

##Build e Deploy
###Gerando Builds
Para gerar um build basta entrar com o comando `gulp build` na linha de comando ou através do _Sublime_ seguindo os passos abaixo:

1. Vá em `tools > Build System > New Build System`
2. Substitua o comando `make` por `gulp build`
3. Usando `ctrl + shift + s` salve o arquivo como `gulp.sublime-build`.
4. Desmarque a opção Save All on Build.
5. `ctrl + B` gera o build na pasta `dist`

###Fazendo o deploy automático
Para fazer o deploy diretamente no servidor basta entrar com o comando `gulp deploy`.