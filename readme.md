<h3>Aplicação teste para a Tria Software em .NET Core + ReactJS criada utilizando</h3>
<code>dotnet new react</code>

<h3>Front-end atualizado para Typescript com</h3>
<code>npx create-react-app --template typescript</code>

<h3>Bibliotecas .NET:</h3>

* <code>dotnet add package Pomelo.EntityFrameworkCore.MySql --version 3.1.2</code>
* <code>dotnet add package Pomelo.EntityFrameworkCore.MySql.Design --version 1.1.2</code>
* <code>dotnet add package Microsoft.EntityFrameworkCore.Tools --version 3.1.16</code>

<h3>Dependências Node:</h3>

* <code>yarn add react-router-dom</code>
* <code>yarn add react-bootstrap</code>
* <code>yarn add formik</code>
* <code>yarn add yup</code>
* <code>yarn add react-hot-toast</code>

<h3>Execução:</h3>

 1. Em sua máquina deve ter instalado: .NET Framework, Node, Yarn
 1. Clone este repositório
 1. Restaure as dependências .NET com <code>dotnet restore</code>
 1. <code>dotnet ef database update</code> ou no console do Nuget <code>Update-Database</code> para criação do BD de acordo com as Migrations
 3. No diretório ClientApp, restaure as dependências React com <code>yarn install</code>
 4. Compile a aplicação executando <code>dotnet build</code>
 5. Execute a aplicação executando <code>dotnet run</code>
 6. A aplicação front-end estará disponível no endereço informado pelo comando anterior, geralmente https://localhost:5001/
