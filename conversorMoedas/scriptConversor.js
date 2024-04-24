const valoresConversao = {
    real: {
        euro: 0.19,
        dolar: 0.20,
        simbolo:"R$"
    },
    dolar:{
        real: 4.99,
        euro: 0.92,
        simbolo:"US$"
    },
    euro: {
        real:5.40,
        dolar:1.08,
        simbolo:"EU"
    }   

}

const relacaoNomesMoedas = {
    real: "BRL",
    dolar: "USD",
    euro : "EUR"
}

const botaoInverter = document.getElementById("botao-inverter");
botaoInverter.addEventListener("click", inverter);

const botaoConverter = document.getElementById("botao-converter")
botaoConverter.addEventListener("click", converter)

const botaoLimpar = document.getElementById("botao-limpar")
botaoLimpar.addEventListener("click", limpar)

const botaoAceitaMensagem = document.getElementById("botao-aceita-mensagem");
botaoAceitaMensagem.addEventListener("click", aceitarMensagem)

if(localStorage.getItem("aceitouCookie") == "1") {
    console.log("usuario ja aceitou os termos não vou mais mostrar");
    const divMensagemUsuario = document.getElementById("mensagem-usuario");
    divMensagemUsuario.classList.add("oculto");
}

function buscaConversaoAPI(moedaOrigem, moedaDestino) {
    let urlApi = "https://economia.awesomeapi.com.br/last/";
    urlApi = urlApi + moedaOrigem + "-" + moedaDestino;
    console.log(urlApi);
    
    fetch(urlApi).then(function(response){
        if(response.status == 200) {
            console.log("a chamada foi feita com sucesso");
        }
        return response.json();
    }).then(function(data){
        responseAPI = data;
        let objetoEmJson = JSON.stringify(data);
        console.log(data[moedaOrigem + moedaDestino]);
        console.log(data[moedaOrigem + moedaDestino]["ask"]);
        console.log(objetoEmJson);
        //retornar o parametro de conversao que está no atributo "ask"
        responseAPI = data[moedaOrigem + moedaDestino]["ask"]
        
        //return data(moedaOrigem + moedaDestino)("ask");
    }).catch(function(error){
        console.log(error);
    })

    //return responseAPI;
}


function aceitarMensagem() {
    //alert("Usuário aceitou os termos");
    const divMensagemUsuario = document.getElementById("mensagem-usuario");
    divMensagemUsuario.classList.add("oculto");

    localStorage.setItem("aceitouCookie", "1");
}

let valorUsuario = document.getElementById("valorEntrada");
valorUsuario.addEventListener("keypress", function(event) {


    console.log(event);

    if(event.ctrlKey == true && event.code ==="L") {
        event.preventDefault();
        limpar();
    }

    if(event.ctrlKey == true && event.code == "KeyI") {
        event.preventDefault();
        inverter();
    }

    if (event.key ===  "Enter") {
        event.preventDefault();
        converter();
    }
});


function converter(fatorDeConversao) {
        let historicoRecuperado = recuperaHistorico();


        let valorUsuario = document.getElementById("valorEntrada").value;

        if(valorUsuario <= 0 || valorUsuario == "") {
            alert("Verificar valor ");
            return;
        }

        let moeda1 = document.getElementById("moeda1").value;
        let moeda2 = document.getElementById("moeda2").value;

        console.log(moeda1);
        console.log(moeda2);

       
        
        if(moeda1 == moeda2) {
            alert("As moedas são iguais!!!")
            return;
        }

        let parametrosConversao = buscaConversaoAPI(relacaoNomesMoedas[moeda1], relacaoNomesMoedas[moeda2]);



        let simbolo = valoresConversao [moeda2]["simbolo"];
        let resultado = valorUsuario * valoresConversao[moeda1][moeda2];
        let paragrafoResultado = document.getElementById("resultado");
        paragrafoResultado.textContent = simbolo + " " + resultado.toFixed(2);

        let objetoResultado = {
            valorDoUsuario: valorUsuario,
            valorMoeda1: moeda1,
            valorMoeda2: moeda2, 
            valorResultado: resultado.toFixed(2)
        }

        //console.log(objetoResultado);

        let objetoResultadoJSON = JSON.stringify(objetoResultado);

        //localStorage.setItem("historico", objetoResultadoJSON);

        salvarHistorico(objetoResultado);

        //localStorage.setItem("historico", objetoResultado);
}

function salvarResulatoNoLocalStorage(resultado) {

}
function recuperaHistorico(){
    let historico = localStorage.getItem("historico");

    if(!historico) {
        return [];        
    }

    let historicoObjeto = JSON.parse(historico);

    return historicoObjeto;
}

function salvarHistorico(conversao) {
    let historico = recuperaHistorico();

    historico.push(conversao);
    historico = JSON.stringify(historico);
    localStorage.setItem("historico", historico);
}

function limpar() {
    paragrafoResultado = document.getElementById("resultado");
    paragrafoResultado.textContent = "";

    valorEntrada = document.getElementById("valorEntrada")
    valorEntrada.value = "";

}
function inverter() {
   let valorMoeda1 = document.getElementById("moeda1").value;
   let valorMoeda2 = document.getElementById("moeda2").value;

   document.getElementById("moeda1").value = valorMoeda2
   document.getElementById("moeda2").value = valorMoeda1
}
