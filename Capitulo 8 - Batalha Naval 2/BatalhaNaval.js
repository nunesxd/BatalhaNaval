class BatalhaNaval {

    constructor(qtdBarcos = 1) {
        this._linha = 7;
        this._coluna = 7;
        this._tabelaDoJogo = document.getElementById('tabela-jogo');
        this._qtdBarcos = qtdBarcos;
        
        this.criaLayout();
        // Gera as coordenadas dos barcos para posicionamento:
        this._coordenadasBarcos = this.geraCoordenadaBarcos();
        this.posicionaBarcos();
        this.iniciaJogo(this._coordenadasBarcos, this._qtdBarcos);
    }

    criaLayout() {
        // Array contendo as letras que aparecerão na coluna do tabuleiro de guerra naval, para orientação do usuário:
        let coordenadaColuna = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q", "R"];

        // Looping para criar a tabela de jogo dinâmicamente.
        for(let i = 0;i <= this._linha;i++) {
            let tr = document.createElement('tr');
            this._tabelaDoJogo.appendChild(tr);

            for(let j = 0;j <= this._linha;j++) {
                let td = document.createElement('td');

                // Condição para identificarmos quais as celulas da tabela serão para mostrar as coordendas apenas, e não terá barcos para o jogo;
                if(i == this._linha || j == 0) {
                    td.classList.add(`coordenada`); // Classe para tratarmos separadamente as td's de coordenada, e não serão jogáveis

                    // Se for na última linha, colocar o número como coordenada na tabela;
                    if(i == this._linha) {
                        td.innerText = j-1;
                        // Deixa a quina da tabela (inferior esquerda) vazia, pois não é coordenada do jogo;
                        if(j == 0) td.innerText = "";
                    }
                    // Se for a primeira coluna, colocar uma letra como coordenada na tabela;
                    else td.innerText = coordenadaColuna[i];

                } else td.classList.add("area-jogo"); // Classe para tratarmos separadamente as td's que serão usadas no jogo;
                td.id = `${i}${j-1}`;    
                tr.appendChild(td);

            }
        }
    }

    geraCoordenadaBarcos() {
        let posicaoBarcos = [];
        //let count = 0; // Para debugg, identificar quantas coordenadas totais foram geradas;
        //let countFalse = 0; // Para debugg, identificar quantas coordenadas iguais foram geradas;

        // Gera aleatoriamente as coordenadas para os barcos serem posicionados no tabuleiro;
        for(let i = 0; i < this._qtdBarcos; i++){
            let xBarco = Math.floor(Math.random() * this._linha);
            let yBarco = Math.floor(Math.random() * this._coluna);

            //let xBarco = 1; // Para debugg de coordenadas iguais;
            //let yBarco = 2; // Para debugg de coordenadas iguais;
            let posicaoNova = [xBarco, yBarco];
            let posicaoUnica = true;

            // Verifica se as coordenadas já foram geradas, caso sim, gera uma nova;
            if(posicaoBarcos.length > 0){
                posicaoBarcos.forEach(posicaoAntiga => {
                    if(this.arraysMatch(posicaoAntiga, posicaoNova)) {
                        posicaoUnica = false;
                        i--;
                        //countFalse++;
                    }
                })
            }

            if(posicaoUnica == true) {
                posicaoBarcos.push(posicaoNova);
            }

            //count++;
            //console.log(`Posição nova: ${posicaoNova} || Posição Unica ? ${posicaoUnica} || Count: ${count} || Count False: ${countFalse}`); // Para debugg;

        }
        return posicaoBarcos;
    }

    arraysMatch(arr1, arr2) {

        // Verifica se os arrays possuem o mesmo tamanho;
        if (arr1.length !== arr2.length) return false;
    
        // Verifica se os itens dos arrays estão no mesmo lugar e na mesma ordem;
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
    
        // De qualquer forma, retorna true;
        return true;
    
    };

    // Método para debug do código, irá colocar imagens de barcos nas coordenadas geradas;
    posicionaBarcos() {
        let coordenadasStr = "";

        this._coordenadasBarcos.forEach(arrayCoordenadas => {
            arrayCoordenadas.forEach(coordenadas => {
                coordenadasStr += coordenadas;

            })
            let imgBarco = document.createElement('img');
            imgBarco.setAttribute("src", "./Imagens/ship.png");
            imgBarco.setAttribute("alt", "Barco");

            let tdTabela = document.getElementById(`${coordenadasStr}`);
            tdTabela.appendChild(imgBarco);
            coordenadasStr = "";

        });
    }

    iniciaJogo(coordenadaBarcos, qtdBarcos) {
        // Identifica os TD's da tabela gerados para o jogo, para então identificarmos os acertos e erros;
        let posicaoParaAtirar = document.querySelectorAll(".area-jogo");
        // Identifica o painel de mensagem do jogo, para atualizar com as estatísticas ou finalizar o jogo;
        let painelMensagem = document.getElementById('area-mensagem');
        let mensagem = "";
        let countTirosErrados = 0;
        let countTirosCertos = 0;
        let coordenadasAcertadas = [];
        let coordenadasErradas = [];

        posicaoParaAtirar.forEach(posicao => {
            // A interação com a tabela será por click nas células, ou TD's;
            posicao.addEventListener("click", function() {

                // Adicionamos a imagem de "splash", para ilustrar o erro do alvo;
                let imgSplash = document.createElement('img');
                imgSplash.setAttribute("src", "./Imagens/splash.png");
                imgSplash.setAttribute("alt", "Splash!!! O alvo não foi acertado!!!");
        
                // As coordenadas são recebidas como arrays dentro de um array;
                coordenadaBarcos.forEach(arrayCoordenadas => {
                    let coordenadasStr = `${arrayCoordenadas[0]}${arrayCoordenadas[1]}`;
                    
                    // Verifica se o ID da celula clicada é a mesma da coordenada que possui um alvo, um barco, e depois verifica se esta coordenada já foi clicada anteriormente, para evitar clickes múltiplos no mesmo TD;
                    if(this.id == coordenadasStr && !coordenadasAcertadas.includes(coordenadasStr)) {
                        coordenadasAcertadas.push(coordenadasStr);
                        // Para debug usamos a imagem do barco na coordenada gerada como alvo (essa imagem é inserida em um momento anterior), abaixo, mudamos esta imagem do barco para um "boom" apenas;
                        let imagemBarco = this.children[0];

                        // Caso não estejamos em debug, cria uma imagem e a insere no TD;
                        if(!imagemBarco) {
                            imagemBarco = document.createElement('img');
                            imagemBarco.setAttribute("src", "./Imagens/boom-pequeno.png");
                            imagemBarco.setAttribute("alt", "Boom!!! O alvo foi destruído!!!");
                            this.appendChild(imagemBarco);

                        } else {
                            imagemBarco.setAttribute("src", "./Imagens/boom-pequeno.png");
                            imagemBarco.setAttribute("alt", "Boom!!! O alvo foi destruído!!!");

                        }
                        countTirosCertos++;

                    }
                })

                // Caso a coordenada seja incorreta, e já não tenha sido clicada anteriormente, insere a imagem de "splash", erro do alvo;
                if(!coordenadasAcertadas.includes(this.id) && !coordenadasErradas.includes(this.id)) {
                    coordenadasErradas.push(this.id);
                    this.appendChild(imgSplash);
                    countTirosErrados++;
                    
                }

                // Mensagem contendo os números de acertos e e erros, e quando todos os baros são encontrados, encerra o jogo;
                if(countTirosCertos < qtdBarcos ) mensagem = `Acertos: ${countTirosCertos}, Erros: ${countTirosErrados}`;
                else {
                    mensagem = "Jogo encerrado !!! Todos os barcos foram afundados !!!";
                    painelMensagem.innerText = mensagem;
                }
                
                painelMensagem.innerText = mensagem;
            })
        })
    }
}

jogo1 = new BatalhaNaval(3);