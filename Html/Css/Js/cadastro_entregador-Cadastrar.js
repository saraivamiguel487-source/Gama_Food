document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-cadastro-entregador");
    const nomeInput = document.getElementById("nome");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const veiculoSelect = document.getElementById("tipo_veiculo");
    const disponivelSelect = document.getElementById("disponivel");
    const cnhInput = document.getElementById("cnh");
    const placaInput = document.getElementById("placa_veiculo");
    const alertaBox = document.getElementById("mensagem-alerta");
    const btnCadastrar = document.getElementById("btn-cadastrar");

    // Máscara de CPF
    cpfInput.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = valor;
    });

    // Máscara de Telefone
    telefoneInput.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = valor;
    });

    // CNH apenas números
    cnhInput.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
    });

    // Placa em maiúsculo sem espaços
    placaInput.addEventListener("input", function (e) {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    });

    // Regra dinâmica: Bicicleta não exige CNH nem Placa
    veiculoSelect.addEventListener("change", function () {
        if (this.value === "bicicleta") {
            cnhInput.value = "";
            placaInput.value = "";
            cnhInput.disabled = true;
            placaInput.disabled = true;
            cnhInput.required = false;
            placaInput.required = false;
            cnhInput.placeholder = "Não exigido para bicicleta";
            placaInput.placeholder = "Não exigido para bicicleta";
            cnhInput.classList.remove("is-invalid", "is-valid");
            placaInput.classList.remove("is-invalid", "is-valid");
        } else {
            cnhInput.disabled = false;
            placaInput.disabled = false;
            cnhInput.required = true;
            placaInput.required = true;
            cnhInput.placeholder = "Somente números (11 dígitos)";
            placaInput.placeholder = "ABC1D23 ou ABC-1234";
        }
    });

    // Validação matemática de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = 11 - (soma % 11);
        let digito1 = resto >= 10 ? 0 : resto;
        if (digito1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        let digito2 = resto >= 10 ? 0 : resto;
        return digito2 === parseInt(cpf.charAt(10));
    }

    function mostrarAlerta(mensagem, tipo) {
        alertaBox.textContent = mensagem;
        alertaBox.className = `alert alert-${tipo} mb-4`;
        alertaBox.classList.remove("d-none");
        alertaBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Validação no envio
    form.addEventListener("submit", function (event) {
        alertaBox.classList.add("d-none");
        const campos = [nomeInput, cpfInput, telefoneInput, veiculoSelect, disponivelSelect, cnhInput, placaInput];
        campos.forEach(campo => campo.classList.remove("is-invalid", "is-valid"));

        if (nomeInput.value.trim().split(" ").length < 2) {
            event.preventDefault();
            nomeInput.classList.add("is-invalid");
            mostrarAlerta("Informe o nome e sobrenome do entregador.", "danger");
            nomeInput.focus();
            return;
        }

        if (!validarCPF(cpfInput.value)) {
            event.preventDefault();
            cpfInput.classList.add("is-invalid");
            mostrarAlerta("O CPF informado é inválido.", "danger");
            cpfInput.focus();
            return;
        }

        if (telefoneInput.value.replace(/\D/g, "").length < 10) {
            event.preventDefault();
            telefoneInput.classList.add("is-invalid");
            mostrarAlerta("Informe um telefone válido com DDD.", "warning");
            telefoneInput.focus();
            return;
        }

        if (veiculoSelect.value === "" || disponivelSelect.value === "") {
            event.preventDefault();
            if (veiculoSelect.value === "") veiculoSelect.classList.add("is-invalid");
            if (disponivelSelect.value === "") disponivelSelect.classList.add("is-invalid");
            mostrarAlerta("Selecione o tipo de veículo e a disponibilidade.", "warning");
            return;
        }

        // Valida CNH e Placa apenas se NÃO for bicicleta
        if (veiculoSelect.value !== "bicicleta") {
            if (cnhInput.value.length !== 11) {
                event.preventDefault();
                cnhInput.classList.add("is-invalid");
                mostrarAlerta("A CNH deve conter exatamente 11 dígitos numéricos.", "danger");
                cnhInput.focus();
                return;
            }

            const placaLimpa = placaInput.value.replace("-", "");
            const regexPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
            if (!regexPlaca.test(placaLimpa)) {
                event.preventDefault();
                placaInput.classList.add("is-invalid");
                mostrarAlerta("Digite uma placa válida (ex: ABC1D23 ou ABC-1234).", "danger");
                placaInput.focus();
                return;
            }
        }

        campos.forEach(campo => {
            if (!campo.disabled) campo.classList.add("is-valid");
        });
        btnCadastrar.disabled = true;
        btnCadastrar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Cadastrando entregador...';
    });
});
