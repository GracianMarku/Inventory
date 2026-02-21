export function renderShell()
{
    return `
    <div class ="sticky min-h-screen flex bg-gray-50 text-gray-900">

    <!-- Sidebar -->

    <aside class= "w-64 border-r bg-white p-4">
        <div class= "font-semibold text-lg"> Inventory Admin </div>
        <div class= "mt-1 text-xs text-gray-500">Backoffice </div>

        <nav class = "mt-6 space-y-2 text-sm">
          <a href="#/dashboard" class = "block rounded-lg px-3 py-2 hover:bg-gray-100"> Dashboard </a>
          <a href="#/products" class = "block rounded-lg px-3 py-2 hover:bg-gray-100"> Products </a>
          <a href="#/sales" class = "block rounded-lg px-3 py-2 hover:bg-gray-100"> Sales </a>
          <a href="#/stock" class = "block rounded-lg px-3 py-2 hover:bg-gray-100"> Stock </a>
          <a href="#/categories" class = "block rounded-lg px-3 py-2 hover:bg-gray-100"> Categories </a>
        </nav>
    </aside>
    
    <!-- Kontenti -->
    <div class = "flex-1">
      <header class = "border-b bg-white">
        <div class = "px-6 py-4">
          <h1 id="pageTitle" class= "text-lg font-semibold">Dashboard </h1>
        </div>
      </header>
      
      <main id="content" class= "p-6"></main>
    </div>
    
    
   </div> 

    `
}