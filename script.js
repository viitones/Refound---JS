const form = document.querySelector("form");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Captura o evento de input do valor para ser formatado
amount.oninput = () => {
  //obtém o valor atual e remove os char de texto
  let value = amount.value.replace(/\D/g, "")

  //converte em centavos
  value = Number(value) / 100

  //atualiza o valor pelo formatado
  amount.value = formatCurrencyBRL(value)
};

function formatCurrencyBRL(value) {
  //formata o valor no padrão brl
  value = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  })

  return value
};

function formatFirstLetter(str) {
  return str.replace(/^\w/, (f) => f.toUpperCase())
}

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}

//captura o evento de submit do form para pegar os valores
form.onsubmit = (event) => {
  event.preventDefault();

  //objeto criado para detalhar cada despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }

  // console.log(newExpense);

  //chama a função de adicionar item na lista
  expenseAdd(newExpense)
}

//adiciona item na lista
function expenseAdd(newExpense) {
  try {
    //cria o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    

    //cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)


    //cria a div com as informações da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //cria as informações da div
    const expenseName = document.createElement("strong")
    expenseName.innerHTML = formatFirstLetter(newExpense.expense)
    const expenseCategory = document.createElement("span")
    expenseCategory.innerHTML = newExpense.category_name

    //coloca as informações dentro da div
    expenseInfo.append(expenseName, expenseCategory)


    //cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`


    //add imagem de deletar
    const expenseDelete = document.createElement("img")
    expenseDelete.classList.add("remove-icon")
    expenseDelete.setAttribute("src", "./img/remove.svg")
    expenseDelete.setAttribute("alt", "deletar")


    //adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseDelete)


    //adiciona o item na lista
    expenseList.append(expenseItem)

    //limpa os campos após adicionar o item
    formClear()

    //atualiza os totais
    updateTotals()

    // console.log(expenseList);
  } catch (error) {
    console.log(error);
  }
}

//atualiza os totais
function updateTotals() {
  try {
    //recupera todos os items da lista
    const items =  expenseList.children

    //atualiza a quantidade de itens da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
    
    //var para calcular o total
    let total = 0

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //removendo os caracteres não numéricos e substitui a virgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      //convertendo para float
      value = parseFloat(value)

      //verifica se é um número válido
      if(isNaN(value)){
        return alert("O valor não é um número")
      }

      total += Number(value)
    }

    //cria o elemento small que vai conter o simbolo de real
    const symbolBrl = document.createElement("small")
    symbolBrl.textContent = "R$"

    //formata o total para moeda usando a função
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    //limpa todo o h2 e coloca os elementos nele
    expensesTotal.innerHTML = ""
    expensesTotal.append(symbolBrl, total)
  } catch (error) {
    console.log(error);
  }
}

//captura o clique nos itens da lista
expenseList.addEventListener("click", (event) => {
  //verifica se é o item de remover
  if(event.target.classList.contains("remove-icon")){
    //seleciona a classe pai mais próxima
    const item = event.target.closest(".expense")
    item.remove()
  }

  updateTotals()
})