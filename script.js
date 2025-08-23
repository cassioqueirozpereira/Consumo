document.addEventListener('DOMContentLoaded', () => {
    // A função é executada apenas após o carregamento completo do DOM (Document Object Model). 
    // Isso garante que todos os elementos HTML estejam disponíveis para serem manipulados pelo JavaScript.

    // Seleção de elementos HTML
    const tipoDesenho = document.getElementById('tipoDesenho'); // Seleciona o menu suspenso para o tipo de desenho (hexagonal ou não).
    const dimensoesDiv = document.getElementById('dimensoes'); // Seleciona a div que contém os campos de dimensão (lados).
    const porcentagemDiv = document.getElementById('porcentagem'); // Seleciona a div que contém os campos de dimensão (lados).
    const porcentagemInput = document.getElementById('valor'); // Seleciona o campo de entrada para o lado 1.
    const lado1Input = document.getElementById('lado1'); // Seleciona o campo de entrada para o lado 1.
    const lado2Input = document.getElementById('lado2'); // Seleciona o campo de entrada para o lado 2.
    const coresInput = document.getElementById('cores'); // Seleciona o campo de entrada para o número de cores.
    const gerarCoresBtn = document.getElementById('gerarCores'); // Seleciona o botão para gerar campos de cor.
    const camposCoresDiv = document.getElementById('camposCores'); // Seleciona a div onde os campos de consumo de cor serão adicionados.
    const calcularBtn = document.getElementById('calcular'); // Seleciona o botão de cálculo.
    const resultadoDiv = document.getElementById('resultado'); // Seleciona a div onde o resultado será exibido.

    const atualizarVisibilidadeDimensoes = () => {
        if (tipoDesenho.value === 'sim') {
            dimensoesDiv.style.display = 'none';
        } else {
            dimensoesDiv.style.display = 'block';
        }
    };
    
    // Chama a função ao carregar a página
    atualizarVisibilidadeDimensoes();
    
    // Adiciona o listener para a mudança do tipo de desenho
    tipoDesenho.addEventListener('change', () => {
        atualizarVisibilidadeDimensoes();
        // Limpa o resultado quando o tipo de desenho é alterado
        resultadoDiv.innerHTML = '';
        resultadoDiv.style.display = 'none';
    });

    // Função de cálculo principal
    const calcularConsumo = () => {
        // Converte o valor do campo de porcentagem para um número decimal.
        let porcentagem = parseFloat(porcentagemInput.value)
        // Converte o valor do campo de porcentagem decimal e transforma-o em uma fração (por exemplo, 50% se torna 0.5).
        if (porcentagemInput.value === '') {
            alert("Por favor, digite um valor para a porcentagem.");
            return; // Encerra a função se o campo de porcentagem estiver vazio.
        }
        // Se o valor for inválido ou não for um número, exibe um alerta e encerra a função.
        if (isNaN(porcentagemInput.value) || parseFloat(porcentagemInput.value) <= 0) {
            alert("Por favor, digite um valor válido para a porcentagem.");
            return; // Encerra a função se o valor for inválido.
        }
        let resultadoC; // Variável para armazenar o valor 'C'.
        const hexagonal = tipoDesenho.value === 'sim'; // Verifica se o desenho é hexagonal, com base no valor do menu suspenso.

        if (hexagonal) {
            resultadoC = 29.07; // Se for hexagonal, 'C' tem um valor fixo.
        } else {
            const lado1 = parseFloat(lado1Input.value); // Converte o valor do lado 1 para um número decimal.
            const lado2 = parseFloat(lado2Input.value); // Converte o valor do lado 2 para um número decimal.

            // Validação dos campos de dimensão. Verifica se os valores são válidos e maiores que zero.
            if (lado1 <= 0 || lado2 <= 0 || isNaN(lado1) || isNaN(lado2)) {
                alert("Por favor, digite valores válidos para os lados.");
                return; // Encerra a função se a validação falhar.
            }
            resultadoC = 1 / (lado1 * lado2); // Calcula 'C' para desenhos não hexagonais.
        }

        const consumoInputs = document.querySelectorAll('.consumo-cor'); // Seleciona todos os campos de consumo de cor gerados dinamicamente.
        resultadoDiv.innerHTML = ''; // Limpa o conteúdo anterior da área de resultado.
        
        resultadoDiv.style.display = 'block'; // Torna a div de resultado visível.
    
        // Validação: verifica se os campos de consumo de cor foram gerados.
        if (consumoInputs.length === 0) {
            alert("Por favor, gere os campos de cores antes de calcular.");
            resultadoDiv.style.display = 'none'; // Esconde a div de resultado.
            return; // Encerra a função.
        }
    
        // Validação dos valores de consumo (solução para mensagem única)
        let erro = false; // Flag para rastrear se houve algum erro nos campos
        consumoInputs.forEach((input) => {
            const consumoInicial = parseFloat(input.value);
            if (isNaN(consumoInicial) || consumoInicial < 0) {
                erro = true; // Define a flag de erro como verdadeira
            }
        });

        // Se a flag de erro for verdadeira, exibe o alerta e encerra a função
        if (erro) {
            alert("Por favor, digite valores válidos para o consumo das cores.");
            resultadoDiv.style.display = 'none';
            return; 
        }
    
        // Se não houver erro, prossegue com o cálculo
        consumoInputs.forEach((input, index) => {
            const consumoInicial = parseFloat(input.value);
            
            let consumoFinal = consumoInicial / resultadoC; // Calcula o consumo final.
            
            consumoFinal = (consumoFinal * (porcentagem / 100)) + consumoFinal; // Adiciona uma margem de 25% ao consumo.
            
            const p = document.createElement('p'); // Cria um novo parágrafo para exibir o resultado.
            p.textContent = `O consumo da tinta ${index + 1} é: ${consumoFinal.toFixed(3)} g/m²`; // Formata o texto do resultado com 3 casas decimais.
            resultadoDiv.appendChild(p); // Adiciona o parágrafo à div de resultado.
        });
    };

    // Eventos e interações
    
    // Esconde/mostra os campos de dimensão do desenho E LIMPA O RESULTADO
    tipoDesenho.addEventListener('change', () => {
        if (tipoDesenho.value === 'sim') {
            dimensoesDiv.style.display = 'none'; // Esconde os campos de dimensão para desenhos hexagonais.
        } else {
            dimensoesDiv.style.display = 'block'; // Mostra os campos para outros tipos de desenho.
        }
        resultadoDiv.innerHTML = ''; // Limpa o resultado quando o tipo de desenho é alterado.
        resultadoDiv.style.display = 'none'; // Esconde a div de resultado.
    });

    // Gera dinamicamente os campos de consumo para cada cor
    gerarCoresBtn.addEventListener('click', () => {
        const numCores = parseInt(coresInput.value); // Obtém o número de cores.
        camposCoresDiv.innerHTML = ''; // Limpa os campos de cor gerados anteriormente.

        if (numCores > 0) {
            // Loop para criar e adicionar os campos de entrada de consumo de cor.
            for (let i = 0; i < numCores; i++) {
                const label = document.createElement('label');
                label.textContent = `Consumo da cor ${i + 1}:`;
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.001';
                input.className = 'consumo-cor';
                camposCoresDiv.appendChild(label);
                camposCoresDiv.appendChild(input);

                // Adiciona um evento para permitir o cálculo pressionando a tecla 'Enter'.
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        calcularConsumo();
                    }
                });
            }
            camposCoresDiv.style.marginTop = '15px';
            calcularBtn.style.display = 'block'; // Mostra o botão de cálculo.
            calcularBtn.style.marginTop = '10px';

            const primeiroInputCor = camposCoresDiv.querySelector('.consumo-cor');
            if (primeiroInputCor) {
                primeiroInputCor.focus();
            }
        } else {
            camposCoresDiv.style.marginTop = '0';
            calcularBtn.style.display = 'none'; // Esconde o botão de cálculo se o número de cores for inválido.
            calcularBtn.style.marginTop = '0';
        }
        resultadoDiv.style.display = 'none'; // Esconde a área de resultado.
    });

    // Detecta "Enter" nos campos de dimensão e no campo de cores para acionar a funcionalidade correspondente.
    lado1Input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Impede o comportamento padrão do 'Enter' (envio do formulário).
            calcularConsumo(); // Chama a função de cálculo.
        }
    });
    
    lado2Input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            calcularConsumo();
        }
    });
    
    coresInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            gerarCoresBtn.click(); // Simula o clique no botão "Gerar Cores".
        }
    });

    // Adiciona a função ao clique do botão
    calcularBtn.addEventListener('click', calcularConsumo);
});