document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-cadastro-cliente");
    const nomeInput = document.getElementById("nomecompleto");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senhahash");
    const setorSelect = document.getElementById("quadra_setor");
    const enderecoInput = document.getElementById("endereco_detalhado");
    const dataInput = document.getElementById("data_cadastro");
    const toggleSenhaBtn = document.getElementById("toggle-senha");
    const iconeOlho = document.getElementById("icone-olho");
    const alertaBox = document.getElementById("mensagem-alerta");
    const btnCadastrar = document.getElementById("btn-cadastrar");

    // Preenche automaticamente a data de hoje
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.value = hoje;

    // Mostrar ou ocultar senha
    toggleSenhaBtn.addEventListener("click", function () {
        const tipoAtual = senhaInput.getAttribute("type");
        if (tipoAtual === "password") {
            senhaInput.setAttribute("type", "text");
            iconeOlho.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            senhaInput.setAttribute("type", "password");
            iconeOlho.classList.replace("fa-eye-slash", "fa-eye");
        }
    });

    // Máscara automática para CPF (000.000.000-00)
    cpfInput.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = valor;
    });

    // Máscara automática para Telefone ((00) 00000-0000)
    telefoneInput.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = valor;
    });

    // Função matemática para validar CPF real
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

    // Validação completa no envio
    form.addEventListener("submit", function (event) {
        alertaBox.classList.add("d-none");
        const campos = [nomeInput, cpfInput, telefoneInput, emailInput, senhaInput, setorSelect, enderecoInput, dataInput];
        campos.forEach(campo => campo.classList.remove("is-invalid", "is-valid"));

        if (nomeInput.value.trim().split(" ").length < 2) {
            event.preventDefault();
            nomeInput.classList.add("is-invalid");
            mostrarAlerta("Por favor, informe seu nome e sobrenome.", "danger");
            nomeInput.focus();
            return;
        }

        if (!validarCPF(cpfInput.value)) {
            event.preventDefault();
            cpfInput.classList.add("is-invalid");
            mostrarAlerta("O CPF informado é inválido. Verifique os números digitados.", "danger");
            cpfInput.focus();
            return;
        }

        if (telefoneInput.value.replace(/\D/g, "").length < 10) {
            event.preventDefault();
            telefoneInput.classList.add("is-invalid");
            mostrarAlerta("Digite um número de telefone válido com DDD.", "warning");
            telefoneInput.focus();
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(emailInput.value.trim())) {
            event.preventDefault();
            emailInput.classList.add("is-invalid");
            mostrarAlerta("Digite um endereço de e-mail válido.", "danger");
            emailInput.focus();
            return;
        }

        if (senhaInput.value.length < 6) {
            event.preventDefault();
            senhaInput.classList.add("is-invalid");
            mostrarAlerta("Sua senha deve ter pelo menos 6 caracteres.", "warning");
            senhaInput.focus();
            return;
        }

        if (setorSelect.value === "" || enderecoInput.value.trim().length < 5) {
            event.preventDefault();
            if (setorSelect.value === "") setorSelect.classList.add("is-invalid");
            if (enderecoInput.value.trim().length < 5) enderecoInput.classList.add("is-invalid");
            mostrarAlerta("Selecione seu setor no Gama e preencha o endereço completo.", "warning");
            return;
        }

        campos.forEach(campo => campo.classList.add("is-valid"));
        btnCadastrar.disabled = true;
        btnCadastrar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Cadastrando cliente...';
    });
});
