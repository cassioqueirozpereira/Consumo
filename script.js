document.addEventListener('DOMContentLoaded', () => {
    const tipoDesenho = document.getElementById('tipoDesenho');
    const dimensoesDiv = document.getElementById('dimensoes');
    const lado1Input = document.getElementById('lado1');
    const lado2Input = document.getElementById('lado2');
    const coresInput = document.getElementById('cores');
    const gerarCoresBtn = document.getElementById('gerarCores');
    const camposCoresDiv = document.getElementById('camposCores');
    const calcularBtn = document.getElementById('calcular');
    const resultadoDiv = document.getElementById('resultado');

    // Função de cálculo principal
    const calcularConsumo = () => {
        let resultadoC;
        const hexagonal = tipoDesenho.value === 'sim';
    
        if (hexagonal) {
            resultadoC = 29.07;
        } else {
            const lado1 = parseFloat(lado1Input.value);
            const lado2 = parseFloat(lado2Input.value);
            if (lado1 <= 0 || lado2 <= 0 || isNaN(lado1) || isNaN(lado2)) {
                alert("Por favor, digite valores válidos para os lados.");
                return;
            }
            resultadoC = 1 / (lado1 * lado2);
        }
    
        const consumoInputs = document.querySelectorAll('.consumo-cor');
        resultadoDiv.innerHTML = '';
        
        resultadoDiv.style.display = 'block';
    
        if (consumoInputs.length === 0) {
            alert("Por favor, gere os campos de cores antes de calcular.");
            resultadoDiv.style.display = 'none';
            return;
        }
    
        let erro = false;
        consumoInputs.forEach((input) => {
            const consumoInicial = parseFloat(input.value);
            if (isNaN(consumoInicial) || consumoInicial < 0) {
                alert("Por favor, digite valores válidos para o consumo das cores.");
                resultadoDiv.style.display = 'none';
                erro = true;
            }
        });

        if (erro) {
            return;
        }
    
        consumoInputs.forEach((input, index) => {
            const consumoInicial = parseFloat(input.value);
            
            let consumoFinal = consumoInicial / resultadoC;
            consumoFinal = (consumoFinal * 0.25) + consumoFinal;
            
            const p = document.createElement('p');
            p.textContent = `O consumo da tinta ${index + 1} é: ${consumoFinal.toFixed(3)} g/m²`;
            resultadoDiv.appendChild(p);
        });
    };

    // Esconde/mostra os campos de dimensão do desenho E LIMPA O RESULTADO
    tipoDesenho.addEventListener('change', () => {
        if (tipoDesenho.value === 'sim') {
            dimensoesDiv.style.display = 'none';
        } else {
            dimensoesDiv.style.display = 'block';
        }
        // Limpa o resultado quando o tipo de desenho é alterado
        resultadoDiv.innerHTML = ''; 
        resultadoDiv.style.display = 'none';
    });

    // Gera dinamicamente os campos de consumo para cada cor
    gerarCoresBtn.addEventListener('click', () => {
        const numCores = parseInt(coresInput.value);
        camposCoresDiv.innerHTML = '';
        if (numCores > 0) {
            for (let i = 0; i < numCores; i++) {
                const label = document.createElement('label');
                label.textContent = `Consumo da cor ${i + 1}:`;
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.001';
                input.className = 'consumo-cor';
                camposCoresDiv.appendChild(label);
                camposCoresDiv.appendChild(input);

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        calcularConsumo();
                    }
                });
            }
            camposCoresDiv.style.marginTop = '15px';
            calcularBtn.style.display = 'block';
            calcularBtn.style.marginTop = '10px';
        } else {
            camposCoresDiv.style.marginTop = '0';
            calcularBtn.style.display = 'none';
            calcularBtn.style.marginTop = '0';
        }
        resultadoDiv.style.display = 'none';
    });

    // Detecta "Enter" nos campos de dimensão e no campo de cores
    lado1Input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            calcularConsumo();
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
            gerarCoresBtn.click();
        }
    });

    // Adiciona a função ao clique do botão
    calcularBtn.addEventListener('click', calcularConsumo);
});